import { createClient } from "@/utils/supabase/client";

// 탐구 변환 점수 테이블
const conversionTable = {
    자연: {
        100: 69.88, 99: 69.13, 98: 68.06, 97: 67.40, 96: 66.85, 95: 66.21,
        94: 65.78, 93: 65.35, 92: 64.87, 91: 64.47, 90: 64.11, 89: 63.72,
        88: 63.39, 87: 62.97, 86: 62.64, 85: 62.30, 84: 61.96, 83: 61.60,
        82: 61.24, 81: 60.90, 80: 60.51, 79: 60.14, 78: 59.78, 77: 59.43,
        76: 59.11, 75: 58.75, 74: 58.32, 73: 57.96, 72: 57.57, 71: 57.21,
        70: 56.85, 69: 56.50, 68: 56.15, 67: 55.73, 66: 55.40, 65: 55.02,
        64: 54.62, 63: 54.24, 62: 53.85, 61: 53.45, 60: 53.00, 59: 52.54,
        58: 52.13, 57: 51.73, 56: 51.39, 55: 51.04, 54: 50.70, 53: 50.37,
        52: 49.96, 51: 49.53, 50: 49.07, 49: 48.67, 48: 48.29, 47: 47.96,
        46: 47.63, 45: 47.33, 44: 47.00, 43: 46.65, 42: 46.33, 41: 45.98,
        40: 45.61, 39: 45.30, 38: 44.99, 37: 44.66, 36: 44.34, 35: 44.06,
        34: 43.77, 33: 43.46, 32: 43.19, 31: 42.94, 30: 42.69, 29: 42.43,
        28: 42.19, 27: 41.92, 26: 41.64, 25: 41.38, 24: 41.13, 23: 40.85,
        22: 40.56, 21: 40.31, 20: 40.03, 19: 39.75, 18: 39.50, 17: 39.24,
        16: 38.98, 15: 38.71, 14: 38.45, 13: 38.22, 12: 37.99, 11: 37.72,
        10: 37.42, 9: 37.16, 8: 36.81, 7: 36.47, 6: 36.11, 5: 35.69,
        4: 35.21, 3: 34.63, 2: 33.88, 1: 33.00, 0: 31.63
    },
    인문: {
        100: 70.33, 99: 69.22, 98: 68.11, 97: 67.33, 96: 66.69, 95: 66.11,
        94: 65.56, 93: 65.04, 92: 64.62, 91: 64.24, 90: 63.87, 89: 63.47,
        88: 63.07, 87: 62.64, 86: 62.26, 85: 61.89, 84: 61.52, 83: 61.20,
        82: 60.89, 81: 60.57, 80: 60.23, 79: 59.89, 78: 59.54, 77: 59.18,
        76: 58.85, 75: 58.50, 74: 58.13, 73: 57.77, 72: 57.43, 71: 57.11,
        70: 56.77, 69: 56.43, 68: 56.09, 67: 55.77, 66: 55.46, 65: 55.09,
        64: 54.73, 63: 54.37, 62: 54.01, 61: 53.64, 60: 53.26, 59: 52.87,
        58: 52.47, 57: 52.11, 56: 51.74, 55: 51.36, 54: 50.90, 53: 50.51,
        52: 50.17, 51: 49.81, 50: 49.44, 49: 49.07, 48: 48.69, 47: 48.32,
        46: 47.93, 45: 47.60, 44: 47.29, 43: 46.85, 42: 46.44, 41: 46.08,
        40: 45.73, 39: 45.39, 38: 44.98, 37: 44.65, 36: 44.35, 35: 44.08,
        34: 43.78, 33: 43.48, 32: 43.23, 31: 42.98, 30: 42.73, 29: 42.50,
        28: 42.29, 27: 42.07, 26: 41.79, 25: 41.48, 24: 41.16, 23: 40.88,
        22: 40.60, 21: 40.31, 20: 40.06, 19: 39.80, 18: 39.54, 17: 39.24,
        16: 38.95, 15: 38.66, 14: 38.37, 13: 38.07, 12: 37.77, 11: 37.52,
        10: 37.24, 9: 36.95, 8: 36.65, 7: 36.19, 6: 35.73, 5: 35.28,
        4: 34.80, 3: 34.26, 2: 33.56, 1: 32.67, 0: 30.67
    }
  };
  

// 영어 환산 점수 표 (100점 기준)
const getEnglishScore = (grade) => {
    const englishScores = {
        1: 100, 2: 98, 3: 94, 4: 88, 5: 84,
        6: 80, 7: 76, 8: 72, 9: 68
    };
    return englishScores[grade] || 0;
};

