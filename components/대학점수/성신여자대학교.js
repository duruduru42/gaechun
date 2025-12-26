import { createClient } from "@/utils/supabase/client";

// 영어 환산 점수 표
const getEnglishScore = (grade) => {
  const englishScores = {
    1: 100, 2: 97, 3: 94, 4: 85, 5: 60,
    6: 40, 7: 25, 8: 10, 9: 0
  };
  return englishScores[grade] || 0;
};

// 한국사 가산점 표
const getHistoryBonus = (grade) => {
  const historyBonuses = {
    1: 2, 2: 1.5, 3: 1, 4: 0.5, 5: 0,
    6: 0, 7: 0, 8: 0, 9: 0
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

// 성신여자대학교 점수 계산 함수
// 핵심 수정: 세 번째 인자 isAdmin 추가 (기본값 false)
export const 성신여자대학교 = async (userId, selection, isAdmin = false) => {
  const supabase = createClient();

  // isAdmin 여부에 따라 테이블과 ID 컬럼 결정
  const tableName = isAdmin ? 'admin_managed_students' : 'exam_results';
  const idColumn = isAdmin ? 'id' : 'user_id';

  // 사용자 시험 데이터 불러오기
  const { data, error } = await supabase
    .from(tableName)
    .select('percentile_korean, percentile_math, percentile_science1, percentile_science2, grade_english, grade_history, science1, science2')
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
    science2
  } = data;

  // 영어 점수 및 한국사 가산점 계산
  const englishScore = getEnglishScore(grade_english);
  const historyBonus = getHistoryBonus(grade_history);

  // 탐구 과목 평균 점수 계산
  const scienceAverage = (Number(percentile_science1 )+ Number(percentile_science2)) / 2;

  let totalScore = 0;

  // 계열별 계산
  if (selection.계열 === '나1') {
    totalScore = ((percentile_korean * 0.3) +
                 (percentile_math * 0.2) +
                 (englishScore * 0.3) +
                 (scienceAverage * 0.2)) * 5 +
                 historyBonus;

  } else if (selection.계열 === '가3') {
    totalScore = ((percentile_korean * 0.3) +
                 (percentile_math * 0.2) +
                 (englishScore * 0.2) +
                 (scienceAverage * 0.3)) * 5 +
                 historyBonus;

  } else if (selection.계열 === '가4') {
    if (!isNaturalScience(science1) || !isNaturalScience(science2)) {
      return '불가: 탐구 과목 조건 불충족'; // 자연탐구 필수
    }

    totalScore = ((percentile_korean * 0.2) +
                 (percentile_math * 0.3) +
                 (englishScore * 0.2) +
                 (scienceAverage * 0.3)) * 5 +
                 historyBonus;


  } else if (selection.계열 === '가1') {
    totalScore = ((percentile_korean * 0.2) +
                 (percentile_math * 0.3) +
                 (englishScore * 0.2) +
                 (scienceAverage * 0.3)) * 5 +
                 historyBonus;


  } else if (selection.계열 === '가2') {
    totalScore = ((percentile_korean * 0.1) +
                 (percentile_math * 0.35) +
                 (englishScore * 0.3) +
                 (scienceAverage * 0.25)) * 5 +
                 historyBonus;

  
 } else if (selection.계열 === '나2') {
  totalScore = ((percentile_korean * 0.3) +
                               (percentile_math * 0.25) +
                               (englishScore * 0.2) +
                               (scienceAverage * 0.25)) * 5 +
                               historyBonus;


  } else {
    return '불가: 잘못된 계열 값'; // 잘못된 계열 값일 경우
  }

  return totalScore.toFixed(2);
};
