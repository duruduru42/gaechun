import { createClient } from "@/utils/supabase/client";

// 영어 환산 점수 표
const getEnglishScore = (grade) => {
  const englishScores = {
    1: 100, 2: 99, 3: 96, 4: 85, 5: 70,
    6: 55, 7: 40, 8: 20, 9: 0
  };
  return englishScores[grade] || 0;
};

// 한국사 가산점 표
const getHistoryBonus = (grade) => {
  const historyBonuses = {
    1: 3, 2: 3, 3: 3, 4: 3, 5: 2.5,
    6: 2, 7: 1.5, 8: 1, 9: 0.5
  };
  return historyBonuses[grade] || 0;
};

// 과목이 자연탐구 과목인지 확인하는 함수
const isNaturalScience = (subject) => {
  const naturalScienceSubjects = [
    '물리학Ⅰ', '물리학Ⅱ', '화학Ⅰ', '화학Ⅱ',
    '생명과학Ⅰ', '생명과학Ⅱ', '지구과학Ⅰ', '지구과학Ⅱ'
  ];
  return naturalScienceSubjects.includes(subject);
};

// 동덕여자대학교 점수 계산 함수
// 핵심 수정: 세 번째 인자 isAdmin 추가 (기본값 false)
export const 동덕여자대학교 = async (userId, selection, isAdmin = false) => {
  const supabase = createClient();

  // isAdmin 여부에 따라 테이블과 ID 컬럼 결정
  const tableName = isAdmin ? 'admin_managed_students' : 'exam_results';
  const idColumn = isAdmin ? 'id' : 'user_id';

  // 사용자 시험 데이터 불러오기
  const { data, error } = await supabase
    .from(tableName)
    .select('percentile_korean, percentile_math, percentile_science1, percentile_science2, grade_english, grade_history, science1, science2, math')
    .eq(idColumn, userId)
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

  // 영어 점수 및 한국사 가산점 계산
  const englishScore = getEnglishScore(grade_english);
  const historyBonus = getHistoryBonus(grade_history);

  // 탐구 과목 중 높은 점수 선택
  const higherScienceScore = Math.max(percentile_science1, percentile_science2);

  let totalScore = 0;

  // 계열별 계산
  if (selection.계열 === '인문') {
    const higherKoreanMath = Math.max(percentile_korean, percentile_math);

    totalScore = ((higherKoreanMath * 0.35) +
                 (Math.min(percentile_korean, percentile_math) * 0.25) +
                 (englishScore * 0.2) +
                 (higherScienceScore * 0.2))*10 +
                 historyBonus;

  } else if (selection.계열 === '자연') {
    let mathBonus = 1;

    // 수학 > 국어 & 수학 과목 미적/기하 → 5% 가산
    if (percentile_math > percentile_korean && (math === '미적분' || math === '기하')) {
        mathBonus = 1.05;
    }

    // 가산 적용된 수학 백분위 적용
    const boostedMath = percentile_math * mathBonus;

    const higherKoreanMath = Math.max(percentile_korean, boostedMath);
    const lowerKoreanMath  = Math.min(percentile_korean, boostedMath);

    totalScore = ((higherKoreanMath * 0.35) +
                 (lowerKoreanMath * 0.25) +
                 (englishScore * 0.2) +
                 (higherScienceScore * 0.2)) * 10 +
                 historyBonus;

  } else if (selection.계열 === '약학') {
    // 약학은 수학이 '미적분' 또는 '기하' 선택 필수, 탐구는 자연탐구 필수
    if (math !== '미적분' && math !== '기하') {
      return '불가: 수학 과목 조건 불충족'; // 미적분, 기하 필수
    }
    if (!isNaturalScience(science1) || !isNaturalScience(science2)) {
      return '불가: 탐구 과목 조건 불충족'; // 자연탐구 필수
    }

    totalScore = ((percentile_korean * 0.25) +
                 (percentile_math * 0.35) +
                 (englishScore * 0.20) +
                 ((Number(percentile_science1) + Number(percentile_science2)) * 0.1))*10 +
                 historyBonus;

  } else {
    return '불가: 잘못된 계열 값'; // 잘못된 계열 값일 경우
  }

  return totalScore.toFixed(2);
};
