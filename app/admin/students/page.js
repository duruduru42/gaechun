"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { createClient } from "@/utils/supabase/client";
import { useRouter } from 'next/navigation';

// 모듈 수준 싱글톤으로 클라이언트 생성 (#4)
const supabase = createClient();

// 공통 데이터 변환 헬퍼 (#6)
function normalizeChoice(curr) {
  return {
    ...curr,
    display_univ: curr.university_name || curr.departments?.name,
    display_dept: curr.department_name || curr.departments?.모집단위,
    is_integrated: curr.departments?.sum === 'y',
  };
}

// 컴포넌트 분리 (#8)
function StatusBadge({ status, isIntegrated }) {
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
        <span className="text-[9px] bg-purple-100 text-purple-600 border border-purple-200 px-1.5 py-0.5 rounded-md font-black">통합</span>
      )}
    </div>
  );
}

// 컴포넌트 분리 (#8)
function ChoiceItem({ choice }) {
  if (!choice) return <span className="text-gray-300 text-xs italic">미선택</span>;
  return (
    <div className="text-sm">
      <div className="flex items-center mb-1 justify-between">
        <span className="font-bold text-gray-800 truncate max-w-[120px]">{choice.display_univ}</span>
        <StatusBadge status={choice.status} isIntegrated={choice.is_integrated} />
      </div>
      <div className="text-gray-500 text-xs font-normal">({choice.display_dept})</div>
      <div className="text-[10px] text-blue-600 font-bold mt-1">{choice.converted_score?.toLocaleString()}점</div>
    </div>
  );
}

