"use client";
import React, { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase/config";
import VideoCard from "./VideoCard";
import { motion } from "framer-motion";

export interface VideoClip {
  id: string;
  url: string;
  filename: string;
  userId?: string;
  size: number;
  mimeType: string;
  createdAt: any;
}

export default function VideoList() {
  const [videos, setVideos] = useState<VideoClip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const q = query(collection(db, "videos"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const data: VideoClip[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as any),
          createdAt: doc.data().createdAt?.toDate?.() ?? new Date(),
        }));
        setVideos(data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handleDeleteSuccess = (id: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== id));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <motion.div
          className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin mb-3"
        />
        Fetching videos...
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        No videos found
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
      }}
    >
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          id={video.id}
          url={video.url}
          filename={video.filename}
          createdAt={video.createdAt}
          ownerId={video.userId ?? ""}
          onDeleteSuccess={handleDeleteSuccess}
        />
      ))}
    </motion.div>
  );
}
