import { useState } from 'react';
import { ChevronLeft, CheckCircle2, Trophy } from 'lucide-react';
import { LessonContent } from './lessonData';
import { FlashcardViewer } from './FlashcardViewer';
import { MCQViewer } from './MCQViewer';
import { Button } from '@/app/components/ui/button';

interface LessonViewerProps {
  lesson: LessonContent;
  onBack: () => void;
  onComplete: (lessonId: number, score: number, totalQuestions: number) => void;
}

type LessonStage = 'overview' | 'flashcards' | 'quiz' | 'results';

export function LessonViewer({ lesson, onBack, onComplete }: LessonViewerProps) {
  const [stage, setStage] = useState<LessonStage>('overview');
  const [quizScore, setQuizScore] = useState(0);
  const [quizTotal, setQuizTotal] = useState(0);

  const handleStartLesson = () => {
    setStage('flashcards');
  };

  const handleFlashcardsComplete = () => {
    setStage('quiz');
  };

  const handleQuizComplete = (score: number, total: number) => {
    setQuizScore(score);
    setQuizTotal(total);
    setStage('results');
    onComplete(lesson.id, score, total);
  };

  const handleRetryQuiz = () => {
    setStage('quiz');
  };

  const scorePercentage = Math.round((quizScore / quizTotal) * 100);
  const passed = scorePercentage >= 70;

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
              <Button
                onClick={onBack}
                className="bg-gray-700 hover:bg-gray-600 text-white gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
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
          {stage === 'overview' && (
            <div className="space-y-6">
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-4">Lesson Overview</h2>
                <p className="text-gray-300 text-lg mb-6">{lesson.description}</p>

                <div className="space-y-4 mb-8">
                  <h3 className="text-lg font-semibold text-white">What you'll learn:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <p className="text-sm font-medium text-purple-300 mb-2">📚 Study Phase</p>
                      <p className="text-gray-300 text-sm">
                        Review {lesson.flashcards.length} interactive flashcards to master key concepts
                      </p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <p className="text-sm font-medium text-blue-300 mb-2">❓ Quiz Phase</p>
                      <p className="text-gray-300 text-sm">
                        Answer {lesson.mcqQuestions.length} multiple-choice questions to test your knowledge
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleStartLesson}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-6 text-lg font-semibold"
                >
                  Start Lesson
                </Button>
              </div>
            </div>
          )}

          {stage === 'flashcards' && (
            <div className="bg-purple-900/30 border border-purple-500/30 rounded-2xl p-8">
              <FlashcardViewer
                cards={lesson.flashcards}
                onComplete={handleFlashcardsComplete}
              />
            </div>
          )}

          {stage === 'quiz' && (
            <div className="bg-blue-900/30 border border-blue-500/30 rounded-2xl p-8">
              <MCQViewer
                questions={lesson.mcqQuestions}
                onComplete={handleQuizComplete}
              />
            </div>
          )}

          {stage === 'results' && (
            <div className="space-y-6">
              <div className={`border-2 rounded-2xl p-8 text-center ${
                passed
                  ? 'bg-green-500/10 border-green-500'
                  : 'bg-yellow-500/10 border-yellow-500'
              }`}>
                <div className="mb-6 flex justify-center">
                  {passed ? (
                    <Trophy className="w-16 h-16 text-yellow-400 animate-bounce" />
                  ) : (
                    <CheckCircle2 className="w-16 h-16 text-yellow-400" />
                  )}
                </div>

                <h2 className={`text-3xl font-bold mb-2 ${
                  passed ? 'text-green-300' : 'text-yellow-300'
                }`}>
                  {passed ? 'Lesson Completed!' : 'Quiz Finished'}
                </h2>

                <p className="text-lg text-gray-200 mb-8">
                  You scored <span className="font-bold text-2xl text-yellow-400">{scorePercentage}%</span>
                </p>

                <div className="bg-white/10 rounded-lg p-6 mb-8">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Correct</p>
                      <p className="text-2xl font-bold text-green-400">{quizScore}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Total</p>
                      <p className="text-2xl font-bold text-blue-400">{quizTotal}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Earned</p>
                      <p className="text-2xl font-bold text-yellow-400">{lesson.xp} XP</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {!passed && (
                    <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-4 mb-4">
                      <p className="text-sm text-yellow-100">
                        💡 Score at least 70% to pass. Try reviewing the flashcards again!
                      </p>
                    </div>
                  )}

                  {passed && (
                    <div className="bg-green-500/20 border border-green-500 rounded-lg p-4 mb-4">
                      <p className="text-sm text-green-100">
                        ✓ Great job! You've mastered this lesson. Move on to the next one!
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    {!passed && (
                      <Button
                        onClick={handleRetryQuiz}
                        className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                      >
                        Retry Quiz
                      </Button>
                    )}
                    <Button
                      onClick={onBack}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 text-white"
                    >
                      Back to Lessons
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
