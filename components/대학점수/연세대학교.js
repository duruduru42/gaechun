import { createClient } from "@/utils/supabase/client";

// 탐구 변환 점수 테이블
const conversionTable = {
  인문:{
  100: 69.35,
  99: 68.70,
  98: 67.77,
  97: 67.06,
  96: 66.52,
  95: 65.99,
  94: 65.50,
  93: 65.09,
  92: 64.59,
  91: 64.18,
  90: 63.77,
  89: 63.39,
  88: 63.00,
  87: 62.63,
  86: 62.30,
  85: 61.93,
  84: 61.55,
  83: 61.13,
  82: 60.74,
  81: 60.43,
  80: 60.12,
  79: 59.78,
  78: 59.43,
  77: 59.11,
  76: 58.77,
  75: 58.45,
  74: 58.10,
  73: 57.71,
  72: 57.38,
  71: 57.04,
  70: 56.70,
  69: 56.37,
  68: 55.98,
  67: 55.62,
  66: 55.24,
  65: 54.92,
  64: 54.59,
  63: 54.26,
  62: 53.93,
  61: 53.59,
  60: 53.22,
  59: 52.84,
  58: 52.50,
  57: 52.16,
  56: 51.82,
  55: 51.44,
  54: 51.04,
  53: 50.66,
  52: 50.26,
  51: 49.90,
  50: 49.51,
  49: 49.13,
  48: 48.75,
  47: 48.37,
  46: 48.03,
  45: 47.70,
  44: 47.37,
  43: 47.05,
  42: 46.72,
  41: 46.39,
  40: 46.05,
  39: 45.70,
  38: 45.35,
  37: 45.02,
  36: 44.69,
  35: 44.38,
  34: 44.07,
  33: 43.77,
  32: 43.48,
  31: 43.20,
  30: 42.93,
  29: 42.67,
  28: 42.39,
  27: 42.10,
  26: 41.83,
  25: 41.54,
  24: 41.24,
  23: 40.97,
  22: 40.66,
  21: 40.37,
  20: 40.07,
  19: 39.78,
  18: 39.51,
  17: 39.24,
  16: 38.95,
  15: 38.65,
  14: 38.35,
  13: 38.04,
  12: 37.75,
  11: 37.45,
  10: 37.14,
  9: 36.78,
  8: 36.43,
  7: 36.02,
  6: 35.61,
  5: 35.12,
  4: 34.58,
  3: 34.04,
  2: 33.44,
  1: 32.52,
  0: 30.35},
  자연:{
    100: 69.35,
    99: 68.70,
    98: 67.77,
    97: 67.06,
    96: 66.52,
    95: 65.99,
    94: 65.50,
    93: 65.09,
    92: 64.59,
    91: 64.18,
    90: 63.77,
    89: 63.39,
    88: 63.00,
    87: 62.63,
    86: 62.30,
    85: 61.93,
    84: 61.55,
    83: 61.13,
    82: 60.74,
    81: 60.43,
    80: 60.12,
    79: 59.78,
    78: 59.43,
    77: 59.11,
    76: 58.77,
    75: 58.45,
    74: 58.10,
    73: 57.71,
    72: 57.38,
    71: 57.04,
    70: 56.70,
    69: 56.37,
    68: 55.98,
    67: 55.62,
    66: 55.24,
    65: 54.92,
    64: 54.59,
    63: 54.26,
    62: 53.93,
    61: 53.59,
    60: 53.22,
    59: 52.84,
    58: 52.50,
    57: 52.16,
    56: 51.82,
    55: 51.44,
    54: 51.04,
    53: 50.66,
    52: 50.26,
    51: 49.90,
    50: 49.51,
    49: 49.13,
    48: 48.75,
    47: 48.37,
    46: 48.03,
    45: 47.70,
    44: 47.37,
    43: 47.05,
    42: 46.72,
    41: 46.39,
    40: 46.05,
    39: 45.70,
    38: 45.35,
    37: 45.02,
    36: 44.69,
    35: 44.38,
    34: 44.07,
    33: 43.77,
    32: 43.48,
    31: 43.20,
    30: 42.93,
    29: 42.67,
    28: 42.39,
    27: 42.10,
    26: 41.83,
    25: 41.54,
    24: 41.24,
    23: 40.97,
    22: 40.66,
    21: 40.37,
    20: 40.07,
    19: 39.78,
    18: 39.51,
    17: 39.24,
    16: 38.95,
    15: 38.65,
    14: 38.35,
    13: 38.04,
    12: 37.75,
    11: 37.45,
    10: 37.14,
    9: 36.78,
    8: 36.43,
    7: 36.02,
    6: 35.61,
    5: 35.12,
    4: 34.58,
    3: 34.04,
    2: 33.44,
    1: 32.52,
    0: 30.35}
};

