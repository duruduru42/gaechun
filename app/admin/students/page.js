"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from "@/utils/supabase/client";
import { useRouter } from 'next/navigation';

export default function StudentSimpleListPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [studentChoices, setStudentChoices] = useState({}); // 학생별 지망 대학 저장
  const supabase = createClient();
  const router = useRouter();

  // [추가된 로직] 특정 군의 모든 지망이 '변경'인지 체크
  const hasCriticalChange = (studentId) => {
    const choices = studentChoices[studentId];
    if (!choices) return false;

    return ['가', '나', '다'].some((group) => {
      const groupChoices = choices[group];
      if (!groupChoices) return false;

      // 해당 군에 등록된 지망들(1, 2, 3지망) 배열 추출
      const activePriorities = Object.values(groupChoices).filter(item => item !== null);
      
      // 등록된 지망이 아예 없으면 경고 대상 아님
      if (activePriorities.length === 0) return false;

      // 해당 군에 등록된 모든 지망의 상태가 '변경'인 경우에만 true
      return activePriorities.every(choice => choice.status === '변경');
    });
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("로그인이 필요합니다.");
        router.push("/signin");
        return;
      }

      const { data, error } = await supabase
        .from('admin_managed_students')
        .select(`*`)
        .eq('manager_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [router]);

  const handleDeleteStudent = async (studentId, studentName) => {
    if (!confirm(`정말로 ${studentName} 학생의 모든 데이터를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('admin_managed_students')
        .delete()
        .eq('id', studentId);

      if (error) throw error;

      alert("삭제되었습니다.");
      setStudents(prev => prev.filter(s => s.id !== studentId));
    } catch (error) {
      console.error("Delete error:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const toggleExpand = async (studentId) => {
    if (expandedId === studentId) {
      setExpandedId(null);
      return;
    }

    setExpandedId(studentId);

    if (!studentChoices[studentId]) {
      const { data, error } = await supabase
        .from('student_choices')
        .select(`
          *,
          departments (
            university_id,
            name,
            모집단위,
            sum
          )
        `)
        .eq('student_id', studentId);

      if (!error && data) {
        const organized = data.reduce((acc, curr) => {
          if (!acc[curr.group_type]) acc[curr.group_type] = {};
          
          acc[curr.group_type][curr.priority] = {
            ...curr,
            display_univ: curr.university_name || curr.departments?.name,
            display_dept: curr.department_name || curr.departments?.모집단위,
            is_integrated: curr.departments?.sum === 'y'
          };
          return acc;
        }, {});
        setStudentChoices(prev => ({ ...prev, [studentId]: organized }));
      }
    }
  };

  const renderStatusBadge = (status, isIntegrated) => {
    const statusStyles = {
      '확정': 'bg-blue-100 text-blue-700 border-blue-200',
      '보류': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      '변경': 'bg-red-100 text-red-700 border-red-200',
    };
    
    const style = statusStyles[status] || 'bg-gray-100 text-gray-600 border-gray-200';
    
    return (
      <div className="flex items-center gap-1">
        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-black ml-2 ${style}`}>
          {status || '대기'}
        </span>
        {isIntegrated && (
          <span className="text-[9px] bg-purple-100 text-purple-600 border border-purple-200 px-1.5 py-0.5 rounded-md font-black">
            통합
          </span>
        )}
      </div>
    );
  };

  const renderChoice = (studentId, group, priority) => {
    const choice = studentChoices[studentId]?.[group]?.[priority];
    
    if (!choice) return <span className="text-gray-300 text-xs italic">미선택</span>;

    return (
      <div className="text-sm">
        <div className="flex items-center mb-1 justify-between">
          <span className="font-bold text-gray-800 truncate max-w-[120px]">{choice.display_univ}</span>
          {renderStatusBadge(choice.status, choice.is_integrated)}
        </div>
        <div className="text-gray-500 text-xs font-normal">
          ({choice.display_dept})
        </div>
        <div className="text-[10px] text-blue-600 font-bold mt-1">
          {choice.converted_score?.toLocaleString()}점
        </div>
      </div>
    );
  };

  if (loading) return <div className="p-20 text-center text-gray-500 font-bold">학생 목록을 불러오는 중...</div>;

  return (
    <div className="max-w-5xl mx-auto p-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-black text-gray-800 tracking-tighter italic">ADMIN <span className="text-blue-600">STUDENTS</span></h1>
        <button
          onClick={() => router.push('/admin')}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100"
        >
          + 신규 학생 등록
        </button>
      </div>

      <div className="bg-white shadow-2xl rounded-[32px] border border-gray-100 overflow-hidden">
        {students.length === 0 ? (
          <div className="p-20 text-center text-gray-500 font-bold italic">등록된 학생이 없습니다.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">이름 (지망대학 상세)</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-center">전형 구분</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-center">등록일</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-center">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {students.map((student) => {
                // [추가] 각 학생의 경고 여부 판단
                const isWarning = hasCriticalChange(student.id);

                return (
                  <React.Fragment key={student.id}>
                    <tr 
                      onClick={() => toggleExpand(student.id)}
                      className={`hover:bg-blue-50/30 transition-all cursor-pointer group ${expandedId === student.id ? 'bg-blue-50/20' : ''}`}
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          {/* 경고 시 점 색상 빨간색 & 애니메이션 추가 */}
                          <div className={`w-2 h-2 rounded-full ${isWarning ? 'bg-red-500 animate-pulse' : (expandedId === student.id ? 'bg-blue-600' : 'bg-gray-200')} transition-colors`} />
                          
                          {/* [추가] 이름 텍스트 색상 분기 및 경고 배지 */}
                          <span className={`font-black text-lg ${isWarning ? 'text-red-600' : 'text-gray-900'}`}>
                            {student.student_name}
                          </span>
                          
                          {isWarning && (
                            <span className="bg-red-600 text-white text-[9px] px-2 py-0.5 rounded-md font-black animate-bounce shadow-sm shadow-red-200">
                              배정 주의
                            </span>
                          )}

                          <span className={`text-[10px] font-bold ${expandedId === student.id ? 'text-blue-600' : 'text-gray-300'} transition-colors ml-auto`}>
                            {expandedId === student.id ? 'CLOSE ▲' : 'DETAILS ▼'}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                          <span className="bg-gray-100 px-3 py-1.5 rounded-full text-[10px] font-black text-gray-500 uppercase tracking-tight">
                              {student.selection_type || '일반'}
                          </span>
                      </td>
                      <td className="px-8 py-6 text-center text-gray-400 text-xs font-bold tracking-tighter">
                        {new Date(student.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/admin/set-priority?studentId=${student.id}&type=${encodeURIComponent(student.selection_type)}`);
                            }}
                            className="bg-gray-900 text-white px-5 py-2 rounded-xl text-xs font-black hover:bg-blue-600 transition shadow-sm"
                          >
                            수정
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteStudent(student.id, student.student_name);
                            }}
                            className="bg-white text-red-500 border border-red-100 px-5 py-2 rounded-xl text-xs font-black hover:bg-red-50 transition"
                          >
                            삭제
                          </button>
                        </div>
                      </td>
                    </tr>

                    {expandedId === student.id && (
                      <tr className="bg-gray-50/30 shadow-inner">
                        <td colSpan="4" className="px-8 py-10">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {['가', '나', '다'].map((group) => (
                              <div key={group} className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-xl shadow-gray-200/40 hover:shadow-2xl transition-all">
                                <div className="flex items-center justify-between mb-6 border-b border-gray-50 pb-4">
                                  <div className="flex items-center">
                                      <div className="w-1.5 h-4 bg-blue-600 rounded-full mr-2 shadow-sm shadow-blue-200" />
                                      <h3 className="text-sm font-black text-gray-900 tracking-tight">{group}군 지망 순위</h3>
                                  </div>
                                  <span className="text-[10px] font-black text-gray-300">GROUP {group}</span>
                                </div>
                                <div className="space-y-6">
                                  {[1, 2, 3].map((p) => (
                                    <div key={p} className="relative pl-5 border-l-2 border-gray-50 hover:border-blue-100 transition-colors">
                                      <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em] mb-2 leading-none">0{p} Choice</p>
                                      {renderChoice(student.id, group, p)}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-8 flex items-center justify-between bg-white px-6 py-4 rounded-[20px] border border-gray-100 shadow-sm">
                              <div className="flex items-center gap-6">
                                  <div className="flex flex-col">
                                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Standard Data</span>
                                      <div className="flex gap-4">
                                          <span className="text-xs font-bold">국어: <b className="text-blue-600">{student.percentile_korean}</b></span>
                                          <span className="text-xs font-bold">수학: <b className="text-blue-600">{student.percentile_math}</b></span>
                                          <span className="text-xs font-bold">탐1: <b className="text-blue-600">{student.percentile_science1}</b></span>
                                          <span className="text-xs font-bold">탐2: <b className="text-blue-600">{student.percentile_science2}</b></span>
                                      </div>
                                  </div>
                              </div>
                              <div className="text-[10px] font-black text-gray-300 italic uppercase">Ranking System v1.0</div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}