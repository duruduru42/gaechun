import { createClient } from "@/utils/supabase/client";

// English grade to score mapping
const getEnglishScore = (grade) => {
    const englishScores = {
        1: 100, 2: 96, 3: 92, 4: 88, 5: 80,
        6: 60, 7: 30, 8: 20, 9: 10
    };
    return englishScores[grade] || 0;
};

// Check if the math subject qualifies for a 10% bonus
const isAdvancedMath = (subject) => {
    return subject === '미적분' || subject === '기하';
};

// Korea Polytechnic University score calculation function
export const 한국공학대학교 = async (userId, selection) => {
    const supabase = createClient();

    // Fetch user data
    const { data, error } = await supabase
        .from('exam_results')
        .select('percentile_korean, percentile_math, percentile_science1, percentile_science2, grade_english, math')
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
        math
    } = data;

    // Calculate English score
    const englishScore = getEnglishScore(grade_english);

    // Apply 10% bonus if math subject is '미적분' or '기하'
    const mathScore = isAdvancedMath(math) ? percentile_math * 1.1 : percentile_math;

    // Select the higher score between the two 탐구 subjects
    const highestScienceScore = Math.max(percentile_science1, percentile_science2);

    // Calculate the total score based on the selected track
    let totalScore = 0;
    if (selection.계열 === '공학') {
        totalScore = percentile_korean + (mathScore * 1.4) + (englishScore * 0.8) + (highestScienceScore * 0.8);
    } else if (selection.계열 === '경영') {
        totalScore = (percentile_korean * 1.2) + (mathScore * 1.2) + (englishScore * 0.8) + (highestScienceScore * 0.8);
    } else {
        return '불가'; // If the track is invalid
    }

    return totalScore.toFixed(2);
};
