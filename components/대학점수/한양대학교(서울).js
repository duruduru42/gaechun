import { createClient } from "@/utils/supabase/client";

const naturalScienceSubjects = [
  '물리학Ⅰ', '물리학Ⅱ', '화학Ⅰ', '화학Ⅱ',
  '지구과학Ⅰ', '지구과학Ⅱ', '생명과학Ⅰ', '생명과학Ⅱ'
];


// Conversion table for percentile to standard score
const conversionTable = {
  자연: {
    100: 70.00, 99: 69.39, 98: 68.73, 97: 68.24, 96: 67.79, 95: 67.37,
    94: 67.01, 93: 66.71, 92: 66.36, 91: 66.12, 90: 65.88, 89: 65.62,
    88: 65.40, 87: 65.16, 86: 64.93, 85: 64.70, 84: 64.47, 83: 64.23,
    82: 64.00, 81: 63.76, 80: 63.53, 79: 63.30, 78: 63.05, 77: 62.79,
    76: 62.57, 75: 62.33, 74: 62.12, 73: 61.85, 72: 61.59, 71: 61.38,
    70: 61.16, 69: 60.94, 68: 60.68, 67: 60.41, 66: 60.16, 65: 59.93,
    64: 59.69, 63: 59.44, 62: 59.18, 61: 58.91, 60: 58.67, 59: 58.44,
    58: 58.22, 57: 57.97, 56: 57.74, 55: 57.48, 54: 57.20, 53: 56.94,
    52: 56.72, 51: 56.46, 50: 56.24, 49: 56.01, 48: 55.77, 47: 55.53,
    46: 55.25, 45: 55.01, 44: 54.76, 43: 54.54, 42: 54.31, 41: 54.09,
    40: 53.88, 39: 53.69, 38: 53.49, 37: 53.29, 36: 53.08, 35: 52.88,
    34: 52.68, 33: 52.49, 32: 52.29, 31: 52.10, 30: 51.91, 29: 51.71,
    28: 51.51, 27: 51.33, 26: 51.13, 25: 50.94, 24: 50.75, 23: 50.55,
    22: 50.38, 21: 50.20, 20: 50.03, 19: 49.86, 18: 49.69, 17: 49.51,
    16: 49.32, 15: 49.13, 14: 48.95, 13: 48.77, 12: 48.58, 11: 48.39,
    10: 48.15, 9: 47.93, 8: 47.68, 7: 47.43, 6: 47.16, 5: 46.88,
    4: 46.62, 3: 46.28, 2: 45.84, 1: 45.06, 0: 43.80,
  },
  인문: {
    100: 70.00, 99: 69.39, 98: 68.73, 97: 68.24, 96: 67.79, 95: 67.37,
    94: 67.01, 93: 66.71, 92: 66.36, 91: 66.12, 90: 65.88, 89: 65.62,
    88: 65.40, 87: 65.16, 86: 64.93, 85: 64.70, 84: 64.47, 83: 64.23,
    82: 64.00, 81: 63.76, 80: 63.53, 79: 63.30, 78: 63.05, 77: 62.79,
    76: 62.57, 75: 62.33, 74: 62.12, 73: 61.85, 72: 61.59, 71: 61.38,
    70: 61.16, 69: 60.94, 68: 60.68, 67: 60.41, 66: 60.16, 65: 59.93,
    64: 59.69, 63: 59.44, 62: 59.18, 61: 58.91, 60: 58.67, 59: 58.44,
    58: 58.22, 57: 57.97, 56: 57.74, 55: 57.48, 54: 57.20, 53: 56.94,
    52: 56.72, 51: 56.46, 50: 56.24, 49: 56.01, 48: 55.77, 47: 55.53,
    46: 55.25, 45: 55.01, 44: 54.76, 43: 54.54, 42: 54.31, 41: 54.09,
    40: 53.88, 39: 53.69, 38: 53.49, 37: 53.29, 36: 53.08, 35: 52.88,
    34: 52.68, 33: 52.49, 32: 52.29, 31: 52.10, 30: 51.91, 29: 51.71,
    28: 51.51, 27: 51.33, 26: 51.13, 25: 50.94, 24: 50.75, 23: 50.55,
    22: 50.38, 21: 50.20, 20: 50.03, 19: 49.86, 18: 49.69, 17: 49.51,
    16: 49.32, 15: 49.13, 14: 48.95, 13: 48.77, 12: 48.58, 11: 48.39,
    10: 48.15, 9: 47.93, 8: 47.68, 7: 47.43, 6: 47.16, 5: 46.88,
    4: 46.62, 3: 46.28, 2: 45.84, 1: 45.06, 0: 43.80,
  }
};


  const getConvertedScore = (percentile, subject) => {
    const track = naturalScienceSubjects.includes(subject) ? '자연' : '인문';
    const percentileScore = conversionTable[track][percentile]; // 백분위에 해당하는 점수 가져오기
    const maxScore = conversionTable[track][100]; // 백분위 100 점수 가져오기
    return maxScore && percentileScore ? percentileScore / maxScore : 0; // 변환 점수 계산
  };


export const 한양대학교 = async (userId, selection) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('exam_results')
    .select('standard_score_korean, standard_score_math, percentile_science1, percentile_science2, grade_english, grade_history, science1, science2')
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