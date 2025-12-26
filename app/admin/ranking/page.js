"use client";

import { useEffect, useState, Suspense } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useSearchParams, useRouter } from 'next/navigation';

function RankingDetailContent() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const router = useRouter();
  const univId = searchParams.get('univId');

  const [universityInfo, setUniversityInfo] = useState(null);
  const [groupedData, setGroupedData] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  
  // 수시 전용 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ unit: '', group: '가', capacity: '', score: '' });

  const isSusi = univId === 'susi1' || univId === 'susi2';

  useEffect(() => {
    if (univId) fetchData();
  }, [univId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id);

      const { data: univ } = await supabase.from('university').select('*').eq('id', univId).single();
      setUniversityInfo(univ);

      const { data: choices, error: choicesError } = await supabase
        .from('student_choices')
        .select(`
          *,
          departments!inner (id, university_id, 모집단위, 모집인원, 군)
        `)
        .eq('departments.university_id', univId)
        .eq('status', '확정');

      if (choicesError) throw choicesError;

      const studentIds = choices.map(c => c.student_id);
      const { data: students } = await supabase
        .from('admin_managed_students')
        .select('id, student_name, manager_id')
        .in('id', studentIds);

      const combined = choices.map(choice => ({
        ...choice,
        admin_managed_students: students?.find(s => s.id === choice.student_id)
      }));

      const grouped = combined.reduce((acc, curr) => {
        const deptName = curr.departments.모집단위;
        if (!acc[deptName]) acc[deptName] = [];
        acc[deptName].push(curr);
        return acc;
      }, {});

      Object.keys(grouped).forEach(key => {
        grouped[key].sort((a, b) => b.converted_score - a.converted_score);
      });

      setGroupedData(grouped);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // 수시 데이터 등록 로직
  const handleAddSusi = async () => {
    // 1. 유효성 검사
    if (!formData.unit || !formData.capacity || !formData.score) {
      return alert("모든 필드를 입력해주세요.");
    }

    try {
      // 2. 현재 관리자가 담당하는 학생 중 한 명의 ID를 가져옴 (외래키 에러 방지)
      // 만약 특정 학생을 선택하는 UI가 없다면 가장 최근에 등록된 학생을 기준으로 합니다.
      const { data: studentList, error: studentError } = await supabase
        .from('admin_managed_students')
        .select('id')
        .eq('manager_id', currentUserId) // 현재 관리자의 학생만 조회
        .limit(1)
        .single();

      if (studentError || !studentList) {
        return alert("담당하는 학생이 없습니다. 학생을 먼저 등록해야 수시 항목 추가가 가능합니다.");
      }

      // 변수 선언 및 할당 확인
      const targetStudentId = studentList.id; 

      // 3. departments 테이블에 학과 등록
      const { data: dept, error: deptErr } = await supabase
        .from('departments')
        .insert([{ 
          university_id: univId, 
          모집단위: formData.unit, 
          군: formData.group, 
          모집인원: parseInt(formData.capacity) 
        }])
        .select()
        .single();

      if (deptErr) throw deptErr;

      // 4. student_choices 테이블에 등록 (위에서 정의한 targetStudentId 사용)
      const { error: choiceErr } = await supabase
        .from('student_choices')
        .insert([{
          student_id: targetStudentId, // 정의된 변수 사용
          department_id: dept.id,
          converted_score: parseFloat(formData.score),
          status: '확정',
          priority: 1,
          group_type: formData.group
        }]);

      if (choiceErr) throw choiceErr;

      alert("성공적으로 등록되었습니다.");
      setIsModalOpen(false);
      setFormData({ unit: '', group: '가', capacity: '', score: '' });
      fetchData(); // 리스트 갱신
    } catch (err) {
      console.error("Insert Error:", err);
      alert(`등록 실패: ${err.message || "알 수 없는 오류"}`);
    }
  };

  // 수시 데이터 삭제 로직
  const handleDeleteSusi = async (deptId) => {
    if (!confirm("해당 모집단위와 관련된 모든 데이터를 삭제하시겠습니까?")) return;
    try {
      // student_choices는 연쇄 삭제(Cascade) 설정이 안 되어 있을 경우를 대비해 수동 삭제
      await supabase.from('student_choices').delete().eq('department_id', deptId);
      await supabase.from('departments').delete().eq('id', deptId);
      
      alert("삭제되었습니다.");
      fetchData();
    } catch (err) {
      alert("삭제 실패");
    }
  };

  if (loading) return <div className="p-20 text-center font-bold text-gray-400">데이터 분석 중...</div>;

  return (
    <div className="container mx-auto p-6 max-w-5xl font-sans">
      <div className="flex items-center justify-between mb-8 border-b pb-6">
        <div className="flex items-center gap-4">
          <img src={universityInfo?.logo_url} alt="logo" className="w-12 h-12 rounded-lg border" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{universityInfo?.name}</h2>
            <p className="text-sm text-blue-600 font-semibold uppercase tracking-tight">최종 확정자 명단</p>
          </div>
        </div>
        <div className="flex gap-2">
          {isSusi && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-md transition-all"
            >
              + 항목 추가 (수시이월)
            </button>
          )}
          <button onClick={() => router.back()} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-sm font-bold transition-all">
            목록으로 돌아가기
          </button>
        </div>
      </div>

      <div className="space-y-12">
        {Object.entries(groupedData).length === 0 ? (
          <div className="py-20 text-center text-gray-400 border-2 border-dashed rounded-2xl font-medium">현재 확정된 인원이 없습니다.</div>
        ) : (
          Object.entries(groupedData).map(([deptName, students]) => (
            <div key={deptName}>
              <div className="flex items-center justify-between mb-3 px-2">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-5 bg-gray-800 rounded-full"></span>
                  <h3 className="text-lg font-bold text-gray-800">{deptName}</h3>
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded ml-2 font-bold">{students[0].departments.군}군</span>
                  {isSusi && (
                    <button 
                      onClick={() => handleDeleteSusi(students[0].departments.id)}
                      className="text-xs text-red-500 hover:underline ml-2"
                    >
                      학과삭제
                    </button>
                  )}
                </div>
                <span className="text-xs text-gray-400 font-medium">모집 {students[0].departments.모집인원}명 / 확정 {students.length}명</span>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <table className="min-w-full table-auto">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr className="text-gray-500 text-xs font-bold uppercase text-center">
                      <th className="py-3 px-4 w-16">순위</th>
                      <th className="py-3 px-4">학생 이름</th>
                      <th className="py-3 px-4">환산 점수</th>
                      <th className="py-3 px-4 w-24">지망</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-gray-700">
                    {students.map((choice, index) => {
                      const isMyStudent = choice.admin_managed_students?.manager_id === currentUserId;
                      return (
                        <tr key={choice.id} className={`border-b border-gray-100 last:border-0 text-center ${isMyStudent ? 'bg-yellow-50 font-bold' : 'hover:bg-gray-50'}`}>
                          <td className="py-3 font-bold text-gray-400">{index + 1}</td>
                          <td className="py-3">
                            <div className="flex items-center justify-center gap-2">
                              {choice.admin_managed_students?.student_name}
                              {isMyStudent && <span className="text-[10px] bg-yellow-400 text-yellow-900 px-1.5 py-0.5 rounded font-black">MY</span>}
                            </div>
                          </td>
                          <td className="py-3 font-semibold text-gray-900">{choice.converted_score}</td>
                          <td className="py-3 text-gray-400 text-xs">{choice.priority}지망</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 수시 등록 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold mb-6 border-b pb-2">수시이월 전형 정보 등록</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">모집단위</label>
                <input 
                  type="text" className="w-full border rounded-lg p-2 outline-blue-500"
                  value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})}
                  placeholder="예: 호서대 경영학과"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1">군</label>
                  <select 
                    className="w-full border rounded-lg p-2 outline-blue-500"
                    value={formData.group} onChange={e => setFormData({...formData, group: e.target.value})}
                  >
                    <option value="가">가군</option>
                    <option value="나">나군</option>
                    <option value="다">다군</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1">모집인원</label>
                  <input 
                    type="number" className="w-full border rounded-lg p-2 outline-blue-500"
                    value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})}
                    placeholder="숫자만 입력"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">환산 점수</label>
                <input 
                  type="number" className="w-full border rounded-lg p-2 outline-blue-500"
                  value={formData.score} onChange={e => setFormData({...formData, score: e.target.value})}
                  placeholder="예: 505"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-8">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-gray-600"
              >취소</button>
              <button 
                onClick={handleAddSusi}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-white shadow-lg shadow-blue-200"
              >등록하기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RankingDetail() {
  return (
    <Suspense fallback={<div className="p-20 text-center text-gray-500 font-bold">데이터 분석 중...</div>}>
      <RankingDetailContent />
    </Suspense>
  );
}