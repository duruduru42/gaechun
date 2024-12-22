import { createClient } from "@/utils/supabase/client";

const naturalScienceSubjects = [
  '물리학Ⅰ', '물리학Ⅱ', '화학Ⅰ', '화학Ⅱ',
  '생명과학Ⅰ', '생명과학Ⅱ', '지구과학Ⅰ', '지구과학Ⅱ'
];

// 탐구 변환 점수 테이블
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
    4: 34.93, 3: 34.42, 2: 33.76, 1: 32.58, 0: 30.79
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
    4: 34.93, 3: 34.42, 2: 33.76, 1: 32.58, 0: 30.79
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

  const { data: profile, error: profileError } = await supabase
    .from('profile')
    .select('gender')
    .eq('id', userId)
    .single();

  if (profileError || !profile) {
    return '불가: 사용자 정보 없음'; // 프로필 데이터가 없을 경우 처리
  }

  // 성별이 '남'이면 불가 처리
  if (profile.gender === '남학생') {
    return '불가: 남성 지원 불가';
  }


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
      (standard_score_korean / 139) * 0.35 +
      (standard_score_math / 140) * 0.25 +
      englishScore * 0.2 +
      ((Number(scienceScore1) + Number(scienceScore2))) * 0.1
    ) * 1000 + historyBonus;
  } else if (selection.계열 === '경상') {
    totalScore = (
      (standard_score_korean / 139) * 0.3 +
      (standard_score_math / 140) * 0.3 +
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
      (standard_score_korean / 139) * 0.25 +
      (standard_score_math / 140) * 0.35 +
      englishScore * 0.2 +
      ((adjustedScienceScore1 + adjustedScienceScore2)) * 0.1
    ) * 1000 + historyBonus;
  } else if (selection.계열 === '수학') {
    if (!naturalScienceSubjects.includes(science1) || !naturalScienceSubjects.includes(science2) || (math !== '기하' && math !== '미적분')) {
      return '불가: 수학 과목 조건 불충족'; // 수학 과목 조건 불충족 시
    }
    totalScore = (
      (standard_score_korean / 139) * 0.15 +
      (standard_score_math / 140) * 0.5 +
      englishScore * 0.2 +
      (scienceScore1 + scienceScore2) * 0.075
    ) * 1000 + historyBonus;
  } else if (selection.계열 === '통계') {
    totalScore = (
      (standard_score_korean / 139) * 0.25 +
      (standard_score_math / 140) * 0.4 +
      englishScore * 0.2 +
      (scienceScore1 + scienceScore2) * 0.075
    ) * 1000 + historyBonus;
  } else if (selection.계열 === '자연2') {
    if (!naturalScienceSubjects.includes(science1) && !naturalScienceSubjects.includes(science2)) {
      return '불가: 자연 탐구 과목 조건 불충족';
    }
    totalScore = (
      (standard_score_korean / 139) * 0.25 +
      (standard_score_math / 140) * 0.35 +
      englishScore * 0.2 +
      (scienceScore1 + scienceScore2) * 0.1
    ) * 1000 + historyBonus;
  } else {
    return '불가: 잘못된 계열 값';
  }

  return totalScore.toFixed(2);
};
