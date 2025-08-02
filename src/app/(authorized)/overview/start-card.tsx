import { motion } from 'motion/react';

export const StatCard = ({
  icon,
  label,
  value,
  index,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  index: number;
}) => (
  <motion.div
    className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.1 }}
  >
    <div className="text-purple-400">{icon}</div>
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-lg font-semibold text-white/90">{value}</p>
    </div>
  </motion.div>
);
