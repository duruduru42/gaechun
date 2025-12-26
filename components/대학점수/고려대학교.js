import { createClient } from "@/utils/supabase/client";

const naturalScienceSubjects = [
  '물리학Ⅰ', '물리학Ⅱ', '화학Ⅰ', '화학Ⅱ',
  '생명과학Ⅰ', '생명과학Ⅱ', '지구과학Ⅰ', '지구과학Ⅱ'
];

const conversionTable = {
  자연: {
    100: 70.11, 99: 69.17, 98: 68.08, 97: 67.36, 96: 66.76, 95: 66.15,
    94: 65.66, 93: 65.18, 92: 64.73, 91: 64.34, 90: 63.97, 89: 63.56,
    88: 63.18, 87: 62.79, 86: 62.43, 85: 62.08, 84: 61.73, 83: 61.38,
    82: 61.05, 81: 60.72, 80: 60.35, 79: 60.00, 78: 59.65, 77: 59.29,
    76: 58.97, 75: 58.61, 74: 58.22, 73: 57.86, 72: 57.49, 71: 57.15,
    70: 56.80, 69: 56.46, 68: 56.11, 67: 55.74, 66: 55.43, 65: 55.05,
    64: 54.67, 63: 54.29, 62: 53.92, 61: 53.52, 60: 53.12, 59: 52.71,
    58: 52.30, 57: 51.92, 56: 51.57, 55: 51.21, 54: 50.80, 53: 50.44,
    52: 50.06, 51: 49.68, 50: 49.26, 49: 48.88, 48: 48.50, 47: 48.15,
    46: 47.78, 45: 47.47, 44: 47.15, 43: 46.75, 42: 46.39, 41: 46.02,
    40: 45.67, 39: 45.34, 38: 44.98, 37: 44.65, 36: 44.34, 35: 44.07,
    34: 43.77, 33: 43.47, 32: 43.21, 31: 42.96, 30: 42.70, 29: 42.46,
    28: 42.24, 27: 41.99, 26: 41.70, 25: 41.42, 24: 41.13, 23: 40.85,
    22: 40.57, 21: 40.30, 20: 40.04, 19: 39.77, 18: 39.51, 17: 39.24,
    16: 38.96, 15: 38.67, 14: 38.40, 13: 38.13, 12: 37.87, 11: 37.60,
    10: 37.32, 9: 37.04, 8: 36.72, 7: 36.31, 6: 35.90, 5: 35.47,
    4: 34.99, 3: 34.43, 2: 33.70, 1: 32.82, 0: 31.17,
  },
  인문: {
    100: 70.11, 99: 69.17, 98: 68.08, 97: 67.36, 96: 66.76, 95: 66.15,
    94: 65.66, 93: 65.18, 92: 64.73, 91: 64.34, 90: 63.97, 89: 63.56,
    88: 63.18, 87: 62.79, 86: 62.43, 85: 62.08, 84: 61.73, 83: 61.38,
    82: 61.05, 81: 60.72, 80: 60.35, 79: 60.00, 78: 59.65, 77: 59.29,
    76: 58.97, 75: 58.61, 74: 58.22, 73: 57.86, 72: 57.49, 71: 57.15,
    70: 56.80, 69: 56.46, 68: 56.11, 67: 55.74, 66: 55.43, 65: 55.05,
    64: 54.67, 63: 54.29, 62: 53.92, 61: 53.52, 60: 53.12, 59: 52.71,
    58: 52.30, 57: 51.92, 56: 51.57, 55: 51.21, 54: 50.80, 53: 50.44,
    52: 50.06, 51: 49.68, 50: 49.26, 49: 48.88, 48: 48.50, 47: 48.15,
    46: 47.78, 45: 47.47, 44: 47.15, 43: 46.75, 42: 46.39, 41: 46.02,
    40: 45.67, 39: 45.34, 38: 44.98, 37: 44.65, 36: 44.34, 35: 44.07,
    34: 43.77, 33: 43.47, 32: 43.21, 31: 42.96, 30: 42.70, 29: 42.46,
    28: 42.24, 27: 41.99, 26: 41.70, 25: 41.42, 24: 41.13, 23: 40.85,
    22: 40.57, 21: 40.30, 20: 40.04, 19: 39.77, 18: 39.51, 17: 39.24,
    16: 38.96, 15: 38.67, 14: 38.40, 13: 38.13, 12: 37.87, 11: 37.60,
    10: 37.32, 9: 37.04, 8: 36.72, 7: 36.31, 6: 35.90, 5: 35.47,
    4: 34.99, 3: 34.43, 2: 33.70, 1: 32.82, 0: 31.17,
  }
};

// Helper function to get the converted score
const getConvertedScore = (percentile, subject) => {
  const track = naturalScienceSubjects.includes(subject) ? '자연' : '인문';
  return conversionTable[track][percentile] || 0;
};

// 고려대학교(세종) 점수 계산 함수
// 핵심 수정: 세 번째 인자 isAdmin 추가 (기본값 false)
export const 고려대학교 = async (userId, selection, isAdmin = false) => {
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
  } = data;

  // 탐구 과목 변환 점수 계산
  let convertedScienceScore1 = getConvertedScore(percentile_science1, science1);
  let convertedScienceScore2 = getConvertedScore(percentile_science2, science2);

  // ✅ 자연 계열일 때, 자연탐구 과목에 각각 3% 가산점
  if (selection.계열 === '자연') {
    if (naturalScienceSubjects.includes(science1)) {
      convertedScienceScore1 *= 1.03;
    }
    if (naturalScienceSubjects.includes(science2)) {
      convertedScienceScore2 *= 1.03;
    }
  }

  const totalScienceConvertedScore = convertedScienceScore1 + convertedScienceScore2;

  let score = 0;

  if (selection.계열 === '인문') {
    score =
      ((Number(standard_score_korean) +
        Number(standard_score_math) +
        Number(totalScienceConvertedScore) * 0.8) /
        560) *
      1000;
  } else if (selection.계열 === '자연') {
    score =
      ((Number(standard_score_korean) +
        Number(standard_score_math) * 1.2 +
        Number(totalScienceConvertedScore)) /
        640) *
      1000;
  } else {
    return '불가'; // 잘못된 계열 값일 경우
  }

  const englishPenalty = {
    1: 0, 2: 3, 3: 6, 4: 9, 5: 12,
    6: 15, 7: 18, 8: 21, 9: 24
  };
  score -= englishPenalty[grade_english] || 0;

  // Add points for History grade
  const historyBonus = {
    1: 10, 2: 10, 3: 10, 4: 10, 5: 9.8,
    6: 9.6, 7: 9.4, 8: 9.2, 9: 8
  };
  score += historyBonus[grade_history] || 0;

  return parseFloat(score.toFixed(2));
};
