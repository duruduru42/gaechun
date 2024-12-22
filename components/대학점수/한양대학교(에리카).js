import { createClient } from "@/utils/supabase/client";

const conversionTable = {
    자연: {
        100: 70.00, 99: 69.81, 98: 69.40, 97: 69.02, 96: 68.59, 95: 68.25,
        94: 67.85, 93: 67.26, 92: 67.01, 91: 66.54, 90: 66.33, 89: 65.66,
        88: 65.45, 87: 64.89, 86: 64.50, 85: 64.42, 84: 63.58, 83: 63.37,
        82: 62.72, 81: 62.61, 80: 62.09, 79: 61.52, 78: 61.36, 77: 61.02,
        76: 60.47, 75: 60.45, 74: 59.66, 73: 59.01, 72: 58.91, 71: 58.51,
        70: 57.78, 69: 57.76, 68: 57.21, 67: 56.63, 66: 56.39, 65: 55.90,
        64: 55.74, 63: 55.18, 62: 54.83, 61: 54.44, 60: 54.14, 59: 54.09,
        58: 52.88, 57: 52.59, 56: 52.51, 55: 52.12, 54: 51.44, 53: 51.21,
        52: 50.81, 51: 50.22, 50: 49.85, 49: 49.37, 48: 48.96, 47: 48.82,
        46: 48.50, 45: 47.71, 44: 47.43, 43: 47.32, 42: 46.53, 41: 46.29,
        40: 45.75, 39: 45.49, 38: 45.21, 37: 44.91, 36: 44.07, 35: 44.02,
        34: 43.38, 33: 43.08, 32: 42.66, 31: 42.18, 30: 41.69, 29: 41.22,
        28: 41.12, 27: 40.58, 26: 40.32, 25: 40.09, 24: 39.17, 23: 39.09,
        22: 38.60, 21: 38.40, 20: 37.88, 19: 37.51, 18: 37.10, 17: 36.58,
        16: 36.19, 15: 35.81, 14: 35.19, 13: 35.01, 12: 34.62, 11: 34.02,
        10: 33.69, 9: 33.45, 8: 32.89, 7: 32.30, 6: 32.00, 5: 31.60,
        4: 31.41, 3: 30.81, 2: 30.46, 1: 30.04, 0: 29.68
    },
    인문: {
        100: 70.00, 99: 69.81, 98: 69.40, 97: 69.02, 96: 68.59, 95: 68.25,
        94: 67.85, 93: 67.26, 92: 67.01, 91: 66.54, 90: 66.33, 89: 65.66,
        88: 65.45, 87: 64.89, 86: 64.50, 85: 64.42, 84: 63.58, 83: 63.37,
        82: 62.72, 81: 62.61, 80: 62.09, 79: 61.52, 78: 61.36, 77: 61.02,
        76: 60.47, 75: 60.45, 74: 59.66, 73: 59.01, 72: 58.91, 71: 58.51,
        70: 57.78, 69: 57.76, 68: 57.21, 67: 56.63, 66: 56.39, 65: 55.90,
        64: 55.74, 63: 55.18, 62: 54.83, 61: 54.44, 60: 54.14, 59: 54.09,
        58: 52.88, 57: 52.59, 56: 52.51, 55: 52.12, 54: 51.44, 53: 51.21,
        52: 50.81, 51: 50.22, 50: 49.85, 49: 49.37, 48: 48.96, 47: 48.82,
        46: 48.50, 45: 47.71, 44: 47.43, 43: 47.32, 42: 46.53, 41: 46.29,
        40: 45.75, 39: 45.49, 38: 45.21, 37: 44.91, 36: 44.07, 35: 44.02,
        34: 43.38, 33: 43.08, 32: 42.66, 31: 42.18, 30: 41.69, 29: 41.22,
        28: 41.12, 27: 40.58, 26: 40.32, 25: 40.09, 24: 39.17, 23: 39.09,
        22: 38.60, 21: 38.40, 20: 37.88, 19: 37.51, 18: 37.10, 17: 36.58,
        16: 36.19, 15: 35.81, 14: 35.19, 13: 35.01, 12: 34.62, 11: 34.02,
        10: 33.69, 9: 33.45, 8: 32.89, 7: 32.30, 6: 32.00, 5: 31.60,
        4: 31.41, 3: 30.81, 2: 30.46, 1: 30.04, 0: 29.68
    }
  };

