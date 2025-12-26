import { createClient } from "@/utils/supabase/client";

const naturalScienceSubjects = [
  '물리학Ⅰ', '물리학Ⅱ', '화학Ⅰ', '화학Ⅱ',
  '생명과학Ⅰ', '생명과학Ⅱ', '지구과학Ⅰ', '지구과학Ⅱ'
];

const conversionTable = {
  자연: {
    100: 70.50, 99: 70.02, 98: 69.55, 97: 69.21, 96: 68.93, 95: 68.69,
    94: 68.34, 93: 68.01, 92: 67.75, 91: 67.51, 90: 67.27, 89: 67.02,
    88: 66.77, 87: 66.50, 86: 66.26, 85: 66.03, 84: 65.72, 83: 65.45,
    82: 65.20, 81: 64.93, 80: 64.65, 79: 64.37, 78: 64.08, 77: 63.78,
    76: 63.50, 75: 63.21, 74: 62.91, 73: 62.61, 72: 62.33, 71: 62.06,
    70: 61.78, 69: 61.40, 68: 61.03, 67: 60.68, 66: 60.34, 65: 59.93,
    64: 59.52, 63: 59.12, 62: 58.71, 61: 58.29, 60: 57.89, 59: 57.49,
    58: 57.05, 57: 56.65, 56: 56.24, 55: 55.83, 54: 55.32, 53: 54.89,
    52: 54.52, 51: 54.12, 50: 53.71, 49: 53.31, 48: 52.89, 47: 52.48,
    46: 52.05, 45: 51.69, 44: 51.35, 43: 50.87, 42: 50.41, 41: 50.02,
    40: 49.63, 39: 49.26, 38: 48.81, 37: 48.45, 36: 48.12, 35: 47.82,
    34: 47.49, 33: 47.16, 32: 46.88, 31: 46.61, 30: 46.33, 29: 46.08,
    28: 45.85, 27: 45.61, 26: 45.30, 25: 44.96, 24: 44.61, 23: 44.30,
    22: 43.99, 21: 43.67, 20: 43.40, 19: 43.11, 18: 42.82, 17: 42.49,
    16: 42.18, 15: 41.86, 14: 41.54, 13: 41.21, 12: 40.88, 11: 40.60,
    10: 40.29, 9: 39.98, 8: 39.65, 7: 39.14, 6: 38.63, 5: 38.14,
    4: 37.61, 3: 37.02, 2: 36.25, 1: 35.27, 0: 33.07,
  },
  인문: {
    100: 70.00, 99: 69.52, 98: 69.05, 97: 68.71, 96: 68.43, 95: 68.19,
    94: 67.95, 93: 67.73, 92: 67.46, 91: 67.22, 90: 66.99, 89: 66.74,
    88: 66.48, 87: 66.21, 86: 65.97, 85: 65.74, 84: 65.43, 83: 65.17,
    82: 64.91, 81: 64.65, 80: 64.36, 79: 64.08, 78: 63.79, 77: 63.49,
    76: 63.22, 75: 62.93, 74: 62.62, 73: 62.32, 72: 62.04, 71: 61.77,
    70: 61.49, 69: 61.12, 68: 60.74, 67: 60.39, 66: 60.05, 65: 59.64,
    64: 59.24, 63: 58.83, 62: 58.42, 61: 58.00, 60: 57.61, 59: 57.20,
    58: 56.76, 57: 56.37, 56: 55.96, 55: 55.54, 54: 55.03, 53: 54.61,
    52: 54.23, 51: 53.84, 50: 53.43, 49: 53.02, 48: 52.60, 47: 52.20,
    46: 51.77, 45: 51.40, 44: 51.06, 43: 50.58, 42: 50.13, 41: 49.73,
    40: 49.35, 39: 48.97, 38: 48.52, 37: 48.16, 36: 47.83, 35: 47.53,
    34: 47.20, 33: 46.87, 32: 46.60, 31: 46.32, 30: 46.05, 29: 45.79,
    28: 45.56, 27: 45.32, 26: 45.01, 25: 44.67, 24: 44.32, 23: 44.01,
    22: 43.70, 21: 43.39, 20: 43.11, 19: 42.82, 18: 42.54, 17: 42.21,
    16: 41.89, 15: 41.57, 14: 41.25, 13: 40.92, 12: 40.59, 11: 40.32,
    10: 40.01, 9: 39.69, 8: 39.36, 7: 38.85, 6: 38.35, 5: 37.85,
    4: 37.32, 3: 36.73, 2: 35.96, 1: 34.98, 0: 32.78,
  }
};