export default function StudentSimpleListPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [studentChoices, setStudentChoices] = useState({});
  const [expandAll, setExpandAll] = useState(false);

  const router = useRouter();

  // #7: studentChoices 변경 시에만 경고 학생 목록 재계산
  const warningSet = useMemo(() => {
    const set = new Set();
    for (const [studentId, choices] of Object.entries(studentChoices)) {
      const isCritical = ['가', '나', '다'].some((group) => {
        const groupChoices = choices[group];
        if (!groupChoices) return false;
        const activePriorities = Object.values(groupChoices).filter(item => item !== null);
        if (activePriorities.length === 0) return false;
        return activePriorities.every(choice => choice.status === '변경');
      });
      if (isCritical) set.add(studentId);
    }
    return set;
  }, [studentChoices]);

  // #5: useCallback으로 메모이제이션
  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("로그인이 필요합니다.");
        router.push("/signin");
        return;
      }

      // #9: 필요한 컬럼만 명시적으로 선택
      const { data, error } = await supabase
        .from('admin_managed_students')
        .select('id, student_name, selection_type, created_at, percentile_korean, percentile_math, percentile_science1, percentile_science2, manager_id')
        .eq('manager_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  // #1: 실제 의존성인 fetchStudents를 배열에 포함
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const toggleAll = useCallback(async () => {
    if (expandAll) {
      setExpandedId(null);
      setExpandAll(false);
      return;
    }

    setLoading(true);
    try {
      const unloadedIds = students
        .filter(s => !studentChoices[s.id])
        .map(s => s.id);

      if (unloadedIds.length > 0) {
        // #9: 필요한 컬럼만 명시적으로 선택, #10: priority 정렬 추가
        const { data, error } = await supabase
          .from('student_choices')
          .select('id, student_id, group_type, priority, status, university_name, department_name, converted_score, departments (name, 모집단위, sum)')
          .in('student_id', unloadedIds)
          .order('priority', { ascending: true });

        if (error) throw error;

        if (data) {
          const newChoices = data.reduce((acc, curr) => {
            if (!acc[curr.student_id]) acc[curr.student_id] = {};
            if (!acc[curr.student_id][curr.group_type]) acc[curr.student_id][curr.group_type] = {};
            // #6: 공통 헬퍼 사용
            acc[curr.student_id][curr.group_type][curr.priority] = normalizeChoice(curr);
            return acc;
          }, {});

          setStudentChoices(prev => ({ ...prev, ...newChoices }));
        }
      }

      // #3: 상태를 함께 설정해 불일치 방지
      setExpandedId('ALL');
      setExpandAll(true);
    } catch (error) {
      console.error("Expand all error:", error);
    } finally {
      setLoading(false);
    }
  }, [expandAll, students, studentChoices]);

  const handleDeleteStudent = useCallback(async (studentId, studentName) => {
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
  }, []);

  const toggleExpand = useCallback(async (studentId) => {
    // #2: 전체 모드 해제 시 해당 학생만 유지
    if (expandedId === 'ALL') {
      setExpandAll(false);
      setExpandedId(studentId);
      // 데이터가 이미 로드됐으면 별도 fetch 불필요
      if (!studentChoices[studentId]) {
        // 전체 로드 시 포함됐어야 하지만 누락된 경우 fallback fetch
        await fetchChoicesForStudent(studentId);
      }
      return;
    }

    if (expandedId === studentId) {
      setExpandedId(null);
      return;
    }

    setExpandAll(false);
    setExpandedId(studentId);

    if (!studentChoices[studentId]) {
      await fetchChoicesForStudent(studentId);
    }
  }, [expandedId, studentChoices]);

  const fetchChoicesForStudent = useCallback(async (studentId) => {
    // #9: 필요한 컬럼만 선택, #10: priority 정렬 추가
    const { data, error } = await supabase
      .from('student_choices')
      .select('id, student_id, group_type, priority, status, university_name, department_name, converted_score, departments (name, 모집단위, sum)')
      .eq('student_id', studentId)
      .order('priority', { ascending: true });

    if (!error && data) {
      const organized = data.reduce((acc, curr) => {
        if (!acc[curr.group_type]) acc[curr.group_type] = {};
        // #6: 공통 헬퍼 사용
        acc[curr.group_type][curr.priority] = normalizeChoice(curr);
        return acc;
      }, {});
      setStudentChoices(prev => ({ ...prev, [studentId]: organized }));
    }
  }, []);

  if (loading) return <div className="p-20 text-center text-gray-500 font-bold">학생 목록을 불러오는 중...</div>;

  return (
    <div className="max-w-5xl mx-auto p-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-black text-gray-800 tracking-tighter italic">ADMIN <span className="text-blue-600">STUDENTS</span></h1>
        <div className="flex gap-3">
          <button
            onClick={toggleAll}
            className={`px-6 py-2.5 rounded-xl font-bold border transition shadow-sm ${
              expandAll
                ? 'bg-gray-800 text-white border-gray-800'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {expandAll ? '전체 리스트 접기 ▲' : '전체 상세 펼치기 ▼'}
          </button>
          <button
            onClick={() => router.push('/admin')}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100"
          >
            + 신규 학생 등록
          </button>
        </div>
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
                // #7: useMemo로 캐싱된 warningSet 사용
                const isWarning = warningSet.has(student.id);
                const isExpanded = expandedId === 'ALL' || expandedId === student.id;

                return (
                  <React.Fragment key={student.id}>
                    <tr
                      onClick={() => toggleExpand(student.id)}
                      className={`hover:bg-blue-50/30 transition-all cursor-pointer group ${isExpanded ? 'bg-blue-50/20' : ''}`}
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${isWarning ? 'bg-red-500 animate-pulse' : (isExpanded ? 'bg-blue-600' : 'bg-gray-200')} transition-colors`} />
                          <span className={`font-black text-lg ${isWarning ? 'text-red-600' : 'text-gray-900'}`}>{student.student_name}</span>
                          {isWarning && (
                            <span className="bg-red-600 text-white text-[9px] px-2 py-0.5 rounded-md font-black animate-bounce shadow-sm shadow-red-200">배정 주의</span>
                          )}
                          <span className={`text-[10px] font-bold ${isExpanded ? 'text-blue-600' : 'text-gray-300'} transition-colors ml-auto`}>
                            {isExpanded ? 'CLOSE ▲' : 'DETAILS ▼'}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className="bg-gray-100 px-3 py-1.5 rounded-full text-[10px] font-black text-gray-500 uppercase tracking-tight">{student.selection_type || '일반'}</span>
                      </td>
                      <td className="px-8 py-6 text-center text-gray-400 text-xs font-bold tracking-tighter">
                        {new Date(student.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="flex justify-center gap-2">
                          <button onClick={(e) => { e.stopPropagation(); router.push(`/admin/set-priority?studentId=${student.id}&type=${encodeURIComponent(student.selection_type)}`); }} className="bg-gray-900 text-white px-5 py-2 rounded-xl text-xs font-black hover:bg-blue-600 transition shadow-sm">수정</button>
                          <button onClick={(e) => { e.stopPropagation(); handleDeleteStudent(student.id, student.student_name); }} className="bg-white text-red-500 border border-red-100 px-5 py-2 rounded-xl text-xs font-black hover:bg-red-50 transition">삭제</button>
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
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
                                      {/* #8: ChoiceItem 컴포넌트 사용 */}
                                      <ChoiceItem choice={studentChoices[student.id]?.[group]?.[p]} />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-8 flex items-center justify-between bg-white px-6 py-4 rounded-[20px] border border-gray-100 shadow-sm">
                            <div className="flex flex-col">
                              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Standard Data</span>
                              <div className="flex gap-4">
                                <span className="text-xs font-bold">국어: <b className="text-blue-600">{student.percentile_korean}</b></span>
                                <span className="text-xs font-bold">수학: <b className="text-blue-600">{student.percentile_math}</b></span>
                                <span className="text-xs font-bold">탐1: <b className="text-blue-600">{student.percentile_science1}</b></span>
                                <span className="text-xs font-bold">탐2: <b className="text-blue-600">{student.percentile_science2}</b></span>
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
