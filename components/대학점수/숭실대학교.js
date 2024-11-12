import { createClient } from "@/utils/supabase/client";

// 과학탐구 과목 리스트
const naturalScienceSubjects = [
  '물리학Ⅰ', '물리학Ⅱ', '화학Ⅰ', '화학Ⅱ',
  '생명과학Ⅰ', '생명과학Ⅱ', '지구과학Ⅰ', '지구과학Ⅱ'
];

const conversionTable = {
    자연: {
      100: 68.85, 99: 68.80, 98: 67.46, 97: 66.62, 96: 66.10, 95: 65.43,
      94: 64.85, 93: 64.34, 92: 63.94, 91: 63.49, 90: 63.15, 89: 62.83,
      88: 62.52, 87: 62.22, 86: 61.92, 85: 61.52, 84: 61.11, 83: 60.68,
      82: 60.28, 81: 59.99, 80: 59.69, 79: 59.38, 78: 59.08, 77: 58.79,
      76: 58.49, 75: 58.19, 74: 57.81, 73: 57.43, 72: 57.16, 71: 56.89,
      70: 56.62, 69: 56.32, 68: 56.00, 67: 55.67, 66: 55.33, 65: 55.00,
      64: 54.67, 63: 54.37, 62: 54.11, 61: 53.85, 60: 53.59, 59: 53.34,
      58: 53.09, 57: 52.84, 56: 52.60, 55: 52.26, 54: 51.90, 53: 51.60,
      52: 51.23, 51: 50.85, 50: 50.46, 49: 50.07, 48: 49.77, 47: 49.42,
      46: 49.08, 45: 48.75, 44: 48.40, 43: 48.07, 42: 47.75, 41: 47.37,
      40: 46.94, 39: 46.57, 38: 46.21, 37: 45.84, 36: 45.41, 35: 45.01,
      34: 44.67, 33: 44.33, 32: 44.02, 31: 43.70, 30: 43.38, 29: 43.11,
      28: 42.77, 27: 42.40, 26: 42.08, 25: 41.75, 24: 41.42, 23: 41.09,
      22: 40.70, 21: 40.33, 20: 39.99, 19: 39.64, 18: 39.31, 17: 38.98,
      16: 38.56, 15: 38.14, 14: 37.71, 13: 37.29, 12: 36.93, 11: 36.57,
      10: 36.23, 9: 35.89, 8: 35.55, 7: 35.16, 6: 34.72, 5: 33.99,
      4: 33.15, 3: 32.49, 2: 31.81, 1: 30.88, 0: 28.58
    },
    인문: {
      100: 68.03, 99: 67.73, 98: 66.74, 97: 66.12, 96: 65.65, 95: 65.13,
      94: 64.68, 93: 64.29, 92: 63.92, 91: 63.56, 90: 63.21, 89: 62.89,
      88: 62.58, 87: 62.28, 86: 62.00, 85: 61.67, 84: 61.32, 83: 60.97,
      82: 60.65, 81: 60.39, 80: 60.12, 79: 59.83, 78: 59.53, 77: 59.24,
      76: 58.96, 75: 58.67, 74: 58.34, 73: 58.00, 72: 57.71, 71: 57.43,
      70: 57.13, 69: 56.82, 68: 56.46, 67: 56.11, 66: 55.77, 65: 55.44,
      64: 55.11, 63: 54.77, 62: 54.47, 61: 54.15, 60: 53.83, 59: 53.49,
      58: 53.19, 57: 52.88, 56: 52.56, 55: 52.15, 54: 51.73, 53: 51.36,
      52: 50.96, 51: 50.57, 50: 50.14, 49: 49.73, 48: 49.35, 47: 48.96,
      46: 48.62, 45: 48.27, 44: 47.92, 43: 47.58, 42: 47.23, 41: 46.86,
      40: 46.48, 39: 46.09, 38: 45.71, 37: 45.36, 36: 44.98, 35: 44.62,
      34: 44.28, 33: 43.95, 32: 43.64, 31: 43.33, 30: 43.03, 29: 42.76,
      28: 42.43, 27: 42.11, 26: 41.81, 25: 41.49, 24: 41.17, 23: 40.87,
      22: 40.52, 21: 40.19, 20: 39.87, 19: 39.55, 18: 39.25, 17: 38.95,
      16: 38.60, 15: 38.24, 14: 37.88, 13: 37.52, 12: 37.19, 11: 36.86,
      10: 36.53, 9: 36.16, 8: 35.81, 7: 35.40, 6: 34.95, 5: 34.37,
      4: 33.70, 3: 33.10, 2: 32.46, 1: 31.55, 0: 29.51
    }
  };
  

