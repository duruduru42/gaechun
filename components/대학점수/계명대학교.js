import { createClient } from "@/utils/supabase/client";

// 영어 환산 점수 표 (100점 기준)
const getEnglishScore = (grade) => {
  const englishScores = {
    1: 100,
    2: 98,
    3: 94,
    4: 90,
    5: 86,
    6: 82,
    7: 78,
    8: 74,
    9: 60,
  };
  return englishScores[grade] || 0;
};

// 한국사 가산점 (400점 기준)
const getHistoryBonus400 = (grade) => {
  if (grade === 1 || grade === 2) return 5;
  if (grade === 3 || grade === 4) return 4.5;
  if (grade === 5 || grade === 6) return 4;
  if (grade === 7 || grade === 8) return 3.5;
  return 3; // 9등급
};

// 과목이 자연탐구 과목인지 확인하는 함수
const isNaturalScience = (subject) => {
  const naturalScienceSubjects = [
    "물리학Ⅰ", "물리학Ⅱ",
    "화학Ⅰ", "화학Ⅱ",
    "생명과학Ⅰ", "생명과학Ⅱ",
    "지구과학Ⅰ", "지구과학Ⅱ",
  ];
  return naturalScienceSubjects.includes(subject);
};

// 계명대학교 점수 계산 함수
export const 계명대학교 = async (userId, selection) => {
  const supabase = createClient();

  // 사용자 시험 데이터 불러오기
  const { data, error } = await supabase
    .from("exam_results")
    .select(
      "percentile_korean, percentile_math, percentile_science1, percentile_science2, grade_english, grade_history, science1, science2, math"
    )
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    return "불가"; // 데이터가 없거나 에러일 경우 처리
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
    math,
  } = data;

  // 영어 점수 계산
  const englishScore = getEnglishScore(grade_english);
  const historyBonus = getHistoryBonus400(grade_history);

  let totalScore = 0;

  if (selection.계열 === "자연") {
    // 수학 조건: 미적/기하 필수
    if (math !== "미적분" && math !== "기하") {
      return "불가: 수학 과목 조건 불충족"; // 미적분, 기하 필수
    }

    // 탐구 조건: 두 과목 모두 과학탐구여야 함
    if (!isNaturalScience(science1) || !isNaturalScience(science2)) {
      return "불가: 탐구 과목 조건 불충족"; // 자연탐구 필수
    }

    // 가중합 (0~100)
    const base =
      Number(percentile_korean) * 0.25 +
      Number(percentile_math) * 0.3 +
      Number(percentile_science1) * 0.125 +
      Number(percentile_science2) * 0.125 +
      Number(englishScore) * 0.2;

    totalScore = base*4 + historyBonus ;
  } else {
    return "불가"; // 잘못된 계열 값일 경우
  }

  return totalScore.toFixed(2);
};
