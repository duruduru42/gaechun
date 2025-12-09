import { createClient } from "@/utils/supabase/client";

// 과탐 및 사탐 구분
const naturalScienceSubjects = [
  '물리학Ⅰ', '물리학Ⅱ', '화학Ⅰ', '화학Ⅱ',
  '지구과학Ⅰ', '지구과학Ⅱ', '생명과학Ⅰ', '생명과학Ⅱ'
];

const humanitiesSubjects = [
  '생활과윤리', '윤리와사상', '한국지리', '세계지리', 
  '동아시아사', '세계사', '경제', '정치와법', '사회·문화'
];

const conversionTable = {
  자연: {
    100: 70.13, 99: 68.84, 98: 67.92, 97: 67.13, 96: 66.33, 95: 65.62,
    94: 65.03, 93: 64.56, 92: 64.09, 91: 63.72, 90: 63.37, 89: 62.88,
    88: 62.52, 87: 62.10, 86: 61.74, 85: 61.38, 84: 61.01, 83: 60.65,
    82: 60.32, 81: 59.90, 80: 59.56, 79: 59.20, 78: 58.82, 77: 58.42,
    76: 58.08, 75: 57.67, 74: 57.35, 73: 56.99, 72: 56.71, 71: 56.42,
    70: 56.12, 69: 55.79, 68: 55.38, 67: 54.94, 66: 54.56, 65: 54.21,
    64: 53.86, 63: 53.46, 62: 53.03, 61: 52.57, 60: 52.22, 59: 51.89,
    58: 51.59, 57: 51.28, 56: 50.96, 55: 50.54, 54: 50.12, 53: 49.75,
    52: 49.44, 51: 49.14, 50: 48.83, 49: 48.49, 48: 48.14, 47: 47.81,
    46: 47.43, 45: 47.07, 44: 46.68, 43: 46.38, 42: 46.07, 41: 45.75,
    40: 45.43, 39: 45.16, 38: 44.89, 37: 44.59, 36: 44.26, 35: 43.95,
    34: 43.65, 33: 43.37, 32: 43.10, 31: 42.83, 30: 42.56, 29: 42.24,
    28: 41.93, 27: 41.65, 26: 41.38, 25: 41.11, 24: 40.81, 23: 40.53,
    22: 40.29, 21: 40.06, 20: 39.82, 19: 39.58, 18: 39.31, 17: 39.04,
    16: 38.76, 15: 38.46, 14: 38.18, 13: 37.89, 12: 37.60, 11: 37.30,
    10: 36.99, 9: 36.63, 8: 36.26, 7: 35.86, 6: 35.43, 5: 35.06,
    4: 34.71, 3: 34.15, 2: 33.43, 1: 32.07, 0: 0.00
  },
  인문: {
    100: 70.13, 99: 68.84, 98: 67.92, 97: 67.13, 96: 66.33, 95: 65.62,
    94: 65.03, 93: 64.56, 92: 64.09, 91: 63.72, 90: 63.37, 89: 62.88,
    88: 62.52, 87: 62.10, 86: 61.74, 85: 61.38, 84: 61.01, 83: 60.65,
    82: 60.32, 81: 59.90, 80: 59.56, 79: 59.20, 78: 58.82, 77: 58.42,
    76: 58.08, 75: 57.67, 74: 57.35, 73: 56.99, 72: 56.71, 71: 56.42,
    70: 56.12, 69: 55.79, 68: 55.38, 67: 54.94, 66: 54.56, 65: 54.21,
    64: 53.86, 63: 53.46, 62: 53.03, 61: 52.57, 60: 52.22, 59: 51.89,
    58: 51.59, 57: 51.28, 56: 50.96, 55: 50.54, 54: 50.12, 53: 49.75,
    52: 49.44, 51: 49.14, 50: 48.83, 49: 48.49, 48: 48.14, 47: 47.81,
    46: 47.43, 45: 47.07, 44: 46.68, 43: 46.38, 42: 46.07, 41: 45.75,
    40: 45.43, 39: 45.16, 38: 44.89, 37: 44.59, 36: 44.26, 35: 43.95,
    34: 43.65, 33: 43.37, 32: 43.10, 31: 42.83, 30: 42.56, 29: 42.24,
    28: 41.93, 27: 41.65, 26: 41.38, 25: 41.11, 24: 40.81, 23: 40.53,
    22: 40.29, 21: 40.06, 20: 39.82, 19: 39.58, 18: 39.31, 17: 39.04,
    16: 38.76, 15: 38.46, 14: 38.18, 13: 37.89, 12: 37.60, 11: 37.30,
    10: 36.99, 9: 36.63, 8: 36.26, 7: 35.86, 6: 35.43, 5: 35.06,
    4: 34.71, 3: 34.15, 2: 33.43, 1: 32.07, 0: 0.00
  }
};

  

  const getConvertedScore = (percentile, subject) => {
    const track = naturalScienceSubjects.includes(subject) ? '자연' : '인문';
    const percentileScore = conversionTable[track][percentile]; // 백분위에 해당하는 점수 가져오기
    const maxScore = conversionTable[track][100]; // 백분위 100 점수 가져오기
    return maxScore && percentileScore ? percentileScore / maxScore : 0; // 변환 점수 계산
  };

