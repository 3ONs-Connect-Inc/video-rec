"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title = "Confirm Action",
  message = "Are you sure?",
  confirmText = "Yes",
  cancelText = "No",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-sm text-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <h2 className="text-lg font-semibold mb-2">{title}</h2>
            <p className="text-gray-600 mb-6">{message}</p>

            <div className="flex justify-center gap-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 cursor-pointer rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
