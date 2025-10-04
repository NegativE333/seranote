import { motion } from "motion/react";


export const AnalyticsCard = ({
  title,
  label,
  value,
  icon,
  gradient,
}: {
  title: string;
  label: string;
  value: string;
  icon: React.ReactNode;
  gradient: string;
}) => {
  return (
    <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="relative overflow-hidden rounded-md border border-white/10 bg-gradient-to-b from-slate-900/60 to-slate-900/30 backdrop-blur-xl group min-w-[100px]"
        >
          <div className={`absolute -top-16 -right-16 h-40 w-40 ${gradient} opacity-20 rotate-12 blur-2xl group-hover:opacity-30 transition-opacity`}></div>
          <div className="p-6 relative">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-slate-300">{title}</h3>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-bold tracking-tight text-white">{value}</span>
                  <span className="text-xs text-slate-400 mb-1">{label}</span>
                </div>
              </div>
              <div className={`rounded-xl p-3 ${gradient} text-white shadow-sm shadow-black/20`}>
                {icon}
              </div>
            </div>
          </div>
        </motion.div>
  );
};