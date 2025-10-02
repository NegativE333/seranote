'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { ArrowLeft, Play, Pause, MusicIcon, MessageCircle } from 'lucide-react';
import { urlFor } from '@/lib/sanity';
import LoadingComponent from './loading-component';
import { ErrorComponent } from './error-component';
import MessageList from './message-list';
import MessageInput from './message-input';
import { useUser } from '@clerk/nextjs';

interface Message {
  id: string;
  content: string;
  createdAt: string;
  sender: {
    id: string;
    name: string | null;
    email: string;
  };
}

interface Seranote {
  id: string;
  title: string;
  message: string;
  songId: string;
  songClipStart: number;
  songClipDur: number;
  songTotalDur?: number;
  createdAt: string;
  updatedAt: string;
  senderEmail: string;
  receiverEmail?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  accessToken: string;
  messages?: Message[];
  sender?: {
    id: string;
    name: string | null;
    email: string;
  };
}

interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  cover: any;
  audioLink?: any;
  audioDur?: number;
}

const constructAudioUrl = (audioLink: any): string | null => {
  if (!audioLink?.asset?._ref) return null;
  const ref = audioLink.asset._ref as string;
  const parts = ref.split('-');
  if (parts.length >= 3) {
    const id = parts[1];
    const format = parts[2];
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '';
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || '';
    if (!projectId || !dataset) return null;
    return `https://cdn.sanity.io/files/${projectId}/${dataset}/${id}.${format}`;
  }
  return null;
};

