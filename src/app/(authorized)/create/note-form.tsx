import { useState } from 'react';
import { motion } from 'motion/react';
import { MusicIcon } from 'lucide-react';
import { SongSelectModal } from './song-select-modal';
import { toast } from 'sonner';

interface Song {
  id: string;
  title: string;
  artist: string;
  audioDur?: number; // optional from Sanity
}

const DEFAULT_CLIP_DURATION = 114;

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const NoteForm = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [clipStart, setClipStart] = useState<number | null>(null);
  const [clipDuration, setClipDuration] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [savingStage, setSavingStage] = useState(0);

  // Expecting SongSelectModal to call onSelectSong(song, start, duration)
  const handleSelectSong = (song: any, selectedStart?: number, selectedDuration?: number) => {
    setSelectedSong(song);
    setClipStart(selectedStart ?? 0);
    setClipDuration(selectedDuration ?? DEFAULT_CLIP_DURATION);
    setIsModalOpen(false);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSong) return;

    try {
      setSubmitting(true);
      setTimeout(() => setSavingStage(1), 1000);
      setTimeout(() => setSavingStage(2), 2500);
      const res = await fetch('/api/seranotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          message,
          songId: selectedSong.id,
          songClipStart: clipStart ?? 0,
          songClipDur: clipDuration ?? DEFAULT_CLIP_DURATION,
          songTotalDur: selectedSong.audioDur ?? null,
          receiverEmail: email || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to save note');
      }
      setShowSuccess(true);
      setSavingStage(3);
      setTitle('');
      setMessage('');
      setEmail('');
      setSelectedSong(null);
      setClipStart(null);
      setClipDuration(null);
      toast.success('Note sent');
      setTimeout(() => {
        setShowSuccess(false);
        setSavingStage(0);
      }, 3000);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <motion.div
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Create a New Note</h1>
          <p className="text-gray-400 mt-2">Pour your heart out. Your words are safe here.</p>
        </div>

        <form className="space-y-6" onSubmit={onSubmit}>
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
              required
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
              required
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
                    {clipStart !== null && clipDuration !== null && (
                      <p className="text-xs text-gray-400">
                        Clip: {formatTime(clipStart)} - {formatTime(clipStart + clipDuration)}
                      </p>
                    )}
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
              disabled={submitting || !selectedSong || showSuccess}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-8 rounded-lg text-base shadow-lg shadow-purple-800/20 disabled:opacity-50 relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Button Content - Fixed size container */}
              <div className="flex items-center justify-center gap-2 h-6">
                {/* Normal State */}
                {!submitting && !showSuccess && (
                  <motion.div
                    className="flex items-center justify-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span>Send Note</span>
                  </motion.div>
                )}

                {/* Saving State */}
                {submitting && (
                  <motion.div
                    className="flex items-center justify-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                    <motion.div
                      key={savingStage}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="min-w-[200px] text-left"
                    >
                      {savingStage === 0 && 'Wrapping your note in starlight...'}
                      {savingStage === 1 && 'Sending it into the cosmos...'}
                      {savingStage === 2 && 'Almost there...'}
                    </motion.div>
                  </motion.div>
                )}

                {/* Success State */}
                {showSuccess && (
                  <motion.div
                    className="flex items-center justify-center gap-2 relative z-10"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2, delay: 0.1 }}
                      className="w-5 h-5 bg-white rounded-full flex items-center justify-center"
                    >
                      <span className="text-green-600 text-sm font-bold">✓</span>
                    </motion.div>
                    <span className="text-white font-semibold">Your Seranote is on its way</span>
                  </motion.div>
                )}
              </div>

              {/* Background color change for success */}
              {showSuccess && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>

      <SongSelectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectSong={handleSelectSong}
      />
    </>
  );
};
