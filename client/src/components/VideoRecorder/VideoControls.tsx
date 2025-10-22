// src/components/VideoControls.tsx
"use client";

import React from "react";
import { Play, Pause, StopCircle, Phone, Mic, MicOff, Video, VideoOff } from "lucide-react";

interface Props {
  micOn: boolean;
  videoOn: boolean;
  isRecording: boolean;
  isPaused: boolean;
  onToggleMic: () => void;
  onToggleVideo: () => void;
  onToggleStartStop: () => void; // single start/stop toggle
  onPause: () => void;
  onResume: () => void;
  onEndCall: () => void;
}

export default function VideoControls({
  micOn,
  videoOn,
  isRecording,
  isPaused,
  onToggleMic,
  onToggleVideo,
  onToggleStartStop,
  onPause,
  onResume,
  onEndCall,
}: Props) {
  return (
    <div className="flex justify-center items-center gap-4 mt-6">
      <button onClick={onToggleMic} title={micOn ? "Mute Microphone" : "Unmute Microphone"} className={`p-3 rounded-full ${micOn ? "bg-green-600" : "bg-gray-600"} text-white`}>
        {micOn ? <Mic size={18} /> : <MicOff size={18} />}
      </button>

      <button onClick={onToggleVideo} title={videoOn ? "Turn Off Camera" : "Turn On Camera"} className={`p-3 rounded-full ${videoOn ? "bg-green-600" : "bg-gray-600"} text-white`}>
        {videoOn ? <Video size={18} /> : <VideoOff size={18} />}
      </button>

      {/* Single Start / Stop toggle */}
      <button
        onClick={onToggleStartStop}
        title={isRecording ? "Stop recording (finalize segment)" : "Start recording (new segment)"}
        className={`p-3 rounded-full ${isRecording ? "bg-gray-800" : "bg-red-600"} text-white`}
      >
        {isRecording ? <StopCircle size={20} /> : <Play size={20} />}
      </button>

      {/* Pause / Resume while recording */}
      {isRecording ? (
        isPaused ? (
          <button onClick={onResume} title="Resume recording" className="p-3 rounded-full bg-green-600 text-white">
            <Play size={18} />
          </button>
        ) : (
          <button onClick={onPause} title="Pause recording" className="p-3 rounded-full bg-yellow-500 text-white">
            <Pause size={18} />
          </button>
        )
      ) : (
        <button disabled className="p-3 rounded-full bg-gray-500 text-white opacity-60">
          <Pause size={18} />
        </button>
      )}

      {/* End Call */}
      <button onClick={onEndCall} title="End call (upload & reset)" className="p-3 rounded-full bg-blue-700 text-white">
        <Phone size={18} />
      </button>
    </div>
  );
}