// 영어 환산 점수
const getEnglishScore = (grade) => {
  const englishScores = {
    1: 100, 2: 95, 3: 87.5, 4: 75, 5: 60,
    6: 40, 7: 25, 8: 12.5, 9: 5
  };
  return englishScores[grade] || 0;
};

// 한국사 감점
const getHistoryPenalty = (grade) => {
  const historyPenalties = {
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0.2,
    6: 0.4, 7: 0.6, 8: 0.8, 9: 1
  };
  return historyPenalties[grade] || 0;
};

// 탐구 변환 점수 계산
const getConvertedScore = (percentile, subject) => {
  const track = naturalScienceSubjects.includes(subject) ? '자연' : '인문';
  const percentileScore = conversionTable[track][percentile];
  return percentileScore ;
};

// 특정 과목 리스트
const humanitiesSubjects = [
  '생활과 윤리', '윤리와 사상', '한국지리', '세계지리',
  '동아시아사', '세계사', '경제', '정치와 법', '사회·문화'
];

const naturalScienceSubjects = [
  '물리학Ⅰ', '물리학Ⅱ', '화학Ⅰ', '화학Ⅱ',
  '지구과학Ⅰ', '지구과학Ⅱ', '생명과학Ⅰ', '생명과학Ⅱ'
];

// 연세대학교 점수 계산
export const 연세대학교 = async (userId, selection) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('exam_results')
    .select('standard_score_korean, standard_score_math, percentile_science1, percentile_science2, grade_english, grade_history, science1, science2')
    .eq('user_id', userId)
    .single();

  if (error || !data) return '불가'; // 데이터 없을 시

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

  let baseScore = 0;

  const convertedScienceScore1 = getConvertedScore(percentile_science1, science1);
  const convertedScienceScore2 = getConvertedScore(percentile_science2, science2);

  // 계열별 점수 계산
  if (selection.계열 === '인문') {
    const scienceScore1 = humanitiesSubjects.includes(science1)
    ? convertedScienceScore1 * 1.03
    : convertedScienceScore1;

    const scienceScore2 = humanitiesSubjects.includes(science2)
    ? convertedScienceScore2 * 1.03
    : convertedScienceScore2;

    baseScore = (
      Number(standard_score_korean) * 1.5 +
      Number(standard_score_math) +
      getEnglishScore(grade_english) +
      scienceScore1 +
      scienceScore2
    ) * 1000 / 800;

  } else if (selection.계열 === '자연') {
    const scienceScore1 = naturalScienceSubjects.includes(science1)
    ? convertedScienceScore1 * 1.03
    : convertedScienceScore1;

    const scienceScore2 = naturalScienceSubjects.includes(science2)
    ? convertedScienceScore2 * 1.03
    : convertedScienceScore2;

    baseScore = (
      Number(standard_score_korean) +
      Number(standard_score_math) * 1.5 +
      getEnglishScore(grade_english) +
      (scienceScore1 + scienceScore2) * 1.5
    ) * 1000 / 900;

  } else if (selection.계열 === '의학') {
    const scienceScore1 = naturalScienceSubjects.includes(science1)
    ? convertedScienceScore1 * 1.03
    : convertedScienceScore1;

    const scienceScore2 = naturalScienceSubjects.includes(science2)
    ? convertedScienceScore2 * 1.03
    : convertedScienceScore2;

    baseScore = (
      Number(standard_score_korean) +
      Number(standard_score_math) * 1.5 +
      getEnglishScore(grade_english) +
      (scienceScore1 + scienceScore2) * 1.5
    )

  } else if (selection.계열 === '생활') {
    baseScore = (
      Number(standard_score_korean) +
      Number(standard_score_math) +
      getEnglishScore(grade_english) +
      (convertedScienceScore1 + convertedScienceScore2) * 0.5
    ) * 1000 / 600;
  } else {
    return '불가'; // 잘못된 계열
  }

  // 최종 점수 계산
  const finalScore = baseScore - getHistoryPenalty(grade_history);
  return finalScore.toFixed(2);
};
