import React, { useState } from 'react';
import { QuizData, QuestionItem } from '../types';
import { RotateCcw, PenSquare, Share2, Award, CheckCircle2, XCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface QuestionLog {
  question: QuestionItem;
  userAnswerIdx: number;
  isCorrect: boolean;
}

interface GameOverModalProps {
  quiz: QuizData;
  score: number;
  correctCount: number;
  totalQuestions: number;
  maxStreak: number;
  questionLogs: QuestionLog[];
  onRestart: () => void;
  onOpenEditor: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  quiz,
  score,
  correctCount,
  totalQuestions,
  maxStreak,
  questionLogs,
  onRestart,
  onOpenEditor
}) => {
  const [showReview, setShowReview] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const percentage = Math.round((correctCount / Math.max(1, totalQuestions)) * 100);

  let title = "مبروك! وصلت للضفة الذهبية بنجاح! 🏆";
  let badgeName = "أسطورة البركة المائية 👑";
  let badgeColor = "from-amber-400 to-yellow-500 text-slate-950";

  if (percentage === 100) {
    title = "إنجاز أسطوري! عبور كامل للبركة بلا أخطاء! 🌟";
    badgeName = "بطل القفزات الذهبية 👑";
  } else if (percentage >= 80) {
    title = "ممتاز جداً! وصلت للضفة الأخرى ببراعة! 🐸";
    badgeName = "قافز ماهر ومحترف ⭐";
    badgeColor = "from-emerald-400 to-teal-500 text-slate-950";
  } else if (percentage >= 50) {
    title = "أحسنت المحاولة! وصلت بنجاح للهدف! 🌿";
    badgeName = "مستكشف البركة 🍀";
    badgeColor = "from-cyan-400 to-blue-500 text-slate-950";
  } else {
    title = "محاولة شجاعة! حاول مرة أخرى للوصول للقمة! 💦";
    badgeName = "متدرب واعد 🌿";
    badgeColor = "from-slate-400 to-slate-500 text-white";
  }

  const handleShare = () => {
    const text = `🐸 لعبت مسابقة "${quiz.title}" على لعبة قفزات الضفدع Froggy Jumps وحققت:
⭐ النتيجة: ${score} نقطة
🎯 الإجابات الصحيحة: ${correctCount} من ${totalQuestions} (${percentage}%)
🔥 أعلى سلسلة إجابات: ${maxStreak}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  return (
    <div
      id="game-over-panel"
      className="w-full glass-panel rounded-3xl p-6 sm:p-8 text-center text-white relative z-20 my-auto border-2 border-amber-300/40 shadow-2xl animate-in zoom-in-95 duration-300 max-w-2xl mx-auto"
    >
      {/* Frog Victory Avatar */}
      <div className="relative w-24 h-24 mx-auto mb-4">
        <div className="w-24 h-24 bg-amber-400/20 rounded-full flex items-center justify-center border-2 border-amber-300 animate-bounce shadow-[0_0_30px_rgba(251,191,36,0.4)]">
          <span className="text-6xl">🐸</span>
        </div>
        <span className="absolute -top-3 -right-2 text-3xl animate-pulse">👑</span>
      </div>

      {/* Main Title & Subtitle */}
      <h2 className="text-2xl sm:text-3xl font-black mb-2 text-amber-300 drop-shadow">
        {title}
      </h2>
      <p className="text-slate-200 max-w-md mx-auto mb-5 text-sm sm:text-base leading-relaxed">
        أكملت قفزات الضفدع عبر أوراق الزنبق المائية في اختبار: <strong className="text-amber-200">{quiz.title}</strong>
      </p>

      {/* Badge Pill */}
      <div className="inline-block mb-6">
        <span className={`px-4 py-1.5 rounded-full font-black text-xs sm:text-sm shadow-md bg-gradient-to-r ${badgeColor} flex items-center gap-2`}>
          <Award className="w-4 h-4" />
          <span>{badgeName}</span>
        </span>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-6">
        <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-white/10 flex flex-col items-center">
          <span className="text-slate-400 text-xs mb-1">الإجابات الصحيحة</span>
          <span className="font-black text-emerald-400 text-xl sm:text-2xl">
            {correctCount} / {totalQuestions}
          </span>
          <span className="text-[11px] text-emerald-300/80 mt-0.5">{percentage}%</span>
        </div>

        <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-white/10 flex flex-col items-center">
          <span className="text-slate-400 text-xs mb-1">مجموع النقاط</span>
          <span className="font-black text-amber-300 text-xl sm:text-2xl">
            {score}
          </span>
          <span className="text-[11px] text-amber-200/80 mt-0.5">نقطة</span>
        </div>

        <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-white/10 flex flex-col items-center">
          <span className="text-slate-400 text-xs mb-1">أعلى سلسلة</span>
          <span className="font-black text-rose-400 text-xl sm:text-2xl">
            {maxStreak}
          </span>
          <span className="text-[11px] text-rose-300/80 mt-0.5">متتالية 🔥</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-5">
        <button
          onClick={onRestart}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black px-7 py-3 rounded-2xl shadow-xl transition transform hover:-translate-y-0.5 flex items-center gap-2 text-sm sm:text-base cursor-pointer"
        >
          <RotateCcw className="w-5 h-5" />
          <span>إعادة اللعب 🎮</span>
        </button>

        <button
          onClick={onOpenEditor}
          className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-3 rounded-2xl shadow-xl transition transform hover:-translate-y-0.5 flex items-center gap-2 text-sm sm:text-base cursor-pointer"
        >
          <PenSquare className="w-5 h-5" />
          <span>تعديل الأسئلة 📝</span>
        </button>

        <button
          onClick={() => {
            import('../standaloneHtml').then(({ generateStandaloneHtml }) => {
              const htmlStr = generateStandaloneHtml(quiz);
              const blob = new Blob([htmlStr], { type: 'text/html;charset=utf-8' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              const safeName = (quiz.title.trim() || 'froggy_jumps').replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '_');
              a.download = `${safeName}.html`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            });
          }}
          className="bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-400/40 font-bold px-4 py-3 rounded-2xl transition flex items-center gap-2 text-sm sm:text-base cursor-pointer"
          title="تحميل اللعبة كاملة كملف HTML مستقل"
        >
          <span>📥</span>
          <span>تحميل كـ HTML</span>
        </button>

        <button
          onClick={handleShare}
          className="bg-white/20 hover:bg-white/30 text-white font-bold px-4 py-3 rounded-2xl transition flex items-center gap-2 text-sm sm:text-base cursor-pointer"
          title="مشاركة النتيجة"
        >
          <Share2 className="w-4 h-4 text-amber-300" />
          <span>{copiedShare ? "تم النسخ! ✅" : "مشاركة"}</span>
        </button>
      </div>

      {/* Question Review Toggle */}
      {questionLogs.length > 0 && (
        <div className="mt-4 border-t border-white/10 pt-4 text-right">
          <button
            onClick={() => setShowReview(!showReview)}
            className="w-full flex items-center justify-between text-xs sm:text-sm font-bold text-slate-300 hover:text-white transition py-1"
          >
            <span>مراجعة الأسئلة والإجابات ({questionLogs.length})</span>
            {showReview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showReview && (
            <div className="mt-3 space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {questionLogs.map((log, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl border text-right text-xs leading-relaxed ${
                    log.isCorrect
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-100'
                      : 'bg-rose-950/40 border-rose-500/40 text-rose-100'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold mb-1">
                    {log.isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    <span>
                      {i + 1}. {log.question.question}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300 mr-6">
                    <div>
                      إجابتك: <span className={log.isCorrect ? "text-emerald-300 font-bold" : "text-rose-300 font-bold"}>
                        {log.question.options[log.userAnswerIdx]}
                      </span>
                    </div>
                    {!log.isCorrect && (
                      <div className="text-emerald-300 font-bold">
                        الإجابة الصحيحة: {log.question.options[log.question.correct]}
                      </div>
                    )}
                    {log.question.explanation && (
                      <div className="text-slate-400 mt-0.5">
                        💡 {log.question.explanation}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
