import { createClient } from "@/utils/supabase/client";

// 탐구 변환점수 테이블
const conversionTable = {
    자연: {
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
      4: 34.93, 3: 34.42, 2: 33.76, 1: 32.58, 0: 30.70
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
      4: 34.93, 3: 34.42, 2: 33.76, 1: 32.58, 0: 30.70
    }
  };

  const naturalScienceSubjects = [
    '물리학Ⅰ', '물리학Ⅱ', '화학Ⅰ', '화학Ⅱ',
    '생명과학Ⅰ', '생명과학Ⅱ', '지구과학Ⅰ', '지구과학Ⅱ'
  ];
  
  const getConvertedScore = (percentile, subject) => {
    const track = naturalScienceSubjects.includes(subject) ? '자연' : '인문';
    return conversionTable[track][percentile] || 0;
  };

export const 건국대학교 = async (userId, selection) => {
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

  // 영어 점수 계산
  const englishScore = getEnglishScore(grade_english);

  // 한국사 감점 계산
  const historyPenalty = getHistoryPenalty(grade_history);

 // Calculate science scores
 const scienceScore1 = getConvertedScore(percentile_science1, science1);
 const scienceScore2 = getConvertedScore(percentile_science2, science2);

  // 탐구 과목 점수 계산
  const scienceScore = (scienceScore1 + scienceScore2) * 0.2;

  let totalScore = 0;

  // 계열별 계산
  if (selection.계열 === '인문') {
    totalScore = (standard_score_korean * 0.4 + standard_score_math * 0.3 + scienceScore + englishScore * 0.1) * 5;
  } else if (selection.계열 === '자연') {
    totalScore = (standard_score_korean * 0.3 + standard_score_math * 0.4 + scienceScore + englishScore * 0.1) * 5;
  } else {
    return '불가';
  }

  // 한국사 감점 적용
  totalScore += historyPenalty;

  return totalScore.toFixed(1);
};

// 영어 점수 계산 함수
const getEnglishScore = (grade) => {
  const englishScores = {
    1: 200, 2: 197, 3: 194, 4: 190, 5: 185,
    6: 180, 7: 170, 8: 160, 9: 150
  };
  return englishScores[grade] || 0;
};

// 한국사 감점 계산 함수
const getHistoryPenalty = (grade) => {
  const historyPenalties = {
    1: 0, 2: 0, 3: 0, 4: 0, 5: -1.00,
    6: -1.75, 7: -3.00, 8: -4.25, 9: -5.00
  };
  return historyPenalties[grade] || 0;
};


