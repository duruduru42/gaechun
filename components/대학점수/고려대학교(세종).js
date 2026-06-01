import { createClient } from "@/utils/supabase/client";

// 과탐 및 사탐 구분
const naturalScienceSubjects = [
    '물리학Ⅰ', '물리학Ⅱ', '화학Ⅰ', '화학Ⅱ',
    '지구과학Ⅰ', '지구과학Ⅱ', '생명과학Ⅰ', '생명과학Ⅱ'
  ];  

const conversionTable = {
    자연: {
        100: 70.12, 99: 69.37, 98: 68.54, 97: 67.77, 96: 66.96, 95: 66.25,
        94: 65.65, 93: 65.17, 92: 64.70, 91: 64.33, 90: 63.97, 89: 63.48,
        88: 63.11, 87: 62.69, 86: 62.32, 85: 61.96, 84: 61.59, 83: 61.22,
        82: 60.89, 81: 60.47, 80: 60.13, 79: 59.77, 78: 59.38, 77: 58.97,
        76: 58.63, 75: 58.22, 74: 57.90, 73: 57.53, 72: 57.25, 71: 56.95,
        70: 56.65, 69: 56.32, 68: 55.90, 67: 55.46, 66: 55.08, 65: 54.72,
        64: 54.37, 63: 53.96, 62: 53.54, 61: 53.07, 60: 52.71, 59: 52.38,
        58: 52.08, 57: 51.77, 56: 51.44, 55: 51.02, 54: 50.60, 53: 50.22,
        52: 49.91, 51: 49.61, 50: 49.29, 49: 48.95, 48: 48.60, 47: 48.27,
        46: 47.88, 45: 47.51, 44: 47.12, 43: 46.82, 42: 46.51, 41: 46.18,
        40: 45.86, 39: 45.59, 38: 45.31, 37: 45.02, 36: 44.68, 35: 44.37,
        34: 44.07, 33: 43.78, 32: 43.51, 31: 43.23, 30: 42.97, 29: 42.65,
        28: 42.32, 27: 42.05, 26: 41.78, 25: 41.50, 24: 41.20, 23: 40.92,
        22: 40.68, 21: 40.43, 20: 40.20, 19: 39.96, 18: 39.68, 17: 39.41,
        16: 39.12, 15: 38.83, 14: 38.54, 13: 38.25, 12: 37.96, 11: 37.65,
        10: 37.34, 9: 36.97, 8: 36.60, 7: 36.20, 6: 35.77, 5: 35.39,
        4: 35.04, 3: 34.47, 2: 33.75, 1: 32.37, 0: 30.37
    },
    인문: {
        100: 69.88, 99: 68.81, 98: 67.70, 97: 67.00, 96: 66.44, 95: 65.87,
        94: 65.38, 93: 64.97, 92: 64.38, 91: 64.03, 90: 63.68, 89: 63.38,
        88: 63.08, 87: 62.77, 86: 62.45, 85: 62.13, 84: 61.80, 83: 61.44,
        82: 61.10, 81: 60.77, 80: 60.44, 79: 60.09, 78: 59.73, 77: 59.37,
        76: 59.05, 75: 58.74, 74: 58.42, 73: 57.98, 72: 57.51, 71: 57.16,
        70: 56.82, 69: 56.48, 68: 56.11, 67: 55.74, 66: 55.38, 65: 55.03,
        64: 54.66, 63: 54.32, 62: 53.97, 61: 53.62, 60: 53.24, 59: 52.90,
        58: 52.55, 57: 52.12, 56: 51.75, 55: 51.38, 54: 50.98, 53: 50.58,
        52: 50.22, 51: 49.76, 50: 49.40, 49: 49.05, 48: 48.70, 47: 48.31,
        46: 47.85, 45: 47.50, 44: 47.14, 43: 46.79, 42: 46.42, 41: 46.08,
        40: 45.77, 39: 45.48, 38: 45.16, 37: 44.85, 36: 44.56, 35: 44.26,
        34: 43.98, 33: 43.69, 32: 43.37, 31: 43.08, 30: 42.77, 29: 42.48,
        28: 42.22, 27: 41.93, 26: 41.63, 25: 41.33, 24: 41.04, 23: 40.75,
        22: 40.47, 21: 40.17, 20: 39.89, 19: 39.64, 18: 39.39, 17: 39.13,
        16: 38.84, 15: 38.56, 14: 38.31, 13: 38.06, 12: 37.79, 11: 37.51,
        10: 37.12, 9: 36.82, 8: 36.45, 7: 36.10, 6: 35.70, 5: 35.25,
        4: 34.83, 3: 34.37, 2: 33.77, 1: 32.77, 0: 31.00
    }
};

