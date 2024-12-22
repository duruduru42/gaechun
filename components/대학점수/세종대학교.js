import { createClient } from "@/utils/supabase/client";

// 탐구 변환 점수 테이블 (기본 값 적용)
const naturalScienceSubjects = [
  '물리학Ⅰ', '물리학Ⅱ', '화학Ⅰ', '화학Ⅱ',
  '생명과학Ⅰ', '생명과학Ⅱ', '지구과학Ⅰ', '지구과학Ⅱ'
];

const conversionTable = {
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
    },
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
    }
  };

// Helper function to get the converted score
const getConvertedScore = (percentile, subject) => {
  const track = naturalScienceSubjects.includes(subject) ? '자연' : '인문';
  return conversionTable[track][percentile] || 0;
};

// 영어 환산 점수 표 (200점 기준)
const getEnglishScore = (grade, track) => {
  const englishScores = track === '인문' ? {
    1: 200, 2: 195, 3: 190, 4: 185, 5: 170,
    6: 150, 7: 120, 8: 100, 9: 0
  } : {
    1: 200, 2: 198, 3: 196, 4: 194, 5: 170,
    6: 150, 7: 120, 8: 100, 9: 0
  };
  return englishScores[grade] || 0;
};

// 한국사 환산 점수 표 (감산)
const getHistoryScore = (grade) => {
  return grade <= 3 ? 10 : 10 - (0.2 * (grade - 3));
};

// 세종대학교 점수 계산 함수
export const 세종대학교 = async (userId, selection) => {
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
    math
  } = data;

  // 영어 점수 및 한국사 점수 계산
  const englishScore = getEnglishScore(grade_english, selection.계열);
  const historyScore = getHistoryScore(grade_history);
  // Calculate science scores
  const scienceScore1 = getConvertedScore(percentile_science1, science1);
  const scienceScore2 = getConvertedScore(percentile_science2, science2);

  let totalScore = 0;

  // 인문계열 계산
  if (selection.계열 === '인문') {
    totalScore =
      (standard_score_korean / 200 * 300) +
      (standard_score_math / 200 * 300) +
      englishScore +
      (scienceScore1 + scienceScore2) + 
      historyScore;
  } 
  // 자연계열 계산 (자연1, 자연2 공통)
  else if (selection.계열 === '자연1' || selection.계열 === '자연2') {
    let mathBonus = 0;

    // science1, science2가 naturalScienceSubjects에 포함되어 있는지 확인하고 가산점 계산
    const science1Bonus = naturalScienceSubjects.includes(science1)
      ? (selection.계열 === '자연1' ? 0.05 : 0.03)
      : 0;

    const science2Bonus = naturalScienceSubjects.includes(science2)
      ? (selection.계열 === '자연1' ? 0.05 : 0.03)
      : 0;

    // 수학 가산점 계산
    if (math === '미적분' || math === '기하') {
      mathBonus = selection.계열 === '자연1' ? 0.05 : 0.03;
    }

    // 최종 점수 계산
    totalScore =
    (Number(standard_score_korean) || 0) +
    ((Number(standard_score_math) / 200 * 350) || 0) * (1 + mathBonus) +
    (Number(englishScore) || 0) +
    ((Number(scienceScore1) / 200 * 250) || 0) * (1 + science1Bonus) +
    ((Number(scienceScore2) / 200 * 250) || 0) * (1 + science2Bonus) +
    (Number(historyScore) || 0);
  
}
  else {
    return '불가'; // 잘못된 계열 값일 경우
  }

  return totalScore.toFixed(2);
};
