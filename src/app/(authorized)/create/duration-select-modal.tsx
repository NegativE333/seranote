"use client";

import React, { FC, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PlayIcon, PauseIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";

interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  category: string;
  currentSlug: string;
  cover: any;
  audioLink?: any;
  audioDur?: number;
}

interface DurationSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  song: Song | null;
  onConfirmDuration: (song: Song, start: number, duration: number) => void;
}

const MAX_DURATION = 114;
const MIN_DURATION = 14;

const constructAudioUrl = (audioLink: any): string | null => {
  if (!audioLink?.asset?._ref) return null;
  const ref = audioLink.asset._ref as string;
  const parts = ref.split("-");
  if (parts.length >= 3) {
    const id = parts[1];
    const format = parts[2];
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "";
    if (!projectId || !dataset) return null;
    return `https://cdn.sanity.io/files/${projectId}/${dataset}/${id}.${format}`;
  }
  return null;
};

export const DurationSelectModal: FC<DurationSelectModalProps> = ({
  isOpen,
  onClose,
  song,
  onConfirmDuration,
}) => {
  console.log(song);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [trackDur, setTrackDur] = useState<number>(0);

  const [startSec, setStartSec] = useState(0);
  const [endSec, setEndSec] = useState(MIN_DURATION);
  const [activeSlider, setActiveSlider] = useState<"start" | "end">("start");

  const audioRef = useRef<HTMLAudioElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  // Refs to avoid stale closures inside rAF
  const startRef = useRef(0);
  const endRef = useRef(MIN_DURATION);
  const playingRef = useRef(false);

  useEffect(() => {
    if (song?.audioLink) {
      setAudioUrl(constructAudioUrl(song.audioLink));
      setIsPlaying(false);
      playingRef.current = false;
      setStartSec(0);
      startRef.current = 0;
      const hint = Math.min(song.audioDur ?? MAX_DURATION, MAX_DURATION);
      setEndSec(Math.max(MIN_DURATION, hint));
      endRef.current = Math.max(MIN_DURATION, hint);
      setActiveSlider("start");
    } else {
      setAudioUrl(null);
      setIsPlaying(false);
      playingRef.current = false;
      setStartSec(0);
      startRef.current = 0;
      setEndSec(MIN_DURATION);
      endRef.current = MIN_DURATION;
      setActiveSlider("start");
    }
  }, [song]);

  useEffect(() => {
    if (!isOpen) {
      stopTicker();
      audioRef.current?.pause();
      setIsPlaying(false);
      playingRef.current = false;
    }
  }, [isOpen]);

  const onLoadedMetadata = () => {
    const a = audioRef.current;
    if (!a?.duration || Number.isNaN(a.duration)) return;
    const d = a.duration;
    setTrackDur(d);
    const initialEnd = Math.min(d, MAX_DURATION);
    setStartSec(0);
    startRef.current = 0;
    setEndSec(Math.max(MIN_DURATION, initialEnd));
    endRef.current = Math.max(MIN_DURATION, initialEnd);
    updatePlayheadPixel(0);
  };

  const stopTicker = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  };

  const updatePlayheadPixel = (sec: number) => {
    const el = playheadRef.current;
    const tl = timelineRef.current;
    if (!el || !tl || !trackDur) return;
    const w = tl.offsetWidth || 0;
    const x = Math.max(0, Math.min((sec / trackDur) * w, w));
    el.style.transform = `translate3d(${x}px,0,0)`;
  };

  const tick = () => {
    const a = audioRef.current;
    if (!a) return;
    const now = Math.min(a.currentTime, trackDur || Infinity);
    updatePlayheadPixel(now);

    // stop at end marker precisely; use refs to avoid stale closure
    const end = endRef.current;
    if (playingRef.current && now >= end - 0.02) {
      a.pause();
      a.currentTime = end;
      updatePlayheadPixel(end);
      setIsPlaying(false);
      playingRef.current = false;
      stopTicker();
      return;
    }
    rafRef.current = requestAnimationFrame(tick);
  };

  const startTicker = () => {
    stopTicker();
    rafRef.current = requestAnimationFrame(tick);
  };

  const handlePlayPause = () => {
    const a = audioRef.current;
    if (!a || !audioUrl) return;
    if (playingRef.current) {
      a.pause();
      setIsPlaying(false);
      playingRef.current = false;
      stopTicker();
    } else {
      a.currentTime = startRef.current;
      updatePlayheadPixel(startRef.current);
      a.play().catch(() => {
        setIsPlaying(false);
        playingRef.current = false;
      });
      setIsPlaying(true);
      playingRef.current = true;
      startTicker();
    }
  };

  const clampPair = (s: number, e: number) => {
    if (!trackDur) return [0, MIN_DURATION] as const;
    s = Math.max(0, Math.min(s, trackDur));
    e = Math.max(0, Math.min(e, trackDur));
    const len = e - s;
    if (len < MIN_DURATION) e = Math.min(trackDur, s + MIN_DURATION);
    else if (len > MAX_DURATION) e = s + MAX_DURATION;
    if (e > trackDur) {
      const shift = e - trackDur;
      s = Math.max(0, s - shift);
      e = trackDur;
    }
    return [s, e] as const;
  };

  // Keep refs in sync with state
  useEffect(() => {
    startRef.current = startSec;
  }, [startSec]);
  useEffect(() => {
    endRef.current = endSec;
  }, [endSec]);
  useEffect(() => {
    playingRef.current = isPlaying;
  }, [isPlaying]);

  // On selection changes, snap playback and playhead to start
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = startRef.current;
    updatePlayheadPixel(startRef.current);
    // keep ticker as-is; tick reads refs (fresh values)
  }, [startSec, endSec]); // eslint-disable-line react-hooks/exhaustive-deps

  // Extra safety: stop via audio timeupdate (covers tab-throttling)
  const onTimeUpdate = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playingRef.current && a.currentTime >= endRef.current - 0.02) {
      a.pause();
      a.currentTime = endRef.current;
      updatePlayheadPixel(endRef.current);
      setIsPlaying(false);
      playingRef.current = false;
      stopTicker();
    }
  };

  const onStartChange = (val: number) => {
    let s = val;
    let e = Math.max(val + MIN_DURATION, endRef.current);
    [s, e] = clampPair(s, e);
    setStartSec(s);
    setEndSec(e);
    setActiveSlider("start");
  };

  const onEndChange = (val: number) => {
    let e = val;
    let s = Math.min(startRef.current, val - MIN_DURATION);
    [s, e] = clampPair(s, e);
    setStartSec(s);
    setEndSec(e);
    setActiveSlider("end");
  };

  const pct = (sec: number) => (trackDur ? (sec / trackDur) * 100 : 0);
  const startThumbPct = pct(startSec);
  const endThumbPct = pct(endSec);

  const onTimelineHover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current || !trackDur) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const clickPct = ((e.clientX - rect.left) / rect.width) * 100;
    const dStart = Math.abs(clickPct - startThumbPct);
    const dEnd = Math.abs(clickPct - endThumbPct);
    setActiveSlider(dStart <= dEnd ? "start" : "end");
  };

  const onTimelinePointerDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current || !trackDur) return;

    if ((e.target as HTMLElement).tagName.toLowerCase() === "input") {
      const rect = timelineRef.current.getBoundingClientRect();
      const clickPct = ((e.clientX - rect.left) / rect.width) * 100;
      const dStart = Math.abs(clickPct - startThumbPct);
      const dEnd = Math.abs(clickPct - endThumbPct);
      setActiveSlider(dStart <= dEnd ? "start" : "end");
      return;
    }

    const rect = timelineRef.current.getBoundingClientRect();
    const clickRatio = (e.clientX - rect.left) / rect.width;
    const clickSec = Math.max(0, Math.min(clickRatio * trackDur, trackDur));
    const currentLen = Math.min(endRef.current - startRef.current, MAX_DURATION);
    let s = Math.max(0, Math.min(clickSec - currentLen / 2, Math.max(0, trackDur - currentLen)));
    let e2 = s + currentLen;
    [s, e2] = clampPair(s, e2);
    setStartSec(s);
    setEndSec(e2);
  };

  const confirm = () => {
    if (!song) return;
    onConfirmDuration(song, startRef.current, Math.max(MIN_DURATION, Math.min(endRef.current - startRef.current, MAX_DURATION)));
  };

  if (!song) return null;

  const selLeftPct = pct(startSec);
  const selWidthPct = pct(endSec - startSec);

  const format = (t: number) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
          <motion.div
            className="relative z-10 w-full max-w-xl bg-[#0b0b0c] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            initial={{ scale: 0.95, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-white/5 to-transparent">
              <h3 className="text-base font-semibold text-white">Select Audio</h3>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 transition-colors">
                <XIcon className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <Image
                  src={urlFor(song.cover).url()}
                  alt={song.title}
                  width={64}
                  height={64}
                  className="object-cover rounded-md ring-1 ring-white/10"
                />
                <div>
                  <h4 className="font-semibold text-white truncate">{song.title}</h4>
                  <p className="text-sm text-gray-400 truncate">{song.artist}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={handlePlayPause}
                  disabled={!audioUrl}
                  className="p-2 rounded-full bg-purple-600/60 hover:bg-purple-600 transition-colors disabled:opacity-50 shadow-md shadow-purple-900/30"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <PauseIcon className="w-5 h-5 text-white" /> : <PlayIcon className="w-5 h-5 text-white" />}
                </button>

                <div className="relative flex-1">
                  <div
                    ref={timelineRef}
                    className="relative w-full h-12 flex items-center"
                    onMouseMove={onTimelineHover}
                    onMouseEnter={onTimelineHover}
                    onMouseDown={onTimelinePointerDown}
                  >
                    <div className="w-full h-[6px] bg-white/10 rounded-full" />
                    <div
                      className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 h-[6px] rounded-full"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(to right, rgba(255,255,255,0.08) 0 1px, transparent 1px 8px)",
                      }}
                    />
                    {/* Selection fill */}
                    <div
                      className="absolute top-1/2 -translate-y-1/2 h-3 rounded-sm border border-purple-400/70 shadow-inner shadow-purple-900/30"
                      style={{
                        left: `${selLeftPct}%`,
                        width: `${selWidthPct}%`,
                        background:
                          "linear-gradient(90deg, rgba(168,85,247,0.35) 0%, rgba(236,72,153,0.35) 100%)",
                        transition: "left 120ms ease, width 120ms ease",
                      }}
                    />
                    {/* Playhead (transform-based, very smooth) */}
                    <div
                      ref={playheadRef}
                      className="pointer-events-none absolute top-[25%] will-change-transform"
                      style={{ transform: "translate3d(0,0,0)" }}
                    >
                      <div className="w-[2px] h-6 bg-white/85 shadow-[0_0_10px_rgba(255,255,255,0.45)]" />
                      <div className="mt-1 w-2 h-2 rounded-full bg-white/90 -translate-x-[3px] shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
                    </div>

                    {/* Dual sliders */}
                    <div className="absolute inset-0 flex items-center">
                      <input
                        type="range"
                        min={0}
                        max={trackDur || 0}
                        step={0.1}
                        value={startSec}
                        onChange={(e) => onStartChange(parseFloat(e.target.value))}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          setActiveSlider("start");
                        }}
                        className={`range-thumb w-full h-12 bg-transparent appearance-none cursor-pointer ${
                          activeSlider === "start" ? "z-20" : "z-10"
                        }`}
                      />
                      <input
                        type="range"
                        min={0}
                        max={trackDur || 0}
                        step={0.1}
                        value={endSec}
                        onChange={(e) => onEndChange(parseFloat(e.target.value))}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          setActiveSlider("end");
                        }}
                        className={`range-thumb w-full h-12 bg-transparent appearance-none cursor-pointer absolute inset-0 ${
                          activeSlider === "end" ? "z-20" : "z-10"
                        }`}
                      />
                    </div>
                  </div>

                  <style jsx>{`
                    .range-thumb::-webkit-slider-runnable-track {
                      height: 0;
                      background: transparent;
                      border: none;
                    }
                    .range-thumb::-webkit-slider-thumb {
                      -webkit-appearance: none;
                      appearance: none;
                      width: 6px;
                      height: 24px;
                      border-radius: 6px;
                      background: #ffffff;
                      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
                      border: 1px solid rgba(0, 0, 0, 0.2);
                      margin-top: -12px;
                    }
                    .range-thumb::-moz-range-track {
                      height: 0;
                      background: transparent;
                      border: none;
                    }
                    .range-thumb::-moz-range-thumb {
                      width: 10px;
                      height: 24px;
                      border-radius: 6px;
                      background: #ffffff;
                      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
                      border: 1px solid rgba(0, 0, 0, 0.2);
                    }
                  `}</style>
                </div>
              </div>

              <div className="mt-3 flex justify-between text-[11px] text-gray-500">
                <span>{format(0)}</span>
                <span>{format(Math.max(0, trackDur))}</span>
              </div>

              <p className="text-center text-sm text-gray-200 mt-3">
                Selected: {format(startSec)} - {format(Math.min(trackDur || Infinity, endRef.current))} ({Math.round(endRef.current - startRef.current)}s)
              </p>
            </div>

            <div className="p-4 bg-black/20">
              <button
                onClick={confirm}
                className="w-full px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors text-sm font-semibold shadow-md shadow-purple-900/20"
              >
                Confirm
              </button>
            </div>

            <audio
              ref={audioRef}
              src={audioUrl || undefined}
              onLoadedMetadata={onLoadedMetadata}
              onTimeUpdate={onTimeUpdate}
              onEnded={() => {
                setIsPlaying(false);
                playingRef.current = false;
                stopTicker();
              }}
              className="hidden"
              preload="metadata"
              onPlay={startTicker}
              onPause={stopTicker}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};