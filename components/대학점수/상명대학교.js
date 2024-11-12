import { createClient } from "@/utils/supabase/client";

// 영어 환산 점수 표 (100점 기준)
const getEnglishScore = (grade) => {
  const englishScores = {
    1: 100, 2: 98, 3: 96, 4: 94, 5: 90,
    6: 80, 7: 60, 8: 40, 9: 0
  };
  return englishScores[grade] || 0;
};

// 한국사 환산 점수 표
const getHistoryScore = (grade) => {
  const historyScores = {
    1: 10, 2: 10, 3: 10, 4: 10, 5: 9.8,
    6: 9.6, 7: 9.4, 8: 9.2, 9: 9.0
  };
  return historyScores[grade] || 0;
};

// 과목이 자연탐구 과목인지 확인하는 함수
const isNaturalScience = (subject) => {
  const naturalScienceSubjects = [
    '물리학Ⅰ', '물리학Ⅱ', '화학Ⅰ', '화학Ⅱ',
    '생명과학Ⅰ', '생명과학Ⅱ', '지구과학Ⅰ', '지구과학Ⅱ'
  ];
  return naturalScienceSubjects.includes(subject);
};

// 상명대학교 점수 계산 함수
export const 상명대학교 = async (userId, selection) => {
  const supabase = createClient();

  // 사용자 시험 데이터 불러오기
  const { data, error } = await supabase
    .from('exam_results')
    .select('percentile_korean, percentile_math, percentile_science1, percentile_science2, grade_english, grade_history, science1, science2, math')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return '불가'; // 데이터가 없거나 에러일 경우 처리
  }

  const {
    percentile_korean,
    percentile_math,
    percentile_science1,
    percentile_science2,
    grade_english,
    grade_history,
    science1,
    science2,
    math
  } = data;

  // 영어 점수 및 한국사 점수 계산
  const englishScore = getEnglishScore(grade_english);
  const historyScore = getHistoryScore(grade_history);

  // 탐구 과목 중에서 더 높은 과목 선택
  const higherSciencePercentile = Math.max(percentile_science1, percentile_science2);
  const higherScienceSubject = percentile_science1 >= percentile_science2 ? science1 : science2;

  let totalScore = 0;

  // 인문계열 계산
  if (selection.계열 === '인문') {
    totalScore =
      (percentile_korean * 0.35 * 10) +
      (percentile_math * 0.25 * 10) +
      (englishScore * 0.2) +
      (higherSciencePercentile * 0.2 * 10) +
      historyScore;
  } 
  // 자연계열 계산
  else if (selection.계열 === '자연') {
    let mathBonus = 0;
    let scienceBonus = 0;

    // 수학이 '미적분' 또는 '기하'일 때 가산점 적용 (10%)
    if (math === '미적분' || math === '기하') {
      mathBonus = 1.1;
    } else {
      mathBonus = 1;
    }

    // 탐구가 '과학탐구'일 때 가산점 적용 (5%)
    if (isNaturalScience(higherScienceSubject)) {
      scienceBonus = 1.05;
    } else {
      scienceBonus = 1;
    }

    totalScore =
      (percentile_korean * 0.25 * 10) +
      (percentile_math * 0.35 * 10 * mathBonus) +
      (englishScore * 0.2) +
      (higherSciencePercentile * 0.2 * 10 * scienceBonus) +
      historyScore;
  } 
  else {
    return '불가'; // 잘못된 계열 값일 경우
  }

  return totalScore.toFixed(2);
};
