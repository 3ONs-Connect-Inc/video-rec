"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import ConfirmModal from "@/components/ConfirmModal";
import { deleteVideoFromFirestoreAndR2 } from "@/firebase/deleteVideo";


interface VideoCardProps {
  id: string;
  url: string;
  filename: string;
  createdAt: string;
  keyId?: string | null;
  ownerId: string;
  onDeleteSuccess: (id: string) => void;
}

export default function VideoCard({
  id,
  url,
  filename,
  createdAt,
  ownerId,
  onDeleteSuccess,
}: VideoCardProps) {
  const { user, role } = useSelector((state: RootState) => state.session);
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // 🔒 Only admins can delete
  const canDelete = role === "admin";

  const handleDelete = async () => {
    if (!canDelete) {
      alert("You are not authorized to delete this video.");
      return;
    }

    try {
      setDeleting(true);
      await deleteVideoFromFirestoreAndR2(id, role);
      onDeleteSuccess(id);
    } catch (err: any) {
      alert("❌ Failed to delete video: " + (err?.message || err));
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  return (
    <>
      {/* Confirmation Modal */}
      <ConfirmModal
        open={confirmOpen}
        title="Delete Video"
        message="Are you sure you want to permanently delete this video? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />

      <motion.div
        whileHover={{ scale: 1.03 }}
        className="relative bg-white rounded-xl shadow-md overflow-hidden border border-gray-200"
      >
        <video src={url} controls className="w-full h-48 object-cover bg-black" />

        {canDelete && (
          <button
            onClick={() => setConfirmOpen(true)}
            disabled={deleting}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition"
          >
            <Trash2 size={18} />
          </button>
        )}

        <div className="p-3">
          <p className="font-medium text-gray-800 truncate">{filename}</p>
          <p className="text-xs text-gray-500">
            {new Date(createdAt).toLocaleString()}
          </p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 text-sm text-blue-600 hover:underline"
          >
            View / Download
          </a>
        </div>

        {deleting && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center text-gray-600 text-sm font-medium">
            Deleting...
          </div>
        )}
      </motion.div>
    </>
  );
}