// 한국사 가산점 표
const getHistoryBonus = (grade, track) => {
    const historyBonus = track === '자연' ? {
        1: 10.0, 2: 10.0, 3: 10.0, 4: 10.0, 5: 9.8,
        6: 9.6, 7: 9.4, 8: 9.2, 9: 8.5
    } : {
        1: 10.0, 2: 10.0, 3: 10.0, 4: 9.8, 5: 9.6,
        6: 9.4, 7: 9.2, 8: 9.0, 9: 8.5
    };
    return historyBonus[grade] || 0;
};

// 과목이 자연탐구 과목인지 확인하는 함수
const getConvertedScore = (percentile, subject) => {
    const track = naturalScienceSubjects.includes(subject) ? '자연' : '인문';
    const percentileScore = conversionTable[track][percentile]; // 백분위에 해당하는 점수 가져오기
    const maxScore = conversionTable[track][100]; // 백분위 100 점수 가져오기
    return maxScore && percentileScore ? percentileScore / maxScore : 0; // 변환 점수 계산
  };

  const naturalScienceSubjects = [
    '물리학Ⅰ', '물리학Ⅱ', '화학Ⅰ', '화학Ⅱ',
    '지구과학Ⅰ', '지구과학Ⅱ', '생명과학Ⅰ', '생명과학Ⅱ'
  ];

// 이화여자대학교 점수 계산 함수
// 핵심 수정: 세 번째 인자 isAdmin 추가 (기본값 false)
export const 이화여자대학교 = async (userId, selection, isAdmin = false) => {
    const supabase = createClient();

    // isAdmin 여부에 따라 테이블과 ID 컬럼 결정
    const tableName = isAdmin ? 'admin_managed_students' : 'exam_results';
    const idColumn = isAdmin ? 'id' : 'user_id';

    // 사용자 시험 데이터 불러오기
    const { data, error } = await supabase
        .from(tableName)
        .select('standard_score_korean, standard_score_math, percentile_science1, percentile_science2, grade_english, grade_history, science1, science2')
        .eq(idColumn, userId)
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
        grade_history,
        science1,
        science2
    } = data;

    // 영어 점수 및 한국사 가산점 계산
    const englishScore = getEnglishScore(grade_english) / 100;
    const historyBonus = getHistoryBonus(grade_history, selection.계열);

    // 탐구 과목 변환 점수 계산
    const convertedScienceScore1 = getConvertedScore(percentile_science1, science1);
    const convertedScienceScore2 = getConvertedScore(percentile_science2, science2);

    let totalScore = 0;
 
    // 최종 점수 계산
    if (selection.계열 === '인문') {
        totalScore = (
            (standard_score_korean / 147) * 0.3 +
            (standard_score_math / 139) * 0.3 +
            englishScore * 0.2 +
            (convertedScienceScore1+convertedScienceScore2) * 0.1
        ) * 1000 + historyBonus;    
    } 
        else if (selection.계열 === '자연') {
            const scienceScore1 = naturalScienceSubjects.includes(science1)
            ? convertedScienceScore1 * 1.06
            : convertedScienceScore1;
        
            const scienceScore2 = naturalScienceSubjects.includes(science2)
            ? convertedScienceScore2 * 1.06
            : convertedScienceScore2;

        totalScore = (
        (standard_score_korean / 147) * 0.25 +
        (standard_score_math / 139) * 0.3 +
        englishScore * 0.2 +
        (scienceScore1+scienceScore2) * 0.125 
    ) * 1000 + historyBonus;    

    } else if (selection.계열 === '혼합') {
        // "인문" 점수 계산
        const humanitiesScore = (
            (standard_score_korean / 147) * 0.3 +
            (standard_score_math / 139) * 0.3 +
            englishScore * 0.2 +
            (convertedScienceScore1 + convertedScienceScore2) * 0.1
        ) * 1000 + historyBonus;
    
        // "자연" 점수 계산
        const scienceScore1 = naturalScienceSubjects.includes(science1)
            ? convertedScienceScore1 * 1.06
            : convertedScienceScore1;
    
        const scienceScore2 = naturalScienceSubjects.includes(science2)
            ? convertedScienceScore2 * 1.06
            : convertedScienceScore2;
    
        const scienceScore = (
            (standard_score_korean / 147) * 0.25 +
            (standard_score_math / 139) * 0.3 +
            englishScore * 0.2 +
            (scienceScore1 + scienceScore2) * 0.125
        ) * 1000 + historyBonus;
    
        // "혼합" 계열은 "인문"과 "자연" 점수 중 더 높은 점수 선택
        totalScore = Math.max(humanitiesScore, scienceScore); }
        else {
        return '불가'; // 잘못된 계열
      }
      return totalScore.toFixed(2);

};
