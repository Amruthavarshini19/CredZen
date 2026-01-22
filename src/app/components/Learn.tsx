import { useState } from 'react';
import { CheckCircle2, Circle, Star, Trophy } from 'lucide-react';
import { Progress } from '@/app/components/ui/progress';
import { SimpleLessonViewer } from './SimpleLessonViewer';
import { lessonsData, LessonContent } from './lessonData';

export function Learn() {
  const [selectedLesson, setSelectedLesson] = useState<LessonContent | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(
    new Set([1, 2])
  );

  const totalXP = Array.from(completedLessons).reduce((sum, lessonId) => {
    const lesson = lessonsData.find(l => l.id === lessonId);
    return sum + (lesson?.xp || 0);
  }, 0);

  const maxXP = lessonsData.reduce((sum, l) => sum + l.xp, 0);
  const progressPercent = (totalXP / maxXP) * 100;

  const handleLessonClick = (lesson: LessonContent) => {
    setSelectedLesson(lesson);
    // Mark lesson as completed when viewed
    setCompletedLessons(new Set([...completedLessons, lesson.id]));
  };

  const handleBackToLessons = () => {
    setSelectedLesson(null);
  };

  // Render SimpleLessonViewer if a lesson is selected
  if (selectedLesson) {
    return (
      <SimpleLessonViewer
        lesson={selectedLesson}
        onBack={handleBackToLessons}
      />
    );
  }

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
              Master credit cards through comprehensive lessons
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

      {/* Level 1 - Beginner */}
      <div className="bg-purple-900/40 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500">
            <span className="font-bold text-white">1</span>
          </div>
          <h2 className="text-2xl font-semibold text-white">Level 1: Fundamentals</h2>
        </div>
        <p className="text-gray-300 mb-6">Master the basics of credit cards and financial concepts</p>

        <div className="space-y-3">
          {lessonsData
            .filter(l => l.level === 1)
            .map((lesson) => (
              <div
                key={lesson.id}
                onClick={() => handleLessonClick(lesson)}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                  completedLessons.has(lesson.id)
                    ? 'bg-green-500/20 border-green-400 hover:shadow-lg hover:shadow-green-500/50'
                    : 'bg-blue-500/20 border-blue-400 hover:shadow-lg hover:shadow-blue-500/50'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    completedLessons.has(lesson.id)
                      ? 'bg-gradient-to-br from-green-500 to-green-600'
                      : 'bg-gradient-to-br from-blue-500 to-blue-600'
                  }`}
                >
                  {completedLessons.has(lesson.id) ? (
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  ) : (
                    <Circle className="w-6 h-6 text-white" />
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">{lesson.title}</h3>
                  <p className="text-sm text-gray-300">{lesson.description}</p>
                </div>

                <div className="flex items-center gap-1 px-3 py-1 bg-yellow-500/20 rounded-full flex-shrink-0">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-semibold text-yellow-300">{lesson.xp} XP</span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Level 2 - Intermediate */}
      <div className="bg-purple-900/40 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500">
            <span className="font-bold text-white">2</span>
          </div>
          <h2 className="text-2xl font-semibold text-white">Level 2: Intermediate</h2>
        </div>
        <p className="text-gray-300 mb-6">Build on your foundation with advanced concepts and strategies</p>

        <div className="space-y-3">
          {lessonsData
            .filter(l => l.level === 2)
            .map((lesson) => (
              <div
                key={lesson.id}
                onClick={() => handleLessonClick(lesson)}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                  completedLessons.has(lesson.id)
                    ? 'bg-green-500/20 border-green-400 hover:shadow-lg hover:shadow-green-500/50'
                    : 'bg-purple-500/20 border-purple-400 hover:shadow-lg hover:shadow-purple-500/50'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    completedLessons.has(lesson.id)
                      ? 'bg-gradient-to-br from-green-500 to-green-600'
                      : 'bg-gradient-to-br from-purple-500 to-purple-600'
                  }`}
                >
                  {completedLessons.has(lesson.id) ? (
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  ) : (
                    <Circle className="w-6 h-6 text-white" />
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">{lesson.title}</h3>
                  <p className="text-sm text-gray-300">{lesson.description}</p>
                </div>

                <div className="flex items-center gap-1 px-3 py-1 bg-yellow-500/20 rounded-full flex-shrink-0">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-semibold text-yellow-300">{lesson.xp} XP</span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Level 3 - Advanced */}
      <div className="bg-purple-900/40 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-pink-500">
            <span className="font-bold text-white">3</span>
          </div>
          <h2 className="text-2xl font-semibold text-white">Level 3: Advanced</h2>
        </div>
        <p className="text-gray-300 mb-6">Master expert-level strategies and optimization techniques</p>

        <div className="space-y-3">
          {lessonsData
            .filter(l => l.level === 3)
            .map((lesson) => (
              <div
                key={lesson.id}
                onClick={() => handleLessonClick(lesson)}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                  completedLessons.has(lesson.id)
                    ? 'bg-green-500/20 border-green-400 hover:shadow-lg hover:shadow-green-500/50'
                    : 'bg-pink-500/20 border-pink-400 hover:shadow-lg hover:shadow-pink-500/50'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    completedLessons.has(lesson.id)
                      ? 'bg-gradient-to-br from-green-500 to-green-600'
                      : 'bg-gradient-to-br from-pink-500 to-pink-600'
                  }`}
                >
                  {completedLessons.has(lesson.id) ? (
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  ) : (
                    <Circle className="w-6 h-6 text-white" />
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">{lesson.title}</h3>
                  <p className="text-sm text-gray-300">{lesson.description}</p>
                </div>

                <div className="flex items-center gap-1 px-3 py-1 bg-yellow-500/20 rounded-full flex-shrink-0">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-semibold text-yellow-300">{lesson.xp} XP</span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}