"use client";

import { motion } from "motion/react";

export default function AnalyticsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
      <p className="text-gray-400 mb-8">This section is under construction.</p>
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-white/90 mb-2">
          Analytics coming soon
        </h2>
        <p className="text-gray-400 max-w-sm mx-auto">
          Detailed insights and statistics will be available here.
        </p>
      </div>
    </motion.div>
  );
}
