// src/hooks/useVideoRecorder.tsx
"use client";

import { useEffect, useRef, useState } from "react";

export type Segment = { blob: Blob; url: string; createdAt: number };

export interface UseVideoRecorderReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isRecording: boolean;
  isPaused: boolean;
  isCameraOn: boolean;
  isVideoEnabled: boolean; // whether camera track is enabled
  isMicEnabled: boolean; // whether mic track is enabled
  videoPlaybackUrl: string | null;
  elapsed: number;
  segments: Segment[];
  startCamera: () => Promise<void>;
  toggleMic: () => void;
  toggleVideoTrack: () => void; // toggles video track enabled (C1)
  toggleStartStop: () => void; // single button: start new segment / stop current segment
  pauseRecording: () => void; // pause current recorder (R1)
  resumeRecording: () => void; // resume same recorder
  finalizeSession: () => Promise<Segment[]>; // end call (stop & stop tracks)
  resetSession: (autoStartCamera?: boolean) => Promise<void>;
  getSegments: () => Segment[];
    setSegments: React.Dispatch<React.SetStateAction<Segment[]>>; 
}

export default function useVideoRecorder(): UseVideoRecorderReturn {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [segments, setSegments] = useState<Segment[]>([]);
  const currentChunksRef = useRef<Blob[]>([]);

  const [isRecording, setIsRecording] = useState(false); // actively recording (MediaRecorder state === "recording")
  const [isPaused, setIsPaused] = useState(false); // mediaRecorder paused
  const [isCameraOn, setIsCameraOn] = useState(false); // whether we have a stream
  const [isVideoEnabled, setIsVideoEnabled] = useState(true); // video track enabled/disabled (C1)
  const [isMicEnabled, setIsMicEnabled] = useState(true); // audio track enabled/disabled

  const [videoPlaybackUrl, setVideoPlaybackUrl] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<number | null>(null);

  // ---- utils ----
  function supportedMime() {
    try {
      if ((MediaRecorder as any).isTypeSupported) {
        if ((MediaRecorder as any).isTypeSupported("video/webm;codecs=vp9,opus"))
          return "video/webm;codecs=vp9,opus";
        if ((MediaRecorder as any).isTypeSupported("video/webm;codecs=vp8,opus"))
          return "video/webm;codecs=vp8,opus";
      }
    } catch {}
    return "video/webm";
  }

  // ---- camera & binding helpers ----
  async function startCamera() {
    if (streamRef.current) {
      // already have stream — ensure binding and flags
      bindStreamToVideo();
      setIsCameraOn(true);
      updateTrackFlagsFromStream();
      return;
    }
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });
      streamRef.current = s;
      setIsCameraOn(true);
      // set initial flags
      updateTrackFlagsFromStream();
      bindStreamToVideo();
    } catch (err) {
      console.error("startCamera error", err);
      throw err;
    }
  }

  function bindStreamToVideo() {
    const el = videoRef.current;
    if (!el) return;
    // attach stream (preview)
    try {
      // clear any playback src first
      el.srcObject = streamRef.current;
      el.muted = true; // preview muted to avoid echo
      void el.play().catch(() => {});
    } catch (e) {
      console.warn("bindStreamToVideo fail", e);
    }
  }

  function bindPlaybackToVideo(url: string | null) {
    const el = videoRef.current;
    if (!el) return;
    try {
      el.srcObject = null;
    } catch {}
    if (url) {
      el.src = url;
      el.muted = false;
      void el.play().catch(() => {});
    } else {
      el.src = "";
    }
  }

  function updateTrackFlagsFromStream() {
    const s = streamRef.current;
    if (!s) {
      setIsVideoEnabled(false);
      setIsMicEnabled(false);
      return;
    }
    const v = s.getVideoTracks()[0];
    const a = s.getAudioTracks()[0];
    setIsVideoEnabled(!!v && v.enabled);
    setIsMicEnabled(!!a && a.enabled);
  }

  // ---- mic / camera toggle (C1) ----
  function toggleMic() {
    const s = streamRef.current;
    if (!s) return;
    const track = s.getAudioTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setIsMicEnabled(track.enabled);
  }

  function toggleVideoTrack() {
    const s = streamRef.current;
    if (!s) return;
    const track = s.getVideoTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setIsVideoEnabled(track.enabled);
    // preview keeps playing; if disabled the preview will show black / no frames (C1)
    if (track.enabled) {
      bindStreamToVideo();
    } else {
      // leave stream attached — preview will reflect disabled track
      bindStreamToVideo();
    }
  }

  // ---- timer ----
  function startTimer() {
    if (intervalRef.current) return;
    intervalRef.current = window.setInterval(() => {
      setElapsed((v) => v + 1);
    }, 1000);
  }
  function stopTimer() {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }
  function resetTimer() {
    stopTimer();
    setElapsed(0);
  }

  // ---- recording lifecycle ----

  function createAndStartRecorder() {
    const s = streamRef.current;
    if (!s) return null;
    let recorder: MediaRecorder;
    const mime = supportedMime();
    try {
      recorder = new MediaRecorder(s, { mimeType: mime });
    } catch {
      recorder = new MediaRecorder(s);
    }
    currentChunksRef.current = [];

    recorder.ondataavailable = (e: BlobEvent) => {
      if (e.data && e.data.size > 0) currentChunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(currentChunksRef.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const seg: Segment = { blob, url, createdAt: Date.now() };
      setSegments((prev) => {
        const next = [...prev, seg];
        return next;
      });
      // state effect will build combined playback and bind if needed
    };

    recorder.start();
    return recorder;
  }

  // Single Start/Stop toggle behavior:
  // - If not currently recording: start NEW segment (always new)
  // - If currently recording: stop current segment (finalize it)
  function toggleStartStop() {
    if (isRecording) {
      // stop current
      stopRecording();
    } else {
      // start a new segment (always new)
      // If there is a playback bound, remove it and rebind stream so preview is live
      if (videoPlaybackUrl) {
        try {
          URL.revokeObjectURL(videoPlaybackUrl);
        } catch {}
        setVideoPlaybackUrl(null);
       
      }
      // start recording
      const s = streamRef.current;
      if (!s) {
        // ensure camera started
        startCamera().then(() => {
          mediaRecorderRef.current = createAndStartRecorder();
          setIsRecording(true);
          setIsPaused(false);
          bindStreamToVideo();
          startTimer();
        }).catch(() => {});
        return;
      }
      // have stream already
      mediaRecorderRef.current = createAndStartRecorder();
      setIsRecording(true);
      setIsPaused(false);
      bindStreamToVideo();
      startTimer();
    }
  }

  function pauseRecording() {
    const rec = mediaRecorderRef.current;
    if (!rec || rec.state !== "recording") return;
    try {
      rec.pause();
      setIsPaused(true);
      stopTimer();
    } catch (e) {
      console.warn("pause unsupported", e);
    }
  }

  function resumeRecording() {
    const rec = mediaRecorderRef.current;
    if (!rec || rec.state !== "paused") return;
    try {
      rec.resume();
      setIsPaused(false);
      startTimer();
      // Ensure preview is live
      bindStreamToVideo();
    } catch (e) {
      console.warn("resume unsupported", e);
    }
  }

  function stopRecording() {
    const rec = mediaRecorderRef.current;
    if (!rec) return;
    try {
      rec.stop();
    } catch (e) {
      console.warn("stop error", e);
    } finally {
      mediaRecorderRef.current = null;
      setIsRecording(false);
      setIsPaused(false);
      stopTimer();
      // After stop, we want to show combined playback — effect on `segments` will handle it
    }
  }

  // Build combined playback URL when segments change
useEffect(() => {
  if (segments.length === 0) {
    if (videoPlaybackUrl) {
      try { URL.revokeObjectURL(videoPlaybackUrl); } catch {}
      setVideoPlaybackUrl(null);
    }
    return;
  }

  // show *only last recorded segment*, not combined
  const last = segments[segments.length - 1];
  if (videoPlaybackUrl) {
    try { URL.revokeObjectURL(videoPlaybackUrl); } catch {}
  }
  setVideoPlaybackUrl(last.url);

  if (!isRecording && videoRef.current) {
    bindPlaybackToVideo(last.url);
  }
}, [segments]);


  // Finalize session: stop recorder if active, stop tracks, return segments for upload.
  async function finalizeSession(): Promise<Segment[]> {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.stop();
      } catch {}
      mediaRecorderRef.current = null;
    }

    stopTimer();

    const s = streamRef.current;
    if (s) {
      s.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsCameraOn(false);
    setIsRecording(false);
    setIsPaused(false);

    return segments.slice();
  }

  async function resetSession(autoStartCamera = true) {
    // revoke playback & segment urls
    if (videoPlaybackUrl) {
      try {
        URL.revokeObjectURL(videoPlaybackUrl);
      } catch {}
    }
    segments.forEach((seg) => {
      try {
        URL.revokeObjectURL(seg.url);
      } catch {}
    });

    setSegments([]);
    setVideoPlaybackUrl(null);
    setIsRecording(false);
    setIsPaused(false);
    resetTimer();
    setIsVideoEnabled(true);
    setIsMicEnabled(true);

    if (autoStartCamera) {
      await startCamera();
    }
  }

  // cleanup on unmount
  useEffect(() => {
    return () => {
      stopTimer();
      try {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
          mediaRecorderRef.current.stop();
        }
      } catch {}
      if (streamRef.current) {
        try {
          streamRef.current.getTracks().forEach((t) => t.stop());
        } catch {}
      }
      if (videoPlaybackUrl) {
        try {
          URL.revokeObjectURL(videoPlaybackUrl);
        } catch {}
      }
      segments.forEach((seg) => {
        try {
          URL.revokeObjectURL(seg.url);
        } catch {}
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    videoRef,
    isRecording,
    isPaused,
    isCameraOn,
    isVideoEnabled,
    isMicEnabled,
    videoPlaybackUrl,
    elapsed,
    segments,
     setSegments,
    startCamera,
    toggleMic,
    toggleVideoTrack,
    toggleStartStop,
    pauseRecording,
    resumeRecording,
    finalizeSession,
    resetSession,
    getSegments: () => segments.slice(),
  };
}
