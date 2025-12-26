import { createClient } from "@/utils/supabase/client";

const naturalScienceSubjects = [
  '물리학Ⅰ', '물리학Ⅱ', '화학Ⅰ', '화학Ⅱ',
  '생명과학Ⅰ', '생명과학Ⅱ', '지구과학Ⅰ', '지구과학Ⅱ'
];

// 탐구 변환 점수 테이블
const conversionTable = {
  자연: {
    100: 70.00, 99: 69.07, 98: 68.09, 97: 67.36, 96: 66.69, 95: 66.04,
    94: 65.51, 93: 65.06, 92: 64.53, 91: 64.17, 90: 63.82, 89: 63.43,
    88: 63.09, 87: 62.73, 86: 62.39, 85: 62.05, 84: 61.70, 83: 61.34,
    82: 61.00, 81: 60.63, 80: 60.29, 79: 59.94, 78: 59.56, 77: 59.19,
    76: 58.85, 75: 58.49, 74: 58.18, 73: 57.77, 72: 57.39, 71: 57.06,
    70: 56.74, 69: 56.40, 68: 56.01, 67: 55.61, 66: 55.24, 65: 54.89,
    64: 54.52, 63: 54.15, 62: 53.77, 61: 53.36, 60: 52.99, 59: 52.66,
    58: 52.33, 57: 51.96, 56: 51.61, 55: 51.21, 54: 50.80, 53: 50.41,
    52: 50.07, 51: 49.69, 50: 49.35, 49: 49.00, 48: 48.65, 47: 48.29,
    46: 47.86, 45: 47.50, 44: 47.13, 43: 46.80, 42: 46.46, 41: 46.13,
    40: 45.81, 39: 45.53, 38: 45.23, 37: 44.93, 36: 44.62, 35: 44.31,
    34: 44.02, 33: 43.73, 32: 43.44, 31: 43.15, 30: 42.86, 29: 42.56,
    28: 42.27, 27: 41.98, 26: 41.70, 25: 41.41, 24: 41.11, 23: 40.83,
    22: 40.56, 21: 40.29, 20: 40.04, 19: 39.79, 18: 39.53, 17: 39.26,
    16: 38.97, 15: 38.69, 14: 38.42, 13: 38.15, 12: 37.87, 11: 37.57,
    10: 37.23, 9: 36.89, 8: 36.52, 7: 36.15, 6: 35.73, 5: 35.32,
    4: 34.93, 3: 34.42, 2: 33.76, 1: 32.58, 0: 30.79
  },
  인문: {
    100: 70.00, 99: 69.07, 98: 68.09, 97: 67.36, 96: 66.69, 95: 66.04,
    94: 65.51, 93: 65.06, 92: 64.53, 91: 64.17, 90: 63.82, 89: 63.43,
    88: 63.09, 87: 62.73, 86: 62.39, 85: 62.05, 84: 61.70, 83: 61.34,
    82: 61.00, 81: 60.63, 80: 60.29, 79: 59.94, 78: 59.56, 77: 59.19,
    76: 58.85, 75: 58.49, 74: 58.18, 73: 57.77, 72: 57.39, 71: 57.06,
    70: 56.74, 69: 56.40, 68: 56.01, 67: 55.61, 66: 55.24, 65: 54.89,
    64: 54.52, 63: 54.15, 62: 53.77, 61: 53.36, 60: 52.99, 59: 52.66,
    58: 52.33, 57: 51.96, 56: 51.61, 55: 51.21, 54: 50.80, 53: 50.41,
    52: 50.07, 51: 49.69, 50: 49.35, 49: 49.00, 48: 48.65, 47: 48.29,
    46: 47.86, 45: 47.50, 44: 47.13, 43: 46.80, 42: 46.46, 41: 46.13,
    40: 45.81, 39: 45.53, 38: 45.23, 37: 44.93, 36: 44.62, 35: 44.31,
    34: 44.02, 33: 43.73, 32: 43.44, 31: 43.15, 30: 42.86, 29: 42.56,
    28: 42.27, 27: 41.98, 26: 41.70, 25: 41.41, 24: 41.11, 23: 40.83,
    22: 40.56, 21: 40.29, 20: 40.04, 19: 39.79, 18: 39.53, 17: 39.26,
    16: 38.97, 15: 38.69, 14: 38.42, 13: 38.15, 12: 37.87, 11: 37.57,
    10: 37.23, 9: 36.89, 8: 36.52, 7: 36.15, 6: 35.73, 5: 35.32,
    4: 34.93, 3: 34.42, 2: 33.76, 1: 32.58, 0: 30.79
  }
};