// Convert English grade to score
const getEnglishScore = (grade) => {
    const englishScores = {
        1: 100, 2: 99.5, 3: 99, 4: 98, 5: 96.5,
        6: 95, 7: 92.5, 8: 90, 9: 85
    };
    return englishScores[grade] || 0;
};

// Convert Korean History grade to score
const getHistoryScore = (grade) => {
    const historyScores = {
        1: 10, 2: 10, 3: 10, 4: 10, 5: 9.9,
        6: 9.8, 7: 9.7, 8: 9.6, 9: 9
    };
    return historyScores[grade] || 0;
};

const getConvertedScore = (percentile, subject) => {
    const track = naturalScienceSubjects.includes(subject) ? '자연' : '인문';
    const percentileScore = conversionTable[track][percentile]; // 백분위에 해당하는 점수 가져오기
    const maxScore = conversionTable[track][100]; // 백분위 100 점수 가져오기
    return maxScore && percentileScore ? percentileScore / maxScore : 0; // 변환 점수 계산
  };


const humanitiesSubjects = [
  '생활과윤리', '윤리와사상', '한국지리', '세계지리', 
  '동아시아사', '세계사', '경제', '정치와법', '사회문화'
];

const naturalScienceSubjects = [
  '물리학Ⅰ', '물리학Ⅱ', '화학Ⅰ', '화학Ⅱ',
  '지구과학Ⅰ', '지구과학Ⅱ', '생명과학Ⅰ', '생명과학Ⅱ'
];

// Hanyang University ERICA score calculation function
export const 한양대학교에리카 = async (userId, selection) => {
    const supabase = createClient();

    // Fetch user data
    const { data, error } = await supabase
        .from('exam_results')
        .select('standard_score_korean, standard_score_math, percentile_science1, percentile_science2, grade_english, grade_history, science1, science2')
        .eq('user_id', userId)
        .single();

    if (error || !data) {
        return '불가'; // If there's an error or no data found
    }

    const {
        standard_score_korean,
        standard_score_math,
        percentile_science1,
        percentile_science2,
        grade_english,
        grade_history,
        science1,
        science2
    } = data;

    // Calculate English and Korean History scores
    const englishScore = getEnglishScore(grade_english);
    const historyScore = getHistoryScore(grade_history);

    const convertedScienceScore1 = getConvertedScore(percentile_science1, science1);
    const convertedScienceScore2 = getConvertedScore(percentile_science2, science2);

    // Score calculation based on 계열
    let totalScore;
    if (selection.계열 === '인문') {

        const scienceScore1 = humanitiesSubjects.includes(science1)
        ? convertedScienceScore1 * 1.03
        : convertedScienceScore1;
    
        const scienceScore2 = humanitiesSubjects.includes(science2)
        ? convertedScienceScore2 * 1.03
        : convertedScienceScore2;

        totalScore = ((standard_score_korean * 300 / 139) + (standard_score_math * 300 / 140) + (englishScore * 1.5) + (scienceScore1+scienceScore2)*125);

    } else if (selection.계열 === '상경' || selection.계열 === '자연2') {

        totalScore = ((standard_score_korean * 250 / 139) + (standard_score_math * 350 / 140) + (englishScore * 1.5) + (convertedScienceScore1+convertedScienceScore2)*125);
        
    } else if (selection.계열 === '자연1') {

        const scienceScore1 = naturalScienceSubjects.includes(science1)
        ? convertedScienceScore1 * 1.03
        : convertedScienceScore1;
    
        const scienceScore2 = naturalScienceSubjects.includes(science2)
        ? convertedScienceScore2 * 1.03
        : convertedScienceScore2;

        totalScore = ((standard_score_korean * 250 / 139) + (standard_score_math * 350 / 140) + (englishScore * 1.5) + (scienceScore1+scienceScore2)*125);

    } else {
        return '불가'; // If the 계열 is invalid
    }

    // Add Korean History score as a bonus
    totalScore += historyScore;

    return totalScore.toFixed(2);
};
