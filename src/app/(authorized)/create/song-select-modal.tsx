'use client';

import React, { useState, useMemo, FC } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SearchIcon } from 'lucide-react';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity';
import { useQuery } from '@tanstack/react-query';
import { DurationSelectModal } from './duration-select-modal';
import { LogoLoading } from '@/components/ui/logo-loading';

interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  category: string;
  currentSlug: string;
  cover: any;
  audioLink?: any;
  audioDur?: number;
}

interface songsData {
  title: string;
  artist: string;
  album: string;
  category: string;
  currentSlug: string;
  cover: any;
  lrc: string;
  audioLink?: any;
  audioDur?: number;
}

interface SongSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSong: (song: Song, startTime: number, duration: number) => void;
}

// Fetch function for songs
const fetchSongs = async (): Promise<songsData[]> => {
  const response = await fetch('/api/sanity');
  if (!response.ok) {
    throw new Error('Failed to fetch songs');
  }
  return response.json();
};

// --- Song Selection Modal Component ---
export const SongSelectModal: FC<SongSelectModalProps> = ({ isOpen, onClose, onSelectSong }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSongForDuration, setSelectedSongForDuration] = useState<Song | null>(null);
  const [showDurationModal, setShowDurationModal] = useState(false);

  const {
    data: songs = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['songs'],
    queryFn: fetchSongs,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: isOpen,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const convertedSongs: Song[] = useMemo(() => {
    return songs.map((song, index) => ({
      id: song.currentSlug || `song-${index}`,
      title: song.title,
      album: song.album,
      category: song.category,
      currentSlug: song.currentSlug,
      cover: song.cover,
      audioLink: song.audioLink,
      audioDur: song.audioDur,
      artist: song.artist,
    }));
  }, [songs]);

  const filteredSongs = useMemo(
    () =>
      convertedSongs.filter(
        (song) =>
          song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          song.artist.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [convertedSongs, searchTerm],
  );

  const handleSongSelect = (song: Song) => {
    setSelectedSongForDuration(song);
    setShowDurationModal(true);
  };

  const handleDurationConfirm = (song: Song, selectedTime: number, duration: number) => {
    onSelectSong(song, selectedTime, duration);
    setShowDurationModal(false);
    setSelectedSongForDuration(null);
  };

  const handleDurationModalClose = () => {
    setShowDurationModal(false);
    setSelectedSongForDuration(null);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <style jsx global>{`
              .song-list-scrollbar::-webkit-scrollbar {
                width: 6px;
              }
              .song-list-scrollbar::-webkit-scrollbar-track {
                background: transparent;
              }
              .song-list-scrollbar::-webkit-scrollbar-thumb {
                background-color: #4a5568;
                border-radius: 10px;
              }
              .song-list-scrollbar::-webkit-scrollbar-thumb:hover {
                background-color: #718096;
              }
            `}</style>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose}></div>
            <motion.div
              className="relative z-10 w-full max-w-lg bg-[#111113] border border-white/10 rounded-xl shadow-2xl flex flex-col h-[80vh]"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10">
                <h3 className="text-lg font-semibold text-white">Select a Song</h3>
                <div className="relative mt-4">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search for a song or artist..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Song List */}
              <div className="flex-grow overflow-y-auto p-2 song-list-scrollbar">
                {isLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <LogoLoading size="md" />
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center p-8 text-red-500">
                    <p>Error loading songs. Please try again.</p>
                  </div>
                ) : filteredSongs.length > 0 ? (
                  filteredSongs.map((song) => (
                    <div
                      key={song.id}
                      onClick={() => handleSongSelect(song)}
                      className="flex items-center p-4 rounded-lg cursor-pointer hover:bg-white/5 transition-colors"
                    >
                      <div className="w-10 h-10 bg-white/5 rounded-md flex items-center justify-center mr-4">
                        <Image
                          src={urlFor(song.cover).url()}
                          alt={song.title}
                          width={40}
                          height={40}
                          className="object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-white/90">{song.title}</p>
                        <p className="text-sm text-gray-500">{song.artist}</p>
                      </div>
                      {song.audioDur && (
                        <span className="text-xs text-gray-400">{formatTime(song.audioDur)}</span>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center p-8 text-gray-500">
                    <p>No songs found</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-white/10 text-center">
                <button onClick={onClose} className="text-sm text-gray-400 hover:text-white">
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Duration Selection Modal */}
      <DurationSelectModal
        isOpen={showDurationModal}
        onClose={handleDurationModalClose}
        song={selectedSongForDuration}
        onConfirmDuration={handleDurationConfirm}
      />
    </>
  );
};
