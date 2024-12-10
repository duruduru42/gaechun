import { createClient } from "@/utils/supabase/client";

// 영어 환산 점수 표 (100점 기준)
const getEnglishScore = (grade) => {
  const englishScores = {
    1: 100, 2: 98, 3: 95, 4: 80, 5: 70,
    6: 60, 7: 30, 8: 10, 9: 0
  };
  return englishScores[grade] || 0;
};

// 과목이 자연탐구 과목인지 확인하는 함수
const isNaturalScience = (subject) => {
  const naturalScienceSubjects = [
    '물리학Ⅰ', '물리학Ⅱ', '화학Ⅰ', '화학Ⅱ',
    '생명과학Ⅰ', '생명과학Ⅱ', '지구과학Ⅰ', '지구과학Ⅱ'
  ];
  return naturalScienceSubjects.includes(subject);
};

// 인천대학교 점수 계산 함수
export const 인천대학교 = async (userId, selection) => {
  const supabase = createClient();

  // 사용자 시험 데이터 불러오기
  const { data, error } = await supabase
    .from('exam_results')
    .select('percentile_korean, percentile_math, percentile_science1, percentile_science2, grade_english, science1, science2')
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
    science1,
    science2
  } = data;

  // 영어 점수 계산
  const englishScore = getEnglishScore(grade_english);

  let totalScore = 0;

  // 인문계열 계산
  if (selection.계열 === '인문') {
    totalScore =
      (percentile_korean * 3.5) +
      (percentile_math * 3) +
      (percentile_science1 * 1.25) +
      (percentile_science2 * 1.25) +
      englishScore;
  } 
  // 자연계열 계산
  else if (selection.계열 === '자연') {
    // 자연계열은 탐구 과목이 '과학탐구'여야 함
    if (!isNaturalScience(science1) || !isNaturalScience(science2)) {
      return '불가'; // 과학탐구가 아닐 경우 지원 불가 처리
    }

    totalScore =
      (percentile_korean * 2.5) +
      (percentile_math * 3.5) +
      (percentile_science1 * 1.5) +
      (percentile_science2 * 1.5) +
      englishScore;
  } 
  else if (selection.계열 === '특성자연') {
    // 자연계열은 탐구 과목이 '과학탐구'여야 함
    totalScore =
      (percentile_korean * 2.5) +
      (percentile_math * 3.5) +
      (percentile_science1 * 1.5) +
      (percentile_science2 * 1.5) +
      englishScore;
  } 
  else {
    return '불가'; // 잘못된 계열 값일 경우
  }

  return totalScore.toFixed(2);
};
