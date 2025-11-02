import { motion, AnimatePresence } from 'framer-motion';
import { LinkIcon, TrashIcon, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export const NoteCard = ({
  note,
  index,
  unreadCount = 0,
  onDelete,
}: {
  note: any;
  index: number;
  unreadCount?: number;
  onDelete?: (noteId: string) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    e.preventDefault();
    
    if (!note.id) {
      toast.error('No link available to copy');
      return;
    }

    const shareToken = note.id;
    const shareUrl = `${window.location.origin}/notes/${shareToken}`;
    
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied to clipboard!');
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error copying link:', error);
      toast.error('Failed to copy link. Please try again.');
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    
    if (!note.id || !onDelete) return;
    
    if (!confirm('Are you sure you want to delete this seranote? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/seranotes/${note.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete seranote');
      }

      onDelete(note.id);
    } catch (error) {
      console.error('Error deleting seranote:', error);
      alert('Failed to delete seranote. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      layout
      transition={{ layout: { duration: 0.3, ease: 'easeOut' } }}
      className="relative bg-[#111113] border border-white/10 rounded-lg overflow-hidden cursor-pointer max-w-[1000px]"
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

      <div className="p-3 sm:p-4 pl-4 sm:pl-6">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <h3 className="text-base sm:text-lg font-semibold text-white/90 truncate">{note.title}</h3>
            </div>
            {note.senderEmail ? (
              <p className="text-xs text-white/50 mt-1 truncate">
                from {note.senderEmail}
              </p>
            ) : note.receiverEmail ? (
              <p className="text-xs text-white/50 mt-1 truncate">
                to {note.receiverEmail}
              </p>
            ) : null}
          </div>
          <div className="flex flex-row sm:flex-col sm:justify-between sm:items-end items-center gap-2 text-gray-400">
            {unreadCount > 0 && (
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4 text-purple-400" />
                <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full animate-pulse transition-all duration-200">
                  {unreadCount}
                </span>
              </div>
            )}
            <span className="text-xs mt-auto">{note.date}</span>
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
                  {onDelete && (
                    <>
                      <button
                        onClick={handleCopyLink}
                        className="ml-auto p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                        title="Copy link"
                      >
                        <LinkIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="p-2 rounded-full text-gray-400 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="Delete note"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
