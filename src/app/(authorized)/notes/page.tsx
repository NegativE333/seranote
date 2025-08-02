'use client';

import { useState } from 'react';
import { NoteCard } from './note-card';
import { motion } from 'motion/react';

export default function NotesPage() {
  const [notes] = useState([
    {
      id: '1',
      title: 'For the moments we almost had',
      snippet:
        "I find myself replaying the conversations, the silences, the maybes. It's a film I've seen a thousand times...",
      song: 'Clair de Lune',
      artist: 'Claude Debussy',
      date: 'Aug 1, 2025',
      views: 12,
    },
    {
      id: '2',
      title: 'A Tuesday afternoon reminder',
      snippet:
        'Just a quick note to say I was thinking of you. The sky is the same color as your eyes today.',
      song: 'Ribs',
      artist: 'Lorde',
      date: 'Jul 28, 2025',
      views: 1,
    },
    {
      id: '3',
      title: 'Maybe in another life',
      snippet:
        "Perhaps we meet again, as different people in a different time, and this time, it's right.",
      song: 'Sparks',
      artist: 'Coldplay',
      date: 'Jul 15, 2025',
      views: 0,
    },
    {
      id: '4',
      title: 'The Coffee Shop',
      snippet:
        "You were there again today, same order, same quiet corner. I wonder what you're reading.",
      song: 'Coffee',
      artist: 'beabadoobee',
      date: 'Jul 5, 2025',
      views: 28,
    },
    {
      id: '5',
      title: 'The Coffee Shop',
      snippet:
        "You were there again today, same order, same quiet corner. I wonder what you're reading.",
      song: 'Coffee',
      artist: 'beabadoobee',
      date: 'Jul 5, 2025',
      views: 28,
    },
    {
      id: '6',
      title: 'The Coffee Shop',
      snippet:
        "You were there again today, same order, same quiet corner. I wonder what you're reading.",
      song: 'Coffee',
      artist: 'beabadoobee',
      date: 'Jul 5, 2025',
      views: 28,
    },
    {
      id: '7',
      title: 'The Coffee Shop',
      snippet:
        "You were there again today, same order, same quiet corner. I wonder what you're reading.",
      song: 'Coffee',
      artist: 'beabadoobee',
      date: 'Jul 5, 2025',
      views: 28,
    },
    {
      id: '8',
      title: 'The Coffee Shop',
      snippet:
        "You were there again today, same order, same quiet corner. I wonder what you're reading.",
      song: 'Coffee',
      artist: 'beabadoobee',
      date: 'Jul 5, 2025',
      views: 28,
    },
  ]);

  const hasNotes = notes.length > 0;

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
            <NoteCard key={note.id} note={note} index={index} />
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
