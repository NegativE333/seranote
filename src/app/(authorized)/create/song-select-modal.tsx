"use client"

import React, { useState, useMemo, FC } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MusicIcon, SearchIcon } from 'lucide-react';

// --- Type Definitions ---
interface Song {
    id: string;
    title: string;
    artist: string;
}

interface SongSelectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectSong: (song: Song) => void;
}

// --- Mock Data ---
const mockSongs: Song[] = [
    { id: '1', title: "Clair de Lune", artist: "Claude Debussy" },
    { id: '2', title: "Ribs", artist: "Lorde" },
    { id: '3', title: "Sparks", artist: "Coldplay" },
    { id: '4', title: "Coffee", artist: "beabadoobee" },
    { id: '5', title: "To Build A Home", artist: "The Cinematic Orchestra" },
    { id: '6', title: "Experience", artist: "Ludovico Einaudi" },
    { id: '7', title: "Nuvole Bianche", artist: "Ludovico Einaudi" },
    { id: '8', title: "Fourth of July", artist: "Sufjan Stevens" },
    { id: '9', title: "Holocene", artist: "Bon Iver" },
    { id: '10', title: "Liability", artist: "Lorde" },
];

// --- Song Selection Modal Component ---
export const SongSelectModal: FC<SongSelectModalProps> = ({ isOpen, onClose, onSelectSong }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredSongs = useMemo(() => 
        mockSongs.filter(song => 
            song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            song.artist.toLowerCase().includes(searchTerm.toLowerCase())
        ), [searchTerm]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Add custom scrollbar styles */}
                    <style jsx global>{`
                        .song-list-scrollbar::-webkit-scrollbar {
                            width: 6px;
                        }
                        .song-list-scrollbar::-webkit-scrollbar-track {
                            background: transparent;
                        }
                        .song-list-scrollbar::-webkit-scrollbar-thumb {
                            background-color: #4A5568;
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
                        transition={{ duration: 0.3, ease: "easeOut" }}
                    >
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
                        {/* Apply the custom scrollbar class here */}
                        <div className="flex-grow overflow-y-auto p-2 song-list-scrollbar">
                            {filteredSongs.map(song => (
                                <div 
                                    key={song.id}
                                    onClick={() => onSelectSong(song)}
                                    className="flex items-center p-4 rounded-lg cursor-pointer hover:bg-white/5 transition-colors"
                                >
                                    <div className="w-10 h-10 bg-white/5 rounded-md flex items-center justify-center mr-4">
                                        <MusicIcon className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-white/90">{song.title}</p>
                                        <p className="text-sm text-gray-500">{song.artist}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t border-white/10 text-center">
                            <button onClick={onClose} className="text-sm text-gray-400 hover:text-white">Cancel</button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};