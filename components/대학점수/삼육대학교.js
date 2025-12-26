import { createClient } from "@/utils/supabase/client";

// Conversion table for English and Korean History scores based on grade
const getConvertedScore = (grade) => {
  const scoreTable = {
    1: 98, 2: 95, 3: 92, 4: 87, 5: 82,
    6: 70, 7: 50, 8: 40, 9: 0,
  };
  return scoreTable[grade] || 0;
};

// Check if the subject is a science inquiry subject (과학탐구)
const isScienceInquiry = (subject) => {
  const scienceSubjects = [
    "물리학Ⅰ", "물리학Ⅱ", "화학Ⅰ", "화학Ⅱ",
    "생명과학Ⅰ", "생명과학Ⅱ", "지구과학Ⅰ", "지구과학Ⅱ",
  ];
  return scienceSubjects.includes(subject);
};

// Samyook University score calculation function
// 핵심 수정: 세 번째 인자 isAdmin 추가 (기본값 false)
export const 삼육대학교 = async (userId, selection, isAdmin = false) => {
  const supabase = createClient();

  // isAdmin 여부에 따라 테이블과 ID 컬럼 결정
  const tableName = isAdmin ? 'admin_managed_students' : 'exam_results';
  const idColumn = isAdmin ? 'id' : 'user_id';

  // Fetch user data
  const { data, error } = await supabase
    .from(tableName)
    .select(
      "percentile_korean, percentile_math, percentile_science1, percentile_science2, grade_english, grade_history, science1, science2, math",
    )
    .eq(idColumn, userId)
    .single();

  if (error || !data) {
    console.error("Error fetching exam results:", error);
    console.error("Fetched data:", data);
    return "불가";
  }

  // Use `let` for variables that need to be reassigned
  let {
    percentile_korean,
    percentile_math,
    percentile_science1,
    percentile_science2,
    grade_english,
    science1,
    science2,
    math,
  } = data;
  if (!["인문", "자연", "약학"].includes(selection.계열)) {
    console.warn("Invalid 계열:", selection.계열);
    return "불가";
  }

  const englishScore = getConvertedScore(grade_english);

  // 기본 탐구 점수
  let explorationScore1 = percentile_science1 || 0;
  let explorationScore2 = percentile_science2 || 0;

  // ✅ (2) 자연계열 수학 가산점 3% (미적/기하일 때)
  if (selection.계열 === "자연" && (math === "미적분" || math === "기하")) {
    percentile_math *= 1.03; // 5% → 3%로 변경
  }

  // 약학 계열 가산 (기존 로직 유지)
  if (selection.계열 === "약학") {
    if (math === "미적분" || math === "기하") {
      percentile_math *= 1.05; // 약학은 여전히 5% 가산
    }
    if (isScienceInquiry(science1) && isScienceInquiry(science2)) {
      explorationScore1 *= 1.03;
      explorationScore2 *= 1.03;
    }
  }

  // ✅ (1) 탐구·한국사 대체 삭제 → 탐구 2개 중 높은 1개만 반영
  const topExplorationScore = Math.max(
    Number(explorationScore1),
    Number(explorationScore2),
  );

  let totalScore = 0;

  if (selection.계열 === "인문" || selection.계열 === "자연") {
    // Ensure all scores are numbers
    const scores = [
      Number(percentile_korean),
      Number(percentile_math),
      Number(englishScore),
      Number(topExplorationScore),
    ];

    // Sort scores in descending order
    scores.sort((a, b) => b - a);

    // Calculate the total score
    totalScore =
      (scores[0] * 0.35 +
        scores[1] * 0.25 +
        scores[2] * 0.25 +
        scores[3] * 0.15) *
      10;
  } else if (selection.계열 === "약학") {
    // 약학은 기존 방식 유지 (탐구 2과목 합산 사용)
    totalScore =
      (Number(percentile_korean) * 0.25 +
        Number(percentile_math) * 0.3 +
        Number(englishScore) * 0.25 +
        (Number(explorationScore1) + Number(explorationScore2)) * 0.1) *
      10;
  } else {
    return "불가";
  }

  return totalScore.toFixed(2);
};