// Helper function to get the converted score
const getConvertedScore = (percentile, subject) => {
    const track = naturalScienceSubjects.includes(subject) ? '자연' : '인문';
    return conversionTable[track][percentile] || 0;
  };
  

// 영어 환산 점수 표
const getEnglishScore = (grade) => {
    const englishScores = {
        1: 100, 2: 95, 3: 90, 4: 80, 5: 70,
        6: 60, 7: 40, 8: 20, 9: 10
    };
    return englishScores[grade] || 0;
};

// 고려대학교(세종) 점수 계산 함수
export const 고려대학교세종 = async (userId, selection) => {
    const supabase = createClient();

    // 사용자 시험 데이터 불러오기
    const { data, error } = await supabase
        .from('exam_results')
        .select('standard_score_korean, standard_score_math, percentile_science1, percentile_science2, grade_english, science1, science2, math')
        .eq('user_id', userId)
        .single();

    if (error || !data) {
        return '불가'; // 데이터가 없거나 에러일 경우 처리
    }

    const {
        standard_score_korean,
        standard_score_math,
        percentile_science1,
        percentile_science2,
        grade_english,
        science1,
        science2,
        math
    } = data;

    // 영어 점수 계산
    const englishScore = getEnglishScore(grade_english);

        // 탐구 과목 변환 점수 계산
        const convertedScienceScore1 = getConvertedScore(percentile_science1, science1);
        const convertedScienceScore2 = getConvertedScore(percentile_science2, science2);
        const isBothNaturalScience = naturalScienceSubjects.includes(science1) && naturalScienceSubjects.includes(science2);


    // 모집단위 확인
    const isBigDataScience = selection.모집단위 === '빅데이터사이언스학부';

    // 수학 조건 확인
    if (selection.계열 === '자연' && (math !== '미적분' && math !== '기하')) {
        return '불가 : 수학 미적기하 필수 '; // 수학이 '미적분' 또는 '기하'가 아니면 불가
    }

    if (selection.계열 === '자연' && !isBothNaturalScience) {
        return '불가 : 과학탐구 필수'; // 탐구 과목이 자연탐구가 아니면 불가
    }

    // 점수 계산
    let totalScore = 0;
    let maxScore = 0; // maxScore 초기 선언 추가

    if (selection.계열 === '인문') {
    
        totalScore = (standard_score_korean * 0.35 + standard_score_math * 0.2 + englishScore * 0.2 + (convertedScienceScore1+convertedScienceScore2) * 0.25);
        maxScore = (138 * 0.35 + 144 * 0.2 + 100 * 0.2 + 68.83 * 2 * 0.25);
    } else if (selection.계열 === '상경') {
        totalScore = (standard_score_korean * 0.3 + standard_score_math * 0.3 + englishScore * 0.2 + (convertedScienceScore1+convertedScienceScore2) * 0.2);
        maxScore = (138 * 0.3 + 144 * 0.3 + 100 * 0.2 + 68.83 * 2 * 0.2);
    } else if (selection.계열 === '자연' || isBigDataScience) {
        totalScore = (standard_score_korean * 0.2 + standard_score_math * 0.35 + englishScore * 0.2 + (convertedScienceScore1+convertedScienceScore2) * 0.25);
        maxScore = (138 * 0.2 + 144 * 0.35 + 100 * 0.2 + 68.83 * 2 * 0.25);
    } else if (selection.계열 === '데이터') {
        totalScore = (standard_score_korean * 0.2 + standard_score_math * 0.35 + englishScore * 0.2 + (convertedScienceScore1+convertedScienceScore2) * 0.25);
        maxScore = (138 * 0.2 + 144 * 0.35 + 100 * 0.2 + 68.83 * 2 * 0.25);
    } else {
        return '불가'; // 잘못된 계열 값일 경우
    }

    const finalScore = (totalScore / maxScore) * 1000;
    return finalScore.toFixed(2);
};
