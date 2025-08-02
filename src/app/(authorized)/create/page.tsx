"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { NoteForm } from "./note-form";

interface Song {
  id: string;
  title: string;
  artist: string;
}

// --- Main Form Page Component ---
export default function CreateNotePage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectSong = (song: Song) => {
    setSelectedSong(song);
    setIsModalOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <NoteForm />
    </motion.div>
  );
}
