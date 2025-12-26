// 1. 각 과목 최고점 필요
// 2. '인문'은 한국사 땜에 +10점 되는데, 자연은 그냥 패/논패임.

import { createClient } from "@/utils/supabase/client";

const naturalScienceSubjects = [
  '물리학Ⅰ', '물리학Ⅱ', '화학Ⅰ', '화학Ⅱ',
  '지구과학Ⅰ', '지구과학Ⅱ', '생명과학Ⅰ', '생명과학Ⅱ'
];

const conversionTable = {
  자연: {
    100: 70.12, 99: 69.92, 98: 69.39, 97: 69.09, 96: 68.62, 95: 68.49,
    94: 67.61, 93: 67.40, 92: 67.11, 91: 66.56, 90: 66.24, 89: 65.86,
    88: 65.26, 87: 64.96, 86: 64.86, 85: 64.34, 84: 63.37, 83: 63.19,
    82: 62.74, 81: 62.60, 80: 62.41, 79: 61.72, 78: 61.35, 77: 61.07,
    76: 60.47, 75: 60.16, 74: 59.70, 73: 59.18, 72: 58.82, 71: 58.56,
    70: 58.36, 69: 57.55, 68: 57.28, 67: 57.13, 66: 56.52, 65: 55.93,
    64: 55.69, 63: 55.08, 62: 54.94, 61: 54.51, 60: 54.09, 59: 53.43,
    58: 53.29, 57: 53.08, 56: 52.56, 55: 51.89, 54: 51.54, 53: 51.04,
    52: 50.86, 51: 50.44, 50: 49.95, 49: 49.65, 48: 49.27, 47: 48.64,
    46: 48.12, 45: 48.06, 44: 47.43, 43: 47.09, 42: 46.82, 41: 46.03,
    40: 45.95, 39: 45.70, 38: 44.78, 37: 44.69, 36: 44.23, 35: 43.69,
    34: 43.47, 33: 43.16, 32: 42.82, 31: 42.33, 30: 41.26, 29: 41.09,
    28: 40.98, 27: 40.75, 26: 40.22, 25: 39.68, 24: 39.36, 23: 39.02,
    22: 38.51, 21: 38.11, 20: 37.63, 19: 37.28, 18: 37.07, 17: 36.33,
    16: 36.31, 15: 35.68, 14: 35.34, 13: 34.58, 12: 34.45, 11: 34.15,
    10: 33.48, 9: 33.39, 8: 32.92, 7: 32.43, 6: 31.85, 5: 31.60,
    4: 31.16, 3: 30.89, 2: 30.23, 1: 29.96, 0: 29.55
  },
  인문: {
    100: 70.12, 99: 69.92, 98: 69.39, 97: 69.09, 96: 68.62, 95: 68.49,
    94: 67.61, 93: 67.40, 92: 67.11, 91: 66.56, 90: 66.24, 89: 65.86,
    88: 65.26, 87: 64.96, 86: 64.86, 85: 64.34, 84: 63.37, 83: 63.19,
    82: 62.74, 81: 62.60, 80: 62.41, 79: 61.72, 78: 61.35, 77: 61.07,
    76: 60.47, 75: 60.16, 74: 59.70, 73: 59.18, 72: 58.82, 71: 58.56,
    70: 58.36, 69: 57.55, 68: 57.28, 67: 57.13, 66: 56.52, 65: 55.93,
    64: 55.69, 63: 55.08, 62: 54.94, 61: 54.51, 60: 54.09, 59: 53.43,
    58: 53.29, 57: 53.08, 56: 52.56, 55: 51.89, 54: 51.54, 53: 51.04,
    52: 50.86, 51: 50.44, 50: 49.95, 49: 49.65, 48: 49.27, 47: 48.64,
    46: 48.12, 45: 48.06, 44: 47.43, 43: 47.09, 42: 46.82, 41: 46.03,
    40: 45.95, 39: 45.70, 38: 44.78, 37: 44.69, 36: 44.23, 35: 43.69,
    34: 43.47, 33: 43.16, 32: 42.82, 31: 42.33, 30: 41.26, 29: 41.09,
    28: 40.98, 27: 40.75, 26: 40.22, 25: 39.68, 24: 39.36, 23: 39.02,
    22: 38.51, 21: 38.11, 20: 37.63, 19: 37.28, 18: 37.07, 17: 36.33,
    16: 36.31, 15: 35.68, 14: 35.34, 13: 34.58, 12: 34.45, 11: 34.15,
    10: 33.48, 9: 33.39, 8: 32.92, 7: 32.43, 6: 31.85, 5: 31.60,
    4: 31.16, 3: 30.89, 2: 30.23, 1: 29.96, 0: 29.55
  }
};


  const getConvertedScore = (percentile, subject) => {
    const track = naturalScienceSubjects.includes(subject) ? '자연' : '인문';
    const percentileScore = conversionTable[track][percentile]; // 백분위에 해당하는 점수 가져오기
    const maxScore = conversionTable[track][100]; // 백분위 100 점수 가져오기
    return maxScore && percentileScore ? percentileScore / maxScore : 0; // 변환 점수 계산
  };

// 핵심 수정: 세 번째 인자 isAdmin 추가 (기본값 false)
export const 한국외국어대학교글로벌 = async (userId, selection, isAdmin = false) => {
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
  
    // 계열에 따른 영어 및 한국사 점수 계산
    const englishScore = getEnglishScore(grade_english, selection.계열);
    const historyScore = getHistoryScore(grade_history, selection.계열);
  
    const scienceScore1 = getConvertedScore(percentile_science1, science1);
    const scienceScore2 = getConvertedScore(percentile_science2, science2);

    let totalScore = 0;
  
    if (selection.계열 === '인문') {
      // 인문계열 계산
      const koreanScore = standard_score_korean * 0.3 * 700 / 147;
      const mathScore = standard_score_math * 0.3 * 700 / 139;
      const scienceScore = (scienceScore1 + scienceScore2) * 0.2 * 350;
  
      totalScore = koreanScore + mathScore + scienceScore + englishScore + historyScore;
  
    } else if (selection.계열 === '자연') {
      // 자연계열 계산
      const koreanScore = standard_score_korean * 0.2 * 700 / 147;
      const mathScore = standard_score_math * 0.35 * 700 / 139;
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
      const historyScores = {
        1: 10.0, 2: 10.0, 3: 10.0, 4: 10.0, 5: 9.8, 6: 9.6, 7: 9.4,
        8: 9.2, 9: 9.0
      };
      return historyScores[grade] || 0;    
    }
  };