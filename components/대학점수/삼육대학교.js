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
        return '불가'; // If there's an error or no data found
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
        math
    } = data;

    // Calculate English and Korean History scores
    const englishScore = getConvertedScore(grade_english);
    const historyScore = getConvertedScore(grade_history);

    // Determine exploration subject scores (탐구) and apply conditions
    let explorationScore1 = percentile_science1;
    let explorationScore2 = percentile_science2;

    if (selection.계열 === '자연' && (math === '미적분' || math === '기하')) {
        // 5% bonus if math is "미적분" or "기하" for natural sciences
        percentile_math *= 1.05;
    }

    if (selection.계열 === '약학') {
        // Apply bonuses for 약학 track
        if (math === '미적분' || math === '기하') {
            percentile_math *= 1.05; // 5% bonus for math if it is "미적분" or "기하"
        }

        // Apply science inquiry subject bonus if both 탐구 subjects are science inquiry subjects
        if (isScienceInquiry(science1) && isScienceInquiry(science2)) {
            explorationScore1 *= 1.03;
            explorationScore2 *= 1.03;
        }
    }

    // Select the top two scores among 탐구1, 탐구2, and 한국사
    const explorationScores = [explorationScore1, explorationScore2, historyScore];
    explorationScores.sort((a, b) => b - a);
    const topTwoExplorationScores = explorationScores[0] + explorationScores[1];

    // Calculate final score based on track
    let totalScore = 0;

    if (selection.계열 === '인문' || selection.계열 === '자연') {
        // Sort scores in descending order and apply weight
        const scores = [percentile_korean, percentile_math, englishScore, topTwoExplorationScores];
        scores.sort((a, b) => b - a);

        totalScore = (scores[0] * 0.4 + scores[1] * 0.3 + scores[2] * 0.2 + scores[3] * 0.1) * 10;
    } else if (selection.계열 === '약학') {
        // Calculate score for 약학 track
        totalScore = (
            percentile_korean * 0.25 +
            percentile_math * 0.3 +
            englishScore * 0.25 +
            topTwoExplorationScores * 0.2
        ) * 10;
    } else {
        return '불가'; // Invalid track
    }

    return totalScore.toFixed(2);
};
