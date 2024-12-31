import { createClient } from "@/utils/supabase/client";

const conversionTable = {
  인문: {
    100: 70.00, 99: 69.40, 98: 68.84, 97: 68.32, 96: 67.81, 95: 67.25,
    94: 66.90, 93: 66.50, 92: 66.12, 91: 65.84, 90: 65.55, 89: 65.30,
    88: 65.03, 87: 64.68, 86: 64.34, 85: 64.02, 84: 63.68, 83: 63.30,
    82: 62.97, 81: 62.60, 80: 62.26, 79: 61.90, 78: 61.53, 77: 61.15,
    76: 60.81, 75: 60.46, 74: 60.14, 73: 59.73, 72: 59.35, 71: 59.03,
    70: 58.71, 69: 58.37, 68: 57.98, 67: 57.57, 66: 57.21, 65: 56.85,
    64: 56.49, 63: 56.12, 62: 55.73, 61: 55.33, 60: 54.96, 59: 54.62,
    58: 54.29, 57: 53.92, 56: 53.57, 55: 53.18, 54: 52.76, 53: 52.37,
    52: 52.04, 51: 51.65, 50: 51.31, 49: 50.97, 48: 50.62, 47: 50.25,
    46: 49.83, 45: 49.47, 44: 49.10, 43: 48.77, 42: 48.43, 41: 48.09,
    40: 47.78, 39: 47.50, 38: 47.20, 37: 46.89, 36: 46.58, 35: 46.28,
    34: 45.98, 33: 45.69, 32: 45.40, 31: 45.12, 30: 44.83, 29: 44.52,
    28: 44.23, 27: 43.95, 26: 43.66, 25: 43.37, 24: 43.08, 23: 42.79,
    22: 42.53, 21: 42.26, 20: 42.00, 19: 41.76, 18: 41.50, 17: 41.22,
    16: 40.94, 15: 40.65, 14: 40.38, 13: 40.11, 12: 39.83, 11: 39.54,
    10: 39.19, 9: 38.85, 8: 38.49, 7: 38.11, 6: 37.70, 5: 37.28,
    4: 36.89, 3: 36.38, 2: 35.72, 1: 34.55, 0: 32.67,
  },
  자연: {
    100: 70.00, 99: 69.40, 98: 68.84, 97: 68.32, 96: 67.81, 95: 67.25,
    94: 66.90, 93: 66.50, 92: 66.12, 91: 65.84, 90: 65.55, 89: 65.30,
    88: 65.03, 87: 64.68, 86: 64.34, 85: 64.02, 84: 63.68, 83: 63.30,
    82: 62.97, 81: 62.60, 80: 62.26, 79: 61.90, 78: 61.53, 77: 61.15,
    76: 60.81, 75: 60.46, 74: 60.14, 73: 59.73, 72: 59.35, 71: 59.03,
    70: 58.71, 69: 58.37, 68: 57.98, 67: 57.57, 66: 57.21, 65: 56.85,
    64: 56.49, 63: 56.12, 62: 55.73, 61: 55.33, 60: 54.96, 59: 54.62,
    58: 54.29, 57: 53.92, 56: 53.57, 55: 53.18, 54: 52.76, 53: 52.37,
    52: 52.04, 51: 51.65, 50: 51.31, 49: 50.97, 48: 50.62, 47: 50.25,
    46: 49.83, 45: 49.47, 44: 49.10, 43: 48.77, 42: 48.43, 41: 48.09,
    40: 47.78, 39: 47.50, 38: 47.20, 37: 46.89, 36: 46.58, 35: 46.28,
    34: 45.98, 33: 45.69, 32: 45.40, 31: 45.12, 30: 44.83, 29: 44.52,
    28: 44.23, 27: 43.95, 26: 43.66, 25: 43.37, 24: 43.08, 23: 42.79,
    22: 42.53, 21: 42.26, 20: 42.00, 19: 41.76, 18: 41.50, 17: 41.22,
    16: 40.94, 15: 40.65, 14: 40.38, 13: 40.11, 12: 39.83, 11: 39.54,
    10: 39.19, 9: 38.85, 8: 38.49, 7: 38.11, 6: 37.70, 5: 37.28,
    4: 36.89, 3: 36.38, 2: 35.72, 1: 34.55, 0: 32.67,
  }
};

  const getConvertedScore = (percentile, subject) => {
    const track = naturalScienceSubjects.includes(subject) ? '자연' : '인문';
    return conversionTable[track][percentile] || 0;
  };
  

const humanitiesSubjects = [
  '생활과윤리', '윤리와사상', '한국지리', '세계지리', 
  '동아시아사', '세계사', '경제', '정치와법', '사회문화'
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
