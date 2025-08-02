'use client';

import { useState } from 'react';
import { MusicIcon, EyeIcon } from 'lucide-react';
import { StatCard } from './start-card';
import { motion } from 'motion/react';

export default function OverviewPage() {
  const [notes] = useState([
    {
      id: '1',
      title: 'For the moments we almost had',
      views: 12,
    },
    {
      id: '2',
      title: 'A Tuesday afternoon reminder',
      views: 1,
    },
    {
      id: '3',
      title: 'Maybe in another life',
      views: 0,
    },
    {
      id: '4',
      title: 'The Coffee Shop',
      views: 28,
    },
  ]);

  const totalViews = notes.reduce((sum, note) => sum + note.views, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-3xl font-bold text-white mb-2">Overview</h1>
      <p className="text-gray-400 mb-8">A summary of your activity.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={<MusicIcon className="w-8 h-8" />}
          label="Total Notes"
          value={notes.length.toString()}
          index={0}
        />
        <StatCard
          icon={<EyeIcon className="w-8 h-8" />}
          label="Total Views"
          value={totalViews.toString()}
          index={1}
        />
        <StatCard
          icon={<MusicIcon className="w-8 h-8" />}
          label="Most Viewed"
          value={notes[3]?.title || 'N/A'}
          index={2}
        />
      </div>
    </motion.div>
  );
}
