"use client";
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "@/firebase/config";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import VideoCard from "./VideoCard";

interface Props {
  user: {
    userId: string;
    firstname: string;
    lastname: string;
  };
  onClose: () => void;
}

interface Video {
  id: string;
  url: string;
  key?: string | null;
  filename: string;
  userId: string;
  createdAt: any;
}

export default function UserVideoModal({ user, onClose }: Props) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserVideos = async () => {
      try {
        const q = query(
          collection(db, "videos"),
          where("userId", "==", user.userId),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as any),
          createdAt: doc.data().createdAt?.toDate?.() ?? new Date(),
        }));
        setVideos(data);
      } catch (e) {
        console.error("Error fetching user videos:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchUserVideos();
  }, [user.userId]);

  const handleVideoDeleted = (id: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== id));
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-xl shadow-xl w-full max-w-5xl p-6 overflow-y-auto max-h-[90vh]"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {user.firstname} {user.lastname}’s Videos
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
              <X size={20} />
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <motion.div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin mb-3" />
              Loading videos...
            </div>
          ) : videos.length === 0 ? (
            <p className="text-center text-gray-500 py-12">
              No videos uploaded yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.map((video) => (
                <VideoCard
                  key={video.id}
                  id={video.id}
                  url={video.url}
                  filename={video.filename}
                  createdAt={video.createdAt}
                  keyId={video.key}
                  ownerId={video.userId}
                  onDeleteSuccess={handleVideoDeleted}
                />
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
