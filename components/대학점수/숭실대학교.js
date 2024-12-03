import { createClient } from "@/utils/supabase/client";

// 과학탐구 과목 리스트
const naturalScienceSubjects = [
  '물리학Ⅰ', '물리학Ⅱ', '화학Ⅰ', '화학Ⅱ',
  '생명과학Ⅰ', '생명과학Ⅱ', '지구과학Ⅰ', '지구과학Ⅱ'
];

const conversionTable = {
  인문: {
    100: 69.35, 99: 68.71, 98: 67.77, 97: 67.06, 96: 66.53, 95: 66.00, 94: 65.51,
    93: 65.10, 92: 64.59, 91: 64.18, 90: 63.78, 89: 63.39, 88: 63.00, 87: 62.63,
    86: 62.31, 85: 61.94, 84: 61.55, 83: 61.13, 82: 60.75, 81: 60.43, 80: 60.13,
    79: 59.79, 78: 59.44, 77: 59.12, 76: 58.78, 75: 58.45, 74: 58.10, 73: 57.72,
    72: 57.39, 71: 57.05, 70: 56.70, 69: 56.37, 68: 55.98, 67: 55.62, 66: 55.25,
    65: 54.93, 64: 54.60, 63: 54.26, 62: 53.94, 61: 53.59, 60: 53.23, 59: 52.84,
    58: 52.50, 57: 52.17, 56: 51.83, 55: 51.44, 54: 51.04, 53: 50.66, 52: 50.26,
    51: 49.90, 50: 49.51, 49: 49.13, 48: 48.75, 47: 48.38, 46: 48.04, 45: 47.70,
    44: 47.37, 43: 47.05, 42: 46.72, 41: 46.39, 40: 46.06, 39: 45.71, 38: 45.35,
    37: 45.02, 36: 44.69, 35: 44.38, 34: 44.07, 33: 43.77, 32: 43.49, 31: 43.20,
    30: 42.93, 29: 42.68, 28: 42.40, 27: 42.11, 26: 41.84, 25: 41.54, 24: 41.24,
    23: 40.97, 22: 40.67, 21: 40.37, 20: 40.07, 19: 39.79, 18: 39.52, 17: 39.24,
    16: 38.96, 15: 38.66, 14: 38.35, 13: 38.05, 12: 37.75, 11: 37.46, 10: 37.14,
    9: 36.78, 8: 36.43, 7: 36.03, 6: 35.61, 5: 35.12, 4: 34.59, 3: 34.05,
    2: 33.44, 1: 32.53, 0: 30.35
  },
  자연: {
    100: 71.75, 99: 71.00, 98: 69.75, 97: 68.69, 96: 68.00, 95: 67.31, 94: 66.63,
    93: 66.06, 92: 65.36, 91: 64.79, 90: 64.33, 89: 63.89, 88: 63.42, 87: 62.96,
    86: 62.56, 85: 62.07, 84: 61.56, 83: 60.98, 82: 60.43, 81: 60.03, 80: 59.66,
    79: 59.24, 78: 58.82, 77: 58.47, 76: 58.03, 75: 57.66, 74: 57.24, 73: 56.76,
    72: 56.40, 71: 56.01, 70: 55.65, 69: 55.29, 68: 54.93, 67: 54.58, 66: 54.17,
    65: 53.84, 64: 53.53, 63: 53.23, 62: 52.94, 61: 52.63, 60: 52.27, 59: 51.93,
    58: 51.63, 57: 51.32, 56: 51.05, 55: 50.76, 54: 50.44, 53: 50.14, 52: 49.79,
    51: 49.46, 50: 49.15, 49: 48.84, 48: 48.56, 47: 48.24, 46: 47.91, 45: 47.59,
    44: 47.29, 43: 47.01, 42: 46.73, 41: 46.43, 40: 46.11, 39: 45.81, 38: 45.50,
    37: 45.18, 36: 44.84, 35: 44.54, 34: 44.27, 33: 44.00, 32: 43.74, 31: 43.47,
    30: 43.22, 29: 42.98, 28: 42.73, 27: 42.44, 26: 42.16, 25: 41.89, 24: 41.61,
    23: 41.34, 22: 41.03, 21: 40.73, 20: 40.44, 19: 40.15, 18: 39.88, 17: 39.61,
    16: 39.31, 15: 39.00, 14: 38.68, 13: 38.37, 12: 38.09, 11: 37.80, 10: 37.48,
    9: 37.17, 8: 36.82, 7: 36.47, 6: 36.09, 5: 35.53, 4: 34.96, 3: 34.42,
    2: 33.81, 1: 32.88, 0: 30.25
  }
};

  
  const getConvertedScore = (percentile, subject) => {
    const track = naturalScienceSubjects.includes(subject) ? '자연' : '인문';
    const percentileScore = conversionTable[track][percentile]; // 백분위에 해당하는 점수 가져오기
    const maxScore = conversionTable[track][100]; // 백분위 100 점수 가져오기
    return maxScore && percentileScore ? percentileScore / maxScore : 0; // 변환 점수 계산
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

  let totalScore = 0;

  // 계열별 계산
  if (selection.계열 === '인문') {
    totalScore = (standard_score_korean / 138 * 350 + standard_score_math / 144 * 250 + englishScore + (scienceScore1 + scienceScore2) * 100) + historyPenalty;
  } else if (selection.계열 === '경상') {
    totalScore = (standard_score_korean / 138 * 250 + standard_score_math / 144 * 350 + englishScore + (scienceScore1 + scienceScore2) * 100) + historyPenalty;
  } else if (selection.계열 === '자연1') {
    // 수학 과목이 '미적분' 또는 '기하'일 때 7% 가산점 적용
    const mathBonus1 = (math === '미적분' || math === '기하') ? 0.07 : 0;

    // 과탐 과목당 2.5% 가산점 (최대 2과목 반영)
    const scienceBonus1 = (naturalScienceSubjects.includes(science1) ? 0.025 : 0) + (naturalScienceSubjects.includes(science2) ? 0.025 : 0);

    const totalBonus1 = Number(mathBonus1 * standard_score_math) + Number(scienceBonus1 * (Number(percentile_science1) + Number(percentile_science2)))

    totalScore = standard_score_korean / 138 * 200 + standard_score_math / 144 * 350 + englishScore + (scienceScore1 + scienceScore2) * 125 + historyPenalty + Number(totalBonus1);
  } else if (selection.계열 === '자연2') {
    // 수학 과목이 '미적분' 또는 '기하'일 때 5% 가산점 적용
    const mathBonus2 = (math === '미적분' || math === '기하') ? 0.05 : 0;

    // 과탐 과목당 2.5% 가산점 (최대 2과목 반영)
    const scienceBonus2 = (naturalScienceSubjects.includes(science1) ? 0.025 : 0) + (naturalScienceSubjects.includes(science2) ? 0.025 : 0);

    const totalBonus2 = Number(mathBonus2 * standard_score_math) + Number(scienceBonus2 * (Number(percentile_science1) + Number(percentile_science2)))


    totalScore = standard_score_korean / 138 * 200 + standard_score_math / 144 * 350  + englishScore + (scienceScore1 + scienceScore2) * 125 + historyPenalty + Number(totalBonus2);
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
