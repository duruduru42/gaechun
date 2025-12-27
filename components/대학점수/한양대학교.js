import { createClient } from "@/utils/supabase/client";

const naturalScienceSubjects = [
  '물리학Ⅰ', '물리학Ⅱ', '화학Ⅰ', '화학Ⅱ',
  '지구과학Ⅰ', '지구과학Ⅱ', '생명과학Ⅰ', '생명과학Ⅱ'
];


// Conversion table for percentile to standard score
const conversionTable = {
  자연: {
    100: 69.44, 99: 68.81, 98: 68.09, 97: 67.36, 96: 66.76, 95: 66.16,
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
    100: 69.44, 99: 68.81, 98: 68.09, 97: 67.36, 96: 66.76, 95: 66.16,
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


  const getConvertedScore = (percentile, subject) => {
    const track = naturalScienceSubjects.includes(subject) ? '자연' : '인문';
    const percentileScore = conversionTable[track][percentile]; // 백분위에 해당하는 점수 가져오기
    const maxScore = conversionTable[track][100]; // 백분위 100 점수 가져오기
    return maxScore && percentileScore ? percentileScore / maxScore : 0; // 변환 점수 계산
  };


// 핵심 수정: 세 번째 인자 isAdmin 추가 (기본값 false)
export const 한양대학교 = async (userId, selection, isAdmin = false) => {
  const supabase = createClient();

  // isAdmin 여부에 따라 테이블과 ID 컬럼 결정
  const tableName = isAdmin ? 'admin_managed_students' : 'exam_results';
  const idColumn = isAdmin ? 'id' : 'user_id';

  const { data, error } = await supabase
    .from(tableName)
    .select('standard_score_korean, standard_score_math, percentile_science1, percentile_science2, grade_english, grade_history, science1, science2')
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
    science2
  } = data;

  const scienceScore1 = getConvertedScore(percentile_science1, science1);
  const scienceScore2 = getConvertedScore(percentile_science2, science2);


  let baseScore = 0;

  const englishScore = getEnglishScore(grade_english, selection.계열);
  const historyPenalty = getHistoryPenalty(grade_history, selection.계열);

  if (selection.계열 === '자연') {

    const scienceBonus1 = naturalScienceSubjects.includes(science1)
    ? scienceScore1 * 1.03
    : scienceScore1;

    const scienceBonus2 = naturalScienceSubjects.includes(science2)
    ? scienceScore2 * 1.03
    : scienceScore2;

    baseScore = (Number(standard_score_korean) / 147) * 225 +
      (Number(standard_score_math) / 139) * 360 +
      ((Number(scienceBonus1) + Number(scienceBonus2))) * 112.5 + englishScore*0.9 + historyPenalty

  } else if (selection.계열 === '인문') {
    baseScore = (Number(standard_score_korean) / 147) * 315 +
      (Number(standard_score_math) / 139) * 270 +
      ((Number(scienceScore1) + Number(scienceScore2))) * 112.5 + englishScore*0.9 + historyPenalty

  } else if (selection.계열 === '상경') {
    baseScore = (Number(standard_score_korean) / 147) * 315 +
      (Number(standard_score_math) / 139) * 315 +
      ((Number(scienceScore1) + Number(scienceScore2))) * 90 + englishScore*0.9 + historyPenalty
  } else {
    return '불가';
  }

  return baseScore.toFixed(1);
};

const getEnglishScore = (grade, track) => {
  // 계열에 따라 다른 영어 점수 적용
  const englishScores = track === '인문' ? {
    1: 100, 2: 96, 3: 90, 4: 82, 5: 72,
    6: 60, 7: 46, 8: 30, 9: 12
  } : {
    1: 100, 2: 98, 3: 94, 4: 88, 5: 80,
    6: 70, 7: 58, 8: 44, 9: 28
  };
  return englishScores[grade] || 0;
};


const getHistoryPenalty = (grade, track) => {
  if (track === '자연') {
    return grade <= 4 ? 0 : (grade - 4) * 0.1;
  } else {
    return grade <= 3 ? 0 : (grade - 3) * 0.1;
  }
};