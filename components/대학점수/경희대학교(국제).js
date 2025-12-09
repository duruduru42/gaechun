import { createClient } from "@/utils/supabase/client";

const humanitiesSubjects = [
  '생활과 윤리', '윤리와 사상', '한국지리', '세계지리',
  '동아시아사', '세계사', '경제', '정치와 법', '사회·문화'
];

const naturalScienceSubjects = [
  '물리학Ⅰ', '물리학Ⅱ', '화학Ⅰ', '화학Ⅱ',
  '지구과학Ⅰ', '지구과학Ⅱ', '생명과학Ⅰ', '생명과학Ⅱ'
];

export const 경희대학교국제 = async (userId, selection) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('exam_results')
    .select('standard_score_korean, standard_score_math, percentile_science1, percentile_science2, grade_english, grade_history, science1, science2')
    .eq('user_id', userId)
    .single();

  if (error || !data) return '불가';

  const {
    standard_score_korean,
    standard_score_math,
    percentile_science1,
    percentile_science2,
    grade_english,
    grade_history,
    science1,
    science2
  } = data;

  const englishScore = getEnglishScore(grade_english);
  const historyPenalty = getHistoryPenalty(grade_history);

  // Calculate the converted scores for the science subjects based on the subject type
  const scienceScore1 = getConvertedScore(percentile_science1, isNaturalScience(science1) ? '자연' : '인문');
  const scienceScore2 = getConvertedScore(percentile_science2, isNaturalScience(science2) ? '자연' : '인문');

  // Apply additional points for specific subject

  let scienceBonus2 = 0;
  if (isNaturalScience(science1)) scienceBonus2 += 4;
  if (isNaturalScience(science2)) scienceBonus2 += 4;

  let baseScore = 0;

  if (selection.계열 === '인문') {
    baseScore = (standard_score_korean * 0.4 + standard_score_math * 0.25 + (scienceScore1 + scienceScore2 ) * 0.35 ) * 3;
  } else if (selection.계열 === '사회') {
    baseScore = (standard_score_korean * 0.35 + standard_score_math * 0.35 + (scienceScore1 + scienceScore2) * 0.3 ) * 3;
  } else if (selection.계열 === '자연') {
    baseScore = (standard_score_korean * 0.25 + standard_score_math * 0.40 + (scienceScore1 + scienceScore2 + scienceBonus2) * 0.35 ) * 3;
  } else if (selection.계열 === '예술') {
    const higherScienceScore = Math.max(scienceScore1, scienceScore2);
    baseScore = (standard_score_korean * 0.6 + higherScienceScore * 0.4) * 3/2;
  } else if (selection.계열 === '자유') {
      baseScore = (standard_score_korean * 0.25 + standard_score_math * 0.4 + (scienceScore1 + scienceScore2 ) * 0.35 ) * 3;
  } else {
    return '불가';
  }
  baseScore += englishScore || 0;
  baseScore += historyPenalty || 0;

  return baseScore.toFixed(1);
};

