"use client";
import QuestionPanel from "@/components/QuestionPanel";
import VideoRecorder from "@/components/VideoRecorder";
import useLogout from "@/hooks/auth/useLogout";
import { useSession } from "@/hooks/auth/useSession";
import Link from "next/link";
import { useState } from "react";

const questions = [
  "Tell us about yourself.",
  "What motivated you to apply for this role?",
  "Describe a challenge you overcame recently.",
  "Where do you see yourself in 3 years?",
  "What’s something unique about you?",
];

export default function VideoRecorderPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { user } = useSession();
  const logout = useLogout();

  const nextQuestion = () =>
    setCurrentQuestionIndex((i) => (i + 1) % questions.length);
  const prevQuestion = () =>
    setCurrentQuestionIndex((i) => (i - 1 + questions.length) % questions.length);

  return (
    <>
      {/* 🔹 Header */}
      <div className="flex justify-between items-center bg-black text-white px-8 py-4">
        <Link href="/admin/dashboard" className="hover:underline">
          View Videos
        </Link>

        <div className="space-x-4">
          {user ? (
            <>
              <span className="text-gray-300 mr-2">
                Hi, {user.displayName || "User"}
              </span>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/sign-in"
              className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm transition"
            >
              Login Here
            </Link>
          )}
        </div>
      </div>

      {/* 🎥 Main Layout */}
      <main className="flex h-screen bg-gray-50 text-gray-900">
        {/* Left: Video Recorder */}
        <section className="w-2/3 flex flex-col items-center justify-center p-6 bg-white shadow-md">
          <VideoRecorder />
        </section>

        {/* Right: Question Panel */}
        <QuestionPanel
          questions={questions}
          currentIndex={currentQuestionIndex}
          onNext={nextQuestion}
          onPrev={prevQuestion}
        />
      </main>
    </>
  );
}
