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
    100: 69.88, 99: 68.54, 98: 67.45, 97: 66.79, 96: 66.25, 95: 65.61,
    94: 65.19, 93: 64.76, 92: 64.28, 91: 63.89, 90: 63.51, 89: 63.10,
    88: 62.75, 87: 62.40, 86: 62.07, 85: 61.74, 84: 61.40, 83: 61.04,
    82: 60.68, 81: 60.35, 80: 59.96, 79: 59.59, 78: 59.24, 77: 58.89,
    76: 58.57, 75: 58.22, 74: 57.80, 73: 57.44, 72: 57.05, 71: 56.69,
    70: 56.34, 69: 55.99, 68: 55.64, 67: 55.23, 66: 54.90, 65: 54.52,
    64: 54.12, 63: 53.75, 62: 53.37, 61: 52.97, 60: 52.52, 59: 52.07,
    58: 51.65, 57: 51.26, 56: 50.92, 55: 50.58, 54: 50.24, 53: 49.91,
    52: 49.51, 51: 49.08, 50: 48.63, 49: 48.23, 48: 47.86, 47: 47.53,
    46: 47.20, 45: 46.90, 44: 46.57, 43: 46.23, 42: 45.92, 41: 45.57,
    40: 45.20, 39: 44.89, 38: 44.58, 37: 44.25, 36: 43.94, 35: 43.66,
    34: 43.38, 33: 43.07, 32: 42.80, 31: 42.55, 30: 42.30, 29: 42.05,
    28: 41.81, 27: 41.53, 26: 41.24, 25: 40.98, 24: 40.72, 23: 40.46,
    22: 40.19, 21: 39.94, 20: 39.67, 19: 39.40, 18: 39.14, 17: 38.88,
    16: 38.63, 15: 38.36, 14: 38.10, 13: 37.87, 12: 37.64, 11: 37.38,
    10: 37.08, 9: 36.82, 8: 36.48, 7: 36.14, 6: 35.78, 5: 35.37,
    4: 34.89, 3: 34.31, 2: 33.57, 1: 32.70, 0: 0,
  },
  인문: {
    100: 70.33, 99: 68.83, 98: 67.73, 97: 66.96, 96: 66.31, 95: 65.74,
    94: 65.19, 93: 64.67, 92: 64.26, 91: 63.88, 90: 63.51, 89: 63.11,
    88: 62.71, 87: 62.29, 86: 61.91, 85: 61.54, 84: 61.18, 83: 60.85,
    82: 60.55, 81: 60.23, 80: 59.89, 79: 59.55, 78: 59.20, 77: 58.85,
    76: 58.52, 75: 58.17, 74: 57.81, 73: 57.45, 72: 57.11, 71: 56.79,
    70: 56.45, 69: 56.11, 68: 55.77, 67: 55.45, 66: 55.15, 65: 54.78,
    64: 54.42, 63: 54.05, 62: 53.68, 61: 53.30, 60: 52.94, 59: 52.58,
    58: 52.18, 57: 51.81, 56: 51.45, 55: 51.07, 54: 50.61, 53: 50.23,
    52: 49.89, 51: 49.53, 50: 49.16, 49: 48.80, 48: 48.42, 47: 48.05,
    46: 47.66, 45: 47.33, 44: 47.02, 43: 46.59, 42: 46.18, 41: 45.82,
    40: 45.47, 39: 45.13, 38: 44.73, 37: 44.40, 36: 44.10, 35: 43.83,
    34: 43.53, 33: 43.23, 32: 42.99, 31: 42.74, 30: 42.49, 29: 42.26,
    28: 42.05, 27: 41.83, 26: 41.56, 25: 41.25, 24: 40.93, 23: 40.65,
    22: 40.37, 21: 40.09, 20: 39.83, 19: 39.57, 18: 39.31, 17: 39.02,
    16: 38.73, 15: 38.44, 14: 38.15, 13: 37.86, 12: 37.56, 11: 37.30,
    10: 37.03, 9: 36.74, 8: 36.44, 7: 35.98, 6: 35.53, 5: 35.08,
    4: 34.60, 3: 34.07, 2: 33.37, 1: 32.48, 0: 0,
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


// 핵심 수정: 세 번째 인자 isAdmin 추가 (기본값 false)
export const 서울시립대학교 = async (userId, selection, isAdmin = false) => {
  const supabase = createClient();

  // isAdmin 여부에 따라 테이블과 ID 컬럼 결정
  const tableName = isAdmin ? 'admin_managed_students' : 'exam_results';
  const idColumn = isAdmin ? 'id' : 'user_id';

  const { data, error } = await supabase
    .from(tableName)
    .select('standard_score_korean, standard_score_math, percentile_science1, percentile_science2, grade_english, grade_history, science1, science2, math')
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