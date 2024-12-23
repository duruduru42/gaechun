import { createClient } from "@/utils/supabase/client";

const naturalScienceSubjects = [
  '물리학Ⅰ', '물리학Ⅱ', '화학Ⅰ', '화학Ⅱ',
  '생명과학Ⅰ', '생명과학Ⅱ', '지구과학Ⅰ', '지구과학Ⅱ'
];

const conversionTable = {
  자연: {
    100: 70.13, 99: 69.81, 98: 69.45, 97: 69.12, 96: 68.77, 95: 68.46,
    94: 68.21, 93: 68.00, 92: 67.80, 91: 67.50, 90: 67.23, 89: 67.02,
    88: 66.73, 87: 66.40, 86: 66.11, 85: 65.83, 84: 65.55, 83: 65.26,
    82: 65.00, 81: 64.67, 80: 64.41, 79: 64.12, 78: 63.82, 77: 63.50,
    76: 63.23, 75: 62.91, 74: 62.66, 73: 62.38, 72: 62.15, 71: 61.93,
    70: 61.69, 69: 61.43, 68: 61.11, 67: 60.76, 66: 60.46, 65: 60.07,
    64: 59.69, 63: 59.24, 62: 58.77, 61: 58.25, 60: 57.86, 59: 57.50,
    58: 57.16, 57: 56.82, 56: 56.47, 55: 55.99, 54: 55.54, 53: 55.12,
    52: 54.78, 51: 54.44, 50: 54.10, 49: 53.73, 48: 53.34, 47: 52.97,
    46: 52.55, 45: 52.14, 44: 51.71, 43: 51.37, 42: 51.03, 41: 50.67,
    40: 50.33, 39: 50.02, 38: 49.72, 37: 49.39, 36: 49.03, 35: 48.69,
    34: 48.35, 33: 48.03, 32: 47.73, 31: 47.44, 30: 47.14, 29: 46.79,
    28: 46.43, 27: 46.13, 26: 45.83, 25: 45.52, 24: 45.19, 23: 44.88,
    22: 44.62, 21: 44.36, 20: 44.09, 19: 43.83, 18: 43.53, 17: 43.22,
    16: 42.91, 15: 42.58, 14: 42.28, 13: 41.95, 12: 41.63, 11: 41.30,
    10: 40.96, 9: 40.55, 8: 40.14, 7: 39.70, 6: 39.22, 5: 38.81,
    4: 38.42, 3: 37.80, 2: 37.00, 1: 35.49, 0: 33.29,
  },
  인문: {
    100: 70.13, 99: 69.81, 98: 69.45, 97: 69.12, 96: 68.77, 95: 68.46,
    94: 68.21, 93: 68.00, 92: 67.80, 91: 67.50, 90: 67.23, 89: 67.02,
    88: 66.73, 87: 66.40, 86: 66.11, 85: 65.83, 84: 65.55, 83: 65.26,
    82: 65.00, 81: 64.67, 80: 64.41, 79: 64.12, 78: 63.82, 77: 63.50,
    76: 63.23, 75: 62.91, 74: 62.66, 73: 62.38, 72: 62.15, 71: 61.93,
    70: 61.69, 69: 61.43, 68: 61.11, 67: 60.76, 66: 60.46, 65: 60.07,
    64: 59.69, 63: 59.24, 62: 58.77, 61: 58.25, 60: 57.86, 59: 57.50,
    58: 57.16, 57: 56.82, 56: 56.47, 55: 55.99, 54: 55.54, 53: 55.12,
    52: 54.78, 51: 54.44, 50: 54.10, 49: 53.73, 48: 53.34, 47: 52.97,
    46: 52.55, 45: 52.14, 44: 51.71, 43: 51.37, 42: 51.03, 41: 50.67,
    40: 50.33, 39: 50.02, 38: 49.72, 37: 49.39, 36: 49.03, 35: 48.69,
    34: 48.35, 33: 48.03, 32: 47.73, 31: 47.44, 30: 47.14, 29: 46.79,
    28: 46.43, 27: 46.13, 26: 45.83, 25: 45.52, 24: 45.19, 23: 44.88,
    22: 44.62, 21: 44.36, 20: 44.09, 19: 43.83, 18: 43.53, 17: 43.22,
    16: 42.91, 15: 42.58, 14: 42.28, 13: 41.95, 12: 41.63, 11: 41.30,
    10: 40.96, 9: 40.55, 8: 40.14, 7: 39.70, 6: 39.22, 5: 38.81,
    4: 38.42, 3: 37.80, 2: 37.00, 1: 35.49, 0: 33.29,
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
