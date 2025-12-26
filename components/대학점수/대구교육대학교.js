import { createClient } from "@/utils/supabase/client";

// English score conversion table
const getEnglishScore = (grade) => {
    const englishScores = {
        1: 200, 2: 195, 3: 190, 4: 185, 5: 180,
        6: 175, 7: 170, 8: 165, 9: 0
    };
    return englishScores[grade] || 0;
};

// Highest standard score for each inquiry subject
const maxScores = {
    "생활과윤리": 77, "윤리와사상": 74, "한국지리": 70, "세계지리": 70,
    "동아시아사": 68, "세계사": 70, "경제": 71, "정치와법": 68, "사회문화": 70,
    "물리학Ⅰ": 68, "화학Ⅰ": 66, "생명과학Ⅰ": 70, "지구과학Ⅰ": 73,
    "물리학Ⅱ": 73, "화학Ⅱ": 74, "생명과학Ⅱ": 73, "지구과학Ⅱ": 75
};

// Get the maximum score for a given inquiry subject
const getMaxScore = (subject) => {
    return maxScores[subject] || 1; // Default to 1 to prevent division by zero if the subject is not found
};

// Daegu National University of Education score calculation function
// 핵심 수정: 세 번째 인자 isAdmin 추가 (기본값 false)
export const 대구교육대학교 = async (userId, selection, isAdmin = false) => {
    const supabase = createClient();

    // isAdmin 여부에 따라 테이블과 ID 컬럼 결정
    const tableName = isAdmin ? 'admin_managed_students' : 'exam_results';
    const idColumn = isAdmin ? 'id' : 'user_id';

    // Fetch user exam data
    const { data, error } = await supabase
        .from(tableName)
        .select('standard_score_korean, standard_score_math, standard_score_science1, standard_score_science2, grade_english, science1, science2')
        .eq(idColumn, userId)
        .single();

    if (error || !data) {
        return '불가'; // Error handling if no data found
    }

    const {
        standard_score_korean,
        standard_score_math,
        standard_score_science1,
        standard_score_science2,
        grade_english,
        science1,
        science2
    } = data;

    // Calculate English score
    const englishScore = getEnglishScore(grade_english);

    // Calculate inquiry scores based on maximum score for each subject
    const maxScore1 = getMaxScore(science1);
    const maxScore2 = getMaxScore(science2);
    
    const adjustedInquiryScore = Number(standard_score_science1 * 0.1 / maxScore1) + Number(standard_score_science2 * 0.1 / maxScore2);

    // Calculate total score
    const totalScore = (
        (Number(standard_score_korean) * 0.3 / 147) +
        (Number(standard_score_math) * 0.3 / 139) +
        adjustedInquiryScore
    ) * 1000 + Number(englishScore);
    
    return totalScore.toFixed(2);
};
