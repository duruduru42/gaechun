import { createClient } from "@/utils/supabase/client";

const humanitiesSubjects = [
  '생활과 윤리', '윤리와 사상', '한국지리', '세계지리',
  '동아시아사', '세계사', '경제', '정치와 법', '사회·문화'
];

const naturalScienceSubjects = [
  '물리학Ⅰ', '물리학Ⅱ', '화학Ⅰ', '화학Ⅱ',
  '지구과학Ⅰ', '지구과학Ⅱ', '생명과학Ⅰ', '생명과학Ⅱ'
];

export const 경희대학교 = async (userId, selection, isAdmin = false) => {
  const supabase = createClient();

  // isAdmin 여부에 따라 테이블과 ID 컬럼 결정
  const tableName = isAdmin ? 'admin_managed_students' : 'exam_results';
  const idColumn = isAdmin ? 'id' : 'user_id';

  const { data, error } = await supabase
    .from(tableName)
    .select('standard_score_korean, standard_score_math, percentile_science1, percentile_science2, grade_english, grade_history, science1, science2')
    .eq(idColumn, userId)
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
    baseScore = (standard_score_korean * 0.6 + (higherScienceScore+100) * 0.4) * 3;
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
      100: 70.12, 99: 69.18, 98: 68.09, 97: 67.36, 96: 66.76, 95: 66.16, 94: 65.66, 93: 65.19, 92: 64.74, 91: 64.35, 90: 63.97, 89: 63.57, 88: 63.19, 87: 62.79, 86: 62.44, 85: 62.08, 84: 61.73, 83: 61.38, 82: 61.05, 81: 60.72, 80: 60.36, 79: 60.00, 78: 59.65, 77: 59.30, 76: 58.97, 75: 58.62, 74: 58.22, 73: 57.86, 72: 57.50, 71: 57.16, 70: 56.81, 69: 56.46, 68: 56.12, 67: 55.75, 66: 55.43, 65: 55.06, 64: 54.67, 63: 54.30, 62: 53.92, 61: 53.53, 60: 53.13, 59: 52.72, 58: 52.31, 57: 51.93, 56: 51.57, 55: 51.21, 54: 50.80, 53: 50.44, 52: 50.07, 51: 49.68, 50: 49.26, 49: 48.88, 48: 48.50, 47: 48.15, 46: 47.79, 45: 47.47, 44: 47.15, 43: 46.76, 42: 46.39, 41: 46.03, 40: 45.68, 39: 45.35, 38: 44.99, 37: 44.65, 36: 44.35, 35: 44.07, 34: 43.78, 33: 43.47, 32: 43.21, 31: 42.96, 30: 42.71, 29: 42.47, 28: 42.24, 27: 41.99, 26: 41.71, 25: 41.42, 24: 41.13, 23: 40.85, 22: 40.58, 21: 40.31, 20: 40.05, 19: 39.78, 18: 39.52, 17: 39.24, 16: 38.96, 15: 38.68, 14: 38.41, 13: 38.14, 12: 37.87, 11: 37.61, 10: 37.32, 9: 37.05, 8: 36.73, 7: 36.32, 6: 35.91, 5: 35.47, 4: 34.99, 3: 34.43, 2: 33.71, 1: 32.82, 0: 31.12
    },
    인문: {
      100: 70.12, 99: 69.18, 98: 68.09, 97: 67.36, 96: 66.76, 95: 66.16, 94: 65.66, 93: 65.19, 92: 64.74, 91: 64.35, 90: 63.97, 89: 63.57, 88: 63.19, 87: 62.79, 86: 62.44, 85: 62.08, 84: 61.73, 83: 61.38, 82: 61.05, 81: 60.72, 80: 60.36, 79: 60.00, 78: 59.65, 77: 59.30, 76: 58.97, 75: 58.62, 74: 58.22, 73: 57.86, 72: 57.50, 71: 57.16, 70: 56.81, 69: 56.46, 68: 56.12, 67: 55.75, 66: 55.43, 65: 55.06, 64: 54.67, 63: 54.30, 62: 53.92, 61: 53.53, 60: 53.13, 59: 52.72, 58: 52.31, 57: 51.93, 56: 51.57, 55: 51.21, 54: 50.80, 53: 50.44, 52: 50.07, 51: 49.68, 50: 49.26, 49: 48.88, 48: 48.50, 47: 48.15, 46: 47.79, 45: 47.47, 44: 47.15, 43: 46.76, 42: 46.39, 41: 46.03, 40: 45.68, 39: 45.35, 38: 44.99, 37: 44.65, 36: 44.35, 35: 44.07, 34: 43.78, 33: 43.47, 32: 43.21, 31: 42.96, 30: 42.71, 29: 42.47, 28: 42.24, 27: 41.99, 26: 41.71, 25: 41.42, 24: 41.13, 23: 40.85, 22: 40.58, 21: 40.31, 20: 40.05, 19: 39.78, 18: 39.52, 17: 39.24, 16: 38.96, 15: 38.68, 14: 38.41, 13: 38.14, 12: 37.87, 11: 37.61, 10: 37.32, 9: 37.05, 8: 36.73, 7: 36.32, 6: 35.91, 5: 35.47, 4: 34.99, 3: 34.43, 2: 33.71, 1: 32.82, 0: 31.12
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
