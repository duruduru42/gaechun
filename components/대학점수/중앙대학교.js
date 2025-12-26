import { createClient } from "@/utils/supabase/client";

/**
 * 2026학년도 중앙대학교 변환표준점수 테이블
 * 표1: 가군, 나군 모집단위 적용
 * 표2: 다군 모집단위 적용
 */
const conversionTable = {
  표1: {
    100: 71.42, 99: 70.82, 98: 70.09, 97: 69.36, 96: 68.76, 95: 68.16,
    94: 67.66, 93: 67.19, 92: 66.74, 91: 66.35, 90: 65.97, 89: 65.57,
    88: 65.19, 87: 64.79, 86: 64.44, 85: 64.08, 84: 63.73, 83: 63.38,
    82: 63.05, 81: 62.72, 80: 62.23, 79: 61.74, 78: 61.23, 77: 60.70,
    76: 60.22, 75: 59.56, 74: 58.91, 73: 58.27, 72: 57.63, 71: 57.16,
    70: 56.81, 69: 56.46, 68: 56.12, 67: 55.75, 66: 55.43, 65: 55.06,
    64: 54.67, 63: 54.30, 62: 53.92, 61: 53.53, 60: 53.13, 59: 52.72,
    58: 52.31, 57: 51.93, 56: 51.57, 55: 51.21, 54: 50.80, 53: 50.44,
    52: 50.07, 51: 49.68, 50: 49.26, 49: 48.88, 48: 48.50, 47: 48.15,
    46: 47.79, 45: 47.47, 44: 47.15, 43: 46.76, 42: 46.39, 41: 46.03,
    40: 45.68, 39: 45.35, 38: 44.99, 37: 44.65, 36: 44.35, 35: 44.07,
    34: 43.78, 33: 43.47, 32: 43.21, 31: 42.96, 30: 42.71, 29: 42.47,
    28: 42.24, 27: 41.99, 26: 41.71, 25: 41.42, 24: 41.13, 23: 40.85,
    22: 40.58, 21: 40.31, 20: 40.05, 19: 39.78, 18: 39.52, 17: 39.24,
    16: 38.96, 15: 38.68, 14: 38.41, 13: 38.14, 12: 37.87, 11: 37.61,
    10: 37.32, 9: 37.05, 8: 36.73, 7: 36.32, 6: 35.91, 5: 35.47,
    4: 34.99, 3: 34.43, 2: 33.71, 1: 32.82, 0: 31.12
  },
  표2: {
    100: 71.42, 99: 71.04, 98: 70.61, 97: 70.23, 96: 69.97, 95: 69.73,
    94: 69.51, 93: 69.37, 92: 69.24, 91: 69.05, 90: 68.85, 89: 68.66,
    88: 68.41, 87: 68.17, 86: 67.93, 85: 67.59, 84: 67.25, 83: 66.91,
    82: 66.56, 81: 66.20, 80: 65.85, 79: 65.36, 78: 64.87, 77: 64.36,
    76: 63.83, 75: 63.30, 74: 62.59, 73: 61.89, 72: 61.20, 71: 60.51,
    70: 60.01, 69: 59.52, 68: 59.02, 67: 58.51, 66: 57.97, 65: 57.43,
    64: 56.89, 63: 56.33, 62: 55.76, 61: 55.18, 60: 54.61, 59: 54.06,
    58: 53.33, 57: 52.58, 56: 51.83, 55: 51.21, 54: 50.80, 53: 50.44,
    52: 50.07, 51: 49.68, 50: 49.26, 49: 48.88, 48: 48.50, 47: 48.15,
    46: 47.79, 45: 47.47, 44: 47.15, 43: 46.76, 42: 46.39, 41: 46.03,
    40: 45.68, 39: 45.35, 38: 44.99, 37: 44.65, 36: 44.35, 35: 44.07,
    34: 43.78, 33: 43.47, 32: 43.21, 31: 42.96, 30: 42.71, 29: 42.47,
    28: 42.24, 27: 41.99, 26: 41.71, 25: 41.42, 24: 41.13, 23: 40.85,
    22: 40.58, 21: 40.31, 20: 40.05, 19: 39.78, 18: 39.52, 17: 39.24,
    16: 38.96, 15: 38.68, 14: 38.41, 13: 38.14, 12: 37.87, 11: 37.61,
    10: 37.32, 9: 37.05, 8: 36.73, 7: 36.32, 6: 35.91, 5: 35.47,
    4: 34.99, 3: 34.43, 2: 33.71, 1: 32.82, 0: 31.12
  }
};

