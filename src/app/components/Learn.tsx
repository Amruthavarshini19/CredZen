import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Star, Trophy, Sparkles } from 'lucide-react';
import { Progress } from '@/app/components/ui/progress';
import { SimpleLessonViewer } from './SimpleLessonViewer';
import { lessonsData, LessonContent } from './lessonData';

interface Card {
  id: number;
  name: string;
  lastFour: string;
  type: string;
  limit: number;
  balance: number;
  color: string;
  billingDay: number;
  dueDay: number;
}

interface LearnProps {
  completedLessons?: Set<number>;
  onLessonsChange?: (lessons: Set<number>) => void;
  onLessonComplete?: (lessonTitle: string) => void;
  overallUtilization?: number;
  cards?: Card[];
}

export function Learn({
  completedLessons = new Set([1, 2]),
  onLessonsChange,
  onLessonComplete,
  overallUtilization = 0,
  cards = []
}: LearnProps) {
  const [selectedLesson, setSelectedLesson] = useState<LessonContent | null>(null);
  const [localCompletedLessons, setLocalCompletedLessons] = useState<Set<number>>(completedLessons);

  const totalXP = Array.from(localCompletedLessons).reduce((sum, lessonId) => {
    const lesson = lessonsData.find(l => l.id === lessonId);
    return sum + (lesson?.xp || 0);
  }, 0);

  const maxXP = lessonsData.reduce((sum, l) => sum + l.xp, 0);
  const progressPercent = (totalXP / maxXP) * 100;

  const handleLessonClick = (lesson: LessonContent) => {
    setSelectedLesson(lesson);
    // Mark lesson as completed when viewed
    const isNewCompletion = !localCompletedLessons.has(lesson.id);
    const updated = new Set([...localCompletedLessons, lesson.id]);
    setLocalCompletedLessons(updated);
    onLessonsChange?.(updated);

    // Notify parent when lesson is newly completed
    if (isNewCompletion) {
      onLessonComplete?.(`Completed: ${lesson.title}`);
    }
  };

  const handleBackToLessons = () => {
    setSelectedLesson(null);
  };

  const [recommendedIds, setRecommendedIds] = useState<number[]>([]);

  // Identify specific card-level mistakes (Keep for UI display)
  const cardMistakes = cards
    .filter(card => (card.balance / card.limit) > 0.3)
    .map(card => ({
      type: 'high_utilization',
      message: `"${card.name}" is ${Math.round((card.balance / card.limit) * 100)}% utilized`,
      suggestion: "Keep below 30% for better credit health.",
      lessonIds: [6, 4]
    }));

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const riskLevel = overallUtilization > 30 ? "High" : "Low";
        const res = await fetch(`http://localhost:8000/api/learning/recommendations?utilization=${overallUtilization}&risk_level=${riskLevel}`);
        if (res.ok) {
          const data = await res.json();
          const ids = data.modules.map((m: any) => m.id);
          // Combine backend recommendations with local mistake-based ones if needed, or just use backend
          setRecommendedIds(ids);
        }
      } catch (error) {
        console.error("Failed to fetch recommendations", error);
        setRecommendedIds(overallUtilization > 10 ? [2, 5, 9] : [1, 3, 6]);
      }
    }
    fetchRecommendations();
  }, [overallUtilization]);

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

      {/* Recommended Section - Tailored for User */}
      <div className="bg-gradient-to-br from-indigo-900/60 to-purple-900/60 backdrop-blur-md rounded-2xl p-8 border border-indigo-500/30 shadow-2xl relative overflow-hidden">
        {/* Abstract Background Element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-indigo-500/20 rounded-xl border border-indigo-400/30">
              <Sparkles className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Recommended for You</h2>
              <p className="text-indigo-200/70 text-sm">Based on your individual card usage and mistakes</p>
            </div>
          </div>

          {/* Pinpointed Mistakes Section */}
          {cardMistakes.length > 0 && (
            <div className="mb-8 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-pink-400 mb-2">Mistakes Identified</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {cardMistakes.map((mistake, idx) => (
                  <div key={idx} className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 animate-pulse">
                      <Circle className="w-4 h-4 text-red-500" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{mistake.message}</p>
                      <p className="text-gray-400 text-xs mt-1">{mistake.suggestion}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {lessonsData
              .filter(l => recommendedIds.includes(l.id))
              .map((lesson) => (
                <div
                  key={`rec-${lesson.id}`}
                  onClick={() => handleLessonClick(lesson)}
                  className="group flex items-center gap-4 p-5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-indigo-400/50 transition-all cursor-pointer shadow-lg"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Star className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white group-hover:text-indigo-300 transition-colors">{lesson.title}</h3>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-1">{lesson.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] bg-yellow-400/10 text-yellow-400 px-2 py-0.5 rounded-full font-bold">{lesson.xp} XP</span>
                      <span className="text-[10px] text-gray-500">Level {lesson.level}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
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
                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${localCompletedLessons.has(lesson.id)
                  ? 'bg-green-500/20 border-green-400 hover:shadow-lg hover:shadow-green-500/50'
                  : 'bg-blue-500/20 border-blue-400 hover:shadow-lg hover:shadow-blue-500/50'
                  }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${localCompletedLessons.has(lesson.id)
                    ? 'bg-gradient-to-br from-green-500 to-green-600'
                    : 'bg-gradient-to-br from-blue-500 to-blue-600'
                    }`}
                >
                  {localCompletedLessons.has(lesson.id) ? (
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
                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${localCompletedLessons.has(lesson.id)
                  ? 'bg-green-500/20 border-green-400 hover:shadow-lg hover:shadow-green-500/50'
                  : 'bg-purple-500/20 border-purple-400 hover:shadow-lg hover:shadow-purple-500/50'
                  }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${localCompletedLessons.has(lesson.id)
                    ? 'bg-gradient-to-br from-green-500 to-green-600'
                    : 'bg-gradient-to-br from-purple-500 to-purple-600'
                    }`}
                >
                  {localCompletedLessons.has(lesson.id) ? (
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
                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${localCompletedLessons.has(lesson.id)
                  ? 'bg-green-500/20 border-green-400 hover:shadow-lg hover:shadow-green-500/50'
                  : 'bg-pink-500/20 border-pink-400 hover:shadow-lg hover:shadow-pink-500/50'
                  }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${localCompletedLessons.has(lesson.id)
                    ? 'bg-gradient-to-br from-green-500 to-green-600'
                    : 'bg-gradient-to-br from-pink-500 to-pink-600'
                    }`}
                >
                  {localCompletedLessons.has(lesson.id) ? (
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