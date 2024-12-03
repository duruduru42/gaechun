import { createClient } from "@/utils/supabase/client";

const naturalScienceSubjects = [
  '물리학Ⅰ', '물리학Ⅱ', '화학Ⅰ', '화학Ⅱ',
  '생명과학Ⅰ', '생명과학Ⅱ', '지구과학Ⅰ', '지구과학Ⅱ'
];

// 탐구 변환 점수 테이블
const conversionTable = {
  자연: {
    100: 71.75, 99: 71.00, 98: 69.88, 97: 68.69, 96: 68.00, 95: 67.31,
    94: 66.63, 93: 66.06, 92: 65.48, 91: 64.85, 90: 64.33, 89: 63.89,
    88: 63.42, 87: 63.02, 86: 62.63, 85: 62.07, 84: 61.56, 83: 60.98,
    82: 60.43, 81: 60.03, 80: 59.66, 79: 59.24, 78: 58.82, 77: 58.47,
    76: 58.03, 75: 57.66, 74: 57.24, 73: 56.76, 72: 56.40, 71: 56.01,
    70: 55.65, 69: 55.31, 68: 54.95, 67: 54.61, 66: 54.21, 65: 53.86,
    64: 53.53, 63: 53.23, 62: 52.94, 61: 52.63, 60: 52.29, 59: 51.97,
    58: 51.66, 57: 51.34, 56: 51.06, 55: 50.76, 54: 50.44, 53: 50.14,
    52: 49.79, 51: 49.46, 50: 49.15, 49: 48.84, 48: 48.56, 47: 48.24,
    46: 47.91, 45: 47.59, 44: 47.29, 43: 47.01, 42: 46.73, 41: 46.43,
    40: 46.11, 39: 45.81, 38: 45.50, 37: 45.18, 36: 44.84, 35: 44.54,
    34: 44.27, 33: 44.00, 32: 43.74, 31: 43.47, 30: 43.22, 29: 42.98,
    28: 42.73, 27: 42.44, 26: 42.16, 25: 41.89, 24: 41.61, 23: 41.34,
    22: 41.03, 21: 40.74, 20: 40.44, 19: 40.16, 18: 39.89, 17: 39.63,
    16: 39.34, 15: 39.02, 14: 38.70, 13: 38.39, 12: 38.11, 11: 37.81,
    10: 37.50, 9: 37.19, 8: 36.86, 7: 36.49, 6: 36.10, 5: 35.53,
    4: 34.96, 3: 34.42, 2: 33.81, 1: 32.88, 0: 30.25
  },
  인문: {
    100: 67.22, 99: 66.67, 98: 66.02, 97: 65.62, 96: 65.21, 95: 64.83,
    94: 64.51, 93: 64.24, 92: 63.91, 91: 63.64, 90: 63.28, 89: 62.98,
    88: 62.67, 87: 62.38, 86: 62.10, 85: 61.82, 84: 61.54, 83: 61.27,
    82: 61.03, 81: 60.79, 80: 60.55, 79: 60.28, 78: 59.98, 77: 59.69,
    76: 59.44, 75: 59.16, 74: 58.87, 73: 58.57, 72: 58.27, 71: 57.99,
    70: 57.68, 69: 57.37, 68: 56.94, 67: 56.55, 66: 56.21, 65: 55.89,
    64: 55.55, 63: 55.18, 62: 54.83, 61: 54.45, 60: 54.08, 59: 53.65,
    58: 53.29, 57: 52.93, 56: 52.52, 55: 52.05, 54: 51.57, 53: 51.13,
    52: 50.69, 51: 50.30, 50: 49.83, 49: 49.39, 48: 48.93, 47: 48.50,
    46: 48.16, 45: 47.81, 44: 47.48, 43: 47.12, 42: 46.73, 41: 46.37,
    40: 46.02, 39: 45.62, 38: 45.22, 37: 44.89, 36: 44.55, 35: 44.24,
    34: 43.90, 33: 43.57, 32: 43.26, 31: 42.96, 30: 42.68, 29: 42.41,
    28: 42.12, 27: 41.85, 26: 41.59, 25: 41.25, 24: 40.92, 23: 40.65,
    22: 40.35, 21: 40.05, 20: 39.75, 19: 39.46, 18: 39.20, 17: 38.92,
    16: 38.64, 15: 38.35, 14: 38.06, 13: 37.76, 12: 37.45, 11: 37.16,
    10: 36.84, 9: 36.44, 8: 36.08, 7: 35.64, 6: 35.19, 5: 34.76,
    4: 34.26, 3: 33.72, 2: 33.11, 1: 32.22, 0: 30.44
  }
};


