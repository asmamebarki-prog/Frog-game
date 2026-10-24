export interface QuestionItem {
  id?: string;
  question: string;
  options: string[];
  correct: number; // 0-indexed
  explanation?: string;
}

export interface QuizData {
  id?: string;
  title: string;
  category: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  questions: QuestionItem[];
}

export interface QuizPreset {
  id: string;
  name: string;
  category: string;
  description: string;
  data: QuizData;
}

export const DEFAULT_QUIZ: QuizData = {
  title: "تحدي Froggy Jump - الصف العاشر",
  category: "أسئلة علمية وعامة",
  questions: [
    {
      question: "What is 2 + 2?",
      options: ["3", "4", "5"],
      correct: 1,
      explanation: "2 + 2 = 4 بعملية جمع بسيطة"
    },
    {
      question: "ما هي القوة التي تجذب الأجسام نحو مركز الأرض؟",
      options: ["القوة المغناطيسية", "قوة الجاذبية الأرضية", "قوة الاحتكاك"],
      correct: 1,
      explanation: "الجاذبية الأرضية هي القوة الفيزيائية التي تجذب الكتل نحو مركز الأرض"
    },
    {
      question: "أي العضيات التالية تُعرف بمصنع الطاقة في الخلية؟",
      options: ["النواة", "المايتوكندريا", "جهاز جولجي"],
      correct: 1,
      explanation: "الميتوكوندريا تقوم بإنتاج جزيئات ATP لتوفير طاقة الخلية"
    },
    {
      question: "حل المعادلة التالية: 2x + 6 = 14 يُعطي قيمة x تساوي:",
      options: ["x = 3", "x = 5", "x = 4"],
      correct: 2,
      explanation: "2x = 14 - 6 = 8 وبالتالي x = 8 / 2 = 4"
    },
    {
      question: "ما هو الرمز الكيميائي لعنصر الصوديوم؟",
      options: ["Na", "So", "K"],
      correct: 0,
      explanation: "Na مشتق من الكلمة اللاتينية Natrium"
    },
    {
      question: "ما هو أسرع طائر في العالم عند الانقضاض؟",
      options: ["النسر الذهبي", "صقر الشاهين", "العقاب"],
      correct: 1,
      explanation: "صقر الشاهين تصل سرعته عند الانقضاض لأكثر من 320 كم/ساعة"
    }
  ]
};

