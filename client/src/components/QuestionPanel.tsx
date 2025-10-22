"use client";

interface QuestionPanelProps {
  questions: string[];
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
}

export default function QuestionPanel({
  questions,
  currentIndex,
  onNext,
  onPrev,
}: QuestionPanelProps) {
  return (
    <aside className="w-1/3 flex flex-col justify-center p-8 bg-gray-100 border-l border-gray-200">
      <div className="max-w-sm mx-auto text-center">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Question {currentIndex + 1} of {questions.length}
        </h2>
        <p className="text-lg mb-6 text-gray-700 italic">
          “{questions[currentIndex]}”
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={onPrev}
            className="px-4 py-2 bg-gray-300 rounded-full hover:bg-gray-400 transition"
          >
            ← Previous
          </button>
          <button
            onClick={onNext}
            className="px-4 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-900 transition"
          >
            Next →
          </button>
        </div>
      </div>
    </aside>
  );
}
