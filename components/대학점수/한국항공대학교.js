import { createClient } from "@/utils/supabase/client";

// English grade to standard score mapping
const getEnglishScore = (grade) => {
    const englishScores = {
        1: 136, 2: 134, 3: 132, 4: 127, 5: 122,
        6: 117, 7: 112, 8: 107, 9: 102
    };
    return englishScores[grade] || 0;
};

// Korean History bonus points based on grade
const getHistoryBonus = (grade) => {
    const historyBonuses = {
        1: 10, 2: 10, 3: 10, 4: 10, 5: 9.9, 6: 9.8, 7: 9.7, 8: 9.6, 9: 9.5
    };
    return historyBonuses[grade] || 0;
};

const naturalScienceSubjects = [
    '물리학Ⅰ', '물리학Ⅱ', '화학Ⅰ', '화학Ⅱ',
    '지구과학Ⅰ', '지구과학Ⅱ', '생명과학Ⅰ', '생명과학Ⅱ'
  ];

// Korea Aerospace University score calculation function
export const 한국항공대학교 = async (userId, selection) => {
    const supabase = createClient();

    // Fetch user data
    const { data, error } = await supabase
        .from('exam_results')
        .select('standard_score_korean, standard_score_math, standard_score_science1, standard_score_science2, grade_english, grade_history, science1, science2')
        .eq('user_id', userId)
        .single();

    if (error || !data) {
        return '불가'; // If there's an error or no data found
    }

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

    const englishScore = getEnglishScore(grade_english);

    const historyBonus = getHistoryBonus(grade_history);

    let totalScore = 0;

    if (selection.계열 === '자연1') {
    
        const scienceScore1 = naturalScienceSubjects.includes(science1)
            ? Number(standard_score_science1) * 1.05
            : Number(standard_score_science1);
    
        const scienceScore2 = naturalScienceSubjects.includes(science2)
            ? Number(standard_score_science2) * 1.05
            : Number(standard_score_science2);
    
        totalScore = (Number(standard_score_korean) * 0.2 + Number(standard_score_math) * 0.35 + Number(englishScore) * 0.2 + (scienceScore1 + scienceScore2) * 0.25) * 5 + Number(historyBonus);
    
    } else if (selection.계열 === '자연2') {
    
        const scienceScore1 = naturalScienceSubjects.includes(science1)
            ? Number(standard_score_science1) * 1.05
            : Number(standard_score_science1);
    
        const scienceScore2 = naturalScienceSubjects.includes(science2)
            ? Number(standard_score_science2) * 1.05
            : Number(standard_score_science2);
    
        totalScore = (Number(standard_score_korean) * 0.25 + Number(standard_score_math) * 0.3 + Number(englishScore) * 0.2 + (scienceScore1 + scienceScore2) * 0.25) * 5 + Number(historyBonus);
    
    } else if (selection.계열 === '인문') {
    
        const scienceScore1 = Number(standard_score_science1);
        const scienceScore2 = Number(standard_score_science2);
    
        totalScore = (Number(standard_score_korean) * 0.3 + Number(standard_score_math) * 0.25 + Number(englishScore) * 0.2 + (scienceScore1 + scienceScore2) * 0.25) * 5 + Number(historyBonus);
    
    } else {
        return '불가'; // Invalid tracks
    }
    
    return totalScore.toFixed(2);
};
