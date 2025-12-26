 "use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from "@/utils/supabase/client";

export default function Dashboard() {
  const [universities, setUniversities] = useState([]);
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [selectionType, setSelectionType] = useState('');
  const [userSelectionType, setUserSelectionType] = useState('');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    fetchUserSelectionType();
  }, []);

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

  const fetchUserSelectionType = async () => {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !sessionData.session) {
      router.push("/signin");
      return;
    }
    
    const { data: profileData, error: profileError } = await supabase
      .from('profile')
      .select('selection_type')
      .eq('id', sessionData.session.user.id)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
    } else {
      setUserSelectionType(profileData.selection_type);
    }
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

  const fetchApplicantCounts = async (departmentIds) => {
    if (departmentIds.length === 0) return {};

    const { data, error } = await supabase
        .from('applications')
        .select('department_id, user_id')
        .in('department_id', departmentIds);

    if (error) {
        console.error('Error fetching applicant counts:', error);
        return {};
    }

    const counts = data.reduce((acc, { department_id }) => {
        if (!acc[department_id]) {
            acc[department_id] = 0;
        }
        acc[department_id] += 1;
        return acc;
    }, {});

    console.log('Department counts:', counts); // Debug log
    return counts;
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

  const handleUniversityClick = (university) => {
    router.push(`/detail?name=${encodeURIComponent(university.id)}&selectionTypeName=${encodeURIComponent(university.selection_type_name)}`);
  };

  return (
    <div className="container mx-auto p-10">
      <h1 className="text-2xl font-bold p-10 text-center">{userSelectionType} 대학 합격률 분석</h1>
      <div className="bg-white shadow-md rounded my-6 w-full">
  <table className="min-w-full table-auto">
    <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
      <tr>
        <th className="py-3 px-4 text-center">대학명</th>
        <th className="py-3 px-4 text-center">선발유형</th>
        <th className="py-3 px-4 text-center">모집군</th>
        <th className="py-3 px-4 text-center">전체 모집인원(명)</th>
        <th className="py-3 px-4 text-center">변수등급</th>
        <th className="py-3 px-4 text-center"></th>
      </tr>
    </thead>
    <tbody className="text-gray-600 text-m">
      {filteredUniversities.map((university) => (
        <tr onClick={() => handleUniversityClick(university)} 
        key={university.id} className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer">
          <td className="py-3 px-4 text-center whitespace-nowrap">
            <div className="flex items-center justify-center"> {/* 가운데 정렬을 위해 justify-center 추가 */}
              <img src={university.logo_url} alt={`${university.name} logo`} className="w-8 h-8 mr-2" />
              <span className="font-semibold">{university.name}</span>
            </div>
          </td>
        
          <td className="py-3 px-4 text-center">{university.선발유형}</td>
          <td className="py-3 px-4 text-center">{university.모집군}</td>
          <td className="py-3 px-4 text-center">{university.recruited_number}</td>
          <td className={`py-3 px-4 text-center ${getGradeColor(university.변수등급)}`}>{university.변수등급}</td>
          <td className="py-3 px-4 text-center">

          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
    </div>
  );
}

function getGradeColor(grade){
  switch (grade) {
    case '1등급':
      return 'text-green-500';
    case '2등급':
      return 'text-lime-500';
    case '3등급':
      return 'text-yellow-500';
    case '4등급':
      return 'text-orange-500';
    case '5등급':
      return 'text-red-500';
    default:
      return 'text-black';
  }
};