const getConvertedScore = (percentile, subjectType) => {
  const conversionTable = {
    자연: {
      100: 70.00, 99: 69.08, 98: 68.10, 97: 67.36, 96: 66.69, 95: 66.05,
      94: 65.51, 93: 65.07, 92: 64.54, 91: 64.18, 90: 63.82, 89: 63.43,
      88: 63.10, 87: 62.74, 86: 62.40, 85: 62.06, 84: 61.70, 83: 61.34,
      82: 61.00, 81: 60.64, 80: 60.30, 79: 59.94, 78: 59.57, 77: 59.19,
      76: 58.85, 75: 58.50, 74: 58.18, 73: 57.77, 72: 57.39, 71: 57.07,
      70: 56.75, 69: 56.41, 68: 56.01, 67: 55.61, 66: 55.25, 65: 54.89,
      64: 54.53, 63: 54.15, 62: 53.77, 61: 53.37, 60: 53.00, 59: 52.66,
      58: 52.33, 57: 51.96, 56: 51.61, 55: 51.22, 54: 50.80, 53: 50.41,
      52: 50.08, 51: 49.70, 50: 49.35, 49: 49.01, 48: 48.66, 47: 48.29,
      46: 47.87, 45: 47.51, 44: 47.14, 43: 46.81, 42: 46.47, 41: 46.13,
      40: 45.82, 39: 45.54, 38: 45.24, 37: 44.93, 36: 44.62, 35: 44.32,
      34: 44.02, 33: 43.73, 32: 43.44, 31: 43.16, 30: 42.87, 29: 42.56,
      28: 42.27, 27: 41.99, 26: 41.70, 25: 41.41, 24: 41.12, 23: 40.83,
      22: 40.57, 21: 40.30, 20: 40.04, 19: 39.80, 18: 39.54, 17: 39.27,
      16: 38.98, 15: 38.69, 14: 38.42, 13: 38.15, 12: 37.87, 11: 37.58,
      10: 37.23, 9: 36.90, 8: 36.53, 7: 36.15, 6: 35.74, 5: 35.32,
      4: 34.93, 3: 34.42, 2: 33.76, 1: 32.59, 0: 30.71
    },
    인문: {
      100: 70.00, 99: 69.08, 98: 68.10, 97: 67.36, 96: 66.69, 95: 66.05,
      94: 65.51, 93: 65.07, 92: 64.54, 91: 64.18, 90: 63.82, 89: 63.43,
      88: 63.10, 87: 62.74, 86: 62.40, 85: 62.06, 84: 61.70, 83: 61.34,
      82: 61.00, 81: 60.64, 80: 60.30, 79: 59.94, 78: 59.57, 77: 59.19,
      76: 58.85, 75: 58.50, 74: 58.18, 73: 57.77, 72: 57.39, 71: 57.07,
      70: 56.75, 69: 56.41, 68: 56.01, 67: 55.61, 66: 55.25, 65: 54.89,
      64: 54.53, 63: 54.15, 62: 53.77, 61: 53.37, 60: 53.00, 59: 52.66,
      58: 52.33, 57: 51.96, 56: 51.61, 55: 51.22, 54: 50.80, 53: 50.41,
      52: 50.08, 51: 49.70, 50: 49.35, 49: 49.01, 48: 48.66, 47: 48.29,
      46: 47.87, 45: 47.51, 44: 47.14, 43: 46.81, 42: 46.47, 41: 46.13,
      40: 45.82, 39: 45.54, 38: 45.24, 37: 44.93, 36: 44.62, 35: 44.32,
      34: 44.02, 33: 43.73, 32: 43.44, 31: 43.16, 30: 42.87, 29: 42.56,
      28: 42.27, 27: 41.99, 26: 41.70, 25: 41.41, 24: 41.12, 23: 40.83,
      22: 40.57, 21: 40.30, 20: 40.04, 19: 39.80, 18: 39.54, 17: 39.27,
      16: 38.98, 15: 38.69, 14: 38.42, 13: 38.15, 12: 37.87, 11: 37.58,
      10: 37.23, 9: 36.90, 8: 36.53, 7: 36.15, 6: 35.74, 5: 35.32,
      4: 34.93, 3: 34.42, 2: 33.76, 1: 32.59, 0: 30.71
    }
  };
  return conversionTable[subjectType][percentile] || 0;
};

const isNaturalScience = (subject) => naturalScienceSubjects.includes(subject);

const getEnglishScore = (grade) => {
  const englishScores = {
    1: 0, 2: 0, 3: -2, 4: -4, 5: -8,
    6: -12, 7: -18, 8: -24, 9: -30
  };
  return englishScores[grade] || 0;
};

const getHistoryPenalty = (grade) => {
  const historyPenalties = {
    1: 0, 2: 0, 3: 0, 4: 0, 5: -2,
    6: -4, 7: -8, 8: -14, 9: -20
  };
  return historyPenalties[grade] || 0;
};
