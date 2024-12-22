import { createClient } from "@/utils/supabase/client";

// 영어 환산 점수 표
const getEnglishScore = (grade) => {
  const englishScores = {
    1: 100, 2: 95, 3: 88, 4: 79, 5: 68,
    6: 55, 7: 40, 8: 23, 9: 4
  };
  return englishScores[grade] || 0;
};

// 한국사 환산 점수 표
const getHistoryScore = (grade) => {
  const historyScores = {
    1: 10, 2: 10, 3: 10, 4: 9.9, 5: 9.8,
    6: 9.7, 7: 9.6, 8: 9.5, 9: 9.4
  };
  return historyScores[grade] || 0;
};

// 탐구 변환 점수 계산 함수
const getConvertedScore = (percentile, track) => {
  return conversionTable[track][percentile] || 0;
};

// 홍익대학교(서울) 점수 계산 함수
export const 홍익대학교서울 = async (userId, selection) => {
  const supabase = createClient();
  
    const { data, error } = await supabase
        .from('exam_results')
        .select('standard_score_korean, standard_score_math, standard_score_science1, standard_score_science2, grade_english, grade_history, science1, science2, math')
        .eq('user_id', userId)
        .single();

    if (error || !data) {
        return '불가'; // If there's an error or no data found
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
    totalScore =
      standard_score_korean * 0.3 +
      standard_score_math * 0.3 +
      (Number(standard_score_science1) + Number(standard_score_science2)) * 0.25 +
      englishScore * 0.15 +
      historyScore;
  } 
  // 자연계열 계산
  else if (selection.계열 === '자연') {
    // 자연계열 조건: 수학이 '미적분' 또는 '기하'여야 함
    if (math !== '미적분' && math !== '기하') {
      return '불가'; // 수학이 '확률과 통계'일 때 불가 처리
    }

    totalScore =
      standard_score_korean * 0.2 +
      standard_score_math * 0.35 +
      (Number(standard_score_science1) + Number(standard_score_science2)) * 0.3 +
      englishScore * 0.15 +
      historyScore;
  } 
  else {
    return '불가'; // 잘못된 계열 값일 경우
  }

  return totalScore.toFixed(2);
};