// Helper function to get the converted score
const getConvertedScore = (percentile, subject) => {
  const track = naturalScienceSubjects.includes(subject) ? '자연' : '인문';
  return conversionTable[track][percentile] || 0;
};

// 핵심 수정: 세 번째 인자 isAdmin 추가 (기본값 false)
export const 서강대학교 = async (userId, selection, isAdmin = false) => {
  const supabase = createClient();

  // isAdmin 여부에 따라 테이블과 ID 컬럼 결정
  const tableName = isAdmin ? 'admin_managed_students' : 'exam_results';
  const idColumn = isAdmin ? 'id' : 'user_id';

  const { data, error } = await supabase
    .from(tableName)
    .select(
      'standard_score_korean, standard_score_math, percentile_science1, percentile_science2, grade_korean, grade_math, grade_science1, grade_science2, grade_english, grade_history, science1, science2'
    )
    .eq(idColumn, userId)
    .single();

  if (error || !data) return '불가';

  const {
    standard_score_korean,
    standard_score_math,
    grade_korean, 
    grade_math, 
    grade_science1, 
    grade_science2,
    percentile_science1,
    percentile_science2,
    grade_english,
    grade_history,
    science1,
    science2
  } = data;

  const grades = [
    Number(grade_korean) || 9, // 값이 없으면 최악 등급으로 설정
    Number(grade_math) || 9,
    Number(grade_english) || 9,
    science1 && science2
    ? Math.min(Number(grade_science1), Number(grade_science2))
    : 9
  
  ];
  
  // 상위 3개 등급 합 계산 함수
  const isEligibleForApplication = (grades) => {
    const topThreeGrades = [...grades].sort((a, b) => a - b).slice(0, 3); // 상위 3개 추출
    const total = topThreeGrades.reduce((sum, grade) => sum + grade, 0); // 합산
    console.log("상위 3개 등급:", topThreeGrades, "합계:", total); // 디버깅 로그 추가
    return total <= 9; // 상위 3개 등급 합이 9 이하여야 함
  };
  
  // 지원 가능 여부 체크
  if (Number(grade_history) >= 5) return "불가 : 최저 미충족"; // 역사 등급 조건 추가
  if (!isEligibleForApplication(grades)) return "불가 : 최저 미충족";

  // Calculate science scores
  const scienceScore1 = getConvertedScore(percentile_science1, science1);
  const scienceScore2 = getConvertedScore(percentile_science2, science2);

  // ✅ 국어/수학 중 더 높은 점수에 1.3, 낮은 점수에 1.1 반영
  const koreanNum = Number(standard_score_korean) || 0;
  const mathNum   = Number(standard_score_math) || 0;

  const higherKorMath = Math.max(koreanNum, mathNum);
  const lowerKorMath  = Math.min(koreanNum, mathNum);

  const baseScore = (
    higherKorMath * 1.3 +           // 더 높은 쪽
    lowerKorMath * 1.1 +            // 더 낮은 쪽
    (scienceScore1 + scienceScore2) * 0.6 +
    getEnglishScore(grade_english) +
    getHistoryBonus(grade_history)
  );

  return baseScore.toFixed(1);
};

// Helper function for calculating the English score
const getEnglishScore = (grade) => {
  const englishScores = {
    1: 100, 2: 99.5, 3: 98.5, 4: 97, 5: 95,
    6: 92.5, 7: 89.5, 8: 86, 9: 82
  };
  return englishScores[grade] || 0;
};

// Helper function for calculating the History bonus
const getHistoryBonus = (grade) => {
  const historyScores = {
    1: 10, 2: 10, 3: 10, 4: 10, 5: 9.5,
    6: 9.0, 7: 8.5, 8: 8.0, 9: 7.5
  };
  return historyScores[grade] || 0;
};
