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

export const 서울대학교 = async (userId, selection, isAdmin = false) => {
  const supabase = createClient();

  const tableName = isAdmin ? 'admin_managed_students' : 'exam_results';
  const idColumn = isAdmin ? 'id' : 'user_id';

  const { data, error } = await supabase
    .from(tableName)
    .select(
      "math, standard_score_korean, grade_history, standard_score_math, standard_score_science1, standard_score_science2, foreign_language, grade_korean, grade_math, grade_english, grade_science1, grade_science2, grade_foreign_language, science1, science2"
    )
    .eq(idColumn, userId)
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
    Number(grade_korean) || 9,
    Number(grade_math) || 9,
    Number(grade_english) || 9,
    science1 && science2
      ? (Number(grade_science1) + Number(grade_science2)) / 2
      : 9,
  ];

  const isEligibleForApplication = (grades) => {
    const topThreeGrades = [...grades].sort((a, b) => a - b).slice(0, 3);
    const total = topThreeGrades.reduce((sum, grade) => sum + grade, 0);
    return total <= 7;
  };

  if (!isEligibleForApplication(grades)) return "불가";

  // --- 자연 계열 조건 체크 시작 ---
  if (selection.계열 === "자연" || selection.계열 === "자연2") {
    // 수학 조건 확인
    if (!advancedMathSubjects.includes(math)) {
      return "불가: 수학 조건 미충족";
    }

    // '자연' 계열의 경우: 과탐1, 과탐2 모두 조건에 포함되어야 함 (&& 로 수정)
    if (
      selection.계열 === "자연" &&
      !(
        naturalScienceSubjects.includes(science1) &&
        naturalScienceSubjects.includes(science2)
      )
    ) {
      return "불가 : 과탐 조건 미충족";
    }

    // '자연2' 계열의 경우: 과학1, 과학2 모두 조건에 포함되어야 함 (&& 로 수정)
    if (
      selection.계열 === "자연2" &&
      !(
        requiredScienceSubjects.includes(science1) &&
        requiredScienceSubjects.includes(science2)
      )
    ) {
      return "불가: 과학 조건 미충족";
    }
  } // <--- 여기가 빠져있던 닫는 중괄호입니다.
  // --- 자연 계열 조건 체크 끝 ---

  let penalty = 0;

  if (grade_english > 1) {
    penalty += penaltyTable.english[grade_english] || 0;
  }

  if (grade_history > 3) {
    penalty += penaltyTable.history[grade_history] || 0;
  }

  if (
    selection.계열 === "인문" &&
    selection.모집단위 !== "자유전공학부" &&
    grade_foreign_language > 2
  ) {
    penalty += penaltyTable.foreignLanguage[grade_foreign_language] || 0;
  }

  let score =
    (Number(standard_score_korean) || 0) +
    (Number(standard_score_math) * 1.2 || 0) +
    ((Number(standard_score_science1) + Number(standard_score_science2)) * 0.8 || 0);

  const advancedScienceSubjects = ['물리학Ⅱ', '지구과학Ⅱ', '화학Ⅱ', '생명과학Ⅱ'];
  let advancedCount = 0;
  if ((selection.계열 === "자연" || selection.계열 === "자연2") && advancedScienceSubjects.includes(science1)) advancedCount++;
  if ((selection.계열 === "자연" || selection.계열 === "자연2") && advancedScienceSubjects.includes(science2)) advancedCount++;
  
  score += advancedCount === 2 ? 5 : advancedCount === 1 ? 3 : 0;

  score -= penalty;

  return score.toFixed(1);
};