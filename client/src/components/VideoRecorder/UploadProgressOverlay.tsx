"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface UploadProgressOverlayProps {
  progress: number; // 0–100
  total: number;
  current: number;
  visible: boolean;
}

export default function UploadProgressOverlay({
  progress,
  total,
  current,
  visible,
}: UploadProgressOverlayProps) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Circular Progress Ring */}
          <div className="relative mb-6">
            <svg
              className="w-40 h-40 transform -rotate-90"
              viewBox="0 0 150 150"
            >
              {/* Background ring */}
              <circle
                cx="75"
                cy="75"
                r={radius}
                stroke="#444"
                strokeWidth="10"
                fill="transparent"
              />
              {/* Animated progress ring */}
              <motion.circle
                cx="75"
                cy="75"
                r={radius}
                stroke="#3b82f6"
                strokeWidth="10"
                fill="transparent"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                animate={{ strokeDashoffset: offset }}
                transition={{ ease: "easeOut", duration: 0.4 }}
              />
            </svg>

            {/* Percentage label in center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                key={progress}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-3xl font-bold"
              >
                {Math.round(progress)}%
              </motion.span>
              <span className="text-sm text-gray-300 mt-1">
                Clip {current} / {total}
              </span>
            </div>
          </div>

          {/* Loading text */}
          <motion.p
            className="text-lg font-medium text-center mb-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Uploading your videos...
          </motion.p>
          <motion.p
            className="text-sm text-gray-400 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Please don’t close this window.
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
