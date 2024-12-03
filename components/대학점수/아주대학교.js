import { createClient } from "@/utils/supabase/client";

// 탐구 변환 점수 테이블 (자연탐구와 사회탐구에 대한 변환점수 포함)
const conversionTable = {
  자연: {
    100: 71.54, 99: 70.94, 98: 69.69, 97: 68.63, 96: 67.97, 95: 67.31,
    94: 66.59, 93: 66.00, 92: 65.35, 91: 64.79, 90: 64.33, 89: 63.89,
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
    10: 37.48, 9: 37.17, 8: 36.82, 7: 36.47, 6: 36.09, 5: 35.53, 4: 34.96,
    3: 34.42, 2: 33.75, 1: 32.25, 0: 30.63
  },
  인문: {
    100: 67.22, 99: 66.56, 98: 66.02, 97: 65.62, 96: 65.21, 95: 64.83,
    94: 64.51, 93: 64.24, 92: 63.91, 91: 63.64, 90: 63.28, 89: 62.96,
    88: 62.64, 87: 62.34, 86: 62.08, 85: 61.82, 84: 61.54, 83: 61.27,
    82: 61.03, 81: 60.79, 80: 60.55, 79: 60.28, 78: 59.98, 77: 59.69,
    76: 59.44, 75: 59.16, 74: 58.86, 73: 58.57, 72: 58.27, 71: 57.97,
    70: 57.64, 69: 57.33, 68: 56.92, 67: 56.54, 66: 56.21, 65: 55.89,
    64: 55.55, 63: 55.19, 62: 54.82, 61: 54.45, 60: 54.08, 59: 53.65,
    58: 53.29, 57: 52.93, 56: 52.52, 55: 52.05, 54: 51.57, 53: 51.13,
    52: 50.69, 51: 50.30, 50: 49.83, 49: 49.39, 48: 48.93, 47: 48.50,
    46: 48.16, 45: 47.80, 44: 47.44, 43: 47.09, 42: 46.71, 41: 46.36,
    40: 46.02, 39: 45.62, 38: 45.22, 37: 44.89, 36: 44.56, 35: 44.24,
    34: 43.90, 33: 43.57, 32: 43.26, 31: 42.96, 30: 42.68, 29: 42.41,
    28: 42.10, 27: 41.82, 26: 41.55, 25: 41.23, 24: 40.92, 23: 40.65,
    22: 40.35, 21: 40.05, 20: 39.75, 19: 39.46, 18: 39.20, 17: 38.92,
    16: 38.64, 15: 38.35, 14: 38.06, 13: 37.76, 12: 37.45, 11: 37.16,
    10: 36.84, 9: 36.44, 8: 36.08, 7: 35.64, 6: 35.19, 5: 34.76, 4: 34.26,
    3: 33.72, 2: 33.06, 1: 31.89, 0: 30.56
  }
};



// 영어 환산 점수 표
const getEnglishScore = (grade, track) => {
  const englishScores = track === '의학' ? {
    1: 100, 2: 96, 3: 92, 4: 84, 5: 60,
    6: 40, 7: 20, 8: 10, 9: 0
  } : {
    1: 150, 2: 144, 3: 138, 4: 126, 5: 90,
    6: 60, 7: 30, 8: 15, 9: 0
  };
  return englishScores[grade] || 0;
};

// 한국사 감점 표
const getHistoryPenalty = (grade) => {
  const historyPenalties = {
    1: 0, 2: 0, 3: 0, 4: 0, 5: -5,
    6: -10, 7: -20, 8: -30, 9: -40
  };
  return historyPenalties[grade] || 0;
};

// 과학탐구 과목 리스트
const naturalScienceSubjects = [
  '물리학Ⅰ', '물리학Ⅱ', '화학Ⅰ', '화학Ⅱ',
  '생명과학Ⅰ', '생명과학Ⅱ', '지구과학Ⅰ', '지구과학Ⅱ'
];

const getConvertedScore = (percentile, subject) => {
  const track = naturalScienceSubjects.includes(subject) ? '자연' : '인문';
  const percentileScore = conversionTable[track][percentile]; // 백분위에 해당하는 점수 가져오기
  const maxScore = conversionTable[track][100]; // 백분위 100 점수 가져오기
  return maxScore && percentileScore ? percentileScore / maxScore : 0; // 변환 점수 계산
};

// 아주대학교 점수 계산 함수
export const 아주대학교 = async (userId, selection) => {
  const supabase = createClient();

  // 사용자 시험 데이터 불러오기
  const { data, error } = await supabase
    .from('exam_results')
    .select('standard_score_korean, standard_score_math, percentile_science1, percentile_science2, grade_english, grade_history, science1, science2, math')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return '불가1'; // 데이터가 없거나 에러일 경우 처리
  }

  const {
    standard_score_korean,
    standard_score_math,
    percentile_science1,
    percentile_science2,
    grade_english,
    grade_history,
    science1,
    science2,
    math
  } = data;

  // 영어 점수 및 한국사 감점 계산
  const englishScore = getEnglishScore(grade_english, selection.계열);
  const historyPenalty = getHistoryPenalty(grade_history);

  // 탐구 과목 변환 점수 계산
  const convertedScienceScore1 = getConvertedScore(percentile_science1, science1);
  const convertedScienceScore2 = getConvertedScore(percentile_science2, science2);

  let totalScore = 0;

  // 자연계열 계산
  if (selection.계열 === '자연') {
    let mathBonus = 1;

    // 수학이 '미적분' 또는 '기하'일 때 3% 가산
    if (math === '미적분' || math === '기하') {
      mathBonus = 1.03;
    }
    const scienceScore1 = naturalScienceSubjects.includes(science1)
    ? convertedScienceScore1 * 1.03
    : convertedScienceScore1;

  const scienceScore2 = naturalScienceSubjects.includes(science2)
    ? convertedScienceScore2 * 1.03
    : convertedScienceScore2;

    totalScore =
      (standard_score_korean / 138 * 200) +
      (standard_score_math / 144 * 350 * mathBonus) +
      englishScore +
      ((scienceScore1 + scienceScore2) / 2 * 300) +
      historyPenalty;              
  }
    // 의학 계열일 경우 수학 배점과 탐구 배점 변경
    else if (selection.계열 === '의학') {
      let mathBonus = 1;

      // 수학이 '미적분' 또는 '기하'일 때 3% 가산
      if (math === '미적분' || math === '기하') {
        mathBonus = 1.03;
      }
  
       const scienceScore1 = naturalScienceSubjects.includes(science1)
    ? convertedScienceScore1 * 1.03
    : convertedScienceScore1;

      const scienceScore2 = naturalScienceSubjects.includes(science2)
    ? convertedScienceScore2 * 1.03
    : convertedScienceScore2;

      totalScore =
        (standard_score_korean / 138 * 200) +
        (standard_score_math / 144 * 400 * mathBonus) +
        englishScore +
        ((scienceScore1 + scienceScore2) / 2 * 300) +        
        historyPenalty;
    }

  // 인문계열 계산
  else if (selection.계열 === '인문1' || selection.계열 === '인문2') {

     totalScore =
      (standard_score_korean / 138 * (selection.계열 === '인문1' ? 250 : 350)) +
      (standard_score_math / 144 * (selection.계열 === '인문1' ? 400 : 250)) +
      englishScore +
      ((convertedScienceScore1 + convertedScienceScore2)/ 2 * (selection.계열 === '인문1' ? 200 : 250)) +
      historyPenalty;
  } else{

  return '불가2'; // 잘못된 계열 값일 경우
  }
  return totalScore.toFixed(2);

};
