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
            name,
            모집단위
          )
        `)
        .eq('student_id', studentId);

      if (!error && data) {
        const organized = data.reduce((acc, curr) => {
          if (!acc[curr.group_type]) acc[curr.group_type] = {};
          
          acc[curr.group_type][curr.priority] = {
            ...curr,
            display_univ: curr.university_name || curr.departments?.name,
            display_dept: curr.department_name || curr.departments?.모집단위
          };
          return acc;
        }, {});
        setStudentChoices(prev => ({ ...prev, [studentId]: organized }));
      }
    }
  };

  // 상태 배지 렌더링 함수
  const renderStatusBadge = (status) => {
    const statusStyles = {
      '확정': 'bg-blue-100 text-blue-700 border-blue-200',
      '보류': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      '변경': 'bg-red-100 text-red-700 border-red-200',
    };
    
    const style = statusStyles[status] || 'bg-gray-100 text-gray-600 border-gray-200';
    
    return (
      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-black ml-2 ${style}`}>
        {status || '대기'}
      </span>
    );
  };

  const renderChoice = (studentId, group, priority) => {
    const choice = studentChoices[studentId]?.[group]?.[priority];
    
    if (!choice) return <span className="text-gray-300 text-xs italic">미선택</span>;

    return (
      <div className="text-sm">
        <div className="flex items-center mb-1">
          <span className="font-bold text-gray-800">{choice.display_univ}</span>
          {renderStatusBadge(choice.status)}
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
        <h1 className="text-3xl font-black text-gray-800">내 담당 학생 목록</h1>
        <button
          onClick={() => router.push('/admin')}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg"
        >
          + 신규 학생 등록
        </button>
      </div>

      <div className="bg-white shadow-2xl rounded-2xl border border-gray-100 overflow-hidden">
        {students.length === 0 ? (
          <div className="p-20 text-center text-gray-500 font-bold italic">등록된 학생이 없습니다.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-5 text-sm font-black text-gray-600 uppercase tracking-tighter">이름 (클릭시 지망대학)</th>
                <th className="px-6 py-5 text-sm font-black text-gray-600 uppercase tracking-tighter">전형 구분</th>
                <th className="px-6 py-5 text-sm font-black text-gray-600 uppercase tracking-tighter">등록일</th>
                <th className="px-6 py-5 text-sm font-black text-gray-600 uppercase tracking-tighter text-center">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.map((student) => (
                <React.Fragment key={student.id}>
                  <tr 
                    onClick={() => toggleExpand(student.id)}
                    className="hover:bg-blue-50/50 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-5 font-black text-gray-900">
                      {student.student_name}
                      <span className="ml-2 text-xs text-gray-400 group-hover:text-blue-500">{expandedId === student.id ? '▲' : '▼'}</span>
                    </td>
                    <td className="px-6 py-5 text-gray-600 font-medium">
                        <span className="bg-gray-100 px-3 py-1 rounded-lg text-xs font-bold text-gray-500">
                            {student.selection_type || '일반'}
                        </span>
                    </td>
                    <td className="px-6 py-5 text-gray-400 text-sm font-medium">
                      {new Date(student.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/admin/set-priority?studentId=${student.id}`);
                          }}
                          className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-xs font-black hover:bg-blue-700 transition shadow-sm"
                        >
                          수정
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteStudent(student.id, student.student_name);
                          }}
                          className="bg-white text-red-500 border border-red-200 px-4 py-1.5 rounded-md text-xs font-black hover:bg-red-50 transition shadow-sm"
                        >
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>

                  {expandedId === student.id && (
                    <tr className="bg-gray-50/50">
                      <td colSpan="4" className="px-6 py-8 border-inner">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {['가', '나', '다'].map((group) => (
                            <div key={group} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                              <div className="flex items-center mb-4 border-b border-gray-50 pb-2">
                                <div className="w-1.5 h-4 bg-blue-600 rounded-full mr-2" />
                                <h3 className="text-sm font-black text-gray-800">{group}군 지망 순위</h3>
                              </div>
                              <div className="space-y-5">
                                <div className="relative pl-4 border-l-2 border-gray-50">
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">1st Priority</p>
                                    {renderChoice(student.id, group, 1)}
                                </div>
                                <div className="relative pl-4 border-l-2 border-gray-50">
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">2nd Priority</p>
                                    {renderChoice(student.id, group, 2)}
                                </div>
                                <div className="relative pl-4 border-l-2 border-gray-50">
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">3rd Priority</p>
                                    {renderChoice(student.id, group, 3)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-8 flex items-center gap-6 px-4 py-3 bg-white rounded-xl border border-gray-100 shadow-sm w-fit">
                           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">Percentile Data</span>
                           <span className="text-xs">국어: <b className="text-gray-800">{student.percentile_korean}</b></span>
                           <span className="text-xs">수학: <b className="text-gray-800">{student.percentile_math}</b></span>
                           <span className="text-xs">탐1: <b className="text-gray-800">{student.percentile_science1}</b></span>
                           <span className="text-xs">탐2: <b className="text-gray-800">{student.percentile_science2}</b></span>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}