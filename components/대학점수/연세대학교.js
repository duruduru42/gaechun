import { createClient } from "@/utils/supabase/client";

// 탐구 변환 점수 테이블
const conversionTable = {
  인문:{
    100: 70.00, 99: 68.78, 98: 68.10, 97: 67.36, 96: 66.69, 95: 66.05,
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
    4: 34.93, 3: 34.42, 2: 33.81, 1: 32.79, 0: 30.71},
  자연:{
    100: 70.00, 99: 68.78, 98: 68.10, 97: 67.36, 96: 66.69, 95: 66.05,
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
    4: 34.93, 3: 34.42, 2: 33.81, 1: 32.79, 0: 30.71}
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
  '생활과윤리', '윤리와사상', '한국지리', '세계지리',
  '동아시아사', '세계사', '경제', '정치와법', '사회문화'
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
