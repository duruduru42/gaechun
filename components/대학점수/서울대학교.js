import { createClient } from "@/utils/supabase/client";

const penaltyTable = {
  english: {
    1: 0, 2: 0.5, 3: 2.0, 4: 4.0, 5: 6.0, 6: 8.0, 7: 10.0, 8: 12.0, 9: 14.0,
  },
  history: {
    1: 0, 2: 0, 3: 0, 4: 0.4, 5: 0.8, 6: 1.2, 7: 1.6, 8: 2.0, 9: 2.4,
  },
  foreignLanguage: {
    1: 0, 2: 0, 3: 0.5, 4: 1.0, 5: 1.5, 6: 2.0, 7: 2.5, 8: 3.0, 9: 3.5,
  },
};

const advancedMathSubjects = ["미적분", "기하"];
const requiredScienceSubjects = [
  "물리학Ⅰ",
  "물리학Ⅱ",
  "화학Ⅰ",
  "화학Ⅱ",
];

const naturalScienceSubjects = [
  '물리학Ⅰ', '물리학Ⅱ', '화학Ⅰ', '화학Ⅱ',
  '생명과학Ⅰ', '생명과학Ⅱ', '지구과학Ⅰ', '지구과학Ⅱ'
];

export const 서울대학교 = async (userId, selection) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("exam_results")
    .select(
      "math, standard_score_korean, grade_history, standard_score_math, standard_score_science1, standard_score_science2, foreign_language, grade_korean, grade_math, grade_english, grade_science1, grade_science2, grade_foreign_language, science1, science2"
    )
    .eq("user_id", userId)
    .single();

  if (error || !data) return "불가1";

  const {
    standard_score_korean,
    standard_score_math,
    standard_score_science1,
    standard_score_science2,
    foreign_language,
    grade_korean,
    grade_math,
    grade_english,
    grade_science1,
    grade_science2,
    grade_history,
    grade_foreign_language,
    science1,
    science2,
    math
  } = data;


  if (
    selection.계열 === "인문" &&
    !foreign_language &&
    selection.모집단위 !== "자유전공학부"
  ) {
    return "불가";
  }
  const grades = [
    Number(grade_korean) || 9, // 값이 없으면 최악 등급으로 설정
    Number(grade_math) || 9,
    Number(grade_english) || 9,
    science1 && science2 // science1과 science2가 둘 다 있을 경우에만 평균 계산
      ? (Number(grade_science1) + Number(grade_science2)) / 2
      : 9, // 하나라도 없으면 최악 등급으로 설정
  ];
  
  // 상위 3개 등급 합 계산 함수
  const isEligibleForApplication = (grades) => {
    const topThreeGrades = [...grades].sort((a, b) => a - b).slice(0, 3); // 상위 3개 추출
    const total = topThreeGrades.reduce((sum, grade) => sum + grade, 0); // 합산
    console.log("상위 3개 등급:", topThreeGrades, "합계:", total); // 디버깅 로그 추가
    return total <= 7; // 상위 3개 등급 합이 7 이하여야 함
  };
  
  // 지원 가능 여부 체크
  if (!isEligibleForApplication(grades)) return "불가";
  

  // 자연 계열 추가 조건
  if (selection.계열 === "자연" || selection.계열 === "자연2") {
    // 수학 조건 확인
    if (!advancedMathSubjects.includes(math)) {
      return "불가: 수학 조건 미충족"; // '미적분' 또는 '기하'가 아니면 불가
    }

    // '자연'의 경우 과탐 조건 확인
    if (
      selection.계열 === "자연" &&
      !(
        naturalScienceSubjects.includes(science1) ||
        naturalScienceSubjects.includes(science2)
      )
    ) {
      return "불가 : 과탐 조건 미충족"; // 과탐 조건이 미충족되면 불가
    }

    // '자연2'의 경우 과학 조건 확인
    if (
      selection.계열 === "자연2" &&
      !(
        requiredScienceSubjects.includes(science1) ||
        requiredScienceSubjects.includes(science2)
      )
    ) {
      return "불가: 과학 조건 미충족"; // 과학 조건이 미충족되면 불가
    }
  }

  // 감점 계산
  let penalty = 0;

  // 영어 감점
  if (grade_english > 1) {
    penalty += penaltyTable.english[grade_english] || 0;
  }

  // 한국사 감점
  if (grade_history > 3) {
    penalty += penaltyTable.history[grade_history] || 0;
  }

  // 제2외국어/한문 감점
  if (
    selection.계열 === "인문" &&
    selection.모집단위 !== "자유전공학부" &&
    grade_foreign_language > 2
  ) {
    penalty += penaltyTable.foreignLanguage[grade_foreign_language] || 0;
  }

  // 기본 점수 계산
  let score =
    (Number(standard_score_korean) || 0) +
    (Number(standard_score_math) * 1.2 || 0) +
    ((Number(standard_score_science1) + Number(standard_score_science2)) * 0.8 || 0);

  // Check for advanced science subjects and apply bonus
  const advancedScienceSubjects = ['물리학Ⅱ', '지구과학Ⅱ', '화학Ⅱ', '생명과학Ⅱ'];
  let advancedCount = 0;
  if (selection.계열 === "자연" && advancedScienceSubjects.includes(science1) || selection.계열 === "자연2" && advancedScienceSubjects.includes(science1)) advancedCount++;
  if (selection.계열 === "자연" && advancedScienceSubjects.includes(science2) || selection.계열 === "자연2" && advancedScienceSubjects.includes(science2)) advancedCount++;
  score += advancedCount === 2 ? 5 : advancedCount === 1 ? 3 : 0;

  // 감점 적용
  score -= penalty;

  return score.toFixed(1);
};