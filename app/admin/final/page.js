"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { createClient } from "@/utils/supabase/client";
import { useRouter } from 'next/navigation';

function RankingDashboardContent() {
  const [universities, setUniversities] = useState([]);
  const [confirmedCounts, setConfirmedCounts] = useState({});
  const [userSelectionType, setUserSelectionType] = useState('');
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const init = async () => {
      // 1. 세션 및 관리자 프로필 확인
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/signin");
        return;
      }

      const { data: profile } = await supabase
        .from('profile')
        .select('selection_type')
        .eq('id', session.user.id)
        .single();

      const type = profile?.selection_type || '기회균형전형';
      setUserSelectionType(type);

      // 2. 대학 리스트 가져오기
      const { data: univData } = await supabase
        .from('university')
        .select('*')
        .order('name', { ascending: true })
        .range(0, 999);

      const suffix = type === '기회균형전형' ? '1' : '2';
      const filteredUniversities = univData?.filter(u => String(u.id).endsWith(suffix)) || [];

      // 3. 확정 인원 데이터 집계 (중요 수정 포인트)
      const { data: choicesData, error: choicesError } = await supabase
        .from('student_choices')
        .select(`
          status,
          departments!inner (
            university_id
          ),
          admin_managed_students!inner (
            selection_type
          )
        `)
        .eq('status', '확정')
        .eq('admin_managed_students.selection_type', type) // 해당 전형 학생들만 필터링
        .range(0, 999);

      if (choicesError) {
        console.error("집계 에러:", choicesError);
      }

      // 4. Counts 맵 생성 (데이터 구조 안정성 강화)
      const countsMap = (choicesData || []).reduce((acc, curr) => {
        // Supabase의 조인 방식에 따라 객체 또는 배열로 올 수 있으므로 모두 대응
        const deptSource = curr.departments;
        const uId = Array.isArray(deptSource) 
          ? deptSource[0]?.university_id 
          : deptSource?.university_id;

        if (uId) {
          const key = String(uId).trim();
          acc[key] = (acc[key] || 0) + 1;
        }
        return acc;
      }, {});

      // 확인용 로그 (개발자 도구에서 확인 가능)
      console.log("📊 매칭된 확정 인원 맵:", countsMap);

      setConfirmedCounts(countsMap);
      setUniversities(filteredUniversities);
      setLoading(false);
    };

    init();
  }, [router, supabase]);

  const handleUniversityClick = (univId) => {
    router.push(`/admin/ranking?univId=${univId}`);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="font-black text-gray-500 italic">RANKING DATA ANALYZING...</p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-10 font-sans">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-gray-900 mb-2 italic tracking-tighter">
          FINAL <span className="text-blue-600 not-italic">RANKING BOARD</span>
        </h1>
        <div className="flex items-center gap-3">
          <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
            {userSelectionType}
          </span>
          <p className="text-gray-400 font-bold text-sm tracking-tight">
             실시간 확정 배정 현황 리스트
          </p>
        </div>
      </header>

      <div className="bg-white shadow-2xl rounded-[40px] overflow-hidden border border-gray-100">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr className="text-gray-400 text-[11px] font-black uppercase tracking-[0.2em]">
              <th className="py-7 px-6 text-center">University</th>
              <th className="py-7 px-6 text-center">Group</th>
              <th className="py-7 px-6 text-center">Total Recruited</th>
              <th className="py-7 px-6 text-center">Confirmed</th>
              <th className="py-7 px-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {universities.map((univ) => {
              // university.id ("chungang1")와 countsMap의 key를 매칭
              const count = confirmedCounts[String(univ.id).trim()] || 0;
              
              return (
                <tr 
                  key={univ.id} 
                  onClick={() => handleUniversityClick(univ.id)}
                  className="hover:bg-blue-50/40 cursor-pointer transition-all duration-300 group"
                >
                  <td className="py-7 px-6">
                    <div className="flex items-center justify-center gap-5">
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-100 bg-white p-1 shadow-sm">
                        <img 
                          src={univ.logo_url} 
                          alt="logo" 
                          className="w-full h-full object-contain"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=LOGO'; }} 
                        />
                      </div>
                      <span className="font-black text-gray-800 text-xl group-hover:text-blue-600 transition-colors">
                        {univ.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-7 px-6 text-center">
                    <span className="font-black text-gray-400 bg-gray-50 px-3 py-1 rounded-lg text-xs">
                      {univ.모집군 || '가,나,다'}
                    </span>
                  </td>
                  <td className="py-7 px-6 text-center font-bold text-gray-500">
                    {univ.recruited_number || 0}명
                  </td>
                  <td className="py-7 px-6 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className={`px-5 py-2 rounded-2xl text-[11px] font-black transition-all ${
                        count > 0 
                        ? 'bg-green-50 text-green-600 border border-green-100' 
                        : 'bg-gray-50 text-gray-300 border border-gray-100'
                      }`}>
                        {count}명 확정됨
                      </span>
                    </div>
                  </td>
                  <td className="py-7 px-6 text-center">
                    <button className="bg-gray-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest group-hover:bg-blue-600 transition-all shadow-lg shadow-gray-200 group-hover:shadow-blue-100">
                      View Ranking
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {universities.length === 0 && (
          <div className="py-32 text-center">
            <p className="text-gray-300 font-black italic text-xl">선택하신 전형에 해당하는 대학 데이터가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RankingPage() {
  return (
    <Suspense fallback={
      <div className="p-20 text-center font-black text-blue-600 animate-pulse">
        시스템 대시보드를 불러오는 중...
      </div>
    }>
      <RankingDashboardContent />
    </Suspense>
  );
}