// 영어 환산 점수 표
const getEnglishScore = (grade) => {
  const englishScores = {
    1: 100, 2: 98, 3: 94, 4: 88, 5: 80,
    6: 70, 7: 60, 8: 40, 9: 20
  };
  return englishScores[grade] || 0;
};

// 한국사 가산점 표 (이거 바꿔야 됨!!!!!!!!!!!!!! 일단 임의로 해놓음)
const getHistoryBonus = (grade) => {
  if (grade >= 1 && grade <= 3) return 3;
  if (grade >= 4 && grade <= 6) return 2;
  return 1;
};

const getConvertedScore = (percentile, subject) => {
  const track = naturalScienceSubjects.includes(subject) ? '자연' : '인문';
  const percentileScore = conversionTable[track][percentile]; // 백분위에 해당하는 점수 가져오기
  const maxScore = conversionTable[track][100]; // 백분위 100 점수 가져오기
  return maxScore && percentileScore ? percentileScore / maxScore : 0; // 변환 점수 계산
};


// 숙명여자대학교 점수 계산 함수
export const 숙명여자대학교 = async (userId, selection) => {
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

  // 영어 점수 및 한국사 가산점 계산
  const englishScore = getEnglishScore(grade_english) / 100;
  const historyBonus = getHistoryBonus(grade_history);

  const scienceScore1 = getConvertedScore(percentile_science1, science1);
  const scienceScore2 = getConvertedScore(percentile_science2, science2);

  let totalScore = 0;
  let adjustedScienceScore1 = 0;
  let adjustedScienceScore2 = 0;


  // 계열별 계산
  if (selection.계열 === '인문') {
    totalScore = (
      (standard_score_korean / 138) * 0.35 +
      (standard_score_math / 144) * 0.25 +
      englishScore * 0.2 +
      ((Number(scienceScore1) + Number(scienceScore2))) * 0.1
    ) * 1000 + historyBonus;
  } else if (selection.계열 === '경상') {
    totalScore = (
      (standard_score_korean / 138) * 0.3 +
      (standard_score_math / 144) * 0.3 +
      englishScore * 0.2 +
      ((scienceScore1 + scienceScore2)) * 0.1
    ) * 1000 + historyBonus;
  } else if (selection.계열 === '자연') {
    if (selection.모집단위 === '신소재물리전공' && science1 === '물리학Ⅰ' && science1==='물리학Ⅱ') {
      adjustedScienceScore1 = scienceScore1*1.05
    }else {
      adjustedScienceScore1 = scienceScore1; // 조건에 부합하지 않으면 원래 값 사용
    }
    if (selection.모집단위 === '신소재물리전공' && science2 === '물리학Ⅰ' && science1==='물리학Ⅱ') {
      adjustedScienceScore2 = scienceScore2*1.05
    }else {
      adjustedScienceScore2 = scienceScore2; // 조건에 부합하지 않으면 원래 값 사용
    }

    totalScore = (
      (standard_score_korean / 138) * 0.25 +
      (standard_score_math / 144) * 0.35 +
      englishScore * 0.2 +
      ((adjustedScienceScore1 + adjustedScienceScore2)) * 0.1
    ) * 1000 + historyBonus;
  } else if (selection.계열 === '수학') {
    if (!naturalScienceSubjects.includes(science1) || !naturalScienceSubjects.includes(science2) || (math !== '기하' && math !== '미적분')) {
      return '불가: 수학 과목 조건 불충족'; // 수학 과목 조건 불충족 시
    }
    totalScore = (
      (standard_score_korean / 138) * 0.15 +
      (standard_score_math / 144) * 0.5 +
      englishScore * 0.2 +
      (scienceScore1 + scienceScore2) * 0.075
    ) * 1000 + historyBonus;
  } else if (selection.계열 === '통계') {
    totalScore = (
      (standard_score_korean / 138) * 0.25 +
      (standard_score_math / 144) * 0.4 +
      englishScore * 0.2 +
      (scienceScore1 + scienceScore2) * 0.075
    ) * 1000 + historyBonus;
  } else if (selection.계열 === '자연2') {
    if (!naturalScienceSubjects.includes(science1) && !naturalScienceSubjects.includes(science2)) {
      return '불가: 자연 탐구 과목 조건 불충족';
    }
    totalScore = (
      (standard_score_korean / 138) * 0.25 +
      (standard_score_math / 144) * 0.35 +
      englishScore * 0.2 +
      (scienceScore1 + scienceScore2) * 0.1
    ) * 1000 + historyBonus;
  } else {
    return '불가: 잘못된 계열 값';
  }

  return totalScore.toFixed(2);
};