// 영어 점수 계산 함수 (조건 4)
const getEnglishScore = (grade, track) => {
  const englishScores = {
    '인문1': { 1: 150, 2: 146, 3: 135, 4: 120, 5: 95, 6: 75, 7: 45, 8: 15, 9: 0 },
    '인문2': { 1: 200, 2: 194, 3: 184, 4: 160, 5: 130, 6: 100, 7: 60, 8: 20, 9: 0 },
    '자연1': { 1: 100, 2: 97, 3: 90, 4: 80, 5: 65, 6: 50, 7: 30, 8: 10, 9: 0 },
    '자연2': { 1: 100, 2: 97, 3: 90, 4: 80, 5: 65, 6: 50, 7: 30, 8: 10, 9: 0 },
  };
  return englishScores[track][grade] || 0;
};

// 한국사 점수 차감 (조건 5)
const getHistoryPenalty = (grade) => {
  const penalties = {
    1: 0, 2: 0, 3: 0, 4: 0, 5: -2,
    6: -4, 7: -6, 8: -8, 9: -10
  };
  return penalties[grade] || 0;
};


export const 서울시립대학교 = async (userId, selection) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('exam_results')
    .select('standard_score_korean, standard_score_math, percentile_science1, percentile_science2, grade_english, grade_history, science1, science2, math')
    .eq('user_id', userId)
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
  } = data;

  // 조건 3: 자연 계열에서 수학이 '확률과통계'일 경우 불가

  // 영어 점수 계산 (조건 4)
  const englishScore = parseFloat(getEnglishScore(grade_english, selection.계열));

  // 한국사 점수 계산 (조건 5)                                                        
  const historyPenalty = parseFloat(getHistoryPenalty(grade_history));

  const convertedScienceScore1 = getConvertedScore(percentile_science1, science1);
  const convertedScienceScore2 = getConvertedScore(percentile_science2, science2);


  let totalScore = 0;

  // 계열별 계산 (조건 6)
  if (selection.계열 === '인문1') {

    const scienceScore1 = humanitiesSubjects.includes(science1)
    ? convertedScienceScore1 * 1.03
    : convertedScienceScore1;

    const scienceScore2 = humanitiesSubjects.includes(science2)
    ? convertedScienceScore2 * 1.03
    : convertedScienceScore2;

    totalScore = (standard_score_korean * 350 / 147) + (standard_score_math * 350 / 139) + englishScore + (scienceScore1+scienceScore2) * 150/2;

  } else if (selection.계열 === '인문2') {

    const scienceScore1 = humanitiesSubjects.includes(science1)
    ? convertedScienceScore1 * 1.03
    : convertedScienceScore1;

    const scienceScore2 = humanitiesSubjects.includes(science2)
    ? convertedScienceScore2 * 1.03
    : convertedScienceScore2;

    totalScore = (standard_score_korean * 350 / 147) + (standard_score_math * 250 / 139) + englishScore + (scienceScore1+scienceScore2) * 200/2;
  } else if (selection.계열 === '자연1') {

    const scienceScore1 = naturalScienceSubjects.includes(science1)
    ? convertedScienceScore1 * 1.03
    : convertedScienceScore1;

    const scienceScore2 = naturalScienceSubjects.includes(science2)
    ? convertedScienceScore2 * 1.03
    : convertedScienceScore2;

    totalScore = (standard_score_korean * 300 / 147) + (standard_score_math * 400 / 139) + englishScore + (scienceScore1+scienceScore2) * 200/2;
  } else if (selection.계열 === '자연2') {

    const scienceScore1 = naturalScienceSubjects.includes(science1)
    ? convertedScienceScore1 * 1.03
    : convertedScienceScore1;

    const scienceScore2 = naturalScienceSubjects.includes(science2)
    ? convertedScienceScore2 * 1.03
    : convertedScienceScore2;

    totalScore = (standard_score_korean * 300 / 147) + (standard_score_math * 350 / 139) + englishScore + (scienceScore1+scienceScore2) * 250/2;
  
  } else {
    return '불가';
  }

  // 한국사 점수 차감
  totalScore += historyPenalty;

  return totalScore.toFixed(1);
};