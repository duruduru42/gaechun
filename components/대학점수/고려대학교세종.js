import { createClient } from "@/utils/supabase/client";

// 과탐 및 사탐 구분
const naturalScienceSubjects = [
  '물리학Ⅰ', '물리학Ⅱ', '화학Ⅰ', '화학Ⅱ',
  '지구과학Ⅰ', '지구과학Ⅱ', '생명과학Ⅰ', '생명과학Ⅱ'
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

// 영어 환산 점수 표
const getEnglishScore = (grade) => {
  const englishScores = {
    1: 100, 2: 95, 3: 90, 4: 80, 5: 70,
    6: 60, 7: 40, 8: 20, 9: 10
  };
  return englishScores[grade] || 0;
};

// 고려대학교(세종) 점수 계산 함수
// 핵심 수정: 세 번째 인자 isAdmin 추가 (기본값 false)
export const 고려대학교세종 = async (userId, selection, isAdmin = false) => {
  const supabase = createClient();

  // isAdmin 여부에 따라 테이블과 ID 컬럼 결정
  const tableName = isAdmin ? 'admin_managed_students' : 'exam_results';
  const idColumn = isAdmin ? 'id' : 'user_id';

  // 사용자 시험 데이터 불러오기
  const { data, error } = await supabase
    .from(tableName)
    .select(
      'standard_score_korean, standard_score_math, percentile_science1, percentile_science2, grade_english, science1, science2, math'
    )
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
    science1,
    science2,
    math
  } = data;

  // 영어 점수 계산
  const englishScore = getEnglishScore(grade_english);

  // 🔹 기본 탐구 변환 점수
  let convertedScienceScore1 = getConvertedScore(percentile_science1, science1);
  let convertedScienceScore2 = getConvertedScore(percentile_science2, science2);

  const isBothNaturalScience =
    naturalScienceSubjects.includes(science1) &&
    naturalScienceSubjects.includes(science2);

  // 🔹 과탐 3% 가산 대상 모집단위
  const scienceBonusMajors = [
    '디지털헬스케어공학과',
    '첨단융합신약학과',
    '자유전공학부(과학기술)',
  ];

  // ✅ 오직 이 모집단위일 때만, 과학탐구 과목에 3% 가산
  if (scienceBonusMajors.includes(selection.모집단위)) {
    if (naturalScienceSubjects.includes(science1)) {
      convertedScienceScore1 *= 1.03;
    }
    if (naturalScienceSubjects.includes(science2)) {
      convertedScienceScore2 *= 1.03;
    }
  }


  if (selection.계열 === '자연' && (math !== '미적분' && math !== '기하')) {
    return '불가 : 수학 미적기하 필수 ';
  }

  // 과탐 필수 조건 (자연계)
  if (selection.계열 === '자연' && !isBothNaturalScience) {
    return '불가 : 과학탐구 필수';
  }

  // 점수 계산
  let totalScore = 0;
  let maxScore = 0;

  const totalScienceConvertedScore = convertedScienceScore1 + convertedScienceScore2;

  if (selection.계열 === '인문') {
    totalScore =
      standard_score_korean * 0.35 +
      standard_score_math * 0.2 +
      englishScore * 0.2 +
      totalScienceConvertedScore * 0.25;
    maxScore =
      147 * 0.35 + 139 * 0.2 + 100 * 0.2 + 68.83 * 2 * 0.25;
  } else if (selection.계열 === '상경') {
    totalScore =
      standard_score_korean * 0.3 +
      standard_score_math * 0.3 +
      englishScore * 0.2 +
      totalScienceConvertedScore * 0.2;
    maxScore =
      147 * 0.3 + 139 * 0.3 + 100 * 0.2 + 68.83 * 2 * 0.2;
  } else if (selection.계열 === '자연') {
    totalScore =
      standard_score_korean * 0.2 +
      standard_score_math * 0.35 +
      englishScore * 0.2 +
      totalScienceConvertedScore * 0.25;
    maxScore =
      147 * 0.2 + 139 * 0.35 + 100 * 0.2 + 68.83 * 2 * 0.25;
  } else if (selection.계열 === '데이터') {
    totalScore =
      standard_score_korean * 0.2 +
      standard_score_math * 0.35 +
      englishScore * 0.2 +
      totalScienceConvertedScore * 0.25;
    maxScore =
      147 * 0.2 + 139 * 0.35 + 100 * 0.2 + 68.83 * 2 * 0.25;
   } else if (selection.계열 === '공과') {
        totalScore =
          standard_score_korean * 0.2 +
          standard_score_math * 0.35 +
          englishScore * 0.2 +
          totalScienceConvertedScore * 0.25;
        maxScore =
          147 * 0.2 + 139 * 0.35 + 100 * 0.2 + 68.83 * 2 * 0.25;
  } else {
    return '불가';
  }

  const finalScore = (totalScore / maxScore) * 1000;
  return finalScore.toFixed(2);
};
