import { motion, AnimatePresence } from 'framer-motion';
import { LinkIcon, TrashIcon, MessageCircle } from 'lucide-react';
import { useState } from 'react';

export const NoteCard = ({
  note,
  index,
  unreadCount = 0,
}: {
  note: any;
  index: number;
  unreadCount?: number;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: index * 0.05 },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, height: 0, marginTop: '0rem' },
    visible: {
      opacity: 1,
      height: 'auto',
      marginTop: '1rem',
      transition: { duration: 0.4 },
    },
  };

  const handleMouseEnter = () => {
    if (!isLocked) {
      setIsExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isLocked) {
      setIsExpanded(false);
    }
  };

  const handleClick = () => {
    if (isLocked) {
      setIsLocked(false);
      setIsExpanded(false);
    } else {
      setIsLocked(true);
      setIsExpanded(true);
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      layout
      transition={{ layout: { duration: 0.3, ease: 'easeOut' } }}
      className="relative bg-[#111113] border border-white/10 rounded-xl overflow-hidden cursor-pointer max-w-[1000px]"
      onHoverStart={handleMouseEnter}
      onHoverEnd={handleMouseLeave}
      onClick={handleClick}
    >
      <motion.div
        className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-purple-500 to-pink-500"
        animate={{
          opacity: isExpanded ? 1 : 0.4,
          boxShadow: isExpanded ? '0 0 15px rgba(192, 38, 211, 0.5)' : 'none',
        }}
        transition={{ duration: 0.3 }}
      />

      <div className="p-6 pl-8">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-white/90">{note.title}</h3>
              {unreadCount > 0 && (
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4 text-red-400" />
                  <span className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded-full animate-pulse">
                    {unreadCount}
                  </span>
                </div>
              )}
            </div>
            {note.sender && (
              <p className="text-sm text-purple-400 mt-1">
                from {note.sender.name || note.sender.email}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <span className="text-xs">{note.date}</span>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-sm text-gray-400 pt-4 border-t border-white/10">{note.snippet}</p>
              <div className="mt-4 flex justify-between items-center">
                <div className="flex">
                  <button className="ml-auto p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10">
                    <LinkIcon className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
