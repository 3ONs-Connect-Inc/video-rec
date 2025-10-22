"use client";
import React from "react";
import { Trash2 } from "lucide-react";

interface Props {
  index: number;
  segment: { url: string; createdAt: number };
  onDelete: () => void;
}

export default function RecordedSegmentItem({ index, segment, onDelete }: Props) {
  return (
    <li className="flex items-center gap-3 bg-gray-50 p-2 rounded-md border">
      <video src={segment.url} controls className="w-40 h-24 object-cover rounded" />
      <div className="flex-1">
        <div className="text-sm font-medium">Clip {index + 1}</div>
        <div className="text-xs text-gray-500">{new Date(segment.createdAt).toLocaleString()}</div>
      </div>
      <a href={segment.url} download={`clip-${segment.createdAt}.webm`} className="text-sm text-blue-600 underline">
        Download
      </a>
      <button onClick={onDelete} className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full">
        <Trash2 size={18} />
      </button>
    </li>
  );
}
