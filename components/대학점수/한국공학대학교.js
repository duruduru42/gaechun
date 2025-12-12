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
        percentile_korean = 0,
        percentile_math = 0,
        percentile_science1 = 0,
        percentile_science2 = 0,
        grade_english = 0,
        math
    } = data;

    // Ensure all values are numbers
    const koreanScore = Number(percentile_korean) || 0;
    const rawMathScore = Number(percentile_math) || 0;
    const science1Score = Number(percentile_science1) || 0;
    const science2Score = Number(percentile_science2) || 0;
    const englishScore = getEnglishScore(Number(grade_english)) || 0;

    // Apply 10% bonus if math subject is '미적분' or '기하'
    const mathScore = isAdvancedMath(math) ? rawMathScore * 1.1 : rawMathScore;

    // Calculate the total score based on the selected track
    let totalScore = 0;
    if (selection.계열 === '공학') {
        totalScore = (koreanScore*1.25) + (mathScore * 1.75) + englishScore  + (Math.max(science1Score, science2Score) );
    } else if (selection.계열 === '경영') {
        totalScore = (koreanScore * 1.5) + (mathScore * 1.5) + englishScore  + (Math.max(science1Score, science2Score) );
    } else {
        return '불가'; // If the track is invalid
    }

    // Ensure totalScore is a number before formatting
    return Number(totalScore).toFixed(2);
};
