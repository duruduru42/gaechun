import { createClient } from "@/utils/supabase/client";

export const 연세대학교 = async (userId, selection) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('exam_results')
    .select('standard_score_korean, standard_score_math, standard_score_science1, standard_score_science2, grade_english, grade_history, science1, science2')
    .eq('user_id', userId)
    .single();

  if (error || !data) return '불가';

  const {
    standard_score_korean,
    standard_score_math,
    standard_score_science1,
    standard_score_science2,
    grade_english,
    grade_history,
    science1,
    science2
  } = data;

  let baseScore;
  let scoreMultiplier;

  // Calculate base score based on the 계열
  if (selection.계열 === '인문') {
    baseScore = (
      Number(standard_score_korean) * 1.5 + 
      Number(standard_score_math) + 
      getEnglishScore(grade_english) + 
      Number(standard_score_science1) + 
      Number(standard_score_science2)
    );
    scoreMultiplier = 1000 / 800;
  } else if (selection.계열 === '자연') {
    baseScore = (
      Number(standard_score_korean) + 
      Number(standard_score_math) * 1.5 + 
      getEnglishScore(grade_english) + 
      (Number(standard_score_science1) + Number(standard_score_science2)) * 1.5
    );
    scoreMultiplier = 1000 / 900;
  } else if (selection.계열 === '생활') {
    baseScore = (
      Number(standard_score_korean) + 
      Number(standard_score_math) + 
      getEnglishScore(grade_english) + 
      (Number(standard_score_science1) + Number(standard_score_science2)) * 0.5
    );
    scoreMultiplier = 1000 / 600;
  } else {
    return '불가';
  }
  

  // Apply bonus points for specific subjects
  if (selection.계열 === '인문' && humanitiesSubjects.includes(science1) || humanitiesSubjects.includes(science2)) {
    baseScore *= 1.03;
  }

  if (selection.계열 === '자연' && naturalScienceSubjects.includes(science1) || naturalScienceSubjects.includes(science2)) {
    baseScore *= 1.03;
  }

  // Calculate final score with history penalty
  const finalScore = baseScore * scoreMultiplier - getHistoryPenalty(grade_history);

  return finalScore.toFixed(1);
};

const getEnglishScore = (grade) => {
  const englishScores = {
    1: 100,
    2: 95,
    3: 87.5,
    4: 75,
    5: 60,
    6: 40,
    7: 25,
    8: 12.5,
    9: 5
  };
  return englishScores[grade] || 0;
};

const getHistoryPenalty = (grade) => {
  const historyPenalties = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0.2,
    6: 0.4,
    7: 0.6,
    8: 0.8,
    9: 1
  };
  return historyPenalties[grade] || 0;
};

// Define lists of subjects that qualify for bonus points
const humanitiesSubjects = [
  '생활과 윤리', '윤리와 사상', '한국지리', '세계지리', 
  '동아시아사', '세계사', '경제', '정치와 법', '사회·문화'
];

const naturalScienceSubjects = [
  '물리학Ⅰ', '물리학Ⅱ', '화학Ⅰ', '화학Ⅱ',
  '지구과학Ⅰ', '지구과학Ⅱ', '생명과학Ⅰ', '생명과학Ⅱ'
];