import { createClient } from "@/utils/supabase/client";

// 영어 환산 점수 표
const getEnglishScore = (grade) => {
  const englishScores = {
    1: 10, 2: 9.5, 3: 9, 4: 8.5, 5: 8,
    6: 7.5, 7: 7, 8: 4, 9: 0
  };
  return englishScores[grade] || 0;
};

// 과학탐구 과목 리스트
const naturalScienceSubjects = [
  '물리학Ⅰ', '물리학Ⅱ', '화학Ⅰ', '화학Ⅱ',
  '지구과학Ⅰ', '지구과학Ⅱ', '생명과학Ⅰ', '생명과학Ⅱ'
];


// 핵심 수정: 세 번째 인자 isAdmin 추가 (기본값 false)
export const 충북대학교 = async (userId, selection, isAdmin = false) => {
  const supabase = createClient();

  // isAdmin 여부에 따라 테이블과 ID 컬럼 결정
  const tableName = isAdmin ? 'admin_managed_students' : 'exam_results';
  const idColumn = isAdmin ? 'id' : 'user_id';

  const { data, error } = await supabase
    .from(tableName)
    .select(
      'standard_score_korean, standard_score_math, standard_score_science1, standard_score_science2, grade_english, grade_history, science1, science2, math'
    )
    .eq(idColumn, userId)
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
    science1,
    science2,
    math
  } = data;
  // 영어 점수 계산
  const englishScore = getEnglishScore(grade_english);

  let totalScore = 0;

  // 자연계열 계산
  if (selection.계열 === '자연') {
    totalScore =
      standard_score_korean/147 * 40  +
      standard_score_math/139 * 60 +      
      englishScore * 4 +
      (Number(standard_score_science1) + Number(standard_score_science2)) /140 * 60 +
      800;

  } else if (selection.계열 === '약학') {

    // 🔹 1) 약학계열: 수학 조건 (확통이면 불가)
    if (math === '확률과 통계') {
      return '불가: 미적/기하 필수';
    }

    // 🔹 2) 약학계열: 탐구 조건 (과탐 필수)
    const isValidScience1 = naturalScienceSubjects.includes(science1);
    const isValidScience2 = naturalScienceSubjects.includes(science2);

    if (!isValidScience1 || !isValidScience2) {
      return '불가: 과탐 필수';
    }

    // 🔹 조건 통과 시 점수 계산은 자연과 동일
    totalScore =
      standard_score_korean/147 * 40  +
      standard_score_math/139 * 60 +      
      englishScore * 4 +
      (Number(standard_score_science1) + Number(standard_score_science2)) /140 * 60 +
      800;

  } else {
    return '불가'; // 잘못된 계열 값일 경우
  }

  return totalScore.toFixed(2);
};
