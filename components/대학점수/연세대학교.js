import { createClient } from "@/utils/supabase/client";

// 탐구 변환 점수 테이블
const conversionTable = {
  인문:{
    100: 69.99, 99: 69.07, 98: 68.09, 97: 67.36, 96: 66.68, 95: 66.04,
  94: 65.50, 93: 65.06, 92: 64.53, 91: 64.17, 90: 63.81, 89: 63.42,
  88: 63.09, 87: 62.73, 86: 62.38, 85: 62.05, 84: 61.70, 83: 61.33,
  82: 61.00, 81: 60.62, 80: 60.29, 79: 59.93, 78: 59.56, 77: 59.18,
  76: 58.85, 75: 58.49, 74: 58.17, 73: 57.76, 72: 57.38, 71: 57.06,
  70: 56.74, 69: 56.40, 68: 56.01, 67: 55.60, 66: 55.23, 65: 54.88,
  64: 54.52, 63: 54.15, 62: 53.76, 61: 53.36, 60: 52.99, 59: 52.65,
  58: 52.32, 57: 51.95, 56: 51.60, 55: 51.21, 54: 50.80, 53: 50.41,
  52: 50.07, 51: 49.68, 50: 49.34, 49: 49.00, 48: 48.65, 47: 48.29,
  46: 47.86, 45: 47.50, 44: 47.13, 43: 46.80, 42: 46.46, 41: 46.12,
  40: 45.81, 39: 45.53, 38: 45.23, 37: 44.93, 36: 44.61, 35: 44.31,
  34: 44.02, 33: 43.73, 32: 43.43, 31: 43.15, 30: 42.86, 29: 42.56,
  28: 42.26, 27: 41.98, 26: 41.70, 25: 41.41, 24: 41.11, 23: 40.83,
  22: 40.56, 21: 40.29, 20: 40.03, 19: 39.79, 18: 39.52, 17: 39.26,
  16: 38.97, 15: 38.68, 14: 38.41, 13: 38.14, 12: 37.87, 11: 37.57,
  10: 37.22, 9: 36.89, 8: 36.52, 7: 36.14, 6: 35.73, 5: 35.31,
  4: 34.92, 3: 34.41, 2: 33.76, 1: 32.58, 0: 30.70},
  자연:{
    100: 69.99, 99: 69.07, 98: 68.09, 97: 67.36, 96: 66.68, 95: 66.04,
    94: 65.50, 93: 65.06, 92: 64.53, 91: 64.17, 90: 63.81, 89: 63.42,
    88: 63.09, 87: 62.73, 86: 62.38, 85: 62.05, 84: 61.70, 83: 61.33,
    82: 61.00, 81: 60.62, 80: 60.29, 79: 59.93, 78: 59.56, 77: 59.18,
    76: 58.85, 75: 58.49, 74: 58.17, 73: 57.76, 72: 57.38, 71: 57.06,
    70: 56.74, 69: 56.40, 68: 56.01, 67: 55.60, 66: 55.23, 65: 54.88,
    64: 54.52, 63: 54.15, 62: 53.76, 61: 53.36, 60: 52.99, 59: 52.65,
    58: 52.32, 57: 51.95, 56: 51.60, 55: 51.21, 54: 50.80, 53: 50.41,
    52: 50.07, 51: 49.68, 50: 49.34, 49: 49.00, 48: 48.65, 47: 48.29,
    46: 47.86, 45: 47.50, 44: 47.13, 43: 46.80, 42: 46.46, 41: 46.12,
    40: 45.81, 39: 45.53, 38: 45.23, 37: 44.93, 36: 44.61, 35: 44.31,
    34: 44.02, 33: 43.73, 32: 43.43, 31: 43.15, 30: 42.86, 29: 42.56,
    28: 42.26, 27: 41.98, 26: 41.70, 25: 41.41, 24: 41.11, 23: 40.83,
    22: 40.56, 21: 40.29, 20: 40.03, 19: 39.79, 18: 39.52, 17: 39.26,
    16: 38.97, 15: 38.68, 14: 38.41, 13: 38.14, 12: 37.87, 11: 37.57,
    10: 37.22, 9: 36.89, 8: 36.52, 7: 36.14, 6: 35.73, 5: 35.31,
    4: 34.92, 3: 34.41, 2: 33.76, 1: 32.58, 0: 30.70}
};

