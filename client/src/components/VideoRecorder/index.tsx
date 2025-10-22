"use client";

import React, { useState } from "react";
import useVideoRecorder from "@/hooks/useVideoRecorder";
import VideoControls from "./VideoControls";
import ConfirmModal from "../ConfirmModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadFileToCFWorker, saveClipMetadataToFirestore } from "@/lib/r2VideoUpload";
import UploadProgressOverlay from "./UploadProgressOverlay";
import { useSession } from "@/hooks/auth/useSession";
import { useRouter } from "next/navigation";
import RecordedSegmentList from "./RecordedSegmentList";

export default function VideoRecorder() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user } = useSession();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentClip, setCurrentClip] = useState(0);
  const [totalClips, setTotalClips] = useState(0);

  const {
    videoRef,
    isRecording,
    isPaused,
    isVideoEnabled,
    isMicEnabled,
    videoPlaybackUrl,
    elapsed,
    segments,
    setSegments, 
    toggleMic,
    toggleVideoTrack,
    toggleStartStop,
    pauseRecording,
    resumeRecording,
    finalizeSession,
    resetSession,
  } = useVideoRecorder();

  const handleToggleStartStop = () => {
    if (!user) {
      router.push("/sign-in");
      return;
    }
    toggleStartStop();
  };

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => await uploadFileToCFWorker(file),
  });

  const saveMetaMutation = useMutation({
    mutationFn: async (payload: {
      url: string;
      key?: string | null;
      filename: string;
      size: number;
      mimeType: string;
      userId?: string | null;
    }) => await saveClipMetadataToFirestore(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
  });

  const handleEndCallClick = () => setShowConfirmModal(true);

  // 🧠 DELETE SEGMENT FUNCTION
  const handleDeleteSegment = (createdAt: number) => {
    setSegments((prev: any[]) => prev.filter((seg) => seg.createdAt !== createdAt));
  };

  // 📤 Upload logic
  const handleEndCall = async () => {
    try {
      const recordedSegments = await finalizeSession();
      if (!recordedSegments || recordedSegments.length === 0) {
        await resetSession(true);
        return;
      }

      setTotalClips(recordedSegments.length);
      setProgress(0);
      setCurrentClip(0);
      setIsUploading(true);

      let completed = 0;

      await Promise.all(
        recordedSegments.map(async (seg, index) => {
          try {
            const file = new File([seg.blob], `clip-${seg.createdAt}.webm`, {
              type: seg.blob.type || "video/webm",
            });

            const uploadRes = await uploadMutation.mutateAsync(file);

            await saveMetaMutation.mutateAsync({
              url: uploadRes.url,
              key: uploadRes.key ?? null,
              filename: file.name,
              size: file.size,
              mimeType: file.type,
              userId: user?.uid ?? null,
            });

            completed += 1;
            setCurrentClip(completed);
            setProgress((completed / recordedSegments.length) * 100);
          } catch (err) {
            console.error(`❌ Error uploading clip ${index + 1}:`, err);
          }
        })
      );

      await resetSession(true);
      setIsUploading(false);
      setProgress(100);
      alert("✅ All clips uploaded and saved!");
    } catch (err: any) {
      console.error("End Call upload error", err);
      alert("❌ Failed to upload clips: " + (err?.message || err));
      setIsUploading(false);
      try {
        await resetSession(true);
      } catch {}
    }
  };

  const handleConfirmEndCall = async () => {
    setShowConfirmModal(false);
    await handleEndCall();
  };

  const handleCancelEndCall = () => setShowConfirmModal(false);

  const formatTime = (sec: number) => {
    const mm = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const ss = Math.floor(sec % 60)
      .toString()
      .padStart(2, "0");
    return `${mm}:${ss}`;
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center relative">
      <h1 className="text-2xl font-semibold mb-4 text-center">Video Interview Recorder</h1>

      <div className="relative aspect-video w-full bg-black rounded-xl overflow-hidden shadow-lg">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          controls={!isRecording && !!videoPlaybackUrl}
          muted={isRecording}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="mt-3 text-sm text-gray-600">Recorded time: {formatTime(elapsed)}</div>

      <VideoControls
        micOn={isMicEnabled}
        videoOn={isVideoEnabled}
        isRecording={isRecording}
        isPaused={isPaused}
        onToggleMic={toggleMic}
        onToggleVideo={toggleVideoTrack}
        onToggleStartStop={handleToggleStartStop}
        onPause={pauseRecording}
        onResume={resumeRecording}
        onEndCall={handleEndCallClick}
      />

      {/* Recorded Segments */}
      <RecordedSegmentList segments={segments} onDelete={handleDeleteSegment} />

      {/* Confirm Modal */}
      <ConfirmModal
        open={showConfirmModal}
        title="Submit Your Videos?"
        message="Are you sure you want to submit these recorded clips?"
        confirmText="Yes, Submit"
        cancelText="No, Go Back"
        onConfirm={handleConfirmEndCall}
        onCancel={handleCancelEndCall}
      />

      <UploadProgressOverlay visible={isUploading} progress={progress} total={totalClips} current={currentClip} />
    </div>
  );
}
