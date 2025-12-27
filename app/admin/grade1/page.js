'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useSearchParams, useRouter } from 'next/navigation';

const supabase = createClient();

const Grade1Content = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const studentId = searchParams.get('studentId');

  const [students, setStudents] = useState([]);
  const [data, setData] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. 관리 대상 학생 리스트 가져오기
  useEffect(() => {
    const fetchStudents = async () => {
      if (!studentId) {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        const { data: studentList, error } = await supabase
          .from('admin_managed_students')
          .select('id, student_name, selection_type')
          .eq('manager_id', user.id)
          .order('created_at', { ascending: false });

        if (!error) setStudents(studentList || []);
        setLoading(false);
      }
    };

    fetchStudents();
  }, [studentId]);

  // 2. 선택된 학생의 상세 데이터 가져오기 (admin_managed_students 테이블 활용)
  useEffect(() => {
    if (studentId) {
      const fetchDetail = async () => {
        setLoading(true);
        
        // [중요] 406 에러 방지: 존재하지 않는 exam_results 대신 admin_managed_students 사용
        const { data: studentData, error } = await supabase
          .from('admin_managed_students')
          .select('*')
          .eq('id', studentId)
          .maybeSingle();

        if (studentData) {
          setData({
            korean: studentData.korean,
            math: studentData.math,
            science1: studentData.science1,
            science2: studentData.science2,
            foreign_language: studentData.foreign_language,
            standard_score_korean: studentData.standard_score_korean,
            standard_score_math: studentData.standard_score_math,
            standard_score_science1: studentData.standard_score_science1,
            standard_score_science2: studentData.standard_score_science2,
            percentile_korean: studentData.percentile_korean,
            percentile_math: studentData.percentile_math,
            percentile_science1: studentData.percentile_science1,
            percentile_science2: studentData.percentile_science2,
            grade_korean: studentData.grade_korean,
            grade_math: studentData.grade_math,
            grade_english: studentData.grade_english,
            grade_history: studentData.grade_history,
            grade_science1: studentData.grade_science1,
            grade_science2: studentData.grade_science2,
            grade_foreign_language: studentData.grade_foreign_language,
          });
          
          // [수정] profile 객체에 display_name 키를 생성하여 에러 방지
          setProfile({ display_name: studentData.student_name });
        } else {
          setData(null);
          setProfile(null);
        }
        
        setLoading(false);
      };
      fetchDetail();
    }
  }, [studentId]);

  // 로딩 화면 처리
  if (loading) return <div className="p-20 text-center font-bold text-gray-500 animate-pulse">데이터를 처리 중입니다...</div>;

  // --- [1] 학생 목록 리스트 화면 ---
  if (!studentId) {
    return (
      <div className="max-w-4xl mx-auto p-10 h-screen flex flex-col">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 shrink-0">학생 성적표 관리</h1>
        <div className="bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden flex flex-col">
          <div className="overflow-y-auto max-h-[70vh]">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">이름</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">작업</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{student.student_name}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => router.push(`/admin/dashboard1?studentId=${student.id}`)}
                          className="bg-orange-500 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-orange-600 transition-all"
                        >
                          대학 합격률 확인
                        </button>
                        <button 
                          onClick={() => router.push(`/admin/grade1?studentId=${student.id}`)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition-all"
                        >
                          성적표 열람
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // --- [2] 성적표 상세 화면 예외 처리 ---
  if (!data && profile) {
    return (
      <div className="p-20 text-center flex flex-col items-center">
        <p className="text-xl font-bold text-gray-600 mb-4">{profile?.display_name}님의 등록된 성적 데이터가 없습니다.</p>
        <button 
          onClick={() => router.push(`/admin/add-student?studentId=${studentId}`)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold"
        >
          성적 입력하러 가기
        </button>
        <button onClick={() => router.push('/admin/grade1')} className="mt-4 text-gray-400 underline">목록으로 돌아가기</button>
      </div>
    );
  }

  // 최종 렌더링 (Optional Chaining ?. 적용)
  return (
    <div className="flex flex-col items-center pb-20">
      <div className="w-full max-w-4xl flex justify-between items-center p-10">
        <button onClick={() => router.push('/admin/grade1')} className="text-gray-400 font-bold hover:text-black">
          ← 목록으로
        </button>
        <h1 className="text-3xl font-bold">{profile?.display_name}님의 성적표</h1>
        <button 
          onClick={() => router.push(`/admin/dashboard1?studentId=${studentId}`)}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg font-bold shadow-md hover:bg-orange-600"
        >
          합격률 확인하러 가기
        </button>
      </div>

      <div className="w-full max-w-4xl p-8 bg-white shadow-md rounded-lg border border-gray-100">
        <h1 className="text-center text-2xl font-bold mb-8">2025학년도 대학수학능력시험 성적표</h1>
        <table className="mt-2 text-sm w-full border-collapse border text-gray-600 border-gray-300">
          <thead className="uppercase leading-normal">
            <tr className="text-center font-bold">
              <td className="p-1 px-3 border" style={{ width: '13%', height: '50px' }}>
                <div className="flex justify-between"><p>영</p> <p>역</p></div>
              </td>
              <td className="p-1 border relative whitespace-nowrap" style={{ width: '13%', height: '50px' }}>한국사</td>
              <td className="p-1 border relative whitespace-nowrap" style={{ width: '11%', height: '50px' }}>국어</td>
              <td className="p-1 border relative whitespace-nowrap" style={{ width: '11%', height: '50px' }}>수학</td>
              <td className="p-1 border relative whitespace-nowrap" style={{ width: '11%', height: '50px' }}>영어</td>
              <td className="p-1 border relative whitespace-nowrap" style={{ width: '15%', height: '50px' }} colSpan="2">탐구</td>
              <td className="p-1 border relative whitespace-nowrap" style={{ width: '11%', height: '50px' }}>제2외국어<br />/한문</td>
            </tr>
          </thead>
          <tbody>
            <tr className="text-center">
              <td className="py-2 px-3 border" style={{ width: '13%', height: '50px' }}>
                <div className="flex justify-between"><p>선</p> <p>택</p> <p>과</p> <p>목</p></div>
              </td>
              <td className="p-1 border relative whitespace-nowrap table-cross" rowSpan="3" style={{ width: '13%'}}></td>
              <td className="p-1 border relative whitespace-nowrap" style={{ width: '11%', height: '50px' }}>{data?.korean}</td>
              <td className="p-1 border relative whitespace-nowrap" style={{ width: '11%', height: '50px' }}>{data?.math}</td>
              <td className="p-1 border relative whitespace-nowrap" rowSpan="3" style={{ width: '11%'}}></td>
              <td className="p-1 border relative whitespace-nowrap" style={{ width: '15%', height: '50px' }}>{data?.science1}</td>
              <td className="p-1 border relative whitespace-nowrap" style={{ width: '15%', height: '50px' }}>{data?.science2}</td>
              <td className="p-1 border relative whitespace-nowrap" style={{ width: '11%', height: '50px' }}>{data?.foreign_language}</td>
            </tr>
            <tr className="text-center">
              <td className="py-2 px-3 border" style={{ width: '13%', height: '50px' }}>
                <div className="flex justify-between"><p>표</p> <p>준</p> <p>점</p> <p>수</p></div>
              </td>
              <td className="p-1 border relative whitespace-nowrap" style={{ width: '11%', height: '50px' }}>{data?.standard_score_korean}</td>
              <td className="p-1 border relative whitespace-nowrap" style={{ width: '11%', height: '50px' }}>{data?.standard_score_math}</td>
              <td className="p-1 border relative whitespace-nowrap" style={{ width: '15%', height: '50px' }}>{data?.standard_score_science1}</td>
              <td className="p-1 border relative whitespace-nowrap" style={{ width: '15%', height: '50px' }}>{data?.standard_score_science2}</td>
              <td className="p-1 border relative whitespace-nowrap table-cross" rowSpan="2" style={{ width: '11%', height: '100px' }}></td>
            </tr>
            <tr className="text-center">
              <td className="py-2 px-3 border" style={{ width: '13%', height: '50px' }}>
                <div className="flex justify-between"><p>백</p> <p>분</p> <p>위</p></div>
              </td>
              <td className="p-1 border relative whitespace-nowrap" style={{ width: '11%', height: '50px' }}>{data?.percentile_korean}</td>
              <td className="p-1 border relative whitespace-nowrap" style={{ width: '11%', height: '50px' }}>{data?.percentile_math}</td>
              <td className="p-1 border relative whitespace-nowrap" style={{ width: '15%', height: '50px' }}>{data?.percentile_science1}</td>
              <td className="p-1 border relative whitespace-nowrap" style={{ width: '15%', height: '50px' }}>{data?.percentile_science2}</td>
            </tr>
            <tr className="text-center font-bold">
              <td className="p-1 px-3 border" style={{ width: '13%', height: '50px' }}>
                <div className="flex justify-between"><p>등</p> <p>급</p></div>
              </td>
              <td className="p-1 border relative whitespace-nowrap" style={{ width: '13%', height: '50px' }}>{data?.grade_history}</td>
              <td className="p-1 border relative whitespace-nowrap" style={{ width: '11%', height: '50px' }}>{data?.grade_korean}</td>
              <td className="p-1 border relative whitespace-nowrap" style={{ width: '11%', height: '50px' }}>{data?.grade_math}</td>
              <td className="p-1 border relative whitespace-nowrap" style={{ width: '11%', height: '50px' }}>{data?.grade_english}</td>
              <td className="p-1 border relative whitespace-nowrap" style={{ width: '15%', height: '50px' }}>{data?.grade_science1}</td>
              <td className="p-1 border relative whitespace-nowrap" style={{ width: '15%', height: '50px' }}>{data?.grade_science2}</td>
              <td className="p-1 border relative whitespace-nowrap" style={{ width: '11%', height: '50px' }}>{data?.grade_foreign_language}</td>
            </tr>
          </tbody>
        </table>
        <p className="text-center text-xl font-medium mt-8">2025. 12. 05</p>
        <p className="text-center text-xl font-bold tracking-widest mt-2">한국교육과정평가원장</p>
      </div>

      <div className="mt-10">
        <button 
          onClick={() => router.push(`/admin/add-student?studentId=${studentId}`)}
          className="text-gray-400 font-bold hover:text-blue-600 underline underline-offset-4"
        >
          데이터 수정하기
        </button>
      </div>
    </div>
  );
};

export default function TablePage() {
  return (
    <Suspense fallback={<div className="p-20 text-center">성적표 시스템 로딩 중...</div>}>
      <Grade1Content />
    </Suspense>
  );
}