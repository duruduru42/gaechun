import { createClient } from "@/utils/supabase/client";

// 영어 환산 점수 표
const getEnglishScore = (grade) => {
  const englishScores = {
    1: 100, 2: 95, 3: 88, 4: 79, 5: 68,
    6: 55, 7: 40, 8: 23, 9: 4
  };
  return englishScores[grade] || 0;
};

const getHistoryScore = (grade) => {
  const historyScores = {
    1: 10, 2: 10, 3: 10, 4: 10, 5: 10,
    6: 9.9, 7: 9.8, 8: 9.7, 9: 9.6
  };
  return historyScores[grade] || 0;
};


// 홍익대학교(서울) 점수 계산 함수
export const 홍익대학교세종 = async (userId, selection) => {
  const supabase = createClient();
  
  // 사용자 시험 데이터 불러오기
  const { data, error } = await supabase
    .from('exam_results')
    .select('standard_score_korean, standard_score_math, standard_score_science1, standard_score_science2, grade_english, grade_history, science1, science2')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return '불가'; // 데이터가 없거나 에러일 경우 처리
  }

  const {
    standard_score_korean,
    standard_score_math,
    standard_score_science1,
    standard_score_science2,
    grade_english,
    grade_history,
    science1,
    science2,
    math
  } = data;

  // 영어 점수 및 한국사 점수 계산
  const englishScore = getEnglishScore(grade_english);
  const historyScore = getHistoryScore(grade_history);

  let totalScore = 0;

  // 인문계열 계산
  if (selection.계열 === '인문') {
    const higherScore = Math.max(standard_score_korean, standard_score_math); // 국어와 수학 중 더 높은 점수 선택
    totalScore =
      Number(higherScore) * 0.4 +
      (Number(standard_score_science1) + Number(standard_score_science2)) * 0.4 +
      Number(englishScore) * 0.2 +
      Number(historyScore);
  } 
  // 자연계열 계산 (서울 캠퍼스와 동일한 방식)
  else if (selection.계열 === '자연') {
    // 자연계열 조건: 수학이 '미적분' 또는 '기하'여야 함
    if (math !== '미적분' && math !== '기하') {
      return '불가'; // 수학이 '확률과 통계'일 때 불가 처리
    }
    totalScore =
    Number(standard_score_korean) * 0.2 +
    Number(standard_score_math) * 0.35 +
      (Number(standard_score_science1) + Number(standard_score_science2)) * 0.3 +
      Number(englishScore) * 0.15 +
      Number(historyScore);
  } 
  else {
    return '불가'; // 잘못된 계열 값일 경우
  }

  return totalScore.toFixed(2);
};