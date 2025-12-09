import { createClient } from "@/utils/supabase/client";

// 과학탐구 과목 리스트
const naturalScienceSubjects = [
  '물리학Ⅰ', '물리학Ⅱ', '화학Ⅰ', '화학Ⅱ',
  '생명과학Ⅰ', '생명과학Ⅱ', '지구과학Ⅰ', '지구과학Ⅱ'
];

const conversionTable = {
  인문: {
    100: 70.00, 99: 69.08, 98: 68.10, 97: 67.36, 96: 66.69, 95: 66.05,
    94: 65.52, 93: 65.07, 92: 64.54, 91: 64.18, 90: 63.82, 89: 63.43,
    88: 63.10, 87: 62.74, 86: 62.40, 85: 62.06, 84: 61.71, 83: 61.34,
    82: 61.01, 81: 60.64, 80: 60.30, 79: 59.94, 78: 59.57, 77: 59.19,
    76: 58.85, 75: 58.50, 74: 58.18, 73: 57.77, 72: 57.39, 71: 57.07,
    70: 56.75, 69: 56.41, 68: 56.02, 67: 55.61, 66: 55.25, 65: 54.89,
    64: 54.53, 63: 54.16, 62: 53.77, 61: 53.37, 60: 53.00, 59: 52.66,
    58: 52.33, 57: 51.96, 56: 51.61, 55: 51.22, 54: 50.80, 53: 50.41,
    52: 50.08, 51: 49.69, 50: 49.35, 49: 49.01, 48: 48.66, 47: 48.29,
    46: 47.87, 45: 47.51, 44: 47.14, 43: 46.81, 42: 46.47, 41: 46.13,
    40: 45.82, 39: 45.54, 38: 45.24, 37: 44.93, 36: 44.62, 35: 44.32,
    34: 44.02, 33: 43.73, 32: 43.44, 31: 43.16, 30: 42.87, 29: 42.56,
    28: 42.27, 27: 41.99, 26: 41.70, 25: 41.41, 24: 41.12, 23: 40.83,
    22: 40.57, 21: 40.30, 20: 40.04, 19: 39.80, 18: 39.54, 17: 39.26,
    16: 38.98, 15: 38.69, 14: 38.42, 13: 38.15, 12: 37.87, 11: 37.58,
    10: 37.23, 9: 36.89, 8: 36.53, 7: 36.15, 6: 35.74, 5: 35.32,
    4: 34.93, 3: 34.42, 2: 33.76, 1: 32.59, 0: 30.71
  },
  자연: {
    100: 70.00, 99: 69.08, 98: 68.10, 97: 67.36, 96: 66.69, 95: 66.05,
    94: 65.52, 93: 65.07, 92: 64.54, 91: 64.18, 90: 63.82, 89: 63.43,
    88: 63.10, 87: 62.74, 86: 62.40, 85: 62.06, 84: 61.71, 83: 61.34,
    82: 61.01, 81: 60.64, 80: 60.30, 79: 59.94, 78: 59.57, 77: 59.19,
    76: 58.85, 75: 58.50, 74: 58.18, 73: 57.77, 72: 57.39, 71: 57.07,
    70: 56.75, 69: 56.41, 68: 56.02, 67: 55.61, 66: 55.25, 65: 54.89,
    64: 54.53, 63: 54.16, 62: 53.77, 61: 53.37, 60: 53.00, 59: 52.66,
    58: 52.33, 57: 51.96, 56: 51.61, 55: 51.22, 54: 50.80, 53: 50.41,
    52: 50.08, 51: 49.69, 50: 49.35, 49: 49.01, 48: 48.66, 47: 48.29,
    46: 47.87, 45: 47.51, 44: 47.14, 43: 46.81, 42: 46.47, 41: 46.13,
    40: 45.82, 39: 45.54, 38: 45.24, 37: 44.93, 36: 44.62, 35: 44.32,
    34: 44.02, 33: 43.73, 32: 43.44, 31: 43.16, 30: 42.87, 29: 42.56,
    28: 42.27, 27: 41.99, 26: 41.70, 25: 41.41, 24: 41.12, 23: 40.83,
    22: 40.57, 21: 40.30, 20: 40.04, 19: 39.80, 18: 39.54, 17: 39.26,
    16: 38.98, 15: 38.69, 14: 38.42, 13: 38.15, 12: 37.87, 11: 37.58,
    10: 37.23, 9: 36.89, 8: 36.53, 7: 36.15, 6: 35.74, 5: 35.32,
    4: 34.93, 3: 34.42, 2: 33.76, 1: 32.59, 0: 30.71
  }
};

const getConvertedScore = (percentile, subject) => {
  const track = naturalScienceSubjects.includes(subject) ? '자연' : '인문';
  const percentileScore = conversionTable[track][percentile]; // 백분위에 해당하는 점수
  const maxScore = conversionTable[track][100];             // 백분위 100 점수
  return maxScore && percentileScore ? percentileScore / maxScore : 0; // 0~1 스케일
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

  // 탐구 과목 변환 점수 (0~1 스케일)
  let scienceScore1 = getConvertedScore(percentile_science1, science1);
  let scienceScore2 = getConvertedScore(percentile_science2, science2);

  let totalScore = 0;

  // 👉 인문/경상: 사탐 과목(= 자연탐구가 아닌 과목)은 과목당 3% 가산
  if (selection.계열 === '인문' || selection.계열 === '경상') {
    if (!naturalScienceSubjects.includes(science1)) {
      scienceScore1 *= 1.025;
    }
    if (!naturalScienceSubjects.includes(science2)) {
      scienceScore2 *= 1.025;
    }
  }

  // 계열별 계산
  if (selection.계열 === '인문') {
    totalScore =
      (standard_score_korean / 147) * 350 +
      (standard_score_math / 139) * 200 +
      englishScore +
      (scienceScore1 + scienceScore2) * 125 +
      historyPenalty;

  } else if (selection.계열 === '경상') {
    totalScore =
      (standard_score_korean / 147) * 250 +
      (standard_score_math / 139) * 300 +
      englishScore +
      (scienceScore1 + scienceScore2) * 125 +
      historyPenalty;

  } else if (selection.계열 === '자연1') {
    const mathBonus1 = (math === '미적분' || math === '기하') ? 0.07 : 0;
    const scienceBonus1 =
      (naturalScienceSubjects.includes(science1) ? 0.025 : 0) +
      (naturalScienceSubjects.includes(science2) ? 0.025 : 0);

    const totalBonus1 =
      mathBonus1 * standard_score_math +
      scienceBonus1 * ((Number(percentile_science1) + Number(percentile_science2)) / 2);

    totalScore =
      (standard_score_korean / 147) * 200 +
      (standard_score_math / 139) * 350 +
      englishScore +
      (scienceScore1 + scienceScore2) * 125 +
      historyPenalty +
      totalBonus1;

  } else if (selection.계열 === '자연2') {
    const mathBonus2 = (math === '미적분' || math === '기하') ? 0.05 : 0;
    const scienceBonus2 =
      (naturalScienceSubjects.includes(science1) ? 0.025 : 0) +
      (naturalScienceSubjects.includes(science2) ? 0.025 : 0);

    const totalBonus2 =
      mathBonus2 * standard_score_math +
      scienceBonus2 * ((Number(percentile_science1) + Number(percentile_science2)) / 2);

    totalScore =
      (standard_score_korean / 147) * 200 +
      (standard_score_math / 139) * 350 +
      englishScore +
      (scienceScore1 + scienceScore2) * 125 +
      historyPenalty +
      totalBonus2;

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
