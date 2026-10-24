import React, { useState, useEffect } from 'react';
import { QuizData, QUIZ_PRESETS, parsePipeFormat, formatToPipeString, DEFAULT_QUIZ } from '../types';
import { X, Sliders, Sparkles, RotateCcw, Copy, Check, FileText, HelpCircle, Layers } from 'lucide-react';

interface QuizEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentQuiz: QuizData;
  onSaveQuiz: (newQuiz: QuizData) => void;
}

export const QuizEditorModal: React.FC<QuizEditorModalProps> = ({
  isOpen,
  onClose,
  currentQuiz,
  onSaveQuiz
}) => {
  const [title, setTitle] = useState(currentQuiz.title);
  const [category, setCategory] = useState(currentQuiz.category);
  const [pipeText, setPipeText] = useState('');
  const [copied, setCopied] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTitle(currentQuiz.title);
      setCategory(currentQuiz.category);
      setPipeText(formatToPipeString(currentQuiz.questions));
      setFeedbackError(null);
    }
  }, [isOpen, currentQuiz]);

  if (!isOpen) return null;

  const parsedQuestions = parsePipeFormat(pipeText);
  const parsedCount = parsedQuestions.length;

  const handleApplyPreset = (presetId: string) => {
    const preset = QUIZ_PRESETS.find(p => p.id === presetId);
    if (preset) {
      setTitle(preset.data.title);
      setCategory(preset.data.category);
      setPipeText(formatToPipeString(preset.data.questions));
      setFeedbackError(null);
    }
  };

  const handleResetDefault = () => {
    if (confirm("هل تريد استعادة نموذج الأسئلة الافتراضي للعبة؟")) {
      setTitle(DEFAULT_QUIZ.title);
      setCategory(DEFAULT_QUIZ.category);
      setPipeText(formatToPipeString(DEFAULT_QUIZ.questions));
      setFeedbackError(null);
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(pipeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    const validQuestions = parsePipeFormat(pipeText);
    if (validQuestions.length === 0) {
      setFeedbackError("يرجى إدخال سؤال واحد صحيح على الأقل باستخدام صيغة الشارطة |");
      return;
    }

    const updatedQuiz: QuizData = {
      title: title.trim() || "اختبار مخصص",
      category: category.trim() || "عام",
      questions: validQuestions
    };

    onSaveQuiz(updatedQuiz);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 select-text">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-3xl p-5 sm:p-6 text-slate-100 max-h-[92vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>محرر الأسئلة الموحد (Fast Pipe Format)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-sans">
                  Fast & Easy
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                أدخل أو عدّل الأسئلة والخيارات ورقم الإجابة الصحيحة في سطر واحد بكل سرعة وسهولة
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 pl-1">
          
          {/* Quick Preset Selector */}
          <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/60">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300 mb-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>نماذج ومسابقات جاهزة سريعة التحميل:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {QUIZ_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleApplyPreset(p.id)}
                  className="bg-slate-900 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 hover:border-emerald-500/50 px-3 py-1.5 rounded-xl transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span>{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quiz Meta Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">عنوان الاختبار / المادة:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
                placeholder="مثال: رياضيات - الصف العاشر"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">الفئة / المفهوم:</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
                placeholder="مثال: الجبر والمعادلات"
              />
            </div>
          </div>

          {/* Fast Pipe Editor Input */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-amber-500/30 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>إدخال الأسئلة الموحد (سطر لكل سؤال):</span>
              </label>
              
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                  parsedCount > 0
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                }`}>
                  {parsedCount > 0 ? `✅ تم التعرف على ${parsedCount} أسئلة` : '⚠️ لا توجد أسئلة صالحة'}
                </span>

                <button
                  onClick={handleCopyText}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg text-xs flex items-center gap-1 transition"
                  title="نسخ النص"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'تم النسخ' : 'نسخ'}</span>
                </button>
              </div>
            </div>

            {/* Syntax Explanation Banner */}
            <div className="text-[11px] text-slate-300 bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 leading-relaxed">
              <div className="flex items-center gap-1.5 font-bold text-amber-200 mb-1">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>قاعدة الصياغة: تفصل علامة الشارطة <code className="bg-slate-800 text-amber-300 px-1 py-0.2 rounded font-mono">|</code> بين السؤال والخيارات، والرقم الأخير هو رقم الخيار الصحيح (1 أو 2 أو 3):</span>
              </div>
              <div className="font-mono text-emerald-300 dir-ltr text-[11px] bg-slate-950 p-1.5 rounded border border-slate-800">
                What is 2+2? | 3 | 4 | 5 | 2
              </div>
            </div>

            <textarea
              rows={8}
              value={pipeText}
              onChange={(e) => {
                setPipeText(e.target.value);
                setFeedbackError(null);
              }}
              dir="auto"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 font-sans focus:outline-none focus:border-emerald-500 leading-relaxed font-mono resize-y"
              placeholder={`السؤال الأول | خيار أ | خيار ب | خيار ج | 1\nالسؤال الثاني | خيار أ | خيار ب | خيار ج | 2`}
            />

            {feedbackError && (
              <p className="text-xs text-rose-400 font-bold bg-rose-950/40 p-2 rounded-xl border border-rose-500/40">
                {feedbackError}
              </p>
            )}
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="pt-4 mt-4 border-t border-slate-800 flex flex-wrap justify-between items-center gap-3">
          <button
            onClick={handleResetDefault}
            className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 underline transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>استعادة الأسئلة الافتراضية</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-800 transition"
            >
              إلغاء
            </button>
            <button
              onClick={handleSave}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black px-7 py-2.5 rounded-xl text-sm shadow-xl transition flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>حفظ وابدأ اللعب 🎮</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
