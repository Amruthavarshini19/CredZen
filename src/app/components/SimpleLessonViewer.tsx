import { ChevronLeft, BookOpen, CheckCircle2 } from 'lucide-react';
import { LessonContent } from './lessonData';

interface SimpleLessonViewerProps {
  lesson: LessonContent;
  onBack: () => void;
}

export function SimpleLessonViewer({ lesson, onBack }: SimpleLessonViewerProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-purple-500/20 bg-purple-900/20 backdrop-blur-sm sticky top-0 z-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              <div>
                <p className="text-xs text-gray-400">Level {lesson.level}</p>
                <h1 className="text-xl font-bold text-white">{lesson.title}</h1>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                {lesson.xp} XP
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Description */}
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
            <p className="text-gray-300 text-lg mb-6">{lesson.description}</p>
          </div>

          {/* Key Concepts / Flashcards Content */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-bold text-white">Key Concepts</h2>
            </div>
            
            <div className="space-y-4">
              {lesson.flashcards.map((card, index) => (
                <div
                  key={card.id}
                  className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 hover:bg-gray-800 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-semibold text-sm">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {card.front}
                      </h3>
                      <p className="text-gray-300 leading-relaxed">
                        {card.back}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Important Points */}
          <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle2 className="w-6 h-6 text-green-400" />
              <h2 className="text-2xl font-bold text-white">Important Points</h2>
            </div>

            <div className="space-y-4">
              {lesson.mcqQuestions.map((question, index) => (
                <div
                  key={question.id}
                  className="bg-gray-800/50 border border-gray-700 rounded-lg p-6"
                >
                  <p className="text-white font-semibold mb-3">
                    {index + 1}. {question.question}
                  </p>
                  <div className="ml-4 space-y-2">
                    {question.options.map((option, optIdx) => (
                      <p
                        key={optIdx}
                        className={`text-sm py-1 px-2 rounded ${
                          optIdx === question.correctAnswer
                            ? 'bg-green-500/20 text-green-200 font-semibold border border-green-500'
                            : 'text-gray-300'
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}) {option}
                      </p>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded text-sm text-blue-100">
                    <p className="font-semibold mb-1">Explanation:</p>
                    <p>{question.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={onBack}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-lg font-semibold transition-all"
            >
              Back to Learning Path
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