export default function SeranoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const [seranote, setSeranote] = useState<Seranote | null>(null);
  const [song, setSong] = useState<Song | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isClipFinished, setIsClipFinished] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchSeranote = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/seranotes/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch seranote');

        const data = await response.json();
        setSeranote(data);
        setMessages(data.messages || []);
        setIsClipFinished(false); // Reset clip finished state for new note

        if (data.songId) {
          await fetchSongData(data.songId);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch seranote');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchSeranote();
    }
  }, [params.id]);

  // Periodic message refresh
  useEffect(() => {
    if (!seranote?.id) return;

    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/seranotes/${seranote.id}/messages`);
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        }
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    // Fetch messages immediately
    fetchMessages();

    // Set up interval to fetch messages every 3 seconds
    const interval = setInterval(fetchMessages, 3000);

    // Cleanup interval on unmount or when seranote changes
    return () => clearInterval(interval);
  }, [seranote?.id]);

  const fetchSongData = async (songId: string) => {
    try {
      const response = await fetch('/api/sanity');
      if (!response.ok) throw new Error('Failed to fetch songs');

      const songs = await response.json();
      const foundSong = songs.find((s: any) => s.currentSlug === songId);

      if (foundSong) {
        const songData = {
          id: foundSong.currentSlug,
          title: foundSong.title,
          artist: foundSong.artist,
          album: foundSong.album,
          cover: foundSong.cover,
          audioLink: foundSong.audioLink,
          audioDur: foundSong.audioDur,
        };
        setSong(songData);

        if (foundSong.audioLink) {
          const url = constructAudioUrl(foundSong.audioLink);
          console.log('Audio URL constructed:', url);
          setAudioUrl(url);
        } else {
          console.log('No audio link found for song:', foundSong);
        }
      }
    } catch (err) {
      console.error('Error fetching song data:', err);
    }
  };

  useEffect(() => {
    // Clean up previous audio element
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }

    if (audioUrl && seranote) {
      console.log('Creating audio element with URL:', audioUrl);
      console.log('Seranote clip start:', seranote.songClipStart, 'duration:', seranote.songClipDur);
      
      const audioElement = new Audio();
      audioElement.src = audioUrl;
      audioElement.preload = 'metadata';
      audioElement.currentTime = seranote.songClipStart;

      const endTime = seranote.songClipStart + seranote.songClipDur;

      const handleTimeUpdate = () => {
        setCurrentTime(audioElement.currentTime);

        // Check if we've reached the end of the clip
        if (audioElement.currentTime >= endTime) {
          audioElement.pause();
          setIsPlaying(false);
          setIsClipFinished(true);
          // Don't reset to start - let it stay at the end
        }
      };

      const handleEnded = () => {
        setIsPlaying(false);
        setIsClipFinished(true);
        // Don't reset to start - let it stay at the end
      };

      const handleLoadedMetadata = () => {
        console.log('Audio metadata loaded, setting currentTime and attempting auto-play');
        audioElement.currentTime = seranote.songClipStart;
        
        // Simple auto-play - try immediately
        audioElement.play()
          .then(() => {
            console.log('Auto-play successful');
            setIsPlaying(true);
          })
          .catch((error) => {
            console.log('Auto-play failed:', error);
          });
      };

      const handleError = (e: any) => {
        console.error('Audio loading error:', e);
        setIsPlaying(false);
      };

      const handleCanPlay = () => {
        console.log('Audio can play, attempting auto-play');
        audioElement.play()
          .then(() => {
            console.log('CanPlay auto-play successful');
            setIsPlaying(true);
          })
          .catch((error) => {
            console.log('CanPlay auto-play failed:', error);
          });
      };

      audioElement.addEventListener('timeupdate', handleTimeUpdate);
      audioElement.addEventListener('ended', handleEnded);
      audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
      audioElement.addEventListener('canplay', handleCanPlay);
      audioElement.addEventListener('error', handleError);

      // Load the audio
      audioElement.load();

      audioRef.current = audioElement;

      // Simple auto-play after a short delay
      const autoPlayTimer = setTimeout(() => {
        console.log('Attempting delayed auto-play');
        audioElement.play()
          .then(() => {
            console.log('Delayed auto-play successful');
            setIsPlaying(true);
          })
          .catch((error) => {
            console.log('Delayed auto-play failed:', error);
          });
      }, 1000);

      // Cleanup function
      return () => {
        clearTimeout(autoPlayTimer);
        audioElement.removeEventListener('timeupdate', handleTimeUpdate);
        audioElement.removeEventListener('ended', handleEnded);
        audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioElement.removeEventListener('canplay', handleCanPlay);
        audioElement.removeEventListener('error', handleError);
        audioElement.pause();
        audioElement.src = '';
      };
    }
  }, [audioUrl, seranote]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const togglePlay = async () => {
    if (!audioRef.current || !seranote) {
      console.log('Cannot play: audioRef.current =', audioRef.current, 'seranote =', seranote);
      return;
    }

    console.log('Toggle play called, isPlaying:', isPlaying, 'isClipFinished:', isClipFinished);
    console.log('Audio element readyState:', audioRef.current.readyState);
    console.log('Audio element src:', audioRef.current.src);

    try {
      if (isPlaying) {
        console.log('Pausing audio');
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        console.log('Starting/resuming audio playback');
        
        // If clip is finished, restart from beginning
        if (isClipFinished) {
          console.log('Clip was finished, restarting from beginning');
          audioRef.current.currentTime = seranote.songClipStart;
          setIsClipFinished(false);
        }
        // Otherwise, resume from current position (no change to currentTime)
        
        // Try to play the audio
        await audioRef.current.play();
        console.log('Audio play started successfully');
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
      // You could add a toast notification here to inform the user
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (!seranote) return 0;
    const totalClipDuration = seranote.songClipDur;
    const elapsed = currentTime - seranote.songClipStart;
    return Math.min(Math.max((elapsed / totalClipDuration) * 100, 0), 100);
  };

  const sendMessage = async (content: string) => {
    if (!seranote || !user) return;

    // Create optimistic message for immediate UI update
    const optimisticMessage = {
      id: `temp-${Date.now()}`,
      content,
      createdAt: new Date().toISOString(),
      sender: {
        id: user.id,
        name: user.fullName || user.firstName || 'You',
        email: user.primaryEmailAddress?.emailAddress || '',
      },
    };

    // Add optimistic message immediately
    setMessages((prev) => [...prev, optimisticMessage]);

    try {
      setIsSendingMessage(true);

      const response = await fetch(`/api/seranotes/${seranote.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      const newMessage = await response.json();
      
      // Replace optimistic message with real message
      setMessages((prev) => 
        prev.map(msg => 
          msg.id === optimisticMessage.id ? newMessage : msg
        )
      );
    } catch (err) {
      console.error('Error sending message:', err);
      
      // Remove optimistic message on error
      setMessages((prev) => 
        prev.filter(msg => msg.id !== optimisticMessage.id)
      );
      
      // You could add a toast notification here
    } finally {
      setIsSendingMessage(false);
    }
  };

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (error || !seranote) {
    return (
      <ErrorComponent title="Error loading seranote" message={error || 'Seranote not found'} />
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-4xl flex-1 flex flex-col"
      >
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Notes
        </button>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/30 scrollbar-track-transparent hover:scrollbar-thumb-purple-500/50 pb-20">
          {song && (
            <div className="mb-6 flex justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="54"
                      stroke="rgba(255, 255, 255, 0.1)"
                      strokeWidth="4"
                      fill="none"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="54"
                      stroke="#9333ea"
                      strokeWidth="4"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 54}`}
                      strokeDashoffset={`${2 * Math.PI * 54 * (1 - getProgressPercentage() / 100)}`}
                      className="transition-all duration-300 ease-out"
                    />
                  </svg>

                  <div
                    onClick={audioUrl ? togglePlay : undefined}
                    className={`absolute inset-0 flex items-center justify-center cursor-pointer group ${
                      audioUrl ? 'hover:scale-110' : 'cursor-not-allowed opacity-50'
                    } transition-transform duration-200`}
                  >
                    <div className="w-24 h-24 bg-white/5 rounded-full overflow-hidden">
                      {song.cover ? (
                        <img
                          src={urlFor(song.cover).url()}
                          alt={song.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <MusicIcon className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {audioUrl && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full flex items-center justify-center">
                          {isPlaying ? (
                            <Pause className="w-6 h-6 text-white" />
                          ) : (
                            <Play className="w-6 h-6 text-white ml-1" />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <h3 className="text-xl font-semibold text-white leading-none">{song.title}</h3>
                  <p className="text-sm text-white/90 leading-none">{song.artist}</p>
                  <p className="text-sm text-white/80 leading-none">{song.album}</p>
                  <div className="text-xs text-white/70">
                    <span className="font-medium">
                      {isClipFinished ? '0:00' : formatTime(Math.max(0, seranote.songClipDur - (currentTime - seranote.songClipStart)))}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-white/80 leading-none mt-3">
                {new Date(seranote.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          )}
          <h1 className="text-3xl font-bold text-white mb-4">{seranote.title}</h1>

          <div className="prose prose-invert max-w-none mb-8">
            <p className="text-lg text-gray-300 leading-relaxed">{seranote.message}</p>
          </div>

          {/* Messages Section */}
          <div className="mt-8 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 mb-6">
              <MessageCircle className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-semibold text-white">Conversation</h2>
              {messages.length > 0 && (
                <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                  {messages.length}
                </span>
              )}
            </div>

            {/* Messages Area */}
            <div className="mb-4">
              <MessageList messages={messages} isLoading={messagesLoading} />
            </div>
          </div>
        </div>

        {/* Fixed Message Input at Bottom */}
        {user && (
          <div className="fixed bottom-2 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-white/10 p-4 z-10 max-w-4xl ml-72 rounded-md">
            <div className="">
              <MessageInput onSendMessage={sendMessage} isSending={isSendingMessage} />
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
