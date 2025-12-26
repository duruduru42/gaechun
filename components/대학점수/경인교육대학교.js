import { createClient } from "@/utils/supabase/client";

// 영어 및 한국사 점수 표 (기존과 동일)
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

// 핵심 수정: 세 번째 인자 isAdmin 추가 (기본값 false)
export const 경인교육대학교 = async (userId, selection, isAdmin = false) => {
    const supabase = createClient();

    // isAdmin 여부에 따라 테이블과 ID 컬럼 결정
    const tableName = isAdmin ? 'admin_managed_students' : 'exam_results';
    const idColumn = isAdmin ? 'id' : 'user_id';

    // Fetch user exam data
    const { data, error } = await supabase
        .from(tableName)
        .select('percentile_korean, percentile_math, percentile_science1, percentile_science2, grade_english, grade_history, math')
        .eq(idColumn, userId)
        .single();

    if (error || !data) {
        return '불가'; // 데이터가 없는 경우 에러 처리
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

    // 영어 및 한국사 점수 계산
    const englishScore = getEnglishScore(grade_english);
    const historyPenalty = getHistoryPenalty(grade_history);

    // 탐구 영역 평균 계산
    const avgExplorationScore = (Number(percentile_science1) + Number(percentile_science2)) / 2;

    // 수학 '미적분' 또는 '기하' 선택 시 3% 가산점 적용
    const mathScore = (math === '미적분' || math === '기하') ? percentile_math * 1.03 : percentile_math;

    // 최종 환산 점수 계산
    const totalScore = (Number(percentile_korean) + Number(mathScore) + Number(englishScore) + avgExplorationScore) * 2.5 - historyPenalty;

    return totalScore.toFixed(2);
};