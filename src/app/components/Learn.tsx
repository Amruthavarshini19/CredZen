import { useState } from 'react';
import { Lock, CheckCircle2, Circle, Star, Trophy } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Progress } from '@/app/components/ui/progress';

interface Lesson {
  id: number;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'locked';
  xp: number;
}

export function Learn() {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [showLessonDialog, setShowLessonDialog] = useState(false);

  const lessons: Lesson[] = [
    {
      id: 1,
      title: 'Credit Card Basics',
      description: 'Learn what credit cards are and how they work',
      status: 'completed',
      xp: 50
    },
    {
      id: 2,
      title: 'Understanding Interest Rates',
      description: 'Master APR, compound interest, and payment cycles',
      status: 'completed',
      xp: 75
    },
    {
      id: 3,
      title: 'Credit Score Fundamentals',
      description: 'Discover what affects your credit score',
      status: 'current',
      xp: 100
    },
    {
      id: 4,
      title: 'Payment Strategies',
      description: 'Learn optimal payment methods and timing',
      status: 'locked',
      xp: 100
    },
    {
      id: 5,
      title: 'Rewards Programs',
      description: 'Understand cashback, points, and miles',
      status: 'locked',
      xp: 125
    },
    {
      id: 6,
      title: 'Credit Utilization',
      description: 'Master the 30% rule and balance management',
      status: 'locked',
      xp: 100
    },
    {
      id: 7,
      title: 'Fees and Charges',
      description: 'Identify and avoid unnecessary credit card fees',
      status: 'locked',
      xp: 75
    },
    {
      id: 8,
      title: 'Security Best Practices',
      description: 'Protect yourself from fraud and identity theft',
      status: 'locked',
      xp: 125
    },
    {
      id: 9,
      title: 'Balance Transfers',
      description: 'Learn when and how to transfer balances',
      status: 'locked',
      xp: 150
    },
    {
      id: 10,
      title: 'Advanced Strategies',
      description: 'Card stacking, churning, and optimization',
      status: 'locked',
      xp: 200
    }
  ];

  const totalXP = lessons.filter(l => l.status === 'completed').reduce((sum, l) => sum + l.xp, 0);
  const maxXP = lessons.reduce((sum, l) => sum + l.xp, 0);
  const progressPercent = (totalXP / maxXP) * 100;

  const handleLessonClick = (lesson: Lesson) => {
    if (lesson.status !== 'locked') {
      setSelectedLesson(lesson);
      setShowLessonDialog(true);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-purple-900/40 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              Learn
            </h1>
            <p className="text-lg text-gray-300">
              Master credit cards through interactive lessons
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              <span className="text-3xl font-bold text-white">{totalXP} XP</span>
            </div>
            <p className="text-sm text-gray-400">Total Experience</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300">Overall Progress</span>
            <span className="font-semibold text-white">{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} className="h-3 bg-purple-950/50" />
        </div>
      </div>

      {/* Learning Path */}
      <div className="bg-purple-900/40 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
        <h2 className="text-2xl font-semibold text-white mb-6">Your Learning Path</h2>
        
        <div className="space-y-4">
          {lessons.map((lesson, index) => (
            <div key={lesson.id} className="relative">
              {/* Connection Line */}
              {index < lessons.length - 1 && (
                <div className="absolute left-6 top-16 w-0.5 h-8 bg-gradient-to-b from-purple-400 to-pink-400" />
              )}

              {/* Lesson Card */}
              <div
                onClick={() => handleLessonClick(lesson)}
                className={`relative flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 ${
                  lesson.status === 'completed'
                    ? 'bg-purple-500/20 border-purple-400 cursor-pointer hover:shadow-lg hover:shadow-purple-500/50'
                    : lesson.status === 'current'
                    ? 'bg-pink-500/20 border-pink-400 cursor-pointer hover:shadow-lg hover:shadow-pink-500/50 ring-2 ring-pink-500 ring-offset-2 ring-offset-gray-900'
                    : 'bg-gray-800/30 border-gray-700 opacity-60'
                }`}
              >
                {/* Status Icon */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    lesson.status === 'completed'
                      ? 'bg-gradient-to-br from-purple-500 to-purple-600'
                      : lesson.status === 'current'
                      ? 'bg-gradient-to-br from-pink-500 to-pink-600'
                      : 'bg-gray-700'
                  }`}
                >
                  {lesson.status === 'completed' ? (
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  ) : lesson.status === 'current' ? (
                    <Circle className="w-6 h-6 text-white" />
                  ) : (
                    <Lock className="w-6 h-6 text-gray-400" />
                  )}
                </div>

                {/* Lesson Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-white">{lesson.title}</h3>
                    {lesson.status === 'current' && (
                      <span className="px-2 py-0.5 bg-pink-500 text-white text-xs rounded-full font-medium">
                        In Progress
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-300">{lesson.description}</p>
                </div>

                {/* XP Badge */}
                <div className="flex items-center gap-1 px-3 py-1 bg-yellow-500/20 rounded-full">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-semibold text-yellow-300">{lesson.xp} XP</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lesson Dialog */}
      <Dialog open={showLessonDialog} onOpenChange={setShowLessonDialog}>
        <DialogContent className="bg-gradient-to-br from-gray-900 to-purple-900 border-purple-500/50 max-w-2xl">
          {selectedLesson && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
                  {selectedLesson.status === 'completed' ? (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center">
                      <Circle className="w-6 h-6 text-white" />
                    </div>
                  )}
                  {selectedLesson.title}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                <p className="text-gray-300">{selectedLesson.description}</p>

                {selectedLesson.status === 'completed' ? (
                  <div className="bg-purple-500/20 border border-purple-400 rounded-xl p-6 text-center">
                    <CheckCircle2 className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                    <h3 className="text-xl font-semibold text-white mb-2">Lesson Completed!</h3>
                    <p className="text-gray-300 mb-4">You've earned {selectedLesson.xp} XP</p>
                    <Button
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                      onClick={() => setShowLessonDialog(false)}
                    >
                      Review Lesson
                    </Button>
                  </div>
                ) : (
                  <div className="bg-pink-500/20 border border-pink-400 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Lesson Content Preview</h3>
                    <p className="text-gray-200 mb-4">
                      This interactive lesson will cover key concepts through:
                    </p>
                    <ul className="space-y-2 text-gray-200 mb-6">
                      <li className="flex items-start gap-2">
                        <span className="text-pink-400">•</span>
                        <span>Interactive quizzes and exercises</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-pink-400">•</span>
                        <span>Real-world examples and scenarios</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-pink-400">•</span>
                        <span>Visual aids and infographics</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-pink-400">•</span>
                        <span>Practice problems to test your knowledge</span>
                      </li>
                    </ul>
                    <Button
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                      onClick={() => setShowLessonDialog(false)}
                    >
                      Start Lesson (Demo)
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}