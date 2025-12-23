import { createClient } from "@/utils/supabase/client";

// 영어 등급별 변환백분위 표
const getEnglishScore = (grade) => {
  const englishScores = {
    1: 100, 2: 100, 3: 99, 4: 95, 5: 79,
    6: 60, 7: 45, 8: 37, 9: 33
  };
  return englishScores[grade] || 0;
};

// 한국사 등급별 감점 표
const getHistoryPenalty = (grade) => {
  const historyPenalties = {
    1: 0, 2: 0, 3: 0, 4: 0, 5: 2,
    6: 4, 7: 10, 8: 20, 9: 40
  };
  return historyPenalties[grade] || 0;
};

// 성균관대학교 점수 계산 함수
export const 성균관대학교 = async (userId, selection) => {
  const supabase = createClient();

  // 사용자 시험 데이터 불러오기
  const { data, error } = await supabase
    .from('exam_results')
    .select('percentile_korean, percentile_math, percentile_science1, percentile_science2, grade_english, grade_history')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return '불가'; 
  }

  const {
    percentile_korean,
    percentile_math,
    percentile_science1,
    percentile_science2,
    grade_english,
    grade_history
  } = data;

  const englishScore = getEnglishScore(grade_english);
  const historyPenalty = getHistoryPenalty(grade_history);
  const bestScience = Math.max(Number(percentile_science1), Number(percentile_science2));

  let scoreA = 0;
  let scoreB = 0;

  // 계열을 '인문'과 '자연'으로 단순화하여 계산
  if (selection.계열 === '인문') {
    // 유형 A: 국4 수3 탐2 영1
    scoreA = (percentile_korean * 4) + (percentile_math * 3) + (bestScience * 2) + (englishScore * 1);
    // 유형 B: 국3 수4 탐2 영1
    scoreB = (percentile_korean * 3) + (percentile_math * 4) + (bestScience * 2) + (englishScore * 1);

  } else if (selection.계열 === '자연') {
    // 유형 A: 국2 수4 탐3 영1
    scoreA = (percentile_korean * 2) + (percentile_math * 4) + (bestScience * 3) + (englishScore * 1);
    // 유형 B: 국3 수4 탐2 영1
    scoreB = (percentile_korean * 3) + (percentile_math * 4) + (bestScience * 2) + (englishScore * 1);

  } else {
    return '불가: 계열 정보 오류';
  }

  // 두 유형 중 높은 점수에서 한국사 감점 적용
  const totalScore = Math.max(scoreA, scoreB) - historyPenalty;

  return totalScore.toFixed(2);
};