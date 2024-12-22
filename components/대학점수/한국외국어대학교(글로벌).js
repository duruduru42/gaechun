// 1. 각 과목 최고점 필요
// 2. '인문'은 한국사 땜에 +10점 되는데, 자연은 그냥 패/논패임.

import { createClient } from "@/utils/supabase/client";

const naturalScienceSubjects = [
  '물리학Ⅰ', '물리학Ⅱ', '화학Ⅰ', '화학Ⅱ',
  '지구과학Ⅰ', '지구과학Ⅱ', '생명과학Ⅰ', '생명과학Ⅱ'
];

const conversionTable = {
  자연: {
    100: 70.00, 99: 69.81, 98: 69.40, 97: 69.02, 96: 68.59, 95: 68.25,
    94: 67.85, 93: 67.26, 92: 67.01, 91: 66.54, 90: 66.33, 89: 65.66,
    88: 65.45, 87: 64.89, 86: 64.50, 85: 64.42, 84: 63.58, 83: 63.37,
    82: 62.72, 81: 62.61, 80: 62.09, 79: 61.52, 78: 61.36, 77: 61.02,
    76: 60.47, 75: 60.45, 74: 59.66, 73: 59.01, 72: 58.91, 71: 58.51,
    70: 57.78, 69: 57.76, 68: 57.21, 67: 56.63, 66: 56.39, 65: 55.90,
    64: 55.74, 63: 55.18, 62: 54.83, 61: 54.44, 60: 54.14, 59: 54.09,
    58: 52.88, 57: 52.59, 56: 52.51, 55: 52.12, 54: 51.44, 53: 51.21,
    52: 50.81, 51: 50.22, 50: 49.85, 49: 49.37, 48: 48.96, 47: 48.82,
    46: 48.50, 45: 47.71, 44: 47.43, 43: 47.32, 42: 46.53, 41: 46.29,
    40: 45.75, 39: 45.49, 38: 45.21, 37: 44.91, 36: 44.07, 35: 44.02,
    34: 43.38, 33: 43.08, 32: 42.66, 31: 42.18, 30: 41.69, 29: 41.22,
    28: 41.12, 27: 40.58, 26: 40.32, 25: 40.09, 24: 39.17, 23: 39.09,
    22: 38.60, 21: 38.40, 20: 37.88, 19: 37.51, 18: 37.10, 17: 36.58,
    16: 36.19, 15: 35.81, 14: 35.19, 13: 35.01, 12: 34.62, 11: 34.02,
    10: 33.69, 9: 33.45, 8: 32.89, 7: 32.30, 6: 32.00, 5: 31.60,
    4: 31.41, 3: 30.81, 2: 30.46, 1: 30.04, 0: 29.68
  },
  인문: {
    100: 70.00, 99: 69.81, 98: 69.40, 97: 69.02, 96: 68.59, 95: 68.25,
    94: 67.85, 93: 67.26, 92: 67.01, 91: 66.54, 90: 66.33, 89: 65.66,
    88: 65.45, 87: 64.89, 86: 64.50, 85: 64.42, 84: 63.58, 83: 63.37,
    82: 62.72, 81: 62.61, 80: 62.09, 79: 61.52, 78: 61.36, 77: 61.02,
    76: 60.47, 75: 60.45, 74: 59.66, 73: 59.01, 72: 58.91, 71: 58.51,
    70: 57.78, 69: 57.76, 68: 57.21, 67: 56.63, 66: 56.39, 65: 55.90,
    64: 55.74, 63: 55.18, 62: 54.83, 61: 54.44, 60: 54.14, 59: 54.09,
    58: 52.88, 57: 52.59, 56: 52.51, 55: 52.12, 54: 51.44, 53: 51.21,
    52: 50.81, 51: 50.22, 50: 49.85, 49: 49.37, 48: 48.96, 47: 48.82,
    46: 48.50, 45: 47.71, 44: 47.43, 43: 47.32, 42: 46.53, 41: 46.29,
    40: 45.75, 39: 45.49, 38: 45.21, 37: 44.91, 36: 44.07, 35: 44.02,
    34: 43.38, 33: 43.08, 32: 42.66, 31: 42.18, 30: 41.69, 29: 41.22,
    28: 41.12, 27: 40.58, 26: 40.32, 25: 40.09, 24: 39.17, 23: 39.09,
    22: 38.60, 21: 38.40, 20: 37.88, 19: 37.51, 18: 37.10, 17: 36.58,
    16: 36.19, 15: 35.81, 14: 35.19, 13: 35.01, 12: 34.62, 11: 34.02,
    10: 33.69, 9: 33.45, 8: 32.89, 7: 32.30, 6: 32.00, 5: 31.60,
    4: 31.41, 3: 30.81, 2: 30.46, 1: 30.04, 0: 29.68
  }
};


  const getConvertedScore = (percentile, subject) => {
    const track = naturalScienceSubjects.includes(subject) ? '자연' : '인문';
    const percentileScore = conversionTable[track][percentile]; // 백분위에 해당하는 점수 가져오기
    const maxScore = conversionTable[track][100]; // 백분위 100 점수 가져오기
    return maxScore && percentileScore ? percentileScore / maxScore : 0; // 변환 점수 계산
  };

  export const 한국외국어대학교글로벌 = async (userId, selection) => {
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
  
    // 계열에 따른 영어 및 한국사 점수 계산
    const englishScore = getEnglishScore(grade_english, selection.계열);
    const historyScore = getHistoryScore(grade_history, selection.계열);
  
    const scienceScore1 = getConvertedScore(percentile_science1, science1);
    const scienceScore2 = getConvertedScore(percentile_science2, science2);

    let totalScore = 0;
  
    if (selection.계열 === '인문') {
      // 인문계열 계산
      const koreanScore = standard_score_korean * 0.3 * 700 / 139;
      const mathScore = standard_score_math * 0.3 * 700 / 140;
      const scienceScore = (scienceScore1 + scienceScore2) * 0.2 * 350;
  
      totalScore = koreanScore + mathScore + scienceScore + englishScore + historyScore;
  
    } else if (selection.계열 === '자연') {
      // 자연계열 계산
      const koreanScore = standard_score_korean * 0.2 * 700 / 139;
      const mathScore = standard_score_math * 0.35 * 700 / 140;
      const scienceScore = (scienceScore1 + scienceScore2) * 0.3 * 350;
  
      totalScore = koreanScore + mathScore + scienceScore + englishScore + historyScore;
  
    } else {
      return '불가';
    }
  
    return totalScore.toFixed(1);
  };

  const getEnglishScore = (grade, track) => {
    // 계열에 따라 다른 영어 점수 적용
    const englishScores = track === '인문' ? {
      1: 140, 2: 138, 3: 134, 4: 128, 5: 120,
      6: 110, 7: 90, 8: 60, 9: 0
    } : {
      1: 105, 2: 104.5, 3: 103.5, 4: 102, 5: 100,
      6: 97.5, 7: 94.5, 8: 90, 9: 0
    };
    return englishScores[grade] || 0;
  };
  
  const getHistoryScore = (grade, track) => {
    if (track === '인문') {
      const historyScores = {
        1: 10.0, 2: 10.0, 3: 10.0, 4: 9.8, 5: 9.6, 6: 9.4, 7: 9.2,
        8: 9.0, 9: 8.0
      };
      return historyScores[grade] || 0;
    } else {
      // 자연 계열은 한국사 점수 0
      return 0;
    }
  };