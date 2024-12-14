import { createClient } from "@/utils/supabase/client";

const conversionTable = {
  인문: {
    100: 70.86, 99: 70.33, 98: 69.40, 97: 68.63, 96: 68.13, 95: 67.61,
    94: 67.12, 93: 66.69, 92: 66.11, 91: 65.90, 90: 65.41, 89: 64.92,
    88: 64.60, 87: 64.29, 86: 63.87, 85: 63.46, 84: 63.31, 83: 62.66,
    82: 62.31, 81: 62.07, 80: 61.70, 79: 61.23, 78: 60.92, 77: 60.48,
    76: 59.90, 75: 59.61, 74: 59.14, 73: 58.68, 72: 58.25, 71: 57.71,
    70: 57.37, 69: 56.85, 68: 56.37, 67: 56.02, 66: 55.45, 65: 55.12,
    64: 54.70, 63: 54.36, 62: 53.95, 61: 53.64, 60: 53.23, 59: 52.84,
    58: 52.50, 57: 52.17, 56: 51.83, 55: 51.44, 54: 51.04, 53: 50.66,
    52: 50.26, 51: 49.90, 50: 49.51, 49: 49.13, 48: 48.75, 47: 48.38,
    46: 48.04, 45: 47.70, 44: 47.37, 43: 47.05, 42: 46.72, 41: 46.39,
    40: 46.06, 39: 45.71, 38: 45.35, 37: 45.02, 36: 44.69, 35: 44.38,
    34: 44.07, 33: 43.77, 32: 43.49, 31: 43.20, 30: 42.93, 29: 42.68,
    28: 42.40, 27: 42.11, 26: 41.84, 25: 41.54, 24: 41.24, 23: 40.97,
    22: 40.67, 21: 40.37, 20: 40.07, 19: 39.79, 18: 39.52, 17: 39.24,
    16: 38.96, 15: 38.65, 14: 38.35, 13: 38.05, 12: 37.75, 11: 37.46,
    10: 37.14, 9: 36.78, 8: 36.43, 7: 36.03, 6: 35.61, 5: 35.12,
    4: 34.59, 3: 34.05, 2: 33.44, 1: 32.53, 0: 30.35
  },
  자연: {
    100: 71.75, 99: 71.00, 98: 69.75, 97: 68.69, 96: 68.00, 95: 67.31,
    94: 66.63, 93: 66.06, 92: 65.35, 91: 64.79, 90: 64.33, 89: 63.89,
    88: 63.42, 87: 62.96, 86: 62.56, 85: 62.07, 84: 61.56, 83: 60.98,
    82: 60.43, 81: 60.03, 80: 59.66, 79: 59.24, 78: 58.82, 77: 58.47,
    76: 58.03, 75: 57.66, 74: 57.24, 73: 56.76, 72: 56.40, 71: 56.01,
    70: 55.65, 69: 55.29, 68: 54.93, 67: 54.58, 66: 54.17, 65: 53.84,
    64: 53.53, 63: 53.23, 62: 52.94, 61: 52.63, 60: 52.27, 59: 51.93,
    58: 51.63, 57: 51.32, 56: 51.05, 55: 50.76, 54: 50.44, 53: 50.14,
    52: 49.79, 51: 49.46, 50: 49.15, 49: 48.84, 48: 48.56, 47: 48.24,
    46: 47.91, 45: 47.59, 44: 47.29, 43: 47.01, 42: 46.73, 41: 46.43,
    40: 46.10, 39: 45.81, 38: 45.50, 37: 45.18, 36: 44.84, 35: 44.54,
    34: 44.27, 33: 44.00, 32: 43.74, 31: 43.47, 30: 43.22, 29: 42.98,
    28: 42.73, 27: 42.43, 26: 42.16, 25: 41.89, 24: 41.61, 23: 41.34,
    22: 41.03, 21: 40.73, 20: 40.44, 19: 40.15, 18: 39.88, 17: 39.61,
    16: 39.31, 15: 39.00, 14: 38.68, 13: 38.37, 12: 38.09, 11: 37.80,
    10: 37.48, 9: 37.17, 8: 36.82, 7: 36.47, 6: 36.09, 5: 35.53,
    4: 34.96, 3: 34.42, 2: 33.81, 1: 32.88, 0: 30.25
  }
};

  const getConvertedScore = (percentile, subject) => {
    const track = naturalScienceSubjects.includes(subject) ? '자연' : '인문';
    return conversionTable[track][percentile] || 0;
  };
  

