import { createClient } from "@/utils/supabase/client";

export const 고려대학교 = async (userId, selection) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('exam_results')
    .select('standard_score_korean, standard_score_math, standard_score_science1, standard_score_science2, grade_english, grade_history, science1, science2')
    .eq('user_id', userId)
    .single();

  if (error || !data) return '불가';

  const {
    standard_score_korean,
    standard_score_math,
    standard_score_science1,
    standard_score_science2,
    grade_english,
    grade_history,
    science1,
    science2
  } = data;


  let score;
  if (['경영대학', '국어국문학과', '철학과', '사학과', '사회학과', '영어영문학과', '독어독문학과', '불어불문학과', '중어중문학과', '노어노문학과', '일어일문학과',
    '서어서문학과', '언어학과', '식품자원경제학과', '정치외교학과', '경제학과', '통계학과', '행정학과', '교육학과', '국어교육과', '영어교육과',
    '지리교육과', '역사교육과', '가정교육과', '국제학부', '미디어학부', '보건정책관리학부', '자유전공학부', '심리학부'
  ].includes(selection.department)) {
    // 인문계
    score = ((Number(standard_score_korean) + Number(standard_score_math) + (Number(standard_score_science1) + Number(standard_score_science2))*0.8)) / 560 * 1000;
  } else {
    // 자연계
    score = (Number(standard_score_korean) + Number(standard_score_math) + (Number(standard_score_science1) + Number(standard_score_science2))) / 640 * 1000;
  }

  // Deduct points for English grade
  const englishPenalty = {
    1: 0, 2: 3, 3: 6, 4: 9, 5: 12,
    6: 15, 7: 18, 8: 21, 9: 24
  };
  score -= englishPenalty[grade_english] || 0;

  // Add points for History grade
  const historyBonus = {
    1: 10, 2: 10, 3: 10, 4: 10, 5: 9.8,
    6: 9.6, 7: 9.4, 8: 9.2, 9: 8
  };
  score += historyBonus[grade_history] || 0;

  const scienceSubjects = ['물리학Ⅰ', '지구과학Ⅰ', '화학Ⅰ', '생명과학Ⅰ', '물리학Ⅱ', '지구과학Ⅱ', '화학Ⅱ', '생명과학Ⅱ'];
  
  if (!scienceSubjects.includes(science1) || !scienceSubjects.includes(science2)) {
    if (['경영대학', '국어국문학과', '철학과'].includes(selection.department)) {
      return '불가';
    }
  }

const forbiddenCombinations = [
  ['물리학Ⅰ', '물리학Ⅱ'],
  ['화학Ⅰ', '화학Ⅱ'],
  ['지구과학Ⅰ', '지구과학Ⅱ'],
  ['생명과학Ⅰ', '생명과학Ⅱ']
];

if (forbiddenCombinations.some(([sci1, sci2]) => 
    (science1 == sci1 && science2 == sci2) ||
    (science1 == sci2 && science2 == sci1))) {
  return '불가';
}


  return score.toFixed(2);
};