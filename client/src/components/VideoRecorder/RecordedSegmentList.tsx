"use client";
import React, { useState } from "react";
import RecordedSegmentItem from "./RecordedSegmentItem";

interface Props {
  segments: { url: string; createdAt: number }[];
  onDelete: (createdAt: number) => void;
}

export default function RecordedSegmentList({ segments, onDelete }: Props) {
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  if (segments.length === 0) return null;

  return (
    <div className="mt-4 w-full max-w-xl">
      <h3 className="text-sm font-medium mb-2">Recorded Clips</h3>
      <ul className="space-y-2">
        {segments.map((seg, i) => (
          <RecordedSegmentItem
            key={seg.createdAt}
            index={i}
            segment={seg}
            onDelete={() => setConfirmDelete(seg.createdAt)}
          />
        ))}
      </ul>

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-md">
            <p className="text-sm mb-4">Delete this clip permanently?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-3 py-1 border rounded text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(confirmDelete);
                  setConfirmDelete(null);
                }}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
