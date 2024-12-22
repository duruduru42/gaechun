import { createClient } from "@/utils/supabase/client";

// 자연계열 과목 및 사회탐구 과목 리스트
const naturalScienceSubjects = [
    '물리학Ⅰ', '물리학Ⅱ', '화학Ⅰ', '화학Ⅱ',
    '생명과학Ⅰ', '생명과학Ⅱ', '지구과학Ⅰ', '지구과학Ⅱ'
];

// 모집단위별 조건
const recruitmentUnitMath = ['수학과', '통계학과', '산업시스템공학과'];
const recruitmentUnitScience = ['화학과', '바이오환경과학과', '생명과학과', '가정교육과'];
const recruitmentUnitBoth = [
  '물리학과', '바이오시스템대학', '식품생명공학과', '의생명공학과', '전자전기공학부',
  '정보통신공학과', '건설환경공학과', '화공생물공학과', '기계로봇에너지공학과', 
  '건축공학부', '에너지신소재공학과', '컴퓨터-AI학부', '시스템반도체학부', 
  '수학교육과', '약학과', '열린전공학부(자연)'
];

// 영어 환산 점수 표
const getEnglishScore = (grade) => {
  const englishScores = {
    1: 200, 2: 199, 3: 197, 4: 190, 5: 180,
    6: 140, 7: 90, 8: 20, 9: 0
  };
  return englishScores[grade] || 0;
};

// 한국사 감점 점수 표
const getHistoryPenalty = (grade) => {
  const penalties = {
    1: 0, 2: 0, 3: 0, 4: 0, 5: -2, 6: -4,
    7: -6, 8: -8, 9: -10
  };
  return penalties[grade] || 0;
};

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
  
// 과목이 자연탐구 과목인지 확인하는 함수
const isNaturalScience = (subject) => naturalScienceSubjects.includes(subject);

// 탐구 변환 점수 계산 함수
const getConvertedScore = (percentile, subject) => {
  const track = naturalScienceSubjects.includes(subject) ? '자연' : '인문';
  return conversionTable[track][percentile] || 0;
};

export const 동국대학교 = async (userId, selection) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('exam_results')
    .select(`
      standard_score_korean,
      standard_score_math,
      percentile_science1,
      percentile_science2,
      grade_english,
      grade_history,
      science1,
      science2,
      math
    `)
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

  // 영어 환산 점수 계산
  const englishScore = getEnglishScore(grade_english);

  // 한국사 감점 점수 계산
  const historyPenalty = getHistoryPenalty(grade_history);

  // 탐구 과목 변환 점수 계산 (탐구 변환 점수 로직 적용)
  const convertedScienceScore1 = getConvertedScore(percentile_science1, science1);
  const convertedScienceScore2 = getConvertedScore(percentile_science2, science2);

  // 기본 점수 계산
  let totalScore = 0;


  if (selection.계열 === '인문') {
    totalScore =
      (standard_score_korean / 200) * 1000 * 0.35 +
      (standard_score_math / 200) * 1000 * 0.25 +
      (convertedScienceScore1 + convertedScienceScore2) * 5 * 0.25 +
      englishScore * 5 * 0.15 +
      historyPenalty;
  } else if (selection.계열 === '자연') {
    totalScore =
      (standard_score_korean / 200) * 1000 * 0.25 +
      (standard_score_math / 200) * 1000 * 0.35 +
      (convertedScienceScore1 + convertedScienceScore2) * 5 * 0.25 +
      englishScore * 5 * 0.15 +
      historyPenalty;
  } else {
    return '불가';
  }

   // 추가 조건 1: 수학 가산점
   if (recruitmentUnitMath.includes(selection.모집단위) && (math === '미적분' || math === '기하')) {
    totalScore += standard_score_math * 0.03 * 5 * 0.35;
  }

  // 추가 조건 2: 탐구 가산점 (과탐)
  if (recruitmentUnitScience.includes(selection.모집단위)) {
    if (isNaturalScience(science1)) {
      totalScore += convertedScienceScore1 * 0.03 * 5 * 0.25;
    }
    if (isNaturalScience(science2)) {
      totalScore += convertedScienceScore2 * 0.03 * 5 * 0.25;
    }
  }

  // 추가 조건 3: 수학 및 탐구 가산점
  if (recruitmentUnitBoth.includes(selection.모집단위)) {
    if (math === '미적분' || math === '기하') {
      totalScore += standard_score_math * 0.03 * 5 * 0.35;
    }
    if (isNaturalScience(science1)) {
      totalScore += convertedScienceScore1 * 0.03 * 5 * 0.25;
    }
    if (isNaturalScience(science2)) {
      totalScore += convertedScienceScore2 * 0.03 * 5 * 0.25;
    }
  }

  return totalScore.toFixed(1);
};
