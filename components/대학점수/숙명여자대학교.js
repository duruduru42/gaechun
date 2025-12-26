import { createClient } from "@/utils/supabase/client";

const naturalScienceSubjects = [
  '물리학Ⅰ', '물리학Ⅱ', '화학Ⅰ', '화학Ⅱ',
  '생명과학Ⅰ', '생명과학Ⅱ', '지구과학Ⅰ', '지구과학Ⅱ'
];

// 탐구 변환 점수 테이블
const conversionTable = {
  자연: {
    100: 70.11, 99: 69.17, 98: 68.08, 97: 67.36, 96: 66.76, 95: 66.15,
    94: 65.66, 93: 65.18, 92: 64.73, 91: 64.34, 90: 63.97, 89: 63.56,
    88: 63.18, 87: 62.79, 86: 62.43, 85: 62.08, 84: 61.73, 83: 61.38,
    82: 61.05, 81: 60.72, 80: 60.35, 79: 60.00, 78: 59.65, 77: 59.29,
    76: 58.97, 75: 58.61, 74: 58.22, 73: 57.86, 72: 57.49, 71: 57.15,
    70: 56.80, 69: 56.46, 68: 56.11, 67: 55.74, 66: 55.43, 65: 55.05,
    64: 54.67, 63: 54.29, 62: 53.92, 61: 53.52, 60: 53.12, 59: 52.71,
    58: 52.30, 57: 51.92, 56: 51.57, 55: 51.21, 54: 50.80, 53: 50.44,
    52: 50.06, 51: 49.68, 50: 49.26, 49: 48.88, 48: 48.50, 47: 48.15,
    46: 47.78, 45: 47.47, 44: 47.15, 43: 46.75, 42: 46.39, 41: 46.02,
    40: 45.67, 39: 45.34, 38: 44.98, 37: 44.65, 36: 44.34, 35: 44.07,
    34: 43.77, 33: 43.47, 32: 43.21, 31: 42.96, 30: 42.70, 29: 42.46,
    28: 42.24, 27: 41.99, 26: 41.70, 25: 41.42, 24: 41.13, 23: 40.85,
    22: 40.57, 21: 40.30, 20: 40.04, 19: 39.77, 18: 39.51, 17: 39.24,
    16: 38.96, 15: 38.67, 14: 38.40, 13: 38.13, 12: 37.87, 11: 37.60,
    10: 37.32, 9: 37.04, 8: 36.72, 7: 36.31, 6: 35.90, 5: 35.47,
    4: 34.99, 3: 34.43, 2: 33.70, 1: 32.82, 0: 31.11
  },
  인문: {
    100: 70.11, 99: 69.17, 98: 68.08, 97: 67.36, 96: 66.76, 95: 66.15,
    94: 65.66, 93: 65.18, 92: 64.73, 91: 64.34, 90: 63.97, 89: 63.56,
    88: 63.18, 87: 62.79, 86: 62.43, 85: 62.08, 84: 61.73, 83: 61.38,
    82: 61.05, 81: 60.72, 80: 60.35, 79: 60.00, 78: 59.65, 77: 59.29,
    76: 58.97, 75: 58.61, 74: 58.22, 73: 57.86, 72: 57.49, 71: 57.15,
    70: 56.80, 69: 56.46, 68: 56.11, 67: 55.74, 66: 55.43, 65: 55.05,
    64: 54.67, 63: 54.29, 62: 53.92, 61: 53.52, 60: 53.12, 59: 52.71,
    58: 52.30, 57: 51.92, 56: 51.57, 55: 51.21, 54: 50.80, 53: 50.44,
    52: 50.06, 51: 49.68, 50: 49.26, 49: 48.88, 48: 48.50, 47: 48.15,
    46: 47.78, 45: 47.47, 44: 47.15, 43: 46.75, 42: 46.39, 41: 46.02,
    40: 45.67, 39: 45.34, 38: 44.98, 37: 44.65, 36: 44.34, 35: 44.07,
    34: 43.77, 33: 43.47, 32: 43.21, 31: 42.96, 30: 42.70, 29: 42.46,
    28: 42.24, 27: 41.99, 26: 41.70, 25: 41.42, 24: 41.13, 23: 40.85,
    22: 40.57, 21: 40.30, 20: 40.04, 19: 39.77, 18: 39.51, 17: 39.24,
    16: 38.96, 15: 38.67, 14: 38.40, 13: 38.13, 12: 37.87, 11: 37.60,
    10: 37.32, 9: 37.04, 8: 36.72, 7: 36.31, 6: 35.90, 5: 35.47,
    4: 34.99, 3: 34.43, 2: 33.70, 1: 32.82, 0: 31.11
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