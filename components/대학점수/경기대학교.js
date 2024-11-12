import { createClient } from "@/utils/supabase/client";

// English conversion scores based on grade
const getEnglishScore = (grade) => {
    const englishScores = {
        1: 100, 2: 98, 3: 94, 4: 86, 5: 70,
        6: 50, 7: 30, 8: 10, 9: 0
    };
    return englishScores[grade] || 0;
};

// Korean history penalty based on grade
const getHistoryPenalty = (grade) => {
    const historyPenalties = {
        1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
        6: 0.5, 7: 0.5, 8: 1, 9: 1
    };
    return historyPenalties[grade] || 0;
};

// 경기대학교 score calculation function
export const 경기대학교 = async (userId, selection) => {
    const supabase = createClient();

    // Fetch user exam data
    const { data, error } = await supabase
        .from('exam_results')
        .select('percentile_korean, percentile_math, percentile_science1, percentile_science2, grade_english, grade_history')
        .eq('user_id', userId)
        .single();

    if (error || !data) {
        return '불가'; // Error handling if no data found
    }

    const {
        percentile_korean,
        percentile_math,
        percentile_science1,
        percentile_science2,
        grade_english,
        grade_history
    } = data;

    // Calculate English score and history penalty
    const englishScore = getEnglishScore(grade_english);
    const historyPenalty = getHistoryPenalty(grade_history);

    // Select the higher score between two inquiry subjects
    const highestInquiryScore = Math.max(percentile_science1, percentile_science2);

    // Calculate total score based on selection
    let totalScore = 0;
    if (selection.계열 === '인문') {
        totalScore = (percentile_korean * 0.35) + (percentile_math * 0.3) + (englishScore * 0.2) + (highestInquiryScore * 0.15);
    } else if (selection.계열 === '자연') {
        totalScore = (percentile_korean * 0.3) + (percentile_math * 0.5) + (englishScore * 0.2) + (highestInquiryScore * 0.15);
    } else {
        return '불가'; // Invalid 계열 value
    }

    // Apply history penalty
    const finalScore = totalScore - historyPenalty;

    return finalScore.toFixed(2);
};
