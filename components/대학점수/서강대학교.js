import { createClient } from "@/utils/supabase/client";

const naturalScienceSubjects = [
  '물리학Ⅰ', '물리학Ⅱ', '화학Ⅰ', '화학Ⅱ',
  '생명과학Ⅰ', '생명과학Ⅱ', '지구과학Ⅰ', '지구과학Ⅱ'
];

const conversionTable = {
  자연: {
      100: 70.13, 99: 69.79, 98: 69.41, 97: 69.07, 96: 68.71, 95: 68.38,
      94: 68.12, 93: 67.90, 92: 67.69, 91: 67.38, 90: 67.09, 89: 66.87,
      88: 66.57, 87: 66.22, 86: 65.92, 85: 65.63, 84: 65.32, 83: 65.02,
      82: 64.75, 81: 64.40, 80: 64.12, 79: 63.82, 78: 63.51, 77: 63.17,
      76: 62.89, 75: 62.55, 74: 62.29, 73: 61.99, 72: 61.76, 71: 61.52,
      70: 61.27, 69: 60.99, 68: 60.66, 67: 60.30, 66: 59.98, 65: 59.59,
      64: 59.21, 63: 58.75, 62: 58.28, 61: 57.76, 60: 57.38, 59: 57.02,
      58: 56.68, 57: 56.33, 56: 55.98, 55: 55.51, 54: 55.06, 53: 54.64,
      52: 54.30, 51: 53.96, 50: 53.62, 49: 53.24, 48: 52.86, 47: 52.48,
      46: 52.07, 45: 51.66, 44: 51.23, 43: 50.89, 42: 50.55, 41: 50.19,
      40: 49.84, 39: 49.54, 38: 49.24, 37: 48.91, 36: 48.55, 35: 48.21,
      34: 47.86, 33: 47.55, 32: 47.25, 31: 46.95, 30: 46.65, 29: 46.30,
      28: 45.95, 27: 45.64, 26: 45.35, 25: 45.04, 24: 44.71, 23: 44.40,
      22: 44.14, 21: 43.87, 20: 43.61, 19: 43.34, 18: 43.05, 17: 42.74,
      16: 42.43, 15: 42.10, 14: 41.79, 13: 41.46, 12: 41.14, 11: 40.81,
      10: 40.47, 9: 40.07, 8: 39.66, 7: 39.22, 6: 38.73, 5: 38.33,
      4: 37.93, 3: 37.32, 2: 36.51, 1: 35.01, 0: 32.81
  },
  인문: {
      100: 69.89, 99: 69.40, 98: 68.90, 97: 68.59, 96: 68.34, 95: 68.08,
      94: 67.87, 93: 67.53, 92: 67.27, 91: 66.99, 90: 66.70, 89: 66.47,
      88: 66.22, 87: 65.97, 86: 65.72, 85: 65.47, 84: 65.20, 83: 64.91,
      82: 64.64, 81: 64.38, 80: 64.11, 79: 63.84, 78: 63.54, 77: 63.26,
      76: 63.00, 75: 62.75, 74: 62.50, 73: 62.14, 72: 61.77, 71: 61.49,
      70: 61.21, 69: 60.94, 68: 60.64, 67: 60.35, 66: 60.07, 65: 59.68,
      64: 59.28, 63: 58.89, 62: 58.51, 61: 58.13, 60: 57.71, 59: 57.34,
      58: 56.96, 57: 56.48, 56: 56.08, 55: 55.67, 54: 55.22, 53: 54.78,
      52: 54.38, 51: 53.89, 50: 53.49, 49: 53.11, 48: 52.71, 47: 52.28,
      46: 51.77, 45: 51.39, 44: 51.00, 43: 50.62, 42: 50.21, 41: 49.83,
      40: 49.50, 39: 49.18, 38: 48.83, 37: 48.48, 36: 48.16, 35: 47.84,
      34: 47.52, 33: 47.20, 32: 46.86, 31: 46.53, 30: 46.19, 29: 45.88,
      28: 45.58, 27: 45.27, 26: 44.93, 25: 44.60, 24: 44.28, 23: 43.96,
      22: 43.66, 21: 43.33, 20: 43.03, 19: 42.75, 18: 42.48, 17: 42.18,
      16: 41.86, 15: 41.57, 14: 41.28, 13: 41.01, 12: 40.71, 11: 40.40,
      10: 39.98, 9: 39.64, 8: 39.25, 7: 38.85, 6: 38.42, 5: 37.93,
      4: 37.45, 3: 36.95, 2: 36.30, 1: 35.20, 0: 33.24
  }
};


// Helper function to get the converted score
const getConvertedScore = (percentile, subject) => {
  const track = naturalScienceSubjects.includes(subject) ? '자연' : '인문';
  return conversionTable[track][percentile] || 0;
};

export const 서강대학교 = async (userId, selection) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('exam_results')
    .select('standard_score_korean, standard_score_math, percentile_science1, percentile_science2, grade_korean, grade_math, grade_science1, grade_science2, grade_english, grade_history, science1, science2')
    .eq('user_id', userId)
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
    science1 && science2 // science1과 science2가 둘 다 있을 경우에만 평균 계산
      ? (Number(grade_science1) + Number(grade_science2)) / 2
      : 9, // 하나라도 없으면 최악 등급으로 설정
  ];
  
  // 상위 3개 등급 합 계산 함수
  const isEligibleForApplication = (grades) => {
    const topThreeGrades = [...grades].sort((a, b) => a - b).slice(0, 3); // 상위 3개 추출
    const total = topThreeGrades.reduce((sum, grade) => sum + grade, 0); // 합산
    console.log("상위 3개 등급:", topThreeGrades, "합계:", total); // 디버깅 로그 추가
    return total <= 9; // 상위 3개 등급 합이 7 이하여야 함
  };
  
  // 지원 가능 여부 체크
  if (Number(grade_history) >= 5) return "불가 : 최저 미충족"; // 역사 등급 조건 추가
  if (!isEligibleForApplication(grades)) return "불가 : 최저 미충족";



  // Calculate science scores
  const scienceScore1 = getConvertedScore(percentile_science1, science1);
  const scienceScore2 = getConvertedScore(percentile_science2, science2);

  // Calculate total score
  const baseScore = (
    Number(standard_score_korean) * 1.1 +
    Number(standard_score_math) * 1.3 +
    (scienceScore1 + scienceScore2) * 0.6 +
    getEnglishScore(grade_english) +
    getHistoryBonus(grade_history)
  );

  return baseScore.toFixed(1);
};

// Helper function for calculating the English score
const getEnglishScore = (grade) => {
  const englishScores = {
    1: 100, 2: 99, 3: 98, 4: 97, 5: 96,
    6: 95, 7: 94, 8: 93, 9: 92
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