// 영어 환산 점수
const getEnglishScore = (grade) => {
  const englishScores = {
    1: 100, 2: 95, 3: 87.5, 4: 75, 5: 60,
    6: 40, 7: 25, 8: 12.5, 9: 5
  };
  return englishScores[grade] || 0;
};

// 한국사 감점
const getHistoryPenalty = (grade) => {
  const historyPenalties = {
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0.2,
    6: 0.4, 7: 0.6, 8: 0.8, 9: 1
  };
  return historyPenalties[grade] || 0;
};

// 탐구 변환 점수 계산
const getConvertedScore = (percentile, subject) => {
  const track = naturalScienceSubjects.includes(subject) ? '자연' : '인문';
  const percentileScore = conversionTable[track][percentile];
  return percentileScore ;
};

// 특정 과목 리스트
const humanitiesSubjects = [
  '생활과 윤리', '윤리와 사상', '한국지리', '세계지리',
  '동아시아사', '세계사', '경제', '정치와 법', '사회·문화'
];

const naturalScienceSubjects = [
  '물리학Ⅰ', '물리학Ⅱ', '화학Ⅰ', '화학Ⅱ',
  '지구과학Ⅰ', '지구과학Ⅱ', '생명과학Ⅰ', '생명과학Ⅱ'
];

// 연세대학교 점수 계산
export const 연세대학교 = async (userId, selection) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('exam_results')
    .select('standard_score_korean, standard_score_math, percentile_science1, percentile_science2, grade_english, grade_history, science1, science2')
    .eq('user_id', userId)
    .single();

  if (error || !data) return '불가'; // 데이터 없을 시

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

  let baseScore = 0;

  const convertedScienceScore1 = getConvertedScore(percentile_science1, science1);
  const convertedScienceScore2 = getConvertedScore(percentile_science2, science2);

  // 계열별 점수 계산
  if (selection.계열 === '인문') {
    const scienceScore1 = humanitiesSubjects.includes(science1)
    ? convertedScienceScore1 * 1.03
    : convertedScienceScore1;

    const scienceScore2 = humanitiesSubjects.includes(science2)
    ? convertedScienceScore2 * 1.03
    : convertedScienceScore2;

    baseScore = (
      Number(standard_score_korean) * 1.5 +
      Number(standard_score_math) +
      getEnglishScore(grade_english) +
      scienceScore1 +
      scienceScore2
    ) * 1000 / 800;

  } else if (selection.계열 === '자연') {
    const scienceScore1 = naturalScienceSubjects.includes(science1)
    ? convertedScienceScore1 * 1.03
    : convertedScienceScore1;

    const scienceScore2 = naturalScienceSubjects.includes(science2)
    ? convertedScienceScore2 * 1.03
    : convertedScienceScore2;

    baseScore = (
      Number(standard_score_korean) +
      Number(standard_score_math) * 1.5 +
      getEnglishScore(grade_english) +
      (scienceScore1 + scienceScore2) * 1.5
    ) * 1000 / 900;

  } else if (selection.계열 === '의학') {
    const scienceScore1 = naturalScienceSubjects.includes(science1)
    ? convertedScienceScore1 * 1.03
    : convertedScienceScore1;

    const scienceScore2 = naturalScienceSubjects.includes(science2)
    ? convertedScienceScore2 * 1.03
    : convertedScienceScore2;

    baseScore = (
      Number(standard_score_korean) +
      Number(standard_score_math) * 1.5 +
      getEnglishScore(grade_english) +
      (scienceScore1 + scienceScore2) * 1.5
    )

  } else if (selection.계열 === '생활') {
    baseScore = (
      Number(standard_score_korean) +
      Number(standard_score_math) +
      getEnglishScore(grade_english) +
      (convertedScienceScore1 + convertedScienceScore2) * 0.5
    ) * 1000 / 600;
  } else {
    return '불가'; // 잘못된 계열
  }

  // 최종 점수 계산
  const finalScore = baseScore - getHistoryPenalty(grade_history);
  return finalScore.toFixed(2);
};