// 탐구 과목이 과학탐구 과목인지 확인하는 함수
const isNaturalScience = (subject) => {
  return naturalScienceSubjects.includes(subject);
};

// 탐구 변환 점수 계산 함수
const getConvertedScore = (percentile, subject) => {
  const inquiryType = isNaturalScience(subject) ? '과학탐구' : '사회탐구';
  return conversionTable[inquiryType] ? percentile / conversionTable[inquiryType][100] : 0;
};

export const 숭실대학교 = async (userId, selection) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('exam_results')
    .select('standard_score_korean, standard_score_math, percentile_science1, percentile_science2, grade_english, grade_history, science1, science2, math')
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
    science2,
    math
  } = data;

  // 영어 점수 계산
  const englishScore = getEnglishScore(grade_english);

  // 한국사 감점 계산
  const historyPenalty = getHistoryPenalty(grade_history);

  // 탐구 과목 변환 점수 계산
  const scienceScore1 = getConvertedScore(percentile_science1, science1);
  const scienceScore2 = getConvertedScore(percentile_science2, science2);

  // 탐구 과목 점수 합산
  const scienceScore = (scienceScore1 + scienceScore2);

  let totalScore = 0;

  // 계열별 계산
  if (selection.계열 === '인문') {
    totalScore = (standard_score_korean / 150 * 350 + standard_score_math / 148 * 250 + englishScore + scienceScore * 100) + historyPenalty;
  } else if (selection.계열 === '경상') {
    totalScore = (standard_score_korean / 150 * 250 + standard_score_math / 148 * 350 + englishScore + scienceScore * 100) + historyPenalty;
  } else if (selection.계열 === '자연1') {
    // 수학 과목이 '미적분' 또는 '기하'일 때 7% 가산점 적용
    const mathBonus = (math === '미적분' || math === '기하') ? 0.07 : 0;

    // 과탐 과목당 2.5% 가산점 (최대 2과목 반영)
    const scienceBonus = (isNaturalScience(science1) ? 0.025 : 0) + (isNaturalScience(science2) ? 0.025 : 0);
    const maxScienceBonus = 0.05;

    totalScore = (standard_score_korean / 150 * 200 + standard_score_math / 148 * 350 * (1 + mathBonus) + englishScore + scienceScore * 120 * (1 + Math.min(scienceBonus, maxScienceBonus))) + historyPenalty;
  } else if (selection.계열 === '자연2') {
    // 수학 과목이 '미적분' 또는 '기하'일 때 5% 가산점 적용
    const mathBonus = (math === '미적분' || math === '기하') ? 0.05 : 0;

    // 과탐 과목당 2.5% 가산점 (최대 2과목 반영)
    const scienceBonus = (isNaturalScience(science1) ? 0.025 : 0) + (isNaturalScience(science2) ? 0.025 : 0);
    const maxScienceBonus = 0.05;

    totalScore = (standard_score_korean / 150 * 200 + standard_score_math / 148 * 350 * (1 + mathBonus) + englishScore + scienceScore * 120 * (1 + Math.min(scienceBonus, maxScienceBonus))) + historyPenalty;
  } else {
    return '불가';
  }

  return totalScore.toFixed(1);
};

// 영어 점수 계산 함수
const getEnglishScore = (grade) => {
  const englishScores = {
    1: 200, 2: 194, 3: 186, 4: 173, 5: 144,
    6: 116, 7: 87, 8: 44, 9: 0
  };
  return englishScores[grade] || 0;
};

// 한국사 감점 계산 함수
const getHistoryPenalty = (grade) => {
  const historyPenalties = {
    1: 4.0, 2: 3.5, 3: 3.0, 4: 2.5, 5: 2.0,
    6: 1.5, 7: 1.0, 8: 0.5, 9: 0
  };
  return historyPenalties[grade] || 0;
};
