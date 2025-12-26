"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from "@/utils/supabase/client";

function DashboardContent() {
  const [universities, setUniversities] = useState([]);
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [selectionType, setSelectionType] = useState('');
  const [userSelectionType, setUserSelectionType] = useState('');
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  
  // URL에서 studentId 파라미터를 가져옴
  const studentId = searchParams.get('studentId');

  useEffect(() => {
    fetchTargetSelectionType();
  }, [studentId]);

  useEffect(() => {
    if (userSelectionType) {
      setSelectionType(userSelectionType);
      fetchUniversities();
    }
  }, [userSelectionType]);

  useEffect(() => {
    if (universities.length > 0 && selectionType) {
      filterAndSortUniversities();
    }
  }, [universities, selectionType]);

  // 핵심 로직: 파라미터 studentId가 있으면 학생의 타입을, 없으면 관리자 본인의 타입을 가져옴
  const fetchTargetSelectionType = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData?.session) {
      router.push("/signin");
      return;
    }

    let targetSelectionType = '';

    if (studentId) {
      // 1. 파라미터 studentId가 있는 경우: admin_managed_students 테이블 조회
      const { data: studentData, error: studentError } = await supabase
        .from('admin_managed_students')
        .select('selection_type')
        .eq('id', studentId)
        .single();

      if (!studentError && studentData) {
        targetSelectionType = studentData.selection_type;
      }
    } else {
      // 2. 파라미터가 없는 경우: 기존처럼 로그인한 사용자의 profile 조회
      const { data: profileData, error: profileError } = await supabase
        .from('profile')
        .select('selection_type')
        .eq('id', sessionData.session.user.id)
        .single();

      if (!profileError && profileData) {
        targetSelectionType = profileData.selection_type;
      }
    }

    setUserSelectionType(targetSelectionType);
  };

  const fetchUniversities = async () => {
    const { data, error } = await supabase
      .from('university')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) {
      console.error('Error fetching universities:', error);
    } else {
      setUniversities(data);
    }
  };

// ... 기존 코드 동일

const filterAndSortUniversities = () => {
  let filtered = universities.filter(
    (university) => 
      university.selection_type_name === selectionType && 
      university.id !== 'susi1' && 
      university.id !== 'susi2'
  );
  setFilteredUniversities(filtered);
};

// ... 이하 코드 동일
  // 대학 클릭 시 studentId 파라미터도 함께 전달하여 상세 페이지에서도 학생 정보 유지
  const handleUniversityClick = (university) => {
    const baseUrl = `/admin/detail1?name=${encodeURIComponent(university.id)}&selectionTypeName=${encodeURIComponent(university.selection_type_name)}`;
    const finalUrl = studentId ? `${baseUrl}&studentId=${studentId}` : baseUrl;
    router.push(finalUrl);
  };

  return (
    <div className="container mx-auto p-10">
      <h1 className="text-2xl font-bold p-10 text-center">
        {studentId ? "학생 전형 분석: " : ""}{userSelectionType} 대학 합격률 분석
      </h1>
      <div className="bg-white shadow-md rounded my-6 w-full">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <tr>
              <th className="py-3 px-4 text-center">대학명</th>
              <th className="py-3 px-4 text-center">선발유형</th>
              <th className="py-3 px-4 text-center">모집군</th>
              <th className="py-3 px-4 text-center">전체 모집인원(명)</th>
              <th className="py-3 px-4 text-center">변수등급</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-m">
            {filteredUniversities.map((university) => (
              <tr 
                onClick={() => handleUniversityClick(university)} 
                key={university.id} 
                className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
              >
                <td className="py-3 px-4 text-center whitespace-nowrap">
                  <div className="flex items-center justify-center">
                    <img src={university.logo_url} alt={`${university.name} logo`} className="w-8 h-8 mr-2" />
                    <span className="font-semibold">{university.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-center">{university.선발유형}</td>
                <td className="py-3 px-4 text-center">{university.모집군}</td>
                <td className="py-3 px-4 text-center">{university.recruited_number}</td>
                <td className={`py-3 px-4 text-center ${getGradeColor(university.변수등급)}`}>{university.변수등급}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Next.js에서 useSearchParams를 사용하려면 Suspense로 감싸야 함
export default function Dashboard() {
  return (
    <Suspense fallback={<div className="p-20 text-center">분석 데이터를 불러오는 중...</div>}>
      <DashboardContent />
    </Suspense>
  );
}

function getGradeColor(grade){
  switch (grade) {
    case '1등급': return 'text-green-500';
    case '2등급': return 'text-lime-500';
    case '3등급': return 'text-yellow-500';
    case '4등급': return 'text-orange-500';
    case '5등급': return 'text-red-500';
    default: return 'text-black';
  }
}