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
      100: 70.12, 99: 69.18, 98: 68.09, 97: 67.36, 96: 66.76, 95: 66.16,
      94: 65.66, 93: 65.19, 92: 64.74, 91: 64.35, 90: 63.97, 89: 63.57,
      88: 63.19, 87: 62.79, 86: 62.44, 85: 62.08, 84: 61.73, 83: 61.38,
      82: 61.05, 81: 60.72, 80: 60.36, 79: 60.01, 78: 59.65, 77: 59.30,
      76: 58.97, 75: 58.62, 74: 58.22, 73: 57.86, 72: 57.50, 71: 57.16,
      70: 56.81, 69: 56.46, 68: 56.12, 67: 55.75, 66: 55.43, 65: 55.06,
      64: 54.67, 63: 54.30, 62: 53.92, 61: 53.53, 60: 53.13, 59: 52.72,
      58: 52.31, 57: 51.93, 56: 51.57, 55: 51.21, 54: 50.80, 53: 50.44,
      52: 50.07, 51: 49.68, 50: 49.27, 49: 48.88, 48: 48.50, 47: 48.15,
      46: 47.79, 45: 47.47, 44: 47.15, 43: 46.76, 42: 46.39, 41: 46.03,
      40: 45.68, 39: 45.35, 38: 44.99, 37: 44.65, 36: 44.35, 35: 44.07,
      34: 43.78, 33: 43.47, 32: 43.21, 31: 42.96, 30: 42.71, 29: 42.47,
      28: 42.24, 27: 41.99, 26: 41.71, 25: 41.42, 24: 41.13, 23: 40.85,
      22: 40.58, 21: 40.31, 20: 40.05, 19: 39.78, 18: 39.52, 17: 39.24,
      16: 38.96, 15: 38.68, 14: 38.41, 13: 38.14, 12: 37.87, 11: 37.61,
      10: 37.32, 9: 37.05, 8: 36.73, 7: 36.32, 6: 35.91, 5: 35.47,
      4: 34.99, 3: 34.43, 2: 33.71, 1: 32.82, 0: 31.12,
    },
    인문: {
      100: 70.12, 99: 69.18, 98: 68.09, 97: 67.36, 96: 66.76, 95: 66.16,
      94: 65.66, 93: 65.19, 92: 64.74, 91: 64.35, 90: 63.97, 89: 63.57,
      88: 63.19, 87: 62.79, 86: 62.44, 85: 62.08, 84: 61.73, 83: 61.38,
      82: 61.05, 81: 60.72, 80: 60.36, 79: 60.01, 78: 59.65, 77: 59.30,
      76: 58.97, 75: 58.62, 74: 58.22, 73: 57.86, 72: 57.50, 71: 57.16,
      70: 56.81, 69: 56.46, 68: 56.12, 67: 55.75, 66: 55.43, 65: 55.06,
      64: 54.67, 63: 54.30, 62: 53.92, 61: 53.53, 60: 53.13, 59: 52.72,
      58: 52.31, 57: 51.93, 56: 51.57, 55: 51.21, 54: 50.80, 53: 50.44,
      52: 50.07, 51: 49.68, 50: 49.27, 49: 48.88, 48: 48.50, 47: 48.15,
      46: 47.79, 45: 47.47, 44: 47.15, 43: 46.76, 42: 46.39, 41: 46.03,
      40: 45.68, 39: 45.35, 38: 44.99, 37: 44.65, 36: 44.35, 35: 44.07,
      34: 43.78, 33: 43.47, 32: 43.21, 31: 42.96, 30: 42.71, 29: 42.47,
      28: 42.24, 27: 41.99, 26: 41.71, 25: 41.42, 24: 41.13, 23: 40.85,
      22: 40.58, 21: 40.31, 20: 40.05, 19: 39.78, 18: 39.52, 17: 39.24,
      16: 38.96, 15: 38.68, 14: 38.41, 13: 38.14, 12: 37.87, 11: 37.61,
      10: 37.32, 9: 37.05, 8: 36.73, 7: 36.32, 6: 35.91, 5: 35.47,
      4: 34.99, 3: 34.43, 2: 33.71, 1: 32.82, 0: 31.12,
    }
  };
  
// 과목이 자연탐구 과목인지 확인하는 함수
const isNaturalScience = (subject) => naturalScienceSubjects.includes(subject);

// 탐구 변환 점수 계산 함수
const getConvertedScore = (percentile, subject) => {
  const track = naturalScienceSubjects.includes(subject) ? '자연' : '인문';
  return conversionTable[track][percentile] || 0;
};

// 핵심 수정: 세 번째 인자 isAdmin 추가 (기본값 false)
export const 동국대학교 = async (userId, selection, isAdmin = false) => {
  const supabase = createClient();

  // isAdmin 여부에 따라 테이블과 ID 컬럼 결정
  const tableName = isAdmin ? 'admin_managed_students' : 'exam_results';
  const idColumn = isAdmin ? 'id' : 'user_id';

  const { data, error } = await supabase
    .from(tableName)
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
