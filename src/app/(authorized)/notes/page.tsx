'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { NoteCard } from './note-card';
import { motion } from 'motion/react';
import moment from 'moment';
import { LogoLoading } from '@/components/ui/logo-loading';
import { MusicIcon, SendIcon, EyeIcon, MessageSquareIcon, UsersIcon } from 'lucide-react';
import { AnalyticsCard } from '@/app/[components]/analytics-card';

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
  const [analytics, setAnalytics] = useState({
    totalSeranotes: 0,
    totalMessages: 0,
    uniqueRecipients: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        
        // Fetch notes and analytics in parallel
        const [notesResponse, analyticsResponse] = await Promise.all([
          fetch('/api/seranotes?type=sent'),
          fetch('/api/analytics?type=sent'),
        ]);

        if (!notesResponse.ok) throw new Error('Failed to fetch notes');
        if (!analyticsResponse.ok) throw new Error('Failed to fetch analytics');

        const [notesData, analyticsData] = await Promise.all([
          notesResponse.json(),
          analyticsResponse.json(),
        ]);

        setNotes(notesData);
        setAnalytics(analyticsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleNoteClick = (noteId: string) => {
    router.push(`/notes/${noteId}`);
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
    // Optionally refresh analytics after deletion
    fetch('/api/analytics?type=sent')
      .then((res) => res.json())
      .then((data) => setAnalytics(data))
      .catch((err) => console.error('Error refreshing analytics:', err));
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
      <h1 className="text-3xl font-bold text-white mb-2">Sent Notes</h1>
      <p className="text-gray-400 mb-8">Your personal collection of unspoken words and melodies.</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8 max-w-[1000px]">
        <AnalyticsCard
          title="Total Seranotes"
          label="sent"
          value={analytics.totalSeranotes.toString()}
          icon={<SendIcon className="w-6 h-6" />}
          gradient="bg-gradient-to-br from-purple-500 to-pink-500"
        />
        <AnalyticsCard
          title="Total Messages"
          label="received"
          value={analytics.totalMessages.toString()}
          icon={<MessageSquareIcon className="w-6 h-6" />}
          gradient="bg-gradient-to-br from-blue-500 to-cyan-500"
        />
        <AnalyticsCard
          title="Unique Recipients"
          label="people"
          value={analytics.uniqueRecipients.toString()}
          icon={<UsersIcon className="w-6 h-6" />}
          gradient="bg-gradient-to-br from-emerald-500 to-teal-500"
        />  
      </div>
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
                  receiverEmail: note.receiverEmail,
                  accessToken: note.accessToken,
                  views: 0,
                }}
                index={index}
                unreadCount={note.unreadCount}
                onDelete={handleDeleteNote}
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
