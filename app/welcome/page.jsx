"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client'; // 실제 경로로 변경

const supabase = createClient();

export default function InputPage() {
    const [korean, setKorean] = useState('');
    const [math, setMath] = useState('');
    const [science1, setScience1] = useState('');
    const [science2, setScience2] = useState('');
    const [foreignLanguage, setForeignLanguage] = useState('');

    const [standardScoreKorean, setStandardScoreKorean] = useState('');
    const [standardScoreMath, setStandardScoreMath] = useState('');
    const [standardScoreScience1, setStandardScoreScience1] = useState('');
    const [standardScoreScience2, setStandardScoreScience2] = useState('');

    const [percentileKorean, setPercentileKorean] = useState('');
    const [percentileMath, setPercentileMath] = useState('');
    const [percentileScience1, setPercentileScience1] = useState('');
    const [percentileScience2, setPercentileScience2] = useState('');

    const [gradeKorean, setGradeKorean] = useState('');
    const [gradeMath, setGradeMath] = useState('');
    const [gradeEnglish, setGradeEnglish] = useState('');
    const [gradeHistory, setGradeHistory] = useState('');
    const [gradeScience1, setGradeScience1] = useState('');
    const [gradeScience2, setGradeScience2] = useState('');
    const [gradeForeignLanguage, setGradeForeignLanguage] = useState('');
    const [isTakingForeignLanguage, setIsTakingForeignLanguage] = useState(false);
    const [selection_type, setSelectionType] = useState("");
    const [name, setName] = useState("");

    const router = useRouter(); // Ensure router is defined

     useEffect(() => {
        const checkExamResult = async () => {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError) {
                console.error('Error fetching user:', userError);
                alert('User not logged in.');
                return;
            }

            // 성적이 있는지 확인
            const { data: examData, error: examError } = await supabase
                .from('exam_results')
                .select('*')
                .eq('user_id', user.id)
                .single();

            // 성적이 있으면 grade1 페이지로 리다이렉트
            if (examData && !examError) {
                router.push('/welcome/grade1');
            }
        };

        checkExamResult();
    }, [router]);

    const handleSubmit = async () => {
        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError) {
                console.error('Error fetching user:', userError);
                alert('User not logged in.');
                return;
            }

            // 기존 exam_results 레코드 확인
            const { data: existingExam, error: checkError } = await supabase
                .from('exam_results')
                .select('user_id')
                .eq('user_id', user.id)
                .single();

            const examData = {
                user_id: user.id,
                korean,
                math,
                science1,
                science2,
                foreign_language: foreignLanguage,
                standard_score_korean: standardScoreKorean,
                standard_score_math: standardScoreMath,
                standard_score_science1: standardScoreScience1,
                standard_score_science2: standardScoreScience2,
                percentile_korean: percentileKorean,
                percentile_math: percentileMath,
                percentile_science1: percentileScience1,
                percentile_science2: percentileScience2,
                grade_korean: parseInt(gradeKorean) || null,
                grade_math: parseInt(gradeMath) || null,
                grade_english: parseInt(gradeEnglish) || null,
                grade_history: parseInt(gradeHistory) || null,
                grade_science1: parseInt(gradeScience1) || null,
                grade_science2: parseInt(gradeScience2) || null,
                grade_foreign_language: parseInt(gradeForeignLanguage) || null,
                pass: 'n',
            };

            let examError;

            if (existingExam && !checkError) {
                // 기존 레코드가 있으면 update
                const { error: updateError } = await supabase
                    .from('exam_results')
                    .update(examData)
                    .eq('user_id', user.id);
                examError = updateError;
            } else {
                // 기존 레코드가 없으면 insert
                const { error: insertError } = await supabase
                    .from('exam_results')
                    .insert(examData);
                examError = insertError;
            }
                
            if (examError) {
                console.error('Error saving exam results:', examError);
                alert(`Failed to submit data: ${examError.message}`);
                return;
            }
            
            const { error: profileError } = await supabase
            .from('profile')
            .update({
                selection_type: selection_type,
                display_name: name // 여기서 selectedType은 입력된 selection_type 값
            })
            .eq('id', user.id); // profile 테이블의 id와 user.id를 매칭

        if (profileError) {
            console.error('Error updating profile selection_type:', profileError);
            alert(`Failed to update selection type: ${profileError.message}`);
            return;
        }

            alert('성적 입력 완료');
            router.push('/welcome/grade1'); // '/home' 페이지로 이동
        } catch (error) {
            console.error('Unexpected error:', error);
            alert('An unexpected error occurred');
        }
    };


    const handleKeyDown = (e, nextId) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const nextElement = document.getElementById(nextId);
            if (nextElement) {
                nextElement.focus();
            }
        }
    };

    const renderSelectField = (id, label, value, setValue, options, nextId) => (
        <div className="relative z-0 mb-4 w-2/3 mx-auto">
            <select
                id={id}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, nextId)}
                tabIndex="0"
                className={`block pt-4 pb-1.5 px-0 w-full text-sm ${
                    value ? 'text-gray-900' : 'text-gray-400'
                } bg-transparent border-0 border-b-2 border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
            >
                <option value="" className="text-gray-400">{label}</option>
                {options.map((option) => (
                    <option key={option} value={option} className="text-gray-900">{option}</option>
                ))}
            </select>
            <label
                htmlFor={id}
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
                {label}
            </label>
        </div>
    );

    const renderInputField = (id, label, value, setValue, nextId) => (
        <div className="relative z-0 mb-4 w-2/3 mx-auto">
            <input
                type="number"
                id={id}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, nextId)}
                tabIndex="0"
                className="block pt-4 pb-1.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                step="any"
                inputMode="decimal"
            />
            <label
                htmlFor={id}
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
                {label}
            </label>
        </div>
    );


    return (
        <div className="text-left box-border p-4 border-4 flex flex-col items-center justify-center">
            <h1 className="font-bold text-4xl text-black mt-20 mb-12">성적 입력</h1>

            <div className="w-full max-w-2xl bg-white shadow-md rounded-lg">
                {/* Korean */}
                <div className="mb-6 mt-10">
                    <p className="text-2xl font-semibold mb-10 text-center">이름</p>
                    <div className="flex justify-center">
                    <input
                    type="text"
                    placeholder="학생이름"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-2/3 p-3 border rounded"
                    id="name"
                    />
                    </div>
                </div>

                <div className="mb-6 mt-10">
                    <p className="text-2xl font-semibold mb-10 text-center">전형</p>
                    <div className="flex justify-center">
                    <select
                    value={selection_type}
                    onChange={(e) => setSelectionType(e.target.value)}
                    className="block pt-4 pb-1.5 px-0 w-2/3 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    id="type"
                    >
                    <option value="">전형을 선택하세요</option>
                    <option value="기회균형전형">기회균형전형</option>
                    <option value="농어촌전형">농어촌전형</option>
                    </select>
                    </div>
                </div>

                <div className="mb-6 mt-10">
                    <p className="text-2xl font-semibold mb-10 text-center">국어</p>
                    {renderSelectField('korean', '선택과목 입력', korean, setKorean, ['언어와 매체', '화법과 작문'], 'standard_score_korean')}
                    {renderInputField('standard_score_korean', '표준점수 입력', standardScoreKorean, setStandardScoreKorean, 'percentile_korean')}
                    {renderInputField('percentile_korean', '백분위 입력', percentileKorean, setPercentileKorean, 'grade_korean')}
                    {renderSelectField('grade_korean', '등급 입력', gradeKorean, setGradeKorean, [...Array(9).keys()].map(i => `${i+1}등급`), 'math')}
                </div>

                {/* Math */}
                <div className="mb-6 mt-10">
                    <p className="text-2xl font-semibold mb-10 text-center">수학</p>
                    {renderSelectField('math', '선택과목 입력', math, setMath, ['기하', '미적분', '확률과 통계'], 'standard_score_math')}
                    {renderInputField('standard_score_math', '표준점수 입력', standardScoreMath, setStandardScoreMath, 'percentile_math')}
                    {renderInputField('percentile_math', '백분위 입력', percentileMath, setPercentileMath, 'grade_math')}
                    {renderSelectField('grade_math', '등급 입력', gradeMath, setGradeMath, [...Array(9).keys()].map(i => `${i+1}등급`), 'grade_english')}
                </div>

                {/* English */}
                <div className="mb-6 mt-10">
                    <p className="text-2xl font-semibold mb-10 text-center">영어</p>
                    {renderSelectField('grade_english', '등급 입력', gradeEnglish, setGradeEnglish, [...Array(9).keys()].map(i => `${i+1}등급`), 'grade_history')}
                </div>

                {/* History */}
                <div className="mb-6 mt-10">
                    <p className="text-2xl font-semibold mb-10 text-center">한국사</p>
                    {renderSelectField('grade_history', '등급 입력', gradeHistory, setGradeHistory, [...Array(9).keys()].map(i => `${i+1}등급`), 'science1')}
                </div>

                {/* Science1 */}
                <div className="mb-6 mt-10">
                    <p className="text-2xl font-semibold mb-10 text-center">탐구 1</p>
                    {renderSelectField('science1', '선택과목 입력', science1, setScience1, [
                        '물리학Ⅰ', '화학Ⅰ', '생명과학Ⅰ', '지구과학Ⅰ',
                        '물리학Ⅱ', '화학Ⅱ', '생명과학Ⅱ', '생활과윤리',
                        '윤리와사상', '한국지리', '세계지리', '동아시아사',
                        '세계사', '경제', '정치와법', '사회문화'
                    ], 'standard_score_science1')}
                    {renderInputField('standard_score_science1', '표준점수 입력', standardScoreScience1, setStandardScoreScience1, 'percentile_science1')}
                    {renderInputField('percentile_science1', '백분위 입력', percentileScience1, setPercentileScience1, 'grade_science1')}
                    {renderSelectField('grade_science1', '등급 입력', gradeScience1, setGradeScience1, [...Array(9).keys()].map(i => `${i+1}등급`), 'science2')}
                </div>

                {/* Science2 */}
                <div className="mb-6 mt-10">
                    <p className="text-2xl font-semibold mb-10 text-center">탐구 2</p>
                    {renderSelectField('science2', '선택과목 입력', science2, setScience2, [
                        '물리학Ⅰ', '화학Ⅰ', '생명과학Ⅰ', '지구과학Ⅰ',
                        '물리학Ⅱ', '화학Ⅱ', '생명과학Ⅱ', '생활과윤리',
                        '윤리와사상', '한국지리', '세계지리', '동아시아사',
                        '세계사', '경제', '정치와법', '사회문화'
                    ], 'standard_score_science2')}
                    {renderInputField('standard_score_science2', '표준점수 입력', standardScoreScience2, setStandardScoreScience2, 'percentile_science2')}
                    {renderInputField('percentile_science2', '백분위 입력', percentileScience2, setPercentileScience2, 'grade_science2')}
                    {renderSelectField('grade_science2', '등급 입력', gradeScience2, setGradeScience2, [...Array(9).keys()].map(i => `${i+1}등급`), 'foreignLanguage')}
                </div>

                {/* Foreign Language */}
                <div className="mb-6 mt-10">
            <p className="text-2xl font-semibold mb-5 text-center">제2외국어/한문</p>
            <div className="flex justify-center mb-6">
                <button
                    className={`px-4 py-2 mr-2 rounded-lg ${isTakingForeignLanguage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => setIsTakingForeignLanguage(true)}
                >
                    응시
                </button>
                <button
                    className={`px-4 py-2 rounded-lg ${!isTakingForeignLanguage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => setIsTakingForeignLanguage(false)}
                >
                    미응시
                </button>
            </div>
            {isTakingForeignLanguage && (
                <>
                    {renderSelectField('foreignLanguage', '선택과목 입력', foreignLanguage, setForeignLanguage, [
                        '독일어', '프랑스어', '스페인어', '중국어',
                        '일본어', '러시아어', '아랍어', '베트남어', '한문'
                    ], 'standard_score_foreignLanguage')}
                    {renderSelectField('grade_foreignLanguage', '등급 입력', gradeForeignLanguage, setGradeForeignLanguage, [...Array(9).keys()].map(i => `${i+1}등급`), 'submit')}
                </>
            )}
        </div>
        <div className='justify-center flex p-10'>
                <button
                    className="rounded-lg px-10 py-3 text-lg font-bold bg-blue-600 text-white"
                    id="submit"
                    onClick={handleSubmit}
                >
                    입력 완료 
                </button>
                </div>
            </div>
        </div>
    );
}

