import { createClient } from "@/utils/supabase/client";

// 과학탐구 과목 리스트
const naturalScienceSubjects = [
  '물리학Ⅰ', '물리학Ⅱ', '화학Ⅰ', '화학Ⅱ',
  '생명과학Ⅰ', '생명과학Ⅱ', '지구과학Ⅰ', '지구과학Ⅱ'
];

const conversionTable = {
  인문: {
    100: 70.12, 99: 69.18, 98: 68.09, 97: 67.36, 96: 66.76, 95: 66.16,
    94: 65.66, 93: 65.19, 92: 64.74, 91: 64.35, 90: 63.97, 89: 63.57,
    88: 63.19, 87: 62.79, 86: 62.44, 85: 62.08, 84: 61.73, 83: 61.38,
    82: 61.05, 81: 60.72, 80: 60.36, 79: 60.01, 78: 59.65, 77: 59.3,
    76: 58.97, 75: 58.62, 74: 58.22, 73: 57.86, 72: 57.5, 71: 57.16,
    70: 56.81, 69: 56.46, 68: 56.12, 67: 55.75, 66: 55.43, 65: 55.06,
    64: 54.67, 63: 54.3, 62: 53.92, 61: 53.53, 60: 53.13, 59: 52.72,
    58: 52.31, 57: 51.93, 56: 51.57, 55: 51.21, 54: 50.8, 53: 50.44,
    52: 50.07, 51: 49.68, 50: 49.27, 49: 48.88, 48: 48.5, 47: 48.15,
    46: 47.79, 45: 47.47, 44: 47.15, 43: 46.76, 42: 46.39, 41: 46.03,
    40: 45.68, 39: 45.35, 38: 44.99, 37: 44.65, 36: 44.35, 35: 44.07,
    34: 43.78, 33: 43.47, 32: 43.21, 31: 42.96, 30: 42.71, 29: 42.47,
    28: 42.24, 27: 41.99, 26: 41.71, 25: 41.42, 24: 41.13, 23: 40.85,
    22: 40.58, 21: 40.31, 20: 40.05, 19: 39.78, 18: 39.52, 17: 39.24,
    16: 38.96, 15: 38.68, 14: 38.41, 13: 38.14, 12: 37.87, 11: 37.61,
    10: 37.32, 9: 37.05, 8: 36.73, 7: 36.32, 6: 35.91, 5: 35.47,
    4: 34.99, 3: 34.43, 2: 33.71, 1: 32.82, 0: 31.12
  },
  자연: {
    100: 70.12, 99: 69.18, 98: 68.09, 97: 67.36, 96: 66.76, 95: 66.16,
    94: 65.66, 93: 65.19, 92: 64.74, 91: 64.35, 90: 63.97, 89: 63.57,
    88: 63.19, 87: 62.79, 86: 62.44, 85: 62.08, 84: 61.73, 83: 61.38,
    82: 61.05, 81: 60.72, 80: 60.36, 79: 60.01, 78: 59.65, 77: 59.3,
    76: 58.97, 75: 58.62, 74: 58.22, 73: 57.86, 72: 57.5, 71: 57.16,
    70: 56.81, 69: 56.46, 68: 56.12, 67: 55.75, 66: 55.43, 65: 55.06,
    64: 54.67, 63: 54.3, 62: 53.92, 61: 53.53, 60: 53.13, 59: 52.72,
    58: 52.31, 57: 51.93, 56: 51.57, 55: 51.21, 54: 50.8, 53: 50.44,
    52: 50.07, 51: 49.68, 50: 49.27, 49: 48.88, 48: 48.5, 47: 48.15,
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
  const percentileScore = conversionTable[track][percentile]; // 백분위에 해당하는 점수
  const maxScore = conversionTable[track][100];             // 백분위 100 점수
  return maxScore && percentileScore ? percentileScore / maxScore : 0; // 0~1 스케일
};

// 핵심 수정: 세 번째 인자 isAdmin 추가 (기본값 false)
export const 숭실대학교 = async (userId, selection, isAdmin = false) => {
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
    math
  } = data;

  // 영어 점수 계산
  const englishScore = getEnglishScore(grade_english);

  // 한국사 감점 계산
  const historyPenalty = getHistoryPenalty(grade_history);

  // 탐구 과목 변환 점수 (0~1 스케일)
  let scienceScore1 = getConvertedScore(percentile_science1, science1);
  let scienceScore2 = getConvertedScore(percentile_science2, science2);

  let totalScore = 0;

  // 👉 인문/경상: 사탐 과목(= 자연탐구가 아닌 과목)은 과목당 3% 가산
  if (selection.계열 === '인문' || selection.계열 === '경상') {
    if (!naturalScienceSubjects.includes(science1)) {
      scienceScore1 *= 1.025;
    }
    if (!naturalScienceSubjects.includes(science2)) {
      scienceScore2 *= 1.025;
    }
  }

  // 계열별 계산
  if (selection.계열 === '인문') {
    totalScore =
      (standard_score_korean / 147) * 350 +
      (standard_score_math / 139) * 200 +
      englishScore +
      (scienceScore1 + scienceScore2) * 125 +
      historyPenalty;

  } else if (selection.계열 === '경상') {
    totalScore =
      (standard_score_korean / 147) * 250 +
      (standard_score_math / 139) * 300 +
      englishScore +
      (scienceScore1 + scienceScore2) * 125 +
      historyPenalty;

  } else if (selection.계열 === '자연1') {
    const mathBonus1 = (math === '미적분' || math === '기하') ? 0.07 : 0;
    const scienceBonus1 =
      (naturalScienceSubjects.includes(science1) ? 0.025 : 0) +
      (naturalScienceSubjects.includes(science2) ? 0.025 : 0);

    const totalBonus1 =
      mathBonus1 * standard_score_math +
      scienceBonus1 * ((Number(percentile_science1) + Number(percentile_science2)) / 2);

    totalScore =
      (standard_score_korean / 147) * 200 +
      (standard_score_math / 139) * 350 +
      englishScore +
      (scienceScore1 + scienceScore2) * 125 +
      historyPenalty +
      totalBonus1;

  } else if (selection.계열 === '자연2') {
    const mathBonus2 = (math === '미적분' || math === '기하') ? 0.05 : 0;
    const scienceBonus2 =
      (naturalScienceSubjects.includes(science1) ? 0.025 : 0) +
      (naturalScienceSubjects.includes(science2) ? 0.025 : 0);

    const totalBonus2 =
      mathBonus2 * standard_score_math +
      scienceBonus2 * ((Number(percentile_science1) + Number(percentile_science2)) / 2);

    totalScore =
      (standard_score_korean / 147) * 200 +
      (standard_score_math / 139) * 350 +
      englishScore +
      (scienceScore1 + scienceScore2) * 125 +
      historyPenalty +
      totalBonus2;

  } else {
    return '불가';
  }

  return totalScore.toFixed(1);
};

// 영어 점수 계산 함수
const getEnglishScore = (grade) => {
  const englishScores = {
    1: 200, 2: 194, 3: 186, 4: 173, 5: 144,
    6: 116, 7: 87, 8: 44, 9: 0
  };
  return englishScores[grade] || 0;
};

// 한국사 감점 계산 함수
const getHistoryPenalty = (grade) => {
  const historyPenalties = {
    1: 4.0, 2: 3.5, 3: 3.0, 4: 2.5, 5: 2.0,
    6: 1.5, 7: 1.0, 8: 0.5, 9: 0
  };
  return historyPenalties[grade] || 0;
};