const humanitiesSubjects = [
  '생활과윤리', '윤리와사상', '한국지리', '세계지리', 
  '동아시아사', '세계사', '경제', '정치와법', '사회문화'
];

const naturalScienceSubjects = [
  '물리학Ⅰ', '물리학Ⅱ', '화학Ⅰ', '화학Ⅱ',
  '지구과학Ⅰ', '지구과학Ⅱ', '생명과학Ⅰ', '생명과학Ⅱ'
];

/**
 * 영어 등급별 환산 점수
 */
const getEnglishScore = (grade) => {
  const englishScores = {
    1: 100, 2: 98, 3: 95, 4: 92, 5: 86,
    6: 75, 7: 64, 8: 58, 9: 50
  };
  return englishScores[grade] || 0;
};

/**
 * 한국사 등급별 가산 점수
 */
const getHistoryScore = (grade) => {
  const historyScores = {
    1: 10, 2: 10, 3: 10, 4: 10,
    5: 9.6, 6: 9.2, 7: 8.8, 8: 8.4, 9: 8.0
  };
  return historyScores[grade] || 0;
};

/**
 * 변환표준점수 획득 함수
 */
const getConvertedScore = (percentile, tableType) => {
  return conversionTable[tableType][percentile] || 0;
};

/**
 * 메인 계산 함수
 * @param {string} userId - 사용자 ID
 * @param {object} selection - 모집군(군), 계열 정보 포함
 * @param {boolean} isAdmin - 관리자 여부
 */
export const 중앙대학교 = async (userId, selection, isAdmin = false) => {
  const supabase = createClient();

  const tableName = isAdmin ? 'admin_managed_students' : 'exam_results';
  const idColumn = isAdmin ? 'id' : 'user_id';

  const { data, error } = await supabase
    .from(tableName)
    .select('standard_score_korean, standard_score_math, percentile_science1, percentile_science2, grade_english, grade_history, science1, science2')
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
    science2
  } = data;

  // 1. 모집군에 따른 변표 테이블 선택 (다군만 표2 적용)
  const tableType = selection.군 === '다' ? '표2' : '표1';

  // 2. 선택된 테이블 기반 변환표준점수 산출
  const convertedScienceScore1 = getConvertedScore(percentile_science1, tableType);
  const convertedScienceScore2 = getConvertedScore(percentile_science2, tableType);

  let baseScore = 0;
  const englishScore = getEnglishScore(grade_english);
  const historyScore = getHistoryScore(grade_history);

  // 3. 계열별 반영 비율 및 가산점 적용
  if (selection.계열 === '인문') {
    // 사탐 과목당 5% 가산
    const scienceScore1 = humanitiesSubjects.includes(science1)
      ? convertedScienceScore1 * 1.05
      : convertedScienceScore1;

    const scienceScore2 = humanitiesSubjects.includes(science2)
      ? convertedScienceScore2 * 1.05
      : convertedScienceScore2;

    baseScore = (
      Number(standard_score_korean) * 0.35 * 5 +
      Number(standard_score_math) * 0.3 * 5 +
      (Number(scienceScore1) + Number(scienceScore2)) * 0.35 * 5 +
      englishScore + historyScore
    );

  } else if (selection.계열 === '사회') {
    // 경영, 경제 등 사회계열 (가산점 없음)
    baseScore = (
      Number(standard_score_korean) * 0.3 * 5 +
      Number(standard_score_math) * 0.4 * 5 +
      (Number(convertedScienceScore1) + Number(convertedScienceScore2)) * 0.3 * 5 +
      englishScore + historyScore
    );

  } else if (selection.계열 === '자연') {
    // 과탐 과목당 5% 가산
    const scienceScore1 = naturalScienceSubjects.includes(science1)
      ? convertedScienceScore1 * 1.05
      : convertedScienceScore1;

    const scienceScore2 = naturalScienceSubjects.includes(science2)
      ? convertedScienceScore2 * 1.05
      : convertedScienceScore2;

    baseScore = (
      Number(standard_score_korean) * 0.3 * 5 +
      Number(standard_score_math) * 0.35 * 5 +
      (Number(scienceScore1) + Number(scienceScore2)) * 0.35 * 5 +
      englishScore + historyScore
    );

  } else {
    return '불가';
  }

  return baseScore.toFixed(1);
};