import { useState } from 'react';
import { FlipHorizontal2 } from 'lucide-react';
import { FlashCard } from './lessonData';
import { Button } from '@/app/components/ui/button';

interface FlashcardViewerProps {
  cards: FlashCard[];
  onComplete: () => void;
}

export function FlashcardViewer({ cards, onComplete }: FlashcardViewerProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studiedCards, setStudiedCards] = useState<Set<number>>(new Set());

  const currentCard = cards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / cards.length) * 100;
  const allStudied = studiedCards.size === cards.length;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped) {
      setStudiedCards(new Set([...studiedCards, currentCard.id]));
    }
  };

  const handleNext = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleSkip = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Study Flashcards</h3>
          <span className="text-sm font-medium text-gray-300">
            {currentCardIndex + 1} / {cards.length}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <div
        onClick={handleFlip}
        className="group perspective cursor-pointer h-64 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-500/50 p-8 flex items-center justify-center hover:border-purple-400 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.6s'
        }}
      >
        <div
          className="w-full h-full flex flex-col items-center justify-center text-center"
          style={{
            backfaceVisibility: 'hidden',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          <span className="text-xs font-medium text-purple-300 mb-4">Question</span>
          <p className="text-2xl font-bold text-white">{currentCard.front}</p>
          <div className="mt-8 flex items-center gap-2 text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity">
            <FlipHorizontal2 className="w-4 h-4" />
            <span className="text-sm">Click to reveal answer</span>
          </div>
        </div>

        <div
          className="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-center rounded-2xl p-8"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'linear-gradient(135deg, #00ff00 0%, #00cc44 100%)',
            opacity: 0.1
          }}
        >
          <span className="text-xs font-medium text-green-300 mb-4">Answer</span>
          <p className="text-lg font-semibold text-green-200">{currentCard.back}</p>
        </div>

        {/* Background for flipped side */}
        {isFlipped && (
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500/50 rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <span className="text-xs font-medium text-green-300 block mb-4">Answer</span>
              <p className="text-lg font-semibold text-white">{currentCard.back}</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-3 justify-center">
        <Button
          onClick={handlePrevious}
          disabled={currentCardIndex === 0}
          className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white"
        >
          Previous
        </Button>

        <Button
          onClick={handleFlip}
          className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white gap-2"
        >
          <FlipHorizontal2 className="w-4 h-4" />
          {isFlipped ? 'Hide Answer' : 'Show Answer'}
        </Button>

        <Button
          onClick={handleNext}
          disabled={currentCardIndex === cards.length - 1}
          className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white"
        >
          Next
        </Button>
      </div>

      {/* Study Stats */}
      <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-300">Cards Studied</p>
            <p className="text-2xl font-bold text-purple-400">{studiedCards.size} / {cards.length}</p>
          </div>
          {allStudied && (
            <div className="text-right">
              <p className="text-sm text-gray-300 mb-2">✓ All cards studied!</p>
              <Button
                onClick={onComplete}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                Continue to Questions
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
