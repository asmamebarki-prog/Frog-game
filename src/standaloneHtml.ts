import { QuizData, DEFAULT_QUIZ } from './types';

export function generateStandaloneHtml(quiz: QuizData = DEFAULT_QUIZ): string {
  const quizJsonEscaped = JSON.stringify(quiz).replace(/</g, '\\u003c').replace(/>/g, '\\u003e');

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Froggy Jumps - لعبة قفزات الضفدع التعليمية</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap" rel="stylesheet">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: 'Tajawal', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      user-select: none;
      -webkit-user-select: none;
    }

    body {
      background: linear-gradient(180deg, #fdba74 0%, #fb923c 20%, #38bdf8 55%, #0284c7 100%);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      color: #0f172a;
      overflow-x: hidden;
    }

    .container {
      max-width: 1020px;
      margin: 0 auto;
      width: 100%;
      padding: 12px 16px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    /* Glassmorphism */
    .glass-panel {
      background: rgba(15, 23, 42, 0.65);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1.5px solid rgba(255, 255, 255, 0.25);
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
      border-radius: 24px;
      color: #ffffff;
    }

    .glass-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(8px);
      border-radius: 18px;
      border: 2px solid rgba(255, 255, 255, 0.8);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      transition: all 0.25s cubic-bezier(0.34, 1.4, 0.64, 1);
      cursor: pointer;
    }

    .glass-card:hover:not(:disabled) {
      transform: translateY(-3px) scale(1.015);
      box-shadow: 0 12px 28px rgba(16, 185, 129, 0.3);
      border-color: #34d399;
    }

    /* Pond Container */
    .pond-container {
      width: 100%;
      height: 270px;
      background: radial-gradient(circle at 50% 30%, #0369a1 0%, #0284c7 40%, #075985 85%, #082f49 100%);
      box-shadow: inset 0 10px 30px rgba(0, 0, 0, 0.5), 0 16px 36px rgba(0, 0, 0, 0.3);
      border: 4px solid rgba(253, 230, 138, 0.5);
      border-radius: 28px;
      position: relative;
      overflow: hidden;
      margin-bottom: 16px;
    }

    /* Lily Pad Animations */
    .floating-pad {
      animation: floatLily 3.8s ease-in-out infinite;
    }

    @keyframes floatLily {
      0%, 100% { transform: translateX(50%) translateY(0px) rotate(-1.5deg); }
      50% { transform: translateX(50%) translateY(-6px) rotate(1.5deg); }
    }

    .frog-idle {
      animation: frogBreathe 2.4s ease-in-out infinite alternate;
    }

    @keyframes frogBreathe {
      0% { transform: scale(1); }
      100% { transform: scale(1.05, 0.94); }
    }

    .frog-splash {
      animation: frogSplashDown 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards !important;
    }

    @keyframes frogSplashDown {
      0% { transform: translateY(0) scale(1); opacity: 1; }
      30% { transform: translateY(-20px) scale(1.1); opacity: 1; }
      70% { transform: translateY(35px) scale(0.7); opacity: 0.6; }
      100% { transform: translateY(90px) scale(0.1); opacity: 0; }
    }

    .water-ripple {
      animation: rippleExpand 1.2s ease-out forwards;
      border-radius: 50%;
      border: 2px solid rgba(165, 243, 252, 0.8);
      position: absolute;
      pointer-events: none;
      transform: translate(50%, 50%);
    }

    @keyframes rippleExpand {
      0% { transform: translate(50%, 50%) scale(0.2); opacity: 0.9; }
      100% { transform: translate(50%, 50%) scale(2.6); opacity: 0; }
    }

    /* Buttons */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      border-radius: 14px;
      font-weight: 800;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
    }

    .btn:active {
      transform: scale(0.97);
    }

    .btn-gold {
      background: linear-gradient(135deg, #fbbf24, #f59e0b);
      color: #0f172a;
      box-shadow: 0 4px 14px rgba(245, 158, 11, 0.4);
    }
    .btn-gold:hover {
      background: linear-gradient(135deg, #fcd34d, #fbbf24);
      transform: translateY(-1px);
    }

    .btn-emerald {
      background: linear-gradient(135deg, #10b981, #059669);
      color: #042f2e;
      box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);
    }
    .btn-emerald:hover {
      background: linear-gradient(135deg, #34d399, #10b981);
      transform: translateY(-1px);
    }

    .btn-glass {
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: #ffffff;
    }
    .btn-glass:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    /* Fireflies */
    .firefly {
      position: absolute;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #fde047;
      box-shadow: 0 0 12px #fde047;
      animation: fireflyAnim 4s ease-in-out infinite;
      pointer-events: none;
    }
    @keyframes fireflyAnim {
      0%, 100% { opacity: 0.2; transform: translate(0, 0) scale(0.8); }
      50% { opacity: 0.9; transform: translate(14px, -18px) scale(1.3); }
    }

    /* Modal Overlay */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(2, 6, 23, 0.85);
      backdrop-filter: blur(12px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
      padding: 16px;
    }
    .modal-card {
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 24px;
      width: 100%;
      max-width: 720px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      color: #f8fafc;
      overflow: hidden;
    }

    /* Canvas Confetti */
    #confetti-canvas {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 99;
    }

    /* Responsive */
    @media (max-width: 640px) {
      .pond-container { height: 230px; }
      .options-grid { grid-template-columns: 1fr !important; }
    }
  </style>
</head>
<body>
  <canvas id="confetti-canvas"></canvas>

  <!-- Navigation Bar -->
  <header style="width: 100%; padding: 12px 20px; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,255,255,0.2); display: flex; justify-content: space-between; align-items: center; color: white;">
    <div style="display: flex; align-items: center; gap: 12px;">
      <div style="width: 42px; height: 42px; border-radius: 14px; background: linear-gradient(135deg, #10b981, #059669); display: flex; align-items: center; justify-content: center; font-size: 24px; border: 2px solid #6ee7b7; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
        🐸
      </div>
      <div>
        <h1 style="font-size: 19px; font-weight: 900; color: #fde047; letter-spacing: 0.5px; margin: 0; display: flex; align-items: center; gap: 6px;">
          <span>FROGGY JUMP</span>
          <span style="font-size: 11px; background: rgba(253, 224, 71, 0.2); color: #fde047; padding: 2px 8px; border-radius: 9999px; border: 1px solid rgba(253, 224, 71, 0.4);">ملف HTML مستقل</span>
        </h1>
        <p style="font-size: 11px; color: #a7f3d0; margin: 0;">لعبة قفزات الضفدع التعليمية التفاعلية</p>
      </div>
    </div>

    <div style="display: flex; align-items: center; gap: 8px;">
      <!-- Sound Toggle -->
      <button id="sound-btn" class="btn btn-glass" style="padding: 8px 14px; font-size: 13px;">
        <span id="sound-icon">🔊</span>
        <span id="sound-label">الصوت</span>
      </button>

      <!-- Fast Pipe Editor -->
      <button id="open-editor-btn" class="btn btn-gold" style="padding: 8px 16px; font-size: 13px;">
        <span>✏️</span>
        <span>محرر الأسئلة (Pipe)</span>
      </button>
    </div>
  </header>

  <div class="container">
    <!-- Top Stats Bar -->
    <div class="glass-panel" style="padding: 12px 18px; margin-bottom: 14px; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px;">
      <div style="display: flex; align-items: center; gap: 12px;">
        <span id="level-badge" style="background: rgba(5, 150, 105, 0.9); padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 900; border: 1px solid #6ee7b7;">
          المرحلة 1 من 5
        </span>
        <div style="width: 140px; background: rgba(15, 23, 42, 0.7); height: 10px; border-radius: 9999px; overflow: hidden; padding: 2px; border: 1px solid rgba(255,255,255,0.2);">
          <div id="progress-fill" style="background: linear-gradient(90deg, #facc15, #34d399); height: 100%; border-radius: 9999px; width: 20%; transition: width 0.4s ease;"></div>
        </div>
      </div>

      <div id="quiz-title-text" style="font-weight: 900; font-size: 15px; color: #fef08a;">
        اختبار تفاعلي
      </div>

      <div style="display: flex; align-items: center; gap: 8px;">
        <div id="streak-badge" style="display: none; align-items: center; gap: 4px; background: rgba(245, 158, 11, 0.25); border: 1px solid rgba(245, 158, 11, 0.5); padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 900; color: #fde047;">
          <span>🔥</span>
          <span id="streak-count">0</span>
        </div>
        <div style="background: rgba(15, 23, 42, 0.75); border: 1px solid rgba(253, 230, 138, 0.4); padding: 4px 14px; border-radius: 12px; display: flex; align-items: center; gap: 6px;">
          <span>⭐</span>
          <span style="font-size: 12px; color: #cbd5e1;">النقاط:</span>
          <span id="score-text" style="font-size: 17px; font-weight: 900; color: #fde047;">0</span>
        </div>
      </div>
    </div>

    <!-- Visual Pond Stage -->
    <div id="pond-stage" class="pond-container">
      <!-- Fireflies -->
      <div class="firefly" style="top: 25px; right: 120px;"></div>
      <div class="firefly" style="top: 60px; left: 140px; animation-delay: -2s;"></div>

      <!-- Start Shore (Right Side in RTL) -->
      <div style="position: absolute; right: 0; bottom: 0; width: 110px; height: 95px; background: linear-gradient(to top left, #064e3b, #047857); border-top-left-radius: 9999px; border-top: 4px solid #34d399; border-left: 2px solid #34d399; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; padding-bottom: 12px; z-index: 10; box-shadow: 0 0 20px rgba(0,0,0,0.5);">
        <span style="font-size: 12px; font-weight: 900; color: #a7f3d0;">🌿 البداية</span>
        <span style="font-size: 10px; color: rgba(167, 243, 208, 0.8);">انطلاق الضفدع</span>
      </div>

      <!-- Golden Shore (Left Side in RTL) -->
      <div style="position: absolute; left: 0; bottom: 0; width: 125px; height: 110px; background: linear-gradient(to top right, #064e3b, #0f766e, #b45309); border-top-right-radius: 9999px; border-top: 4px solid #fde047; border-right: 2px solid #fde047; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; padding-bottom: 14px; z-index: 10; box-shadow: 0 0 25px rgba(251, 191, 36, 0.35);">
        <div style="position: absolute; top: -16px; left: 20px; font-size: 26px; animation: floatLily 2s infinite alternate;">🏆</div>
        <span style="font-size: 12px; font-weight: 900; color: #fde047;">الضفة الذهبية ✨</span>
        <span style="font-size: 10px; color: #fef08a;">خط النهاية</span>
      </div>

      <!-- Lily Pads Track Container -->
      <div id="pads-track" style="position: absolute; inset: 0; z-index: 20; pointer-events: none;"></div>

      <!-- Water Ripples Container -->
      <div id="ripples-container" style="position: absolute; inset: 0; z-index: 15; pointer-events: none;"></div>

      <!-- Frog Character -->
      <div id="frog-elem" class="frog-idle" style="position: absolute; bottom: 26px; right: 5%; z-index: 30; width: 68px; height: 68px; transform: translateX(50%); transition: all 0.65s cubic-bezier(0.34, 1.4, 0.64, 1); pointer-events: none;">
        <div id="frog-crown" style="display: none; position: absolute; top: -20px; left: 50%; transform: translateX(-50%); font-size: 22px;">👑</div>
        <svg viewBox="0 0 100 100" style="width: 100%; height: 100%; filter: drop-shadow(0 8px 12px rgba(0,0,0,0.45));">
          <ellipse cx="22" cy="76" rx="14" ry="7" fill="#15803d" transform="rotate(-15 22 76)" />
          <ellipse cx="78" cy="76" rx="14" ry="7" fill="#15803d" transform="rotate(15 78 76)" />
          <ellipse cx="50" cy="58" rx="34" ry="28" fill="#22c55e" />
          <ellipse cx="50" cy="64" rx="23" ry="19" fill="#86efac" />
          <circle cx="34" cy="29" r="14" fill="#22c55e" stroke="#15803d" stroke-width="1.5" />
          <circle cx="66" cy="29" r="14" fill="#22c55e" stroke="#15803d" stroke-width="1.5" />
          <circle cx="34" cy="29" r="10" fill="#ffffff" />
          <circle cx="66" cy="29" r="10" fill="#ffffff" />
          <circle cx="36" cy="29" r="5" fill="#0f172a" />
          <circle cx="68" cy="29" r="5" fill="#0f172a" />
          <circle cx="38" cy="27" r="2" fill="#ffffff" />
          <circle cx="70" cy="27" r="2" fill="#ffffff" />
          <circle cx="26" cy="54" r="4.5" fill="#fb7185" opacity="0.7" />
          <circle cx="74" cy="54" r="4.5" fill="#fb7185" opacity="0.7" />
          <path id="frog-mouth" d="M 38 56 Q 50 67 62 56" stroke="#0f172a" stroke-width="3" fill="none" stroke-linecap="round" />
        </svg>
      </div>
    </div>

    <!-- Question Card Panel -->
    <div id="quiz-card" class="glass-panel" style="padding: 22px 26px; position: relative; z-index: 20;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.15);">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span id="category-badge" style="background: linear-gradient(90deg, #f59e0b, #d97706); color: #0f172a; font-weight: 900; font-size: 11px; padding: 4px 12px; border-radius: 10px;">
            عام
          </span>
          <span style="font-size: 12px; color: #a7f3d0; font-weight: 700;">اختر الإجابة الصحيحة ليقفز الضفدع 🐸</span>
        </div>
        <button id="speak-btn" class="btn btn-glass" style="padding: 4px 10px; font-size: 12px;" title="استمع للسؤال">
          <span>🔊</span>
          <span style="font-size: 11px;">نطق السؤال</span>
        </button>
      </div>

      <h2 id="question-text" style="font-size: 22px; font-weight: 900; line-height: 1.5; margin-bottom: 18px; color: white;">
        جاري تحميل السؤال...
      </h2>

      <!-- Options Grid -->
      <div id="options-grid" class="options-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 16px;"></div>

      <!-- Feedback Banner -->
      <div id="feedback-banner" style="display: none; padding: 14px 18px; border-radius: 16px; border: 2px solid; justify-content: space-between; align-items: center; gap: 12px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span id="feedback-icon" style="font-size: 24px;"></span>
          <span id="feedback-text" style="font-weight: 800; font-size: 15px;"></span>
        </div>
        <button id="next-btn" class="btn btn-gold" style="padding: 10px 22px; font-size: 14px; white-space: nowrap;">
          <span>السؤال التالي</span>
          <span>⬅️</span>
        </button>
      </div>
    </div>

    <!-- Victory / Game Over Screen -->
    <div id="game-over-panel" class="glass-panel" style="display: none; padding: 32px 24px; text-align: center; max-width: 600px; margin: 0 auto; width: 100%;">
      <div style="font-size: 64px; margin-bottom: 12px; animation: floatLily 2s infinite alternate;">🐸👑</div>
      <h2 id="victory-title" style="font-size: 26px; font-weight: 900; color: #fde047; margin-bottom: 8px;">مبروك! وصلت للضفة الذهبية بنجاح! 🏆</h2>
      <p style="color: #cbd5e1; font-size: 14px; margin-bottom: 20px;">أكملت قفزات الضفدع عبر أوراق الزنبق المائية بمهارة!</p>

      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; max-width: 420px; margin: 0 auto 24px;">
        <div style="background: rgba(15,23,42,0.8); padding: 12px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
          <div style="font-size: 11px; color: #94a3b8;">الصحيحة</div>
          <div id="final-correct" style="font-size: 20px; font-weight: 900; color: #34d399;">0 / 0</div>
        </div>
        <div style="background: rgba(15,23,42,0.8); padding: 12px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
          <div style="font-size: 11px; color: #94a3b8;">النقاط</div>
          <div id="final-score" style="font-size: 20px; font-weight: 900; color: #fde047;">0</div>
        </div>
        <div style="background: rgba(15,23,42,0.8); padding: 12px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
          <div style="font-size: 11px; color: #94a3b8;">أعلى متتالية</div>
          <div id="final-streak" style="font-size: 20px; font-weight: 900; color: #f43f5e;">0 🔥</div>
        </div>
      </div>

      <div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
        <button id="restart-btn" class="btn btn-emerald" style="padding: 12px 28px; font-size: 15px;">
          <span>🔄</span>
          <span>إعادة اللعب</span>
        </button>
        <button id="editor-from-end-btn" class="btn btn-gold" style="padding: 12px 24px; font-size: 15px;">
          <span>📝</span>
          <span>تعديل الأسئلة</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Fast Pipe Format Editor Modal -->
  <div id="editor-modal" class="modal-overlay" style="display: none;">
    <div class="modal-card">
      <div style="padding: 16px 20px; border-bottom: 1px solid #334155; display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="font-size: 22px;">⚙️</div>
          <div>
            <h3 style="font-size: 16px; font-weight: 900; color: white; margin: 0;">محرر الأسئلة الموحد (Fast Pipe Format)</h3>
            <p style="font-size: 11px; color: #94a3b8; margin: 0;">أدخل الأسئلة والخيارات والإجابة في سطر واحد بكل سهولة</p>
          </div>
        </div>
        <button id="close-editor-btn" class="btn btn-glass" style="padding: 6px 12px; font-size: 16px;">✕</button>
      </div>

      <div style="padding: 18px 20px; overflow-y: auto; flex: 1;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px;">
          <div>
            <label style="font-size: 11px; font-weight: 700; color: #cbd5e1; display: block; margin-bottom: 4px;">عنوان الاختبار:</label>
            <input type="text" id="quiz-title-input" style="width: 100%; background: #020617; border: 1px solid #334155; border-radius: 10px; padding: 8px 12px; color: white; font-size: 13px;" placeholder="عنوان الاختبار">
          </div>
          <div>
            <label style="font-size: 11px; font-weight: 700; color: #cbd5e1; display: block; margin-bottom: 4px;">المجال / الفئة:</label>
            <input type="text" id="quiz-cat-input" style="width: 100%; background: #020617; border: 1px solid #334155; border-radius: 10px; padding: 8px 12px; color: white; font-size: 13px;" placeholder="المادة">
          </div>
        </div>

        <!-- Cheatsheet -->
        <div style="background: rgba(2, 6, 23, 0.7); border: 1px solid #334155; border-radius: 12px; padding: 10px 14px; margin-bottom: 12px; font-size: 11px; color: #cbd5e1;">
          <div style="color: #fde047; font-weight: 800; margin-bottom: 4px;">صيغة الإدخال (سطر لكل سؤال):</div>
          <code style="color: #6ee7b7; font-family: monospace; direction: ltr; display: block; background: #0f172a; padding: 4px 8px; border-radius: 6px;">
            السؤال | خيار 1 | خيار 2 | خيار 3 | رقم الخيار الصحيح (1 أو 2 أو 3)
          </code>
        </div>

        <textarea id="pipe-textarea" rows="8" style="width: 100%; background: #020617; border: 1px solid #334155; border-radius: 12px; padding: 12px; color: #f8fafc; font-size: 13px; line-height: 1.6; font-family: monospace; resize: vertical;" placeholder="What is 2+2? | 3 | 4 | 5 | 2"></textarea>
      </div>

      <div style="padding: 14px 20px; border-top: 1px solid #334155; display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap;">
        <button id="reset-default-btn" class="btn" style="background: none; color: #fb7185; font-size: 12px; text-decoration: underline;">
          استعادة الأسئلة الافتراضية
        </button>

        <div style="display: flex; gap: 8px;">
          <!-- Export Standalone HTML button -->
          <button id="download-current-html-btn" class="btn btn-glass" style="padding: 8px 14px; font-size: 12px;" title="حفظ كملف HTML مستقل بالأسئلة الحالية">
            <span>💾</span>
            <span>تحميل كملف HTML مستقل</span>
          </button>
          
          <button id="save-quiz-btn" class="btn btn-emerald" style="padding: 9px 22px; font-size: 13px;">
            <span>🎮 حفظ وابدأ اللعب</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <footer style="padding: 10px; text-align: center; font-size: 11px; color: rgba(255,255,255,0.7); background: rgba(15,23,42,0.4);">
    🐸 Froggy Jumps - لعبة قفزات الضفدع التعليمية • يمكن فتح هذا الملف وتشغيله محلياً دون إنترنت
  </footer>

  <script>
    /* Embedded Initial Quiz Data */
    const initialQuizData = ${quizJsonEscaped};

    /* Sound Synthesizer via Web Audio API */
    let audioCtx = null;
    let isMuted = false;

    function getAudioCtx() {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      return audioCtx;
    }

    function playSound(type) {
      if (isMuted) return;
      try {
        const ctx = getAudioCtx();
        const now = ctx.currentTime;
        if (type === 'jump') {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(180, now);
          osc.frequency.exponentialRampToValueAtTime(620, now + 0.25);
          gain.gain.setValueAtTime(0.35, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.35);
        } else if (type === 'splash') {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(240, now);
          osc.frequency.exponentialRampToValueAtTime(80, now + 0.25);
          gain.gain.setValueAtTime(0.4, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.3);
        } else if (type === 'correct') {
          [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, now + i * 0.07);
            gain.gain.setValueAtTime(0.18, now + i * 0.07);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.3);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + i * 0.07);
            osc.stop(now + i * 0.07 + 0.3);
          });
        } else if (type === 'win') {
          [392, 523, 659, 783, 1046].forEach((f, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(f, now + i * 0.12);
            gain.gain.setValueAtTime(0.25, now + i * 0.12);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.5);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + i * 0.12);
            osc.stop(now + i * 0.12 + 0.5);
          });
        }
      } catch (e) {}
    }

    /* Embedded Lightweight Confetti */
    function launchConfetti() {
      const canvas = document.getElementById('confetti-canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const particles = [];
      const colors = ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6', '#eab308'];

      for (let i = 0; i < 90; i++) {
        particles.push({
          x: canvas.width * 0.5 + (Math.random() - 0.5) * 200,
          y: canvas.height * 0.7,
          vx: (Math.random() - 0.5) * 16,
          vy: -Math.random() * 18 - 8,
          size: Math.random() * 8 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          vrot: (Math.random() - 0.5) * 10
        });
      }

      let frames = 0;
      function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.45; // gravity
          p.rotation += p.vrot;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation * Math.PI / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
          ctx.restore();
        });

        frames++;
        if (frames < 140) {
          requestAnimationFrame(render);
        } else {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
      render();
    }

    /* State Management */
    let currentQuiz = JSON.parse(localStorage.getItem('froggy_standalone_quiz')) || initialQuizData;
    let currentQIdx = 0;
    let score = 0;
    let streak = 0;
    let maxStreak = 0;
    let correctCount = 0;
    let isAnswered = false;

    // Elements
    const frogElem = document.getElementById('frog-elem');
    const frogCrown = document.getElementById('frog-crown');
    const frogMouth = document.getElementById('frog-mouth');
    const padsTrack = document.getElementById('pads-track');
    const ripplesContainer = document.getElementById('ripples-container');
    const questionText = document.getElementById('question-text');
    const optionsGrid = document.getElementById('options-grid');
    const feedbackBanner = document.getElementById('feedback-banner');
    const feedbackText = document.getElementById('feedback-text');
    const feedbackIcon = document.getElementById('feedback-icon');
    const nextBtn = document.getElementById('next-btn');
    const levelBadge = document.getElementById('level-badge');
    const progressFill = document.getElementById('progress-fill');
    const quizTitleText = document.getElementById('quiz-title-text');
    const scoreText = document.getElementById('score-text');
    const streakBadge = document.getElementById('streak-badge');
    const streakCount = document.getElementById('streak-count');
    const categoryBadge = document.getElementById('category-badge');

    const quizCard = document.getElementById('quiz-card');
    const gameOverPanel = document.getElementById('game-over-panel');
    const finalCorrect = document.getElementById('final-correct');
    const finalScore = document.getElementById('final-score');
    const finalStreak = document.getElementById('final-streak');

    // Editor Elements
    const editorModal = document.getElementById('editor-modal');
    const openEditorBtn = document.getElementById('open-editor-btn');
    const closeEditorBtn = document.getElementById('close-editor-btn');
    const quizTitleInput = document.getElementById('quiz-title-input');
    const quizCatInput = document.getElementById('quiz-cat-input');
    const pipeTextarea = document.getElementById('pipe-textarea');
    const saveQuizBtn = document.getElementById('save-quiz-btn');
    const resetDefaultBtn = document.getElementById('reset-default-btn');
    const downloadCurrentHtmlBtn = document.getElementById('download-current-html-btn');

    // Sound toggle
    const soundBtn = document.getElementById('sound-btn');
    const soundIcon = document.getElementById('sound-icon');
    const soundLabel = document.getElementById('sound-label');
    soundBtn.addEventListener('click', () => {
      isMuted = !isMuted;
      soundIcon.textContent = isMuted ? '🔇' : '🔊';
      soundLabel.textContent = isMuted ? 'كتم' : 'الصوت';
    });

    // Text to Speech
    document.getElementById('speak-btn').addEventListener('click', () => {
      if ('speechSynthesis' in window && currentQuiz.questions[currentQIdx]) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(currentQuiz.questions[currentQIdx].question);
        const hasAr = /[\u0600-\u06FF]/.test(currentQuiz.questions[currentQIdx].question);
        u.lang = hasAr ? 'ar-SA' : 'en-US';
        window.speechSynthesis.speak(u);
      }
    });

    function initGame() {
      currentQIdx = 0;
      score = 0;
      streak = 0;
      maxStreak = 0;
      correctCount = 0;
      isAnswered = false;

      scoreText.textContent = '0';
      streakBadge.style.display = 'none';
      quizTitleText.textContent = currentQuiz.title || 'اختبار تفاعلي';
      categoryBadge.textContent = currentQuiz.category || 'عام';

      frogCrown.style.display = 'none';
      frogMouth.setAttribute('d', 'M 38 56 Q 50 67 62 56');
      frogElem.className = 'frog-idle';

      quizCard.style.display = 'block';
      gameOverPanel.style.display = 'none';

      buildPadsTrack();
      moveFrog(0, false);
      loadQuestion();
    }

    function buildPadsTrack() {
      padsTrack.innerHTML = '';
      const totalQ = currentQuiz.questions.length;
      for (let i = 0; i < totalQ; i++) {
        const pad = document.createElement('div');
        pad.className = 'floating-pad';
        const ratio = totalQ > 1 ? i / (totalQ - 1) : 0.5;
        const rightPct = 16 + ratio * (76 - 16);

        pad.style.position = 'absolute';
        pad.style.bottom = '26px';
        pad.style.right = rightPct + '%';
        pad.style.animationDelay = (-i * 0.65) + 's';

        pad.innerHTML = \`
          <div style="width: 72px; height: 32px; background: linear-gradient(to bottom, #10b981, #047857); border-radius: 50%; border-bottom: 4px solid #064e3b; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 14px rgba(0,0,0,0.3); position: relative;">
            <div style="width: 6px; height: 6px; background: #f472b6; border-radius: 50%; position: absolute; top: -3px;"></div>
            <span style="font-size: 11px; font-weight: 900; color: #022c22; opacity: 0.7;">\${i + 1}</span>
          </div>
        \`;
        padsTrack.appendChild(pad);
      }
    }

    function moveFrog(stepIndex, animate = true) {
      const totalQ = currentQuiz.questions.length;
      let targetRight = 5; // Start shore
      if (stepIndex >= totalQ) {
        targetRight = 88; // Gold finish
      } else if (stepIndex > 0) {
        const padIdx = stepIndex - 1;
        const ratio = totalQ > 1 ? padIdx / (totalQ - 1) : 0.5;
        targetRight = 16 + ratio * (76 - 16);
      }

      frogElem.classList.remove('frog-splash');
      if (animate) {
        frogElem.style.transform = 'translate(50%, -36px) scale(1.15) rotate(-6deg)';
        setTimeout(() => {
          frogElem.style.right = targetRight + '%';
          frogElem.style.transform = 'translate(50%, 0) scale(1)';
        }, 150);
      } else {
        frogElem.style.right = targetRight + '%';
        frogElem.style.transform = 'translate(50%, 0) scale(1)';
      }
    }

    function spawnRipple(rightPct) {
      const r = document.createElement('div');
      r.className = 'water-ripple';
      r.style.width = '60px';
      r.style.height = '24px';
      r.style.right = rightPct + '%';
      r.style.bottom = '30px';
      ripplesContainer.appendChild(r);
      setTimeout(() => r.remove(), 1200);
    }

    function loadQuestion() {
      isAnswered = false;
      feedbackBanner.style.display = 'none';

      if (currentQIdx >= currentQuiz.questions.length) {
        showVictory();
        return;
      }

      const q = currentQuiz.questions[currentQIdx];
      levelBadge.textContent = 'المرحلة ' + (currentQIdx + 1) + ' من ' + currentQuiz.questions.length;
      const pct = Math.round(((currentQIdx) / currentQuiz.questions.length) * 100);
      progressFill.style.width = Math.max(10, pct) + '%';

      questionText.textContent = q.question;
      optionsGrid.innerHTML = '';

      const letters = ['أ', 'ب', 'ج', 'د'];
      q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'glass-card';
        btn.style.padding = '14px 18px';
        btn.style.display = 'flex';
        btn.style.justifyContent = 'space-between';
        btn.style.alignItems = 'center';
        btn.style.textAlign = 'right';
        btn.style.fontWeight = '800';
        btn.style.fontSize = '16px';
        btn.style.color = '#0f172a';

        btn.innerHTML = \`
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="width: 30px; height: 30px; border-radius: 10px; background: #e0f2fe; color: #0369a1; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 13px; border: 1px solid #bae6fd;">
              \${letters[idx] || (idx + 1)}
            </span>
            <span>\${opt}</span>
          </div>
          <span style="font-size: 18px; color: #94a3b8;">○</span>
        \`;

        btn.addEventListener('click', () => handleAnswer(idx, btn));
        optionsGrid.appendChild(btn);
      });
    }

    function handleAnswer(selectedIdx, btn) {
      if (isAnswered) return;
      isAnswered = true;

      const q = currentQuiz.questions[currentQIdx];
      const allBtns = optionsGrid.querySelectorAll('.glass-card');
      allBtns.forEach(b => b.disabled = true);

      if (selectedIdx === q.correct) {
        // Correct
        streak++;
        maxStreak = Math.max(maxStreak, streak);
        correctCount++;
        score += 100 + (streak > 1 ? (streak - 1) * 20 : 0);
        scoreText.textContent = score;

        if (streak >= 2) {
          streakBadge.style.display = 'flex';
          streakCount.textContent = streak + 'x';
        }

        btn.style.background = '#10b981';
        btn.style.color = '#ffffff';
        btn.style.borderColor = '#34d399';
        btn.querySelector('span:last-child').textContent = '✓';
        btn.querySelector('span:last-child').style.color = '#ffffff';

        playSound('correct');
        playSound('jump');

        moveFrog(currentQIdx + 1, true);
        setTimeout(() => spawnRipple(16 + (currentQIdx / (currentQuiz.questions.length - 1 || 1)) * 60), 400);

        showFeedback(true, 'إجابة صحيحة! قفز الضفدع بنجاح! 🐸✨');
      } else {
        // Wrong
        streak = 0;
        streakBadge.style.display = 'none';

        btn.style.background = '#f43f5e';
        btn.style.color = '#ffffff';
        btn.style.borderColor = '#fb7185';
        btn.querySelector('span:last-child').textContent = '✕';
        btn.querySelector('span:last-child').style.color = '#ffffff';

        const correctBtn = allBtns[q.correct];
        if (correctBtn) {
          correctBtn.style.background = '#10b981';
          correctBtn.style.color = '#ffffff';
          correctBtn.style.borderColor = '#34d399';
          correctBtn.querySelector('span:last-child').textContent = '✓';
          correctBtn.querySelector('span:last-child').style.color = '#ffffff';
        }

        playSound('splash');
        frogElem.classList.add('frog-splash');
        spawnRipple(5);

        showFeedback(false, 'إجابة غير صحيحة! الإجابة هي: (' + q.options[q.correct] + ') 💦');
      }
    }

    function showFeedback(isCorrect, msg) {
      feedbackBanner.style.display = 'flex';
      feedbackBanner.style.background = isCorrect ? 'rgba(6, 78, 59, 0.85)' : 'rgba(136, 19, 55, 0.85)';
      feedbackBanner.style.borderColor = isCorrect ? '#34d399' : '#fb7185';
      feedbackBanner.style.color = '#ffffff';
      feedbackIcon.textContent = isCorrect ? '✅' : '❌';
      feedbackText.textContent = msg;
    }

    nextBtn.addEventListener('click', () => {
      currentQIdx++;
      loadQuestion();
    });

    function showVictory() {
      playSound('win');
      moveFrog(currentQuiz.questions.length, true);
      frogCrown.style.display = 'block';
      launchConfetti();

      quizCard.style.display = 'none';
      gameOverPanel.style.display = 'block';

      finalCorrect.textContent = correctCount + ' / ' + currentQuiz.questions.length;
      finalScore.textContent = score;
      finalStreak.textContent = maxStreak + ' 🔥';
    }

    document.getElementById('restart-btn').addEventListener('click', initGame);
    document.getElementById('editor-from-end-btn').addEventListener('click', openEditor);

    /* Editor Modal logic */
    function openEditor() {
      quizTitleInput.value = currentQuiz.title || '';
      quizCatInput.value = currentQuiz.category || '';

      const lines = currentQuiz.questions.map(q => {
        return q.question + ' | ' + q.options.join(' | ') + ' | ' + (q.correct + 1);
      });
      pipeTextarea.value = lines.join('\\n');
      editorModal.style.display = 'flex';
    }

    function closeEditor() {
      editorModal.style.display = 'none';
    }

    openEditorBtn.addEventListener('click', openEditor);
    closeEditorBtn.addEventListener('click', closeEditor);

    saveQuizBtn.addEventListener('click', () => {
      const text = pipeTextarea.value.trim();
      if (!text) {
        alert('يرجى كتابة سؤال واحد على الأقل!');
        return;
      }
      const lines = text.split('\\n');
      const parsed = [];
      lines.forEach(line => {
        line = line.trim();
        if (!line) return;
        const p = line.split('|').map(s => s.trim());
        if (p.length >= 4) {
          const qText = p[0];
          const opts = p.slice(1, p.length - 1);
          let correctNum = parseInt(p[p.length - 1], 10) - 1;
          if (isNaN(correctNum) || correctNum < 0 || correctNum >= opts.length) correctNum = 0;
          parsed.push({
            question: qText,
            options: opts,
            correct: correctNum
          });
        }
      });

      if (parsed.length === 0) {
        alert('صيغة الأسئلة غير صحيحة! استخدم الشارطة | بين السؤال والخيارات والإجابة.');
        return;
      }

      currentQuiz = {
        title: quizTitleInput.value.trim() || 'اختبار مخصص',
        category: quizCatInput.value.trim() || 'عام',
        questions: parsed
      };

      localStorage.setItem('froggy_standalone_quiz', JSON.stringify(currentQuiz));
      closeEditor();
      initGame();
    });

    resetDefaultBtn.addEventListener('click', () => {
      if (confirm('هل تريد استعادة الأسئلة الافتراضية؟')) {
        currentQuiz = JSON.parse(JSON.stringify(initialQuizData));
        localStorage.removeItem('froggy_standalone_quiz');
        openEditor();
      }
    });

    // Download standalone HTML file with current edited questions baked into it
    downloadCurrentHtmlBtn.addEventListener('click', () => {
      const currentDocHtml = document.documentElement.outerHTML;
      // Bake the currently edited quiz into the exported HTML
      const updatedQuizJson = JSON.stringify(currentQuiz).replace(/</g, '\\\\u003c').replace(/>/g, '\\\\u003e');
      const exportedHtml = currentDocHtml.replace(/const initialQuizData = [^;]+;/, 'const initialQuizData = ' + updatedQuizJson + ';');

      const blob = new Blob([exportedHtml], { type: 'text/html;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = (currentQuiz.title.replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '_') || 'froggy_jumps') + '.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    });

    // Keyboard shortcuts
    window.addEventListener('keydown', (e) => {
      if (editorModal.style.display === 'flex') return;
      if (!isAnswered && (e.key === '1' || e.key === '2' || e.key === '3' || e.key === '4')) {
        const idx = parseInt(e.key) - 1;
        const btns = optionsGrid.querySelectorAll('.glass-card');
        if (btns[idx]) btns[idx].click();
      } else if (isAnswered && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        nextBtn.click();
      }
    });

    window.onload = initGame;
  </script>
</body>
</html>`;
}
