'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { ArrowLeft, Play, Pause, MusicIcon } from 'lucide-react';
import { urlFor } from '@/lib/sanity';

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
  senderId: string;
  receiverId?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  accessToken: string;
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
  const [seranote, setSeranote] = useState<Seranote | null>(null);
  const [song, setSong] = useState<Song | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchSeranote = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/seranotes/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch seranote');

        const data = await response.json();
        setSeranote(data);

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
          setAudioUrl(url);
        }
      }
    } catch (err) {
      console.error('Error fetching song data:', err);
    }
  };

  useEffect(() => {
    if (audioUrl && seranote) {
      const audioElement = new Audio();
      audioElement.src = audioUrl;
      audioElement.currentTime = seranote.songClipStart;

      const endTime = seranote.songClipStart + seranote.songClipDur;

      audioElement.addEventListener('timeupdate', () => {
        setCurrentTime(audioElement.currentTime);

        if (audioElement.currentTime >= endTime) {
          audioElement.pause();
          setIsPlaying(false);
          audioElement.currentTime = seranote.songClipStart;
        }
      });

      audioElement.addEventListener('ended', () => {
        setIsPlaying(false);
        audioElement.currentTime = seranote.songClipStart;
      });

      audioRef.current = audioElement;

      setTimeout(() => {
        if (audioElement && !isPlaying) {
          audioElement
            .play()
            .then(() => {
              setIsPlaying(true);
            })
            .catch(() => {});
        }
      }, 1000);
    }
  }, [audioUrl, seranote]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.currentTime = seranote!.songClipStart;
      audioRef.current.play();
      setIsPlaying(true);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error || !seranote) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-red-400 mb-2">Error loading seranote</h2>
        <p className="text-gray-400">{error || 'Seranote not found'}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl"
    >
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Notes
      </button>

      {song && (
        <div className="mb-6">
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
                  {formatTime(seranote.songClipDur - (currentTime - seranote.songClipStart))}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      <h1 className="text-3xl font-bold text-white mb-4">{seranote.title}</h1>

      <div className="prose prose-invert max-w-none mb-8">
        <p className="text-lg text-gray-300 leading-relaxed">{seranote.message}</p>
      </div>

      <div className="mt-6 pt-6 border-t border-white/10 text-sm text-gray-400">
        <p>
          Created:{' '}
          {new Date(seranote.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </motion.div>
  );
}
