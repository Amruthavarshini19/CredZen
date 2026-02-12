import { useState } from 'react';
import { ChevronLeft, BookOpen, CheckCircle2, RotateCw, CheckCircle, XCircle } from 'lucide-react';
import { LessonContent } from './lessonData';
import { Button } from '@/app/components/ui/button';

interface SimpleLessonViewerProps {
  lesson: LessonContent;
  onBack: () => void;
}

export function SimpleLessonViewer({ lesson, onBack }: SimpleLessonViewerProps) {
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number | null>>({});
  const [showExplanations, setShowExplanations] = useState<Set<number>>(new Set());

  const toggleCard = (id: number) => {
    const newFlipped = new Set(flippedCards);
    if (newFlipped.has(id)) newFlipped.delete(id);
    else newFlipped.add(id);
    setFlippedCards(newFlipped);
  };

  const handleMCQSelect = (questionId: number, answerIdx: number) => {
    if (selectedAnswers[questionId] !== undefined) return; // Prevent changing after selection
    setSelectedAnswers({ ...selectedAnswers, [questionId]: answerIdx });

    // Auto-show explanation after choice
    const newExplanations = new Set(showExplanations);
    newExplanations.add(questionId);
    setShowExplanations(newExplanations);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950 to-gray-950 relative overflow-hidden pb-12">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      <div className="relative z-10">
        {/* Navigation / Header */}
        <div className="sticky top-0 bg-gray-900/60 backdrop-blur-md border-b border-white/10 z-50">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors group"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Learning Path</span>
            </button>
            <div className="flex items-center gap-4">
              <div className="px-3 py-1 bg-yellow-500/20 rounded-full border border-yellow-500/30 flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-yellow-400 font-bold">{lesson.xp} XP</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Intro Section */}
          <div className="mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-400 mb-2 block">Level {lesson.level} Masterclass</span>
            <h1 className="text-5xl font-black text-white mb-6 leading-tight">{lesson.title}</h1>
            <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">{lesson.description}</p>
          </div>

          {/* Flashcards Section */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <RotateCw className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-3xl font-bold text-white">Interactive Flashcards</h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {lesson.flashcards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => toggleCard(card.id)}
                  className="group relative h-64 perspective-1000 cursor-pointer"
                >
                  <div className={`relative w-full h-full transition-all duration-500 preserve-3d ${flippedCards.has(card.id) ? 'rotate-y-180' : ''}`}>
                    {/* Front */}
                    <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 rounded-2xl p-8 flex flex-col justify-center items-center text-center shadow-xl group-hover:border-indigo-500/50 transition-colors">
                      <p className="text-xl font-bold text-white mb-4">{card.front}</p>
                      <span className="text-xs text-indigo-400 font-bold uppercase tracking-widest mt-4 group-hover:scale-110 transition-transform">Click to Flip</span>
                    </div>
                    {/* Back */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180 bg-indigo-600 border border-indigo-400 rounded-2xl p-8 flex flex-col justify-center items-center text-center shadow-2xl">
                      <p className="text-lg text-white font-medium leading-relaxed">{card.back}</p>
                      <span className="text-xs text-indigo-200 mt-6 font-bold uppercase tracking-widest">Knowledge Acquired</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MCQs Section */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
              </div>
              <h2 className="text-3xl font-bold text-white">Challenge Quiz</h2>
            </div>

            <div className="space-y-8">
              {lesson.mcqQuestions.map((q, qIdx) => (
                <div key={q.id} className="bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl">
                  <div className="flex items-start gap-4 mb-6">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">{qIdx + 1}</span>
                    <h3 className="text-xl font-bold text-white">{q.question}</h3>
                  </div>

                  <div className="grid gap-3">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedAnswers[q.id] === optIdx;
                      const isCorrect = optIdx === q.correctAnswer;
                      const hasAnswered = selectedAnswers[q.id] !== undefined;

                      let buttonStyles = "border-white/10 bg-white/5 hover:bg-white/10";
                      if (hasAnswered) {
                        if (isCorrect) buttonStyles = "border-green-500 bg-green-500/20 text-white";
                        else if (isSelected) buttonStyles = "border-red-500 bg-red-500/20 text-white";
                        else buttonStyles = "opacity-50 border-white/5";
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={hasAnswered}
                          onClick={() => handleMCQSelect(q.id, optIdx)}
                          className={`w-full text-left px-6 py-4 rounded-xl border-2 transition-all flex items-center justify-between ${buttonStyles}`}
                        >
                          <span className="font-medium">{opt}</span>
                          {hasAnswered && isCorrect && <CheckCircle className="w-5 h-5 text-green-400" />}
                          {hasAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-400" />}
                        </button>
                      );
                    })}
                  </div>

                  {showExplanations.has(q.id) && (
                    <div className="mt-8 p-6 bg-indigo-500/10 border border-indigo-500/30 rounded-xl animate-in fade-in slide-in-from-top-4 duration-500">
                      <p className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-2">Expert Feedback</p>
                      <p className="text-indigo-100 leading-relaxed">{q.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Completion Footer */}
          <div className="mt-16 flex flex-col items-center gap-6 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-600 flex items-center justify-center text-white shadow-2xl scale-110">
              <Trophy className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Lesson Completed?</h3>
              <p className="text-gray-400">Head back to the path to claim your reward and unlock the next stage.</p>
            </div>
            <Button
              onClick={onBack}
              className="px-12 py-6 text-lg font-bold rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-xl hover:shadow-purple-500/20 transition-all"
            >
              Return to path
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

const Star = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Trophy = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);
