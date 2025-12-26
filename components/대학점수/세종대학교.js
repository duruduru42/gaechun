import { createClient } from "@/utils/supabase/client";

// 탐구 변환 점수 테이블 (기본 값 적용)
const naturalScienceSubjects = [
  '물리학Ⅰ', '물리학Ⅱ', '화학Ⅰ', '화학Ⅱ',
  '생명과학Ⅰ', '생명과학Ⅱ', '지구과학Ⅰ', '지구과학Ⅱ'
];

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
      4: 34.99, 3: 34.43, 2: 33.71, 1: 32.82, 0: 31.12
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
      4: 34.99, 3: 34.43, 2: 33.71, 1: 32.82, 0: 31.12
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
// 핵심 수정: 세 번째 인자 isAdmin 추가 (기본값 false)
export const 세종대학교 = async (userId, selection, isAdmin = false) => {
  const supabase = createClient();

  // isAdmin 여부에 따라 테이블과 ID 컬럼 결정
  const tableName = isAdmin ? 'admin_managed_students' : 'exam_results';
  const idColumn = isAdmin ? 'id' : 'user_id';

  // 사용자 시험 데이터 불러오기
  const { data, error } = await supabase
    .from(tableName)
    .select('standard_score_korean, standard_score_math, percentile_science1, percentile_science2, grade_english, grade_history, science1, science2, math')
    .eq(idColumn, userId)
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
