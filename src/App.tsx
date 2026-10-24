import { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { QuizData, DEFAULT_QUIZ, QuestionItem } from './types';
import { sound } from './audio';
import { PondStage } from './components/PondStage';
import { QuestionCard } from './components/QuestionCard';
import { QuizEditorModal } from './components/QuizEditorModal';
import { GameOverModal } from './components/GameOverModal';
import { Volume2, VolumeX, PenSquare, Star, Flame, Trophy } from 'lucide-react';

interface QuestionLog {
  question: QuestionItem;
  userAnswerIdx: number;
  isCorrect: boolean;
}

interface WaterRippleItem {
  id: number;
  right: number;
  bottom: number;
}

export default function App() {
  // --- Quiz Data State ---
  const [currentQuiz, setCurrentQuiz] = useState<QuizData>(() => {
    try {
      const saved = localStorage.getItem('froggy_custom_quiz_pipe');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return DEFAULT_QUIZ;
  });

  // --- Game Flow State ---
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [questionLogs, setQuestionLogs] = useState<QuestionLog[]>([]);

  // --- Animation States for Frog ---
  // currentStepIndex: 0 = start shore, 1..N = lily pads, N+1 = victory shore
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [isSplashing, setIsSplashing] = useState(false);
  const [waterRipples, setWaterRipples] = useState<WaterRippleItem[]>([]);

  // --- UI States ---
  const [isMuted, setIsMuted] = useState(() => sound.getMuted());
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Initialize or restart the game
  const restartGame = useCallback(() => {
    setCurrentQuestionIdx(0);
    setCurrentStepIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setCorrectCount(0);
    setIsGameOver(false);
    setQuestionLogs([]);
    setIsJumping(false);
    setIsSplashing(false);
    setWaterRipples([]);
    sound.playClick();
  }, []);

  // Save new quiz from editor
  const handleSaveQuiz = (newQuiz: QuizData) => {
    setCurrentQuiz(newQuiz);
    localStorage.setItem('froggy_custom_quiz_pipe', JSON.stringify(newQuiz));
    restartGame();
  };

  // Add water ripple effect at given location
  const spawnRipple = (rightPercent: number, bottomPx: number = 30) => {
    const newId = Date.now() + Math.random();
    setWaterRipples((prev) => [...prev, { id: newId, right: rightPercent, bottom: bottomPx }]);
    setTimeout(() => {
      setWaterRipples((prev) => prev.filter((r) => r.id !== newId));
    }, 1200);
  };

  // Trigger grand victory celebration
  const triggerVictory = useCallback(() => {
    setIsGameOver(true);
    sound.playVictory();

    // Trigger double confetti blast
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        confetti({
          particleCount: 100,
          angle: 60,
          spread: 55,
          origin: { x: 0.2, y: 0.7 }
        });
        confetti({
          particleCount: 100,
          angle: 120,
          spread: 55,
          origin: { x: 0.8, y: 0.7 }
        });
      }, 300);
    } catch {
      // Confetti failsafe
    }
  }, []);

  // Handle player selecting an option
  const handleSelectOption = (optionIdx: number) => {
    if (isAnswered || isGameOver) return;

    const currentQ = currentQuiz.questions[currentQuestionIdx];
    if (!currentQ) return;

    setSelectedOption(optionIdx);
    setIsAnswered(true);

    const isCorrect = optionIdx === currentQ.correct;

    // Log the answer
    setQuestionLogs((prev) => [
      ...prev,
      {
        question: currentQ,
        userAnswerIdx: optionIdx,
        isCorrect
      }
    ]);

    if (isCorrect) {
      // Correct answer!
      const newStreak = streak + 1;
      setStreak(newStreak);
      setMaxStreak((prev) => Math.max(prev, newStreak));

      // Streak bonus: +100 base + 20 per streak
      const pointsEarned = 100 + (newStreak > 1 ? (newStreak - 1) * 20 : 0);
      setScore((prev) => prev + pointsEarned);
      setCorrectCount((prev) => prev + 1);

      sound.playCorrect();
      sound.playJump();

      // Animate frog jump to current question pad (index 1..N)
      setIsJumping(true);
      const nextStep = currentStepIndex + 1;
      setCurrentStepIndex(nextStep);

      // Compute approximate right percentage for water ripple landing
      const totalQ = currentQuiz.questions.length;
      const stepRatio = totalQ > 1 ? (nextStep - 1) / (totalQ - 1) : 0.5;
      const targetRight = 16 + stepRatio * (76 - 16);

      setTimeout(() => {
        setIsJumping(false);
        spawnRipple(targetRight, 32);
      }, 450);

    } else {
      // Incorrect answer: splash into water!
      setStreak(0);
      sound.playSplash();
      setIsSplashing(true);

      // Splash ripple
      const totalQ = currentQuiz.questions.length;
      const stepRatio = currentStepIndex > 0 ? (currentStepIndex - 1) / (totalQ - 1) : 0;
      const currentRight = currentStepIndex === 0 ? 5 : 16 + stepRatio * (76 - 16);
      spawnRipple(currentRight, 25);

      // Reset splash after animation
      setTimeout(() => {
        setIsSplashing(false);
      }, 750);
    }
  };

  // Advance to the next question
  const handleNextQuestion = useCallback(() => {
    sound.playClick();
    const nextIdx = currentQuestionIdx + 1;

    if (nextIdx >= currentQuiz.questions.length) {
      // Completed all questions: jump to golden shore and celebrate!
      setCurrentStepIndex(currentQuiz.questions.length + 1);
      sound.playJump();
      setIsJumping(true);
      setTimeout(() => {
        setIsJumping(false);
        spawnRipple(88, 32);
        triggerVictory();
      }, 550);
    } else {
      setCurrentQuestionIdx(nextIdx);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  }, [currentQuestionIdx, currentQuiz.questions.length, triggerVictory]);

  // Sound mute toggle
  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      sound.playClick();
    }
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditorOpen) return;

      if (!isAnswered && !isGameOver) {
        if (e.key === '1' || e.key === 'أ') {
          handleSelectOption(0);
        } else if (e.key === '2' || e.key === 'ب') {
          handleSelectOption(1);
        } else if (e.key === '3' || e.key === 'ج') {
          handleSelectOption(2);
        } else if (e.key === '4' || e.key === 'د') {
          handleSelectOption(3);
        }
      } else if (isAnswered && !isGameOver) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleNextQuestion();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditorOpen, isAnswered, isGameOver, handleNextQuestion]);

  // Handle downloading standalone HTML file
  const handleDownloadHtml = () => {
    sound.playClick();
    import('./standaloneHtml').then(({ generateStandaloneHtml }) => {
      const htmlStr = generateStandaloneHtml(currentQuiz);
      const blob = new Blob([htmlStr], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const safeName = (currentQuiz.title.trim() || 'froggy_jumps').replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '_');
      a.download = `${safeName}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  const currentQ = currentQuiz.questions[currentQuestionIdx];
  const progressPercent = Math.min(
    100,
    Math.round(((currentQuestionIdx + (isAnswered ? 1 : 0.5)) / Math.max(1, currentQuiz.questions.length)) * 100)
  );

  return (
    <div className="sky-gradient min-h-screen flex flex-col relative text-slate-800 antialiased selection:bg-emerald-500 selection:text-white">
      
      {/* Navigation Header */}
      <header className="w-full px-4 py-3 bg-slate-900/50 backdrop-blur-md border-b border-white/20 relative z-30 flex justify-between items-center text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-2xl shadow-lg border-2 border-emerald-300">
            🐸
          </div>
          <div>
            <h1 className="text-xl font-black tracking-wide text-amber-300 drop-shadow flex items-center gap-1.5">
              <span>FROGGY JUMP</span>
              <span className="text-xs bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-300/30 font-medium hidden sm:inline">
                التعليمية
              </span>
            </h1>
            <p className="text-xs text-emerald-100 font-medium hidden sm:block">
              لعبة قفزات الضفدع التفاعلية لاختبارات الطلاب والمدارس
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Open / Download HTML file options */}
          <button
            onClick={handleDownloadHtml}
            className="bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold px-3 py-2 rounded-xl text-xs sm:text-sm flex items-center gap-1.5 border border-emerald-400/50 shadow transition cursor-pointer"
            title="تحميل اللعبة كملف HTML مستقل يمكن فتحه وتشغيله على أي جهاز بدون إنترنت"
          >
            <span>📥</span>
            <span className="hidden sm:inline">تحميل كملف HTML</span>
            <span className="sm:hidden">ملف HTML</span>
          </button>

          <a
            href="/froggy_jumps.html"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/15 hover:bg-white/25 text-white font-medium px-2.5 py-2 rounded-xl text-xs sm:text-sm flex items-center gap-1 border border-white/20 transition"
            title="فتح صفحة HTML المستقلة مباشرة في المتصفح"
          >
            <span>🌐</span>
            <span className="hidden md:inline">فتح كـ HTML</span>
          </a>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition border cursor-pointer ${
              isMuted
                ? 'bg-rose-950/60 border-rose-500/40 text-rose-300 hover:bg-rose-900/60'
                : 'bg-white/20 border-white/20 text-amber-300 hover:bg-white/30'
            }`}
            title={isMuted ? "تشغيل الصوت" : "كتم الصوت"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-amber-300" />}
            <span className="hidden lg:inline">{isMuted ? "الصوت مغلق" : "الصوت"}</span>
          </button>

          {/* Teacher Mode / Fast Editor */}
          <button
            onClick={() => {
              sound.playClick();
              setIsEditorOpen(true);
            }}
            className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black px-3.5 py-2 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg transition transform hover:-translate-y-0.5 cursor-pointer"
          >
            <PenSquare className="w-4 h-4 text-slate-950" />
            <span className="hidden sm:inline">محرر الأسئلة 📝</span>
            <span className="sm:hidden">الأسئلة 📝</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-between p-3 sm:p-5 md:p-6 max-w-5xl mx-auto w-full relative z-10">
        
        {/* Top Progress & Score Board */}
        <div
          id="game-stats-bar"
          className="w-full glass-panel rounded-2xl p-3.5 sm:p-4 mb-4 flex flex-wrap justify-between items-center gap-3 text-white border-2 border-white/20 shadow-xl"
        >
          {/* Stage Progress Pill & Bar */}
          <div className="flex items-center gap-3">
            <span className="bg-emerald-600/90 px-3 py-1 rounded-xl text-xs font-black border border-emerald-300 shadow">
              المرحلة {Math.min(currentQuestionIdx + 1, currentQuiz.questions.length)} من {currentQuiz.questions.length}
            </span>
            <div className="w-28 sm:w-44 bg-slate-900/60 rounded-full h-3 overflow-hidden p-0.5 border border-white/25 shadow-inner">
              <div
                className="bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-300 h-full rounded-full transition-all duration-500 shadow-[0_0_10px_#34d399]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Quiz Title Display */}
          <div className="font-black text-amber-200 text-sm sm:text-base flex items-center gap-1.5 drop-shadow">
            <span>{currentQuiz.title}</span>
          </div>

          {/* Streak & Score counters */}
          <div className="flex items-center gap-2">
            {streak >= 2 && (
              <div className="flex items-center gap-1 bg-amber-500/20 px-2.5 py-1 rounded-xl border border-amber-400/40 text-amber-300 text-xs font-black animate-pulse">
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>{streak}x متتالية</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 bg-slate-900/70 px-3.5 py-1 rounded-xl border border-amber-400/40 shadow-inner">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-xs text-slate-300 font-bold">النقاط:</span>
              <span className="text-base sm:text-lg font-black text-amber-300 font-mono">
                {score}
              </span>
            </div>
          </div>
        </div>

        {/* Visual Pond Animation Stage */}
        <PondStage
          totalQuestions={currentQuiz.questions.length}
          currentStepIndex={currentStepIndex}
          isJumping={isJumping}
          isSplashing={isSplashing}
          hasWon={isGameOver}
          streak={streak}
          waterRipples={waterRipples}
        />

        {/* Dynamic Card Area: Either Question Card OR Victory Game Over Panel */}
        {!isGameOver && currentQ ? (
          <QuestionCard
            questionData={currentQ}
            questionIndex={currentQuestionIdx}
            totalQuestions={currentQuiz.questions.length}
            category={currentQuiz.category}
            selectedOption={selectedOption}
            isAnswered={isAnswered}
            onSelectOption={handleSelectOption}
            onNextQuestion={handleNextQuestion}
          />
        ) : isGameOver ? (
          <GameOverModal
            quiz={currentQuiz}
            score={score}
            correctCount={correctCount}
            totalQuestions={currentQuiz.questions.length}
            maxStreak={maxStreak}
            questionLogs={questionLogs}
            onRestart={restartGame}
            onOpenEditor={() => setIsEditorOpen(true)}
          />
        ) : (
          <div className="w-full glass-panel rounded-3xl p-8 text-center text-white">
            <p className="font-bold text-lg mb-3">لا توجد أسئلة متاحة في الاختبار الحالي.</p>
            <button
              onClick={() => setIsEditorOpen(true)}
              className="bg-amber-400 text-slate-950 font-black px-6 py-2.5 rounded-xl shadow-lg"
            >
              افتح محرر الأسئلة لإضافة أسئلة
            </button>
          </div>
        )}

      </main>

      {/* Footer info banner */}
      <footer className="w-full py-2.5 px-4 text-center text-xs text-white/80 border-t border-white/10 bg-slate-950/40 backdrop-blur-sm relative z-20 flex flex-wrap items-center justify-center gap-3">
        <span>🐸 Froggy Jumps - لعبة قفزات الضفدع التعليمية</span>
        <span>•</span>
        <span className="text-amber-200">اختبر معلوماتك وساعد الضفدع على الوصول للضفة الذهبية! 🏆</span>
        <span>•</span>
        <button
          onClick={() => setIsEditorOpen(true)}
          className="text-emerald-300 hover:underline font-bold"
        >
          تخصيص أسئلة الامتحان (Pipe Format)
        </button>
      </footer>

      {/* Teacher / Fast Pipe Editor Modal */}
      <QuizEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        currentQuiz={currentQuiz}
        onSaveQuiz={handleSaveQuiz}
      />

    </div>
  );
}