// 영어 환산 점수 표
const getEnglishScore = (grade) => {
  const englishScores = {
    1: 100, 2: 98, 3: 94, 4: 88, 5: 80,
    6: 70, 7: 60, 8: 40, 9: 20
  };
  return englishScores[grade] || 0;
};

// 한국사 가산점 표 (이거 바꿔야 됨!!!!!!!!!!!!!! 일단 임의로 해놓음)
const getHistoryBonus = (grade) => {
  if (grade >= 1 && grade <= 4) return 3;
  if (grade >= 5 && grade <= 6) return 2;
  return 1;
};

const getConvertedScore = (percentile, subject) => {
  const track = naturalScienceSubjects.includes(subject) ? '자연' : '인문';
  const percentileScore = conversionTable[track][percentile]; // 백분위에 해당하는 점수 가져오기
  const maxScore = conversionTable[track][100]; // 백분위 100 점수 가져오기
  return maxScore && percentileScore ? percentileScore / maxScore : 0; // 변환 점수 계산
};


// 숙명여자대학교 점수 계산 함수
// 핵심 수정: 세 번째 인자 isAdmin 추가 (기본값 false)
export const 숙명여자대학교 = async (userId, selection, isAdmin = false) => {
  const supabase = createClient();

  // isAdmin 여부에 따라 테이블과 ID 컬럼 결정
  const tableName = isAdmin ? 'admin_managed_students' : 'exam_results';
  const idColumn = isAdmin ? 'id' : 'user_id';

  // 사용자 시험 데이터 불러오기
  const { data, error } = await supabase
    .from(tableName)
    .select('standard_score_korean, standard_score_math, percentile_science1, percentile_science2, grade_english, grade_history, science1, science2, math')
    .eq(idColumn, userId)
    .single();

  if (error || !data) {
    return '불가'; // 데이터가 없거나 에러일 경우 처리
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

  const koreanNorm = (standard_score_korean ?? 0) / 147; // 최대값은 기존 로직 유지
  const mathNorm = (standard_score_math ?? 0) / 139;
  const englishNorm = getEnglishScore(grade_english) / 100;

  // 탐구 점수 (0~1)
  let scienceScore1 = getConvertedScore(percentile_science1, science1);
  let scienceScore2 = getConvertedScore(percentile_science2, science2);

  const isSci1Natural = naturalScienceSubjects.includes(science1);
  const isSci2Natural = naturalScienceSubjects.includes(science2);

  // 🔥 탐구 3% 가산 로직
  // 인문/경상: 사탐 과목에 3% 가산
  if (selection.계열 === "인문" || selection.계열 === "경상") {
    if (!isSci1Natural) scienceScore1 *= 1.03;
    if (!isSci2Natural) scienceScore2 *= 1.03;
  }

  // 자연/수학/통계/자연2: 과탐 과목에 3% 가산
  if (["자연", "수학", "통계", "자연2"].includes(selection.계열)) {
    if (isSci1Natural) scienceScore1 *= 1.03;
    if (isSci2Natural) scienceScore2 *= 1.03;
  }

  // 탐구 2과목 평균
  const scienceAvg = (scienceScore1 + scienceScore2) / 2;

  const historyBonus = getHistoryBonus(grade_history);

  // 📊 계열별 최종 비율 적용
  let ratio = 0;

  // 인문/경상 → 국어 35 / 수학 25 / 영어 15 / 탐구 25
  if (selection.계열 === "인문" || selection.계열 === "경상") {
    ratio =
      koreanNorm * 0.35 +
      mathNorm * 0.25 +
      englishNorm * 0.15 +
      scienceAvg * 0.25;
  }
  // 자연/수학/통계/자연2 → 국어 25 / 수학 35 / 영어 15 / 탐구 25
  else if (["자연", "수학", "통계", "자연2"].includes(selection.계열)) {
    ratio =
      koreanNorm * 0.25 +
      mathNorm * 0.35 +
      englishNorm * 0.15 +
      scienceAvg * 0.25;
  } else {
    return "불가: 잘못된 계열 값";
  }

  const totalScore = ratio * 1000 + historyBonus;
  return totalScore.toFixed(2);
};