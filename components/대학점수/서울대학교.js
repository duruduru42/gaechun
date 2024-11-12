import { createClient } from "@/utils/supabase/client";

export const 서울대학교 = async (userId, selection) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('exam_results')
    .select('standard_score_korean, standard_score_math, standard_score_science1, standard_score_science2, foreign_language, science1, science2')
    .eq('user_id', userId)
    .single();

  if (error || !data) return '불가';

  const { standard_score_korean, standard_score_math, standard_score_science1, standard_score_science2, foreign_language, science1, science2 } = data;

  // Conditionally return '불가' for 인문계 if foreign_language is null
  if (!foreign_language && selection.계열 === '인문') return '불가';

  // Calculate base score
  let score = (
    (Number(standard_score_korean) || 0) + 
    (Number(standard_score_math) * 1.2 || 0) + 
    ((Number(standard_score_science1) + Number(standard_score_science2)) * 0.8 || 0)
  ).toFixed(1);
  // Check for 과목2 rule and apply bonus
  const advancedScienceSubjects = ['물리학Ⅱ', '지구과학Ⅱ', '화학Ⅱ', '생명과학Ⅱ'];
  let advancedCount = 0;
  if (advancedScienceSubjects.includes(science1)) advancedCount++;
  if (advancedScienceSubjects.includes(science2)) advancedCount++;
  score += advancedCount === 2 ? 5 : advancedCount === 1 ? 3 : 0;

  return score;
};