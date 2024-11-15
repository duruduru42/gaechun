import { createClient } from "@/utils/supabase/client";

const conversionTable = {
    자연: {
        100: 68.85, 99: 68.80, 98: 67.46, 97: 66.62, 96: 66.10, 95: 65.43,
        94: 64.85, 93: 64.34, 92: 63.94, 91: 63.49, 90: 63.15, 89: 62.83,
        88: 62.52, 87: 62.22, 86: 61.92, 85: 61.52, 84: 61.11, 83: 60.68,
        82: 60.28, 81: 59.99, 80: 59.69, 79: 59.38, 78: 59.08, 77: 58.79,
        76: 58.49, 75: 58.19, 74: 57.81, 73: 57.43, 72: 57.16, 71: 56.89,
        70: 56.62, 69: 56.32, 68: 56.00, 67: 55.67, 66: 55.33, 65: 55.00,
        64: 54.67, 63: 54.37, 62: 54.11, 61: 53.85, 60: 53.59, 59: 53.34,
        58: 53.09, 57: 52.84, 56: 52.60, 55: 52.26, 54: 51.90, 53: 51.60,
        52: 51.23, 51: 50.85, 50: 50.46, 49: 50.07, 48: 49.77, 47: 49.42,
        46: 49.08, 45: 48.75, 44: 48.40, 43: 48.07, 42: 47.75, 41: 47.37,
        40: 46.94, 39: 46.57, 38: 46.21, 37: 45.84, 36: 45.41, 35: 45.01,
        34: 44.67, 33: 44.33, 32: 44.02, 31: 43.70, 30: 43.38, 29: 43.11,
        28: 42.77, 27: 42.40, 26: 42.08, 25: 41.75, 24: 41.42, 23: 41.09,
        22: 40.70, 21: 40.33, 20: 39.99, 19: 39.64, 18: 39.31, 17: 38.98,
        16: 38.56, 15: 38.14, 14: 37.71, 13: 37.29, 12: 36.93, 11: 36.57,
        10: 36.23, 9: 35.89, 8: 35.55, 7: 35.16, 6: 34.72, 5: 33.99,
        4: 33.15, 3: 32.49, 2: 31.81, 1: 30.88, 0: 28.58
    },
    인문: {
        100: 68.03, 99: 67.73, 98: 66.74, 97: 66.12, 96: 65.65, 95: 65.13,
        94: 64.68, 93: 64.29, 92: 63.92, 91: 63.56, 90: 63.21, 89: 62.89,
        88: 62.58, 87: 62.28, 86: 62.00, 85: 61.67, 84: 61.32, 83: 60.97,
        82: 60.65, 81: 60.39, 80: 60.12, 79: 59.83, 78: 59.53, 77: 59.24,
        76: 58.96, 75: 58.67, 74: 58.34, 73: 58.00, 72: 57.71, 71: 57.43,
        70: 57.13, 69: 56.82, 68: 56.46, 67: 56.11, 66: 55.77, 65: 55.44,
        64: 55.11, 63: 54.77, 62: 54.47, 61: 54.15, 60: 53.83, 59: 53.49,
        58: 53.19, 57: 52.88, 56: 52.56, 55: 52.15, 54: 51.73, 53: 51.36,
        52: 50.96, 51: 50.57, 50: 50.14, 49: 49.73, 48: 49.35, 47: 48.96,
        46: 48.62, 45: 48.27, 44: 47.92, 43: 47.58, 42: 47.23, 41: 46.86,
        40: 46.48, 39: 46.09, 38: 45.71, 37: 45.36, 36: 44.98, 35: 44.62,
        34: 44.28, 33: 43.95, 32: 43.64, 31: 43.33, 30: 43.03, 29: 42.76,
        28: 42.43, 27: 42.11, 26: 41.81, 25: 41.49, 24: 41.17, 23: 40.87,
        22: 40.52, 21: 40.19, 20: 39.87, 19: 39.55, 18: 39.25, 17: 38.95,
        16: 38.60, 15: 38.24, 14: 37.88, 13: 37.52, 12: 37.19, 11: 36.86,
        10: 36.53, 9: 36.16, 8: 35.81, 7: 35.40, 6: 34.95, 5: 34.37,
        4: 33.70, 3: 33.10, 2: 32.46, 1: 31.55, 0: 29.51
    }
};

// 탐구 변환 점수 계산 함수
const getConvertedScore = (percentile, subject) => {
    const inquiryType = isNaturalScience(subject) ? '자연' : '인문';
    return conversionTable[inquiryType][percentile] || 0;
};

// 과목이 자연탐구 과목인지 확인하는 함수
const isNaturalScience = (subject) => {
    const naturalScienceSubjects = [
        '물리학Ⅰ', '물리학Ⅱ', '화학Ⅰ', '화학Ⅱ',
        '생명과학Ⅰ', '생명과학Ⅱ', '지구과학Ⅰ', '지구과학Ⅱ'
    ];
    return naturalScienceSubjects.includes(subject);
};

// 고려대학교(세종) 점수 계산 함수
export const 고려대학교 = async (userId, selection) => {
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
    } = data;

    // 영어 점수 계산
    const englishScore = getEnglishScore(grade_english);

    // 탐구 과목 자연탐구 여부 확인
    const isBothNaturalScience = isNaturalScience(science1) && isNaturalScience(science2);

        // 탐구 과목 변환 점수 계산
        const convertedScienceScore1 = getConvertedScore(percentile_science1, science1);
        const convertedScienceScore2 = getConvertedScore(percentile_science2, science2);
        const totalScienceConvertedScore = convertedScienceScore1 + convertedScienceScore2;

    if (selection.계열 === '자연' && !isBothNaturalScience) {
        return '불가'; // 탐구 과목이 자연탐구가 아니면 불가
    }


    if (selection.계열 === '인문') {
        score = ((Number(standard_score_korean) + Number(standard_score_math) + (Number(totalScienceConvertedScore)*0.8)) / 560 * 1000);

    } else if (selection.계열 === '자연') {
      score = ((Number(standard_score_korean) + Number(standard_score_math) + (Number(totalScienceConvertedScore))) / 640 * 1000);

    }  else {
        return '불가'; // 잘못된 계열 값일 경우
    }

    const englishPenalty = {
      1: 0, 2: 3, 3: 6, 4: 9, 5: 12,
      6: 15, 7: 18, 8: 21, 9: 24
    };
    score -= englishPenalty[grade_english] || 0;
  
    // Add points for History grade
    const historyBonus = {
      1: 10, 2: 10, 3: 10, 4: 10, 5: 9.8,
      6: 9.6, 7: 9.4, 8: 9.2, 9: 8
    };
    score += historyBonus[grade_history] || 0;
  

    return score.toFixed(2);
};