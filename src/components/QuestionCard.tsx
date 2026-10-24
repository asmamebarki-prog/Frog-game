import React from 'react';
import { QuestionItem } from '../types';
import { CheckCircle2, XCircle, ArrowLeft, Volume2, Sparkles } from 'lucide-react';

interface QuestionCardProps {
  questionData: QuestionItem;
  questionIndex: number;
  totalQuestions: number;
  category: string;
  selectedOption: number | null;
  isAnswered: boolean;
  onSelectOption: (optionIndex: number) => void;
  onNextQuestion: () => void;
}

const OPTION_LABELS = ['أ', 'ب', 'ج', 'د', 'هـ'];

export const QuestionCard: React.FC<QuestionCardProps> = ({
  questionData,
  questionIndex,
  totalQuestions,
  category,
  selectedOption,
  isAnswered,
  onSelectOption,
  onNextQuestion
}) => {
  const isCorrect = selectedOption !== null && selectedOption === questionData.correct;

  // Read aloud feature using browser Web Speech API
  const handleSpeakQuestion = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(questionData.question);
      // Auto-detect language (Arabic or English)
      const hasArabic = /[\u0600-\u06FF]/.test(questionData.question);
      utterance.lang = hasArabic ? 'ar-SA' : 'en-US';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div
      id="quiz-card-panel"
      className="w-full glass-panel rounded-3xl p-5 sm:p-7 relative z-20 transition-all duration-300 border-2 border-white/20 shadow-2xl"
    >
      {/* Category Pill & Hint */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black px-3.5 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 rounded-xl shadow-md flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            <span>{category || "اختبار تفاعلي"}</span>
          </span>
          <span className="text-xs text-emerald-300 font-bold bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-1 rounded-lg">
            سؤال {questionIndex + 1} / {totalQuestions}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSpeakQuestion}
            title="استمع لنطق السؤال"
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 transition text-xs flex items-center gap-1"
          >
            <Volume2 className="w-4 h-4 text-amber-300" />
            <span className="text-[11px] hidden sm:inline">نطق السؤال</span>
          </button>
          <span className="text-xs text-emerald-200/90 hidden md:inline font-medium">
            اختر الإجابة الصحيحة ليقفز الضفدع 🐸
          </span>
        </div>
      </div>

      {/* Main Question Text */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-black text-white leading-relaxed tracking-wide drop-shadow-sm">
          {questionData.question}
        </h2>
      </div>

      {/* Options Grid */}
      <div
        className={`grid gap-3.5 mb-5 ${
          questionData.options.length <= 2
            ? 'grid-cols-1 sm:grid-cols-2'
            : questionData.options.length === 3
            ? 'grid-cols-1 sm:grid-cols-3'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
        }`}
      >
        {questionData.options.map((optionText, idx) => {
          const isThisSelected = selectedOption === idx;
          const isThisCorrect = idx === questionData.correct;

          let cardStyle = "bg-white/95 text-slate-900 border-white/60 hover:bg-white hover:border-emerald-400 hover:shadow-lg hover:-translate-y-0.5";
          let badgeStyle = "bg-emerald-100 text-emerald-800 border-emerald-300";

          if (isAnswered) {
            if (isThisCorrect) {
              cardStyle = "bg-emerald-500 text-white border-emerald-300 shadow-[0_0_20px_#10b981] scale-[1.02]";
              badgeStyle = "bg-white/20 text-white border-white/40";
            } else if (isThisSelected && !isThisCorrect) {
              cardStyle = "bg-rose-500 text-white border-rose-300 shadow-lg animate-shake";
              badgeStyle = "bg-white/20 text-white border-white/40";
            } else {
              cardStyle = "bg-white/40 text-slate-400 border-transparent opacity-60";
              badgeStyle = "bg-slate-200 text-slate-500 border-slate-300";
            }
          }

          return (
            <button
              key={idx}
              disabled={isAnswered}
              onClick={() => onSelectOption(idx)}
              className={`p-4 rounded-2xl border-2 transition-all duration-200 text-right font-bold text-base sm:text-lg flex items-center justify-between shadow-md cursor-pointer disabled:cursor-default ${cardStyle}`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black border ${badgeStyle}`}>
                  {OPTION_LABELS[idx] || `${idx + 1}`}
                </span>
                <span className="leading-snug">{optionText}</span>
              </div>

              {/* Status Icon */}
              <div className="ml-2 shrink-0">
                {isAnswered && isThisCorrect && (
                  <CheckCircle2 className="w-6 h-6 text-emerald-200" />
                )}
                {isAnswered && isThisSelected && !isThisCorrect && (
                  <XCircle className="w-6 h-6 text-rose-200" />
                )}
                {!isAnswered && (
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300"></div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Answer Feedback & Next Step Banner */}
      {isAnswered && (
        <div
          className={`p-4 rounded-2xl mb-2 flex flex-col sm:flex-row items-center justify-between gap-3 border shadow-xl transition-all duration-300 ${
            isCorrect
              ? 'bg-emerald-950/80 border-emerald-400 text-emerald-100 shadow-[0_0_25px_rgba(16,185,129,0.2)]'
              : 'bg-rose-950/80 border-rose-400 text-rose-100 shadow-[0_0_25px_rgba(244,63,94,0.2)]'
          }`}
        >
          <div className="flex items-center gap-3 text-right w-full sm:w-auto">
            <div className={`p-2.5 rounded-xl ${isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
              {isCorrect ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                <XCircle className="w-6 h-6" />
              )}
            </div>
            <div>
              <p className="font-extrabold text-base">
                {isCorrect
                  ? "أحسنت! إجابة صحيحة، قفز الضفدع بنجاح! 🐸✨"
                  : `إجابة غير صحيحة! الإجابة هي: (${questionData.options[questionData.correct]}) 💦`}
              </p>
              {questionData.explanation && (
                <p className="text-xs text-white/80 mt-0.5">
                  💡 {questionData.explanation}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onNextQuestion}
            className="w-full sm:w-auto bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black px-6 py-2.5 rounded-xl text-sm sm:text-base shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>السؤال التالي</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
