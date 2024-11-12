import { createClient } from "@/utils/supabase/client";

export const 서강대학교 = async (userId, selection) => {
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
    science2,
  } = data;

  // Define the advanced science subjects for the bonus
  const advancedSubjects = ['물리학Ⅱ', '화학Ⅱ', '생명과학Ⅱ', '지구과학Ⅱ'];
  let bonus = 0;

  // Add 0.5 points if one of the science subjects is an advanced subject
  if (advancedSubjects.includes(science1) || advancedSubjects.includes(science2)) {
    bonus = 0.5;
  }

  // Calculate base score
  const baseScore = (
    Number(standard_score_korean) * 1.1 +
    Number(standard_score_math) * 1.3 +
    (Number(standard_score_science1) + Number(standard_score_science2) + bonus) * 0.6 +
    getEnglishScore(grade_english) +
    getHistoryBonus(grade_history)
  );

  return baseScore.toFixed(1);
};

// Helper function for calculating the English score
const getEnglishScore = (grade) => {
  const englishScores = {
    1: 100, 2: 99, 3: 98, 4: 97, 5: 96,
    6: 95, 7: 94, 8: 93, 9: 92
  };
  return englishScores[grade] || 0;
};

// Helper function for calculating the History bonus
const getHistoryBonus = (grade) => {
  const historyScores = {
    1: 10, 2: 10, 3: 10, 4: 10, 5: 9.5,
    6: 9.0, 7: 8.5, 8: 8.0, 9: 7.5
  };
  return historyScores[grade] || 0;
};