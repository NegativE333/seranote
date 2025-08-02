import { useState } from 'react';
import { motion } from 'motion/react';
import { MusicIcon } from 'lucide-react';
import { SongSelectModal } from './song-select-modal';

interface Song {
  id: string;
  title: string;
  artist: string;
}

export const NoteForm = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectSong = (song: Song) => {
    setSelectedSong(song);
    setIsModalOpen(false);
  };

  return (
    <>
      <motion.div
        className="w-full max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="bg-black/30 border border-white/10 rounded-2xl backdrop-blur-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white">Create a New Note</h1>
            <p className="text-gray-400 mt-2">Pour your heart out. Your words are safe here.</p>
          </div>

          <form className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                placeholder="A title for your thoughts..."
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                Message
              </label>
              <textarea
                id="message"
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                placeholder="Write what you can't say..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Song</label>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-left flex items-center justify-between hover:border-white/20 transition-colors"
              >
                {selectedSong ? (
                  <div className="flex items-center gap-3">
                    <MusicIcon className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="font-medium text-white/90">{selectedSong.title}</p>
                      <p className="text-xs text-gray-500">{selectedSong.artist}</p>
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-400">Select a song...</span>
                )}
                <span className="text-xs text-gray-500">Change</span>
              </button>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Recipient's Email (Optional)
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                placeholder="someone@example.com"
              />
            </div>

            <div className="pt-4">
              <motion.button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-8 rounded-lg text-base shadow-lg shadow-purple-800/20"
                whileHover={{
                  scale: 1.02,
                  boxShadow: '0px 0px 20px rgba(192, 38, 211, 0.4)',
                }}
                whileTap={{ scale: 0.98 }}
              >
                Send Note
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>

      <SongSelectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectSong={handleSelectSong}
      />
    </>
  );
};
