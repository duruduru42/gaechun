"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { createClient } from "@/utils/supabase/client";
import { useRouter } from 'next/navigation';

function RankingDashboardContent() {
  const [universities, setUniversities] = useState([]);
  const [confirmedCounts, setConfirmedCounts] = useState({}); // 대학별 확정 인원 저장
  const [userSelectionType, setUserSelectionType] = useState('');
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/signin");
        return;
      }

      // 1. 관리자의 전형 타입 가져오기
      const { data: profile } = await supabase
        .from('profile')
        .select('selection_type')
        .eq('id', session.user.id)
        .single();

      const type = profile?.selection_type || '기회균형전형';
      setUserSelectionType(type);

      // 2. 대학 리스트 가져오기 (전형 접미사 필터링: 기균 1, 농어촌 2)
      const { data: univData } = await supabase
        .from('university')
        .select('*')
        .order('name', { ascending: true });

      const suffix = type === '기회균형전형' ? '1' : '2';
      const filtered = univData?.filter(u => String(u.id).endsWith(suffix)) || [];

      // 3. 확정 인원 데이터 집계
      // student_choices에서 status가 '확정'인 것들을 가져와서 대학별로 카운트합니다.
      const { data: choicesData } = await supabase
        .from('student_choices')
        .select('*, departments(university_id)')
        .eq('status', '확정');

      const counts = (choicesData || []).reduce((acc, curr) => {
        const univId = curr.departments?.university_id;
        if (univId) {
          acc[univId] = (acc[univId] || 0) + 1;
        }
        return acc;
      }, {});

      setConfirmedCounts(counts);
      setUniversities(filtered);
      setLoading(false);
    };
    init();
  }, []);

  const handleUniversityClick = (univId) => {
    // 상세 페이지 경로 수정: /admin/ranking 에 파라미터 전달
    router.push(`/admin/ranking?univId=${univId}`);
  };

  if (loading) return <div className="p-20 text-center font-bold">랭킹 데이터를 불러오는 중...</div>;

  return (
    <div className="container mx-auto p-10 font-sans">
      <h1 className="text-3xl font-black text-gray-900 mb-2 italic tracking-tighter">
        FINAL <span className="text-blue-600 not-italic">RANKING BOARD</span>
      </h1>
      <p className="text-gray-400 font-bold mb-10 uppercase tracking-widest text-sm">
        {userSelectionType} 확정 배정 현황
      </p>

      <div className="bg-white shadow-2xl rounded-[40px] overflow-hidden border border-gray-100">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr className="text-gray-400 text-[11px] font-black uppercase tracking-[0.2em]">
              <th className="py-6 px-4 text-center">University</th>
              <th className="py-6 px-4 text-center">Group</th>
              <th className="py-6 px-4 text-center">Total Recruited</th>
              <th className="py-6 px-4 text-center">Confirmed</th>
              <th className="py-6 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {universities.map((univ) => {
              const count = confirmedCounts[univ.id] || 0;
              return (
                <tr 
                  key={univ.id} 
                  onClick={() => handleUniversityClick(univ.id)}
                  className="hover:bg-blue-50/40 cursor-pointer transition-all duration-200 group"
                >
                  <td className="py-6 px-4">
                    <div className="flex items-center justify-center gap-4">
                      <img src={univ.logo_url} alt="logo" className="w-10 h-10 rounded-full shadow-sm" />
                      <span className="font-black text-gray-800 text-lg group-hover:text-blue-600 transition-colors">{univ.name}</span>
                    </div>
                  </td>
                  <td className="py-6 px-4 text-center font-black text-gray-500 uppercase">{univ.모집군}</td>
                  <td className="py-6 px-4 text-center font-bold text-gray-400">{univ.recruited_number}명</td>
                  <td className="py-6 px-4 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black ${count > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                      {count}명 확정
                    </span>
                  </td>
                  <td className="py-6 px-4 text-center">
                    <span className="bg-gray-900 text-white px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest group-hover:bg-blue-600 transition-all shadow-sm">
                      View Ranking
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function RankingPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center font-black">데이터 로드 중...</div>}>
      <RankingDashboardContent />
    </Suspense>
  );
}