const humanitiesSubjects = [
  '생활과윤리', '윤리와사상', '한국지리', '세계지리', 
  '동아시아사', '세계사', '경제', '정치와법', '사회·문화'
];

const naturalScienceSubjects = [
  '물리학Ⅰ', '물리학Ⅱ', '화학Ⅰ', '화학Ⅱ',
  '지구과학Ⅰ', '지구과학Ⅱ', '생명과학Ⅰ', '생명과학Ⅱ'
];

export const 중앙대학교 = async (userId, selection) => {
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

  // Calculate the converted scores for the science subjects
  const convertedScienceScore1 = getConvertedScore(percentile_science1, science1);
  const convertedScienceScore2 = getConvertedScore(percentile_science2, science2);

  // Calculate the base score based on the track (계열)
  let baseScore = 0;
  let englishScore = getEnglishScore(grade_english);
  let historyScore = getHistoryScore(grade_history);

  if (selection.계열 === '인문') {
    const scienceScore1 = humanitiesSubjects.includes(science1)
    ? convertedScienceScore1 * 1.05
    : convertedScienceScore1;

    const scienceScore2 = humanitiesSubjects.includes(science2)
    ? convertedScienceScore2 * 1.05
    : convertedScienceScore2;

    baseScore = (Number(standard_score_korean) * 0.35 * 5 +
      Number(standard_score_math) * 0.3 * 5 +
      (Number(scienceScore1) + Number(scienceScore2)) * 0.35 * 5 +
      englishScore + historyScore);

  } else if (selection.계열 === '사회') {

    const scienceScore1 = humanitiesSubjects.includes(science1)
    ? convertedScienceScore1 * 1.05
    : convertedScienceScore1;

    const scienceScore2 = humanitiesSubjects.includes(science2)
    ? convertedScienceScore2 * 1.05
    : convertedScienceScore2;

    baseScore = (Number(standard_score_korean) * 0.3 * 5 +
      Number(standard_score_math) * 0.4 * 5 +
      (Number(scienceScore1) + Number(scienceScore2)) * 0.3 * 5 +
      englishScore + historyScore);

  } else if (selection.계열 === '자연') {

    const scienceScore1 = naturalScienceSubjects.includes(science1)
    ? convertedScienceScore1 * 1.05
    : convertedScienceScore1;

    const scienceScore2 = naturalScienceSubjects.includes(science2)
    ? convertedScienceScore2 * 1.05
    : convertedScienceScore2;

    baseScore = (Number(standard_score_korean) * 0.3 * 5 +
      Number(standard_score_math) * 0.35 * 5 +
      (Number(scienceScore1) + Number(scienceScore2)) * 0.35 * 5 +
      englishScore + historyScore);

  } else {
    return '불가';
  }

  return baseScore.toFixed(1);
};

const getEnglishScore = (grade) => {
  const englishScores = {
    1: 100, 2: 98, 3: 95, 4: 92, 5: 86,
    6: 75, 7: 64, 8: 58, 9: 50
  };
  return englishScores[grade] || 0;
};

const getHistoryScore = (grade) => {
  const historyScores = {
    1: 10, 2: 10, 3: 10, 4: 10,
    5: 9.6, 6: 9.2, 7: 8.8, 8: 8.4, 9: 8.0
  };
  return historyScores[grade] || 0;
};
