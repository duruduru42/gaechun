import { createClient } from "@/utils/supabase/client";

const naturalScienceSubjects = [
  '물리학Ⅰ', '물리학Ⅱ', '화학Ⅰ', '화학Ⅱ',
  '생명과학Ⅰ', '생명과학Ⅱ', '지구과학Ⅰ', '지구과학Ⅱ'
];

const conversionTable = {
  자연: {
    100: 70.12, 99: 69.37, 98: 68.54, 97: 67.77, 96: 66.96, 95: 66.25,
    94: 65.65, 93: 65.17, 92: 64.7, 91: 64.33, 90: 63.97, 89: 63.48,
    88: 63.11, 87: 62.69, 86: 62.32, 85: 61.96, 84: 61.59, 83: 61.22,
    82: 60.89, 81: 60.47, 80: 60.13, 79: 59.77, 78: 59.38, 77: 58.97,
    76: 58.63, 75: 58.22, 74: 57.9, 73: 57.53, 72: 57.25, 71: 56.95,
    70: 56.65, 69: 56.32, 68: 55.9, 67: 55.46, 66: 55.08, 65: 54.72,
    64: 54.37, 63: 53.96, 62: 53.54, 61: 53.07, 60: 52.71, 59: 52.38,
    58: 52.08, 57: 51.77, 56: 51.44, 55: 51.02, 54: 50.6, 53: 50.22,
    52: 49.91, 51: 49.61, 50: 49.29, 49: 48.95, 48: 48.6, 47: 48.27,
    46: 47.88, 45: 47.51, 44: 47.12, 43: 46.82, 42: 46.51, 41: 46.18,
    40: 45.86, 39: 45.59, 38: 45.31, 37: 45.02, 36: 44.68, 35: 44.37,
    34: 44.07, 33: 43.78, 32: 43.51, 31: 43.23, 30: 42.97, 29: 42.65,
    28: 42.32, 27: 42.05, 26: 41.78, 25: 41.5, 24: 41.2, 23: 40.92,
    22: 40.68, 21: 40.43, 20: 40.2, 19: 39.96, 18: 39.68, 17: 39.41,
    16: 39.12, 15: 38.83, 14: 38.54, 13: 38.25, 12: 37.96, 11: 37.65,
    10: 37.34, 9: 36.97, 8: 36.6, 7: 36.2, 6: 35.77, 5: 35.39,
    4: 35.04, 3: 34.47, 2: 33.75, 1: 32.37, 0: 30.62,
  },
  인문: {
    100: 70.00, 99: 69.07, 98: 68.09, 97: 67.36, 96: 66.69, 95: 66.04,
    94: 65.51, 93: 65.06, 92: 64.53, 91: 64.17, 90: 63.82, 89: 63.43,
    88: 63.09, 87: 62.73, 86: 62.39, 85: 62.05, 84: 61.70, 83: 61.34,
    82: 61.00, 81: 60.63, 80: 60.29, 79: 59.94, 78: 59.56, 77: 59.19,
    76: 58.85, 75: 58.49, 74: 58.18, 73: 57.77, 72: 57.39, 71: 57.06,
    70: 56.74, 69: 56.40, 68: 56.01, 67: 55.61, 66: 55.24, 65: 54.89,
    64: 54.52, 63: 54.15, 62: 53.77, 61: 53.36, 60: 52.99, 59: 52.66,
    58: 52.33, 57: 51.96, 56: 51.61, 55: 51.21, 54: 50.80, 53: 50.41,
    52: 50.07, 51: 49.69, 50: 49.35, 49: 49.00, 48: 48.65, 47: 48.29,
    46: 47.86, 45: 47.50, 44: 47.13, 43: 46.80, 42: 46.46, 41: 46.13,
    40: 45.81, 39: 45.53, 38: 45.23, 37: 44.93, 36: 44.62, 35: 44.31,
    34: 44.02, 33: 43.73, 32: 43.44, 31: 43.15, 30: 42.86, 29: 42.56,
    28: 42.27, 27: 41.98, 26: 41.70, 25: 41.41, 24: 41.11, 23: 40.83,
    22: 40.56, 21: 40.29, 20: 40.04, 19: 39.79, 18: 39.53, 17: 39.26,
    16: 38.97, 15: 38.69, 14: 38.42, 13: 38.15, 12: 37.87, 11: 37.57,
    10: 37.23, 9: 36.89, 8: 36.52, 7: 36.15, 6: 35.73, 5: 35.32,
    4: 34.93, 3: 34.42, 2: 33.76, 1: 32.58, 0: 30.82,
  }
};

// Helper function to get the converted score
const getConvertedScore = (percentile, subject) => {
  const track = naturalScienceSubjects.includes(subject) ? '자연' : '인문';
  return conversionTable[track][percentile] || 0;
};

// 고려대학교(세종) 점수 계산 함수
export const 고려대학교 = async (userId, selection) => {
  const supabase = createClient();

  // 사용자 시험 데이터 불러오기
  const { data, error } = await supabase
    .from('exam_results')
    .select('standard_score_korean, standard_score_math, percentile_science1, percentile_science2, grade_english, grade_history, science1, science2, math')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return '불가'; // 데이터가 없거나 에러일 경우 처리
  }

  const {
    standard_score_korean,
    standard_score_math,
    percentile_science1,
    percentile_science2,
    grade_english,
    grade_history,
    science1,
    science2,
  } = data;

  // 탐구 과목 변환 점수 계산
  let convertedScienceScore1 = getConvertedScore(percentile_science1, science1);
  let convertedScienceScore2 = getConvertedScore(percentile_science2, science2);

  // ✅ 자연 계열일 때, 자연탐구 과목에 각각 3% 가산점
  if (selection.계열 === '자연') {
    if (naturalScienceSubjects.includes(science1)) {
      convertedScienceScore1 *= 1.03;
    }
    if (naturalScienceSubjects.includes(science2)) {
      convertedScienceScore2 *= 1.03;
    }
  }

  const totalScienceConvertedScore = convertedScienceScore1 + convertedScienceScore2;

  let score = 0;

  if (selection.계열 === '인문') {
    score =
      ((Number(standard_score_korean) +
        Number(standard_score_math) +
        Number(totalScienceConvertedScore) * 0.8) /
        560) *
      1000;
  } else if (selection.계열 === '자연') {
    score =
      ((Number(standard_score_korean) +
        Number(standard_score_math) * 1.2 +
        Number(totalScienceConvertedScore)) /
        640) *
      1000;
  } else {
    return '불가'; // 잘못된 계열 값일 경우
  }

  const englishPenalty = {
    1: 0, 2: 3, 3: 6, 4: 9, 5: 12,
    6: 15, 7: 18, 8: 21, 9: 24
  };
  score -= englishPenalty[grade_english] || 0;

  // Add points for History grade
  const historyBonus = {
    1: 10, 2: 10, 3: 10, 4: 10, 5: 9.8,
    6: 9.6, 7: 9.4, 8: 9.2, 9: 8
  };
  score += historyBonus[grade_history] || 0;

  return parseFloat(score.toFixed(2));
};
