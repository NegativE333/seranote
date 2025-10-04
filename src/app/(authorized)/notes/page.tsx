'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { NoteCard } from './note-card';
import { motion } from 'motion/react';
import moment from 'moment';
import { LogoLoading } from '@/components/ui/logo-loading';

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
  unreadCount: number; // Added unread count to the interface
  sender?: {
    id: string;
    name: string | null;
    email: string;
  };
}

export default function NotesPage() {
  const { user } = useUser();
  const router = useRouter();
  const [notes, setNotes] = useState<Seranote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const response = await fetch('/api/seranotes?type=sent');
        if (!response.ok) throw new Error('Failed to fetch notes');

        const data = await response.json();
        setNotes(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch notes');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, [user]);

  const handleNoteClick = (noteId: string) => {
    router.push(`/notes/${noteId}`);
  };

  const hasNotes = notes.length > 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LogoLoading size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-red-400 mb-2">Error loading notes</h2>
        <p className="text-gray-400">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-3xl font-bold text-white mb-2">My Notes</h1>
      <p className="text-gray-400 mb-8">Your personal collection of unspoken words and melodies.</p>
      {hasNotes ? (
        <div className="space-y-4">
          {notes.map((note, index) => (
            <div key={note.id} onClick={() => handleNoteClick(note.id)}>
              <NoteCard
                note={{
                  id: note.id,
                  title: note.title,
                  snippet: note.message,
                  date: moment(note.createdAt).format('MMM D, YYYY'),
                  views: 0,
                }}
                index={index}
                unreadCount={note.unreadCount}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-white/90 mb-2">Your journal is empty</h2>
          <p className="text-gray-400 max-w-sm mx-auto">
            This is your private space. Create your first note to get started.
          </p>
        </div>
      )}
    </motion.div>
  );
}
