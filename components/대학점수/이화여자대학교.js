import { createClient } from "@/utils/supabase/client";

// 탐구 변환 점수 테이블
const conversionTable = {
    자연: {
        100: 70.13, 99: 69.38, 98: 68.54, 97: 67.77, 96: 66.97, 95: 66.25,
        94: 65.66, 93: 65.18, 92: 64.71, 91: 64.33, 90: 63.98, 89: 63.49,
        88: 63.12, 87: 62.69, 86: 62.33, 85: 61.97, 84: 61.60, 83: 61.23,
        82: 60.90, 81: 60.48, 80: 60.14, 79: 59.77, 78: 59.39, 77: 58.98,
        76: 58.63, 75: 58.22, 74: 57.90, 73: 57.54, 72: 57.25, 71: 56.96,
        70: 56.66, 69: 56.32, 68: 55.91, 67: 55.53, 66: 55.13, 65: 54.75,
        64: 54.38, 63: 53.97, 62: 53.54, 61: 53.10, 60: 52.76, 59: 52.43,
        58: 52.11, 57: 51.77, 56: 51.45, 55: 51.02, 54: 50.61, 53: 50.23,
        52: 49.92, 51: 49.61, 50: 49.30, 49: 48.96, 48: 48.61, 47: 48.27,
        46: 47.89, 45: 47.52, 44: 47.13, 43: 46.82, 42: 46.51, 41: 46.19,
        40: 45.88, 39: 45.60, 38: 45.33, 37: 45.04, 36: 44.71, 35: 44.39,
        34: 44.09, 33: 43.79, 32: 43.52, 31: 43.24, 30: 42.97, 29: 42.65,
        28: 42.33, 27: 42.05, 26: 41.78, 25: 41.50, 24: 41.20, 23: 40.92,
        22: 40.68, 21: 40.44, 20: 40.20, 19: 39.96, 18: 39.69, 17: 39.41,
        16: 39.13, 15: 38.83, 14: 38.55, 13: 38.25, 12: 37.96, 11: 37.67,
        10: 37.37, 9: 37.01, 8: 36.65, 7: 36.23, 6: 35.77, 5: 35.40,
        4: 35.04, 3: 34.48, 2: 33.75, 1: 32.38, 0: 30.38
    },
    인문: {
        100: 69.89, 99: 68.81, 98: 67.70, 97: 67.00, 96: 66.44, 95: 65.87,
        94: 65.39, 93: 64.97, 92: 64.39, 91: 64.04, 90: 63.68, 89: 63.39,
        88: 63.08, 87: 62.77, 86: 62.46, 85: 62.14, 84: 61.80, 83: 61.44,
        82: 61.10, 81: 60.78, 80: 60.44, 79: 60.10, 78: 59.73, 77: 59.38,
        76: 59.05, 75: 58.74, 74: 58.43, 73: 57.98, 72: 57.52, 71: 57.17,
        70: 56.82, 69: 56.48, 68: 56.11, 67: 55.74, 66: 55.39, 65: 55.04,
        64: 54.67, 63: 54.32, 62: 53.97, 61: 53.63, 60: 53.25, 59: 52.91,
        58: 52.56, 57: 52.13, 56: 51.76, 55: 51.39, 54: 50.98, 53: 50.58,
        52: 50.22, 51: 49.77, 50: 49.41, 49: 49.06, 48: 48.70, 47: 48.31,
        46: 47.85, 45: 47.50, 44: 47.15, 43: 46.80, 42: 46.43, 41: 46.08,
        40: 45.78, 39: 45.49, 38: 45.17, 37: 44.86, 36: 44.56, 35: 44.27,
        34: 43.98, 33: 43.69, 32: 43.38, 31: 43.08, 30: 42.77, 29: 42.49,
        28: 42.22, 27: 41.94, 26: 41.63, 25: 41.33, 24: 41.04, 23: 40.75,
        22: 40.47, 21: 40.17, 20: 39.90, 19: 39.65, 18: 39.40, 17: 39.13,
        16: 38.84, 15: 38.57, 14: 38.31, 13: 38.06, 12: 37.79, 11: 37.51,
        10: 37.13, 9: 36.82, 8: 36.46, 7: 36.10, 6: 35.71, 5: 35.26,
        4: 34.83, 3: 34.37, 2: 33.78, 1: 32.78, 0: 31.00
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
export const 이화여자대학교 = async (userId, selection) => {
    const supabase = createClient();

    const { data: profile, error: profileError } = await supabase
    .from('profile')
    .select('gender')
    .eq('id', userId)
    .single();

  if (profileError || !profile) {
    return '불가: 사용자 정보 없음'; // 프로필 데이터가 없을 경우 처리
  }

  // 성별이 '남'이면 불가 처리
  if (profile.gender === '남학생') {
    return '불가: 남성 지원 불가';
  }


    // 사용자 시험 데이터 불러오기
    const { data, error } = await supabase
        .from('exam_results')
        .select('standard_score_korean, standard_score_math, percentile_science1, percentile_science2, grade_english, grade_history, science1, science2')
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
            (standard_score_korean / 139) * 0.3 +
            (standard_score_math / 140) * 0.3 +
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
        (standard_score_korean / 139) * 0.25 +
        (standard_score_math / 140) * 0.3 +
        englishScore * 0.2 +
        (scienceScore1+scienceScore2) * 0.125 
    ) * 1000 + historyBonus;    

    } else if (selection.계열 === '혼합') {
        // "인문" 점수 계산
        const humanitiesScore = (
            (standard_score_korean / 139) * 0.3 +
            (standard_score_math / 140) * 0.3 +
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
            (standard_score_korean / 139) * 0.25 +
            (standard_score_math / 140) * 0.3 +
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