export const QUIZ_PRESETS: QuizPreset[] = [
  {
    id: "science_grade10",
    name: "علوم وفيزياء (الصف العاشر)",
    category: "علوم طبيعية",
    description: "أسئلة في الفيزياء والكيمياء والأحياء",
    data: {
      title: "مسابقة العلوم والفيزياء",
      category: "الصف العاشر",
      questions: [
        {
          question: "ما هي وحدة قياس القوة في النظام الدولي؟",
          options: ["الجول", "النيوتن", "الواط"],
          correct: 1,
          explanation: "النيوتن (N) هي وحدة قياس القوة في النظام الدولي للوحدات"
        },
        {
          question: "ما هو الغاز الأكثر وفرة في الغلاف الجوي للأرض؟",
          options: ["الأكسجين", "النيتروجين", "ثاني أكسيد الكربون"],
          correct: 1,
          explanation: "النيتروجين يشكل حوالي 78% من الغلاف الجوي للأرض"
        },
        {
          question: "أي الكواكب التالية يُطلق عليه الكوكب الأحمر؟",
          options: ["المريخ", "المشتري", "الزهرة"],
          correct: 0,
          explanation: "يسمى المريخ بالكوكب الأحمر بسبب وفرة أكسيد الحديد على سطحه"
        },
        {
          question: "ما هي الصيغة الكيميائية للماء؟",
          options: ["CO2", "H2O", "NaCl"],
          correct: 1,
          explanation: "H2O يتكون من ذرتي هيدروجين وذرة أكسجين"
        },
        {
          question: "ما هي سرعة الضوء في الفراغ تقريبياً؟",
          options: ["300,000 كم/ثانية", "150,000 كم/ثانية", "500,000 كم/ثانية"],
          correct: 0,
          explanation: "تبلغ سرعة الضوء في الفراغ حوالي 300 ألف كيلومتر في الثانية"
        }
      ]
    }
  },
  {
    id: "math_algebra",
    name: "رياضيات وحساب ذهني",
    category: "رياضيات",
    description: "معادلات جبرية وأسئلة حسابية ممتعة",
    data: {
      title: "تحدي عباقرة الرياضيات",
      category: "حساب ذهني وجبر",
      questions: [
        {
          question: "ما هو الجذر التربيعي للعدد 144؟",
          options: ["11", "12", "14"],
          correct: 1,
          explanation: "12 × 12 = 144"
        },
        {
          question: "إذا كان 3x - 5 = 16 فإن قيمة x هي:",
          options: ["6", "7", "8"],
          correct: 1,
          explanation: "3x = 21 إذن x = 7"
        },
        {
          question: "ما هو قياس زوايا المثلث المتساوي الأضلاع؟",
          options: ["45 درجة", "60 درجة", "90 درجة"],
          correct: 1,
          explanation: "مجموع زوايا المثلث 180 درجة، 180 ÷ 3 = 60 درجة لكل زاوية"
        },
        {
          question: "ما هي النسبة المئوية للكسر 3/4؟",
          options: ["60%", "75%", "80%"],
          correct: 1,
          explanation: "3/4 تعادل 75%"
        },
        {
          question: "ما هو ناتج: 7 × 8؟",
          options: ["54", "56", "58"],
          correct: 1,
          explanation: "7 × 8 = 56"
        }
      ]
    }
  },
  {
    id: "arabic_language",
    name: "لغة عربية ونحو وبلاغة",
    category: "لغة عربية",
    description: "أسئلة الإعراب والمفردات والبلاغة",
    data: {
      title: "كنوز لغة الضاد",
      category: "نحو ولغة",
      questions: [
        {
          question: "ما إعراب كلمة 'العلمُ' في جملة: 'العلمُ نورٌ'؟",
          options: ["خبر مرفوع", "مبتدأ مرفوع", "فاعل مرفوع"],
          correct: 1,
          explanation: "العلمُ: مبتدأ مرفوع وعلامة رفعه الضمة الظاهرة"
        },
        {
          question: "ما جمع كلمة 'حكيم'؟",
          options: ["حُكماء", "حُكّام", "محاكم"],
          correct: 0,
          explanation: "جمع حكيم هو حُكماء"
        },
        {
          question: "ما هو الفعل المضارع من 'قال'؟",
          options: ["يقولُ", "قُل", "قائل"],
          correct: 0,
          explanation: "يقولُ هو صيغة المضارع من قال"
        },
        {
          question: "أي من الحروف التالية يُعد من حروف الجر؟",
          options: ["إلى", "ثم", "أو"],
          correct: 0,
          explanation: "'إلى' من حروف الجر، بينما 'ثم' و'أو' من حروف العطف"
        }
      ]
    }
  },
  {
    id: "english_grammar",
    name: "English Challenge",
    category: "English",
    description: "Grammar, vocabulary, and expressions",
    data: {
      title: "English Froggy Jump Challenge",
      category: "Grammar & Vocab",
      questions: [
        {
          question: "Choose the correct past tense: 'Yesterday, she ___ a book.'",
          options: ["reads", "read", "reading"],
          correct: 1,
          explanation: "The past tense of read is spelled 'read' (pronounced red)"
        },
        {
          question: "Which word is an adjective in: 'The happy frog jumped high'?",
          options: ["frog", "happy", "jumped"],
          correct: 1,
          explanation: "'happy' describes the noun frog, so it's an adjective"
        },
        {
          question: "What is the opposite of 'Ancient'?",
          options: ["Old", "Modern", "Historic"],
          correct: 1,
          explanation: "Modern is the direct antonym of ancient"
        },
        {
          question: "Select the correct plural form of 'Child':",
          options: ["Childs", "Children", "Childrens"],
          correct: 1,
          explanation: "The irregular plural form of child is children"
        }
      ]
    }
  }
];

export function parsePipeFormat(rawText: string): QuestionItem[] {
  const lines = rawText.split('\n');
  const questions: QuestionItem[] = [];

  for (let line of lines) {
    line = line.trim();
    if (!line || line.startsWith('#') || line.startsWith('//')) continue;

    const parts = line.split('|').map(p => p.trim());
    if (parts.length >= 4) {
      const question = parts[0];
      // Options can be 2, 3, or 4 options before the last correct index
      // If 5 parts: [q, opt1, opt2, opt3, correct]
      // If 4 parts: [q, opt1, opt2, correct]
      const lastPart = parts[parts.length - 1];
      let correctIdx = parseInt(lastPart, 10) - 1; // 1-based to 0-based
      
      const options = parts.slice(1, parts.length - 1);

      if (isNaN(correctIdx) || correctIdx < 0 || correctIdx >= options.length) {
        correctIdx = 0;
      }

      questions.push({
        id: `q_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        question,
        options,
        correct: correctIdx
      });
    }
  }

  return questions;
}

export function formatToPipeString(questions: QuestionItem[]): string {
  return questions.map(q => {
    const opts = q.options.join(' | ');
    const correctNum = q.correct + 1; // 1-based for human editing
    return `${q.question} | ${opts} | ${correctNum}`;
  }).join('\n');
}
