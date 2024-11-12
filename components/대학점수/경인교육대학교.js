import { createClient } from "@/utils/supabase/client";

// English and Korean History score tables
const getEnglishScore = (grade) => {
    const englishScores = {
        1: 100, 2: 95, 3: 90, 4: 85, 5: 80,
        6: 75, 7: 70, 8: 65, 9: 60
    };
    return englishScores[grade] || 0;
};

const getHistoryPenalty = (grade) => {
    const historyPenalties = {
        1: 0, 2: 0, 3: 0, 4: 0, 5: 2,
        6: 4, 7: 6, 8: 8, 9: 10
    };
    return historyPenalties[grade] || 0;
};

// Gyeongin National University of Education score calculation function
export const 경인교육대학교 = async (userId) => {
    const supabase = createClient();

    // Fetch user exam data
    const { data, error } = await supabase
        .from('exam_results')
        .select('percentile_korean, percentile_math, percentile_science1, percentile_science2, grade_english, grade_history, math')
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
        grade_history,
        math
    } = data;

    // Calculate English and Korean History scores
    const englishScore = getEnglishScore(grade_english);
    const historyPenalty = getHistoryPenalty(grade_history);

    // Calculate average of exploration subjects
    const avgExplorationScore = (Number(percentile_science1) + Number(percentile_science2)) / 2;

    // Apply 3% bonus if math is '미적분' or '기하'
    const mathScore = (math === '미적분' || math === '기하') ? percentile_math * 1.03 : percentile_math;

    // Calculate total score
    const totalScore = (Number(percentile_korean) + Number(mathScore) + Number(englishScore) + avgExplorationScore) * 2.5 - historyPenalty;

    return totalScore.toFixed(2);
};
