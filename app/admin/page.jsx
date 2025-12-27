"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

export default function AddStudentPage() {
    // 기본 정보
    const [name, setName] = useState("");
    const [selection_type, setSelectionType] = useState("");
    
    // 과목 선택
    const [korean, setKorean] = useState('');
    const [math, setMath] = useState('');
    const [science1, setScience1] = useState('');
    const [science2, setScience2] = useState('');
    const [foreignLanguage, setForeignLanguage] = useState('');

    // 표준점수
    const [standardScoreKorean, setStandardScoreKorean] = useState('');
    const [standardScoreMath, setStandardScoreMath] = useState('');
    const [standardScoreScience1, setStandardScoreScience1] = useState('');
    const [standardScoreScience2, setStandardScoreScience2] = useState('');

    // 백분위
    const [percentileKorean, setPercentileKorean] = useState('');
    const [percentileMath, setPercentileMath] = useState('');
    const [percentileScience1, setPercentileScience1] = useState('');
    const [percentileScience2, setPercentileScience2] = useState('');

    // 등급
    const [gradeKorean, setGradeKorean] = useState('');
    const [gradeMath, setGradeMath] = useState('');
    const [gradeEnglish, setGradeEnglish] = useState('');
    const [gradeHistory, setGradeHistory] = useState('');
    const [gradeScience1, setGradeScience1] = useState('');
    const [gradeScience2, setGradeScience2] = useState('');
    const [gradeForeignLanguage, setGradeForeignLanguage] = useState('');
    const [isTakingForeignLanguage, setIsTakingForeignLanguage] = useState(false);

    const router = useRouter();

    // 인증 체크
    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error || !user) {
                alert('관리자 로그인이 필요합니다.');
                router.push("/signin");
            }
        };
        checkAuth();
    }, [router]);

    // 등급 문자열에서 숫자만 추출 (예: "1등급" -> 1)
    const getGradeNumber = (val) => val ? parseInt(val.replace(/[^0-9]/g, "")) : null;

    const handleSubmit = async () => {
        if (!name) { alert("학생 이름을 입력해주세요."); return; }

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("로그인 세션이 만료되었습니다.");

            // 성적 데이터 페이로드 구성
            const scorePayload = {
                korean: korean,
                math: math,
                science1: science1,
                science2: science2,
                foreign_language: isTakingForeignLanguage ? foreignLanguage : null,
                
                standard_score_korean: parseInt(standardScoreKorean) || 0,
                standard_score_math: parseInt(standardScoreMath) || 0,
                standard_score_science1: parseInt(standardScoreScience1) || 0,
                standard_score_science2: parseInt(standardScoreScience2) || 0,
                
                percentile_korean: parseInt(percentileKorean) || 0,
                percentile_math: parseInt(percentileMath) || 0,
                percentile_science1: parseInt(percentileScience1) || 0,
                percentile_science2: parseInt(percentileScience2) || 0,
                
                grade_korean: getGradeNumber(gradeKorean),
                grade_math: getGradeNumber(gradeMath),
                grade_english: getGradeNumber(gradeEnglish),
                grade_history: getGradeNumber(gradeHistory),
                grade_science1: getGradeNumber(gradeScience1),
                grade_science2: getGradeNumber(gradeScience2),
                grade_foreign_language: isTakingForeignLanguage ? getGradeNumber(gradeForeignLanguage) : null,
            };

            // admin_managed_students 테이블에만 데이터 Insert
            const { data: studentData, error: insertError } = await supabase
                .from('admin_managed_students')
                .insert([{
                    student_name: name,
                    manager_id: user.id,
                    selection_type: selection_type,
                    ...scorePayload
                }])
                .select();

            if (insertError) throw insertError;

            const newStudentId = studentData[0].id;
            alert(`${name} 학생이 성공적으로 등록되었습니다.`);
            
            // 등록 완료 후 지망 대학 설정 페이지로 이동
            router.push(`/admin/students`); 
            
        } catch (error) {
            console.error('Error:', error);
            alert('오류가 발생했습니다: ' + error.message);
        }
    };

    const handleKeyDown = (e, nextId) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const nextElement = document.getElementById(nextId);
            if (nextElement) nextElement.focus();
        }
    };

    const renderSelectField = (id, label, value, setValue, options, nextId) => (
        <div className="relative z-0 mb-4 w-2/3 mx-auto">
            <select
                id={id} value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, nextId)}
                className={`block pt-4 pb-1.5 px-0 w-full text-sm ${value ? 'text-gray-900' : 'text-gray-400'} bg-transparent border-0 border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
            >
                <option value="">{label}</option>
                {options.map((option) => (
                    <option key={option} value={option} className="text-gray-900">{option}</option>
                ))}
            </select>
        </div>
    );

    const renderInputField = (id, label, value, setValue, nextId) => (
        <div className="relative z-0 mb-4 w-2/3 mx-auto">
            <input
                type="number" id={id} value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, nextId)}
                className="block pt-4 pb-1.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
            />
            <label htmlFor={id} className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                {label}
            </label>
        </div>
    );

    const gradesOptions = [1,2,3,4,5,6,7,8,9].map(n => `${n}등급`);
    const subjects = ['물리학Ⅰ', '화학Ⅰ', '생명과학Ⅰ', '지구과학Ⅰ', '물리학Ⅱ', '화학Ⅱ', '생명과학Ⅱ','지구과학Ⅱ', '생활과윤리', '윤리와사상', '한국지리', '세계지리', '동아시아사', '세계사', '경제', '정치와법', '사회문화'];

    return (
        <div className="p-4 flex flex-col items-center bg-gray-50 min-h-screen pb-20">
            <h1 className="font-bold text-4xl text-black mt-10 mb-10">신규 학생 성적 등록</h1>

            <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-10 border border-gray-100">
                <div className="mb-12 text-center">
                    <p className="text-2xl font-bold mb-6">학생 기본 정보</p>
                    <div className="flex flex-col items-center gap-4">
                        <input type="text" placeholder="학생 이름" value={name} onChange={(e) => setName(e.target.value)} className="w-2/3 p-3 border-2 rounded-lg focus:border-blue-600 outline-none" id="name" />
                        <select value={selection_type} onChange={(e) => setSelectionType(e.target.value)} className="w-2/3 p-3 border-2 rounded-lg bg-white focus:border-blue-600 outline-none">
                            <option value="">전형을 선택하세요</option>
                            <option value="기회균형전형">기회균형전형</option>
                            <option value="농어촌전형">농어촌전형</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="p-6 bg-blue-50 rounded-xl">
                        <p className="text-xl font-bold mb-6 text-center text-blue-800">국어</p>
                        {renderSelectField('kor_s', '과목 선택', korean, setKorean, ['언어와 매체', '화법과 작문'], 'ss_kor')}
                        {renderInputField('ss_kor', '표준점수', standardScoreKorean, setStandardScoreKorean, 'p_kor')}
                        {renderInputField('p_kor', '백분위', percentileKorean, setPercentileKorean, 'g_kor')}
                        {renderSelectField('g_kor', '등급', gradeKorean, setGradeKorean, gradesOptions, 'math_s')}
                    </div>
                    <div className="p-6 bg-green-50 rounded-xl">
                        <p className="text-xl font-bold mb-6 text-center text-green-800">수학</p>
                        {renderSelectField('math_s', '과목 선택', math, setMath, ['기하', '미적분', '확률과 통계'], 'ss_math')}
                        {renderInputField('ss_math', '표준점수', standardScoreMath, setStandardScoreMath, 'p_math')}
                        {renderInputField('p_math', '백분위', percentileMath, setPercentileMath, 'g_math')}
                        {renderSelectField('g_math', '등급', gradeMath, setGradeMath, gradesOptions, 'g_eng')}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
                    <div className="p-6 bg-yellow-50 rounded-xl">
                        <p className="text-xl font-bold mb-6 text-center text-yellow-800">영어 / 한국사</p>
                        {renderSelectField('g_eng', '영어 등급', gradeEnglish, setGradeEnglish, gradesOptions, 'g_his')}
                        {renderSelectField('g_his', '한국사 등급', gradeHistory, setGradeHistory, gradesOptions, 's1_s')}
                    </div>
                    <div className="p-6 bg-purple-50 rounded-xl">
                        <p className="text-xl font-bold mb-6 text-center text-purple-800">제2외국어</p>
                        <div className="flex justify-center gap-2 mb-4">
                            <button onClick={() => setIsTakingForeignLanguage(true)} className={`px-4 py-2 rounded ${isTakingForeignLanguage ? 'bg-purple-600 text-white' : 'bg-white'}`}>응시</button>
                            <button onClick={() => setIsTakingForeignLanguage(false)} className={`px-4 py-2 rounded ${!isTakingForeignLanguage ? 'bg-gray-400 text-white' : 'bg-white'}`}>미응시</button>
                        </div>
                        {isTakingForeignLanguage && (
                            <>
                                {renderSelectField('fl_s', '과목 선택', foreignLanguage, setForeignLanguage, ['독일어', '프랑스어', '스페인어', '중국어', '일본어', '러시아어', '아랍어', '베트남어', '한문'], 'g_fl')}
                                {renderSelectField('g_fl', '등급 선택', gradeForeignLanguage, setGradeForeignLanguage, gradesOptions, 's1_s')}
                            </>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
                    <div className="p-6 bg-orange-50 rounded-xl">
                        <p className="text-xl font-bold mb-6 text-center text-orange-800">탐구 1</p>
                        {renderSelectField('s1_s', '과목 선택', science1, setScience1, subjects, 'ss_s1')}
                        {renderInputField('ss_s1', '표준점수', standardScoreScience1, setStandardScoreScience1, 'p_s1')}
                        {renderInputField('p_s1', '백분위', percentileScience1, setPercentileScience1, 'g_s1')}
                        {renderSelectField('g_s1', '등급', gradeScience1, setGradeScience1, gradesOptions, 's2_s')}
                    </div>
                    <div className="p-6 bg-orange-50 rounded-xl">
                        <p className="text-xl font-bold mb-6 text-center text-orange-800">탐구 2</p>
                        {renderSelectField('s2_s', '과목 선택', science2, setScience2, subjects, 'ss_s2')}
                        {renderInputField('ss_s2', '표준점수', standardScoreScience2, setStandardScoreScience2, 'p_s2')}
                        {renderInputField('p_s2', '백분위', percentileScience2, setPercentileScience2, 'g_s2')}
                        {renderSelectField('g_s2', '등급', gradeScience2, setGradeScience2, gradesOptions, 'submit')}
                    </div>
                </div>

                <div className="text-center mt-16">
                    <button onClick={handleSubmit} id="submit" className="bg-blue-600 text-white px-20 py-5 rounded-2xl font-black text-2xl hover:bg-blue-700 transition-all shadow-2xl active:scale-95">
                        학생 등록 및 지망 설정 이동
                    </button>
                </div>
            </div>
        </div>
    );
}