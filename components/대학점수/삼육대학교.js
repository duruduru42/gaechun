import { createClient } from "@/utils/supabase/client";

// Conversion table for English and Korean History scores based on grade
const getConvertedScore = (grade) => {
    const scoreTable = {
        1: 98, 2: 95, 3: 92, 4: 87, 5: 82,
        6: 70, 7: 50, 8: 40, 9: 0
    };
    return scoreTable[grade] || 0;
};

// Check if the subject is a science inquiry subject (과학탐구)
const isScienceInquiry = (subject) => {
    const scienceSubjects = [
        '물리학Ⅰ', '물리학Ⅱ', '화학Ⅰ', '화학Ⅱ',
        '생명과학Ⅰ', '생명과학Ⅱ', '지구과학Ⅰ', '지구과학Ⅱ'
    ];
    return scienceSubjects.includes(subject);
};

// Samyook University score calculation function
export const 삼육대학교 = async (userId, selection) => {
    const supabase = createClient();

    // Fetch user data
    const { data, error } = await supabase
        .from('exam_results')
        .select('percentile_korean, percentile_math, percentile_science1, percentile_science2, grade_english, grade_history, science1, science2, math')
        .eq('user_id', userId)
        .single();

    if (error || !data) {
        console.error('Error fetching exam results:', error);
        console.error('Fetched data:', data);
        return '불가';
    }

    // Use `let` for variables that need to be reassigned
    let {
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

    if (!['인문', '자연', '약학'].includes(selection.계열)) {
        console.warn('Invalid 계열:', selection.계열);
        return '불가';
    }

    const englishScore = getConvertedScore(grade_english);
    const historyScore = getConvertedScore(grade_history);

    let explorationScore1 = percentile_science1 || 0;
    let explorationScore2 = percentile_science2 || 0;

    if (selection.계열 === '자연' && (math === '미적분' || math === '기하')) {
        percentile_math *= 1.05; // Apply bonus
    }

    if (selection.계열 === '약학') {
        if (math === '미적분' || math === '기하') {
            percentile_math *= 1.05; // Apply bonus
        }
        if (isScienceInquiry(science1) && isScienceInquiry(science2)) {
            explorationScore1 *= 1.03;
            explorationScore2 *= 1.03;
        }
    }

    const explorationScores = [explorationScore1, explorationScore2, historyScore];
    explorationScores.sort((a, b) => b - a);
    const topTwoExplorationScores = (Number(explorationScores[0]) + Number(explorationScores[1]))/2;

    let totalScore = 0;

    if (selection.계열 === '인문' || selection.계열 === '자연') {
        // Ensure all scores are numbers
        const scores = [
            Number(percentile_korean),
            Number(percentile_math),
            Number(englishScore),
            Number(topTwoExplorationScores)
        ];
    
        // Sort scores in descending order
        scores.sort((a, b) => b - a);
    
        // Calculate the total score
        totalScore = (scores[0] * 0.4 + scores[1] * 0.3 + scores[2] * 0.2 + scores[3] * 0.1) * 10;
    }
     else if (selection.계열 === '약학') {
        totalScore = (
            percentile_korean * 0.25 +
            percentile_math * 0.3 +
            englishScore * 0.25 +
            (explorationScore1+explorationScore2) * 0.1
        ) * 10;
    } else {
        return '불가';
    }

    return totalScore.toFixed(2);
};
