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

      // 1. 대학 기본 정보 가져오기
      const { data: univ } = await supabase.from('university').select('*').eq('id', univId).single();
      setUniversityInfo(univ);

      // 2. 통합 조회를 위해 모든 '확정' 상태인 student_choices와 departments 정보를 가져옵니다.
      const { data: choices, error: choicesError } = await supabase
        .from('student_choices')
        .select(`
          *,
          departments!inner (id, university_id, 모집단위, 모집인원, 군, sum)
        `)
        .eq('status', '확정');

      if (choicesError) throw choicesError;

      // 3. 학생 이름 정보를 별도로 가져오기 (방법 B: 수동 매핑)
      const studentIds = choices.map(c => c.student_id);
      const { data: students } = await supabase
        .from('admin_managed_students')
        .select('id, student_name, manager_id, selection_type')
        .in('id', studentIds);

      // 4. 데이터 결합 및 'sum === y' 로직에 따른 그룹화
      const combined = choices.map(choice => ({
        ...choice,
        admin_managed_students: students?.find(s => s.id === choice.student_id)
      }));

      const grouped = combined.reduce((acc, curr) => {
        const dept = curr.departments;
        if (!dept) return acc;

        // --- [통합 조회 핵심 로직] ---
        // 1. 현재 대학(univId)에 속한 학과인 경우
        const isCurrentUniv = String(dept.university_id) === String(univId);
        
        // 2. sum === 'y'이고, 전형 숫자(1, 2)만 다른 동일 대학의 동일 모집단위인 경우
        let isIntegrated = false;
        if (dept.sum === 'y') {
          const currentBaseId = String(univId).replace(/[12]/, ''); // 예: seoul1 -> seoul
          const targetBaseId = String(dept.university_id).replace(/[12]/, '');
          if (currentBaseId === targetBaseId) isIntegrated = true;
        }

        if (isCurrentUniv || isIntegrated) {
          const deptName = dept.모집단위 || "미지정 학과";
          if (!acc[deptName]) acc[deptName] = [];
          
          // 중복 추가 방지 (이미 추가된 레코드인지 ID로 확인)
          if (!acc[deptName].some(item => item.id === curr.id)) {
            acc[deptName].push(curr);
          }
        }
        return acc;
      }, {});

      // 5. 학과별 성적순 정렬
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

  const handleAddSusi = async () => {
    if (!formData.unit || !formData.capacity || !formData.score) return alert("모든 필드를 입력해주세요.");
    try {
      const { data: studentList, error: studentError } = await supabase
        .from('admin_managed_students')
        .select('id')
        .eq('manager_id', currentUserId)
        .limit(1)
        .single();

      if (studentError || !studentList) return alert("담당 학생이 없습니다.");

      const targetStudentId = studentList.id; 

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

      const { error: choiceErr } = await supabase
        .from('student_choices')
        .insert([{
          student_id: targetStudentId,
          department_id: dept.id,
          converted_score: parseFloat(formData.score),
          status: '확정',
          priority: 1,
          group_type: formData.group
        }]);

      if (choiceErr) throw choiceErr;
      setIsModalOpen(false);
      setFormData({ unit: '', group: '가', capacity: '', score: '' });
      fetchData();
    } catch (err) {
      alert(`등록 실패: ${err.message}`);
    }
  };

  const handleDeleteSusi = async (deptId) => {
    if (!confirm("해당 데이터를 삭제하시겠습니까?")) return;
    try {
      await supabase.from('student_choices').delete().eq('department_id', deptId);
      await supabase.from('departments').delete().eq('id', deptId);
      fetchData();
    } catch (err) { alert("삭제 실패"); }
  };

  if (loading) return <div className="p-20 text-center font-bold text-gray-400 tracking-widest animate-pulse">RANKING ANALYSIS IN PROGRESS...</div>;

  return (
    <div className="container mx-auto p-6 max-w-5xl font-sans">
      <div className="flex items-center justify-between mb-8 border-b pb-6">
        <div className="flex items-center gap-4">
          <img src={universityInfo?.logo_url} alt="logo" className="w-12 h-12 rounded-lg border shadow-sm" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{universityInfo?.name}</h2>
            <p className="text-sm text-blue-600 font-semibold uppercase tracking-tight">Final Confirmed List</p>
          </div>
        </div>
        <div className="flex gap-2">
        </div>
      </div>

      <div className="space-y-12">
        {Object.entries(groupedData).length === 0 ? (
          <div className="py-20 text-center text-gray-300 border-2 border-dashed rounded-2xl font-medium italic text-lg">데이터가 없습니다.</div>
        ) : (
          Object.entries(groupedData).map(([deptName, students]) => (
            <div key={deptName}>
              <div className="flex items-center justify-between mb-3 px-2">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-gray-800 rounded-full"></span>
                  <h3 className="text-lg font-bold text-gray-800">{deptName}</h3>
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded ml-2 font-bold">{students[0].departments.군}군</span>
                  {students[0].departments.sum === 'y' && (
                    <span className="text-[10px] bg-purple-100 text-purple-600 px-2 py-0.5 rounded font-black ml-1 uppercase border border-purple-200">Integrated</span>
                  )}
                </div>
                <span className="text-xs text-gray-400 font-medium">모집 {students[0].departments.모집인원}명 / 확정 {students.length}명</span>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <table className="min-w-full table-auto">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr className="text-gray-500 text-[10px] font-black uppercase text-center tracking-widest">
                      <th className="py-3 px-4 w-16">Rank</th>
                      <th className="py-3 px-4 text-left">Student Name</th>
                      <th className="py-3 px-4">Selection</th>
                      <th className="py-3 px-4">Score</th>
                      {isSusi && <th className="py-3 px-4 w-16">Action</th>}
                    </tr>
                  </thead>
                  <tbody className="text-sm text-gray-700">
                    {students.map((choice, index) => {
                      const isMyStudent = choice.admin_managed_students?.manager_id === currentUserId;
                      return (
                        <tr key={choice.id} className={`border-b border-gray-100 last:border-0 transition-colors ${isMyStudent ? 'bg-yellow-50 font-bold' : 'hover:bg-gray-50'}`}>
                          <td className="py-3 text-center font-bold text-blue-600">{index + 1}</td>
                          <td className="py-3 px-4 text-left">
                            <div className="flex items-center gap-2">
                              {choice.admin_managed_students?.student_name}
                              {isMyStudent && <span className="text-[8px] bg-yellow-400 text-yellow-900 px-1.5 py-0.5 rounded font-black">MY</span>}
                            </div>
                          </td>
                          <td className="py-3 text-center text-[10px] font-bold text-gray-400 uppercase">
                            {choice.admin_managed_students?.selection_type?.replace('전형', '') || '-'}
                          </td>
                          <td className="py-3 text-center font-black text-gray-900 italic tracking-tighter">{choice.converted_score}</td>
                          {isSusi && (
                            <td className="py-3 text-center">
                              <button onClick={() => handleDeleteSusi(choice.departments.id)} className="text-red-400 hover:text-red-600">
                                <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                            </td>
                          )}
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

      {/* MODAL SECTION (SU-SI REGISTRATION) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-[32px] w-full max-w-md shadow-2xl border border-gray-100">
            <h3 className="text-xl font-black mb-6 border-b pb-4 text-gray-800">수시이월 정보 등록</h3>
            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">모집단위</label>
                <input type="text" className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-blue-500 outline-none font-bold" 
                  value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} placeholder="학과명 입력" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">모집군</label>
                  <select className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-blue-500 outline-none font-bold"
                    value={formData.group} onChange={e => setFormData({...formData, group: e.target.value})}>
                    <option value="가">가군</option><option value="나">나군</option><option value="다">다군</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">모집인원</label>
                  <input type="number" className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-blue-500 outline-none font-bold"
                    value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} placeholder="0" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">환산 점수</label>
                <input type="number" className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-blue-500 outline-none font-bold"
                  value={formData.score} onChange={e => setFormData({...formData, score: e.target.value})} placeholder="0.00" />
              </div>
            </div>
            <div className="flex gap-3 mt-10">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-gray-50 hover:bg-gray-100 rounded-2xl font-black text-gray-400 transition-all">CANCEL</button>
              <button onClick={handleAddSusi} className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 rounded-2xl font-black text-white shadow-lg shadow-blue-200 transition-all">CONFIRM</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RankingDetail() {
  return (
    <Suspense fallback={<div className="p-20 text-center font-black text-blue-600 animate-pulse">INITIALIZING DATA...</div>}>
      <RankingDetailContent />
    </Suspense>
  );
}