'use client'

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Calculate from '@/components/ui/Calculate'; // Adjust the filename accordingly
import { 서울대학교 } from '@/components/대학점수/서울대학교';
import { 고려대학교 } from '@/components/대학점수/고려대학교';
import { 연세대학교 } from '@/components/대학점수/연세대학교';
import { 서강대학교 } from '@/components/대학점수/서강대학교';
import { 한양대학교 } from '@/components/대학점수/한양대학교(서울)';
import { 중앙대학교 } from '@/components/대학점수/중앙대학교';
import { 경희대학교서울 } from '@/components/대학점수/경희대학교(서울)';
import { 경희대학교국제 } from '@/components/대학점수/경희대학교(국제)';
import { 한국외국어대학교서울 } from '@/components/대학점수/한국외국어대학교(서울)';
import { 한국외국어대학교글로벌 } from '@/components/대학점수/한국외국어대학교(글로벌)';
import { 서울시립대학교 } from '@/components/대학점수/서울시립대학교';
import { 건국대학교 } from '@/components/대학점수/건국대학교';
import { 동국대학교 } from '@/components/대학점수/동국대학교';
import { 홍익대학교서울 } from '@/components/대학점수/홍익대학교(서울)';
import { 홍익대학교세종 } from '@/components/대학점수/홍익대학교(세종)';
import { 숭실대학교 } from '@/components/대학점수/숭실대학교';
import { 세종대학교 } from '@/components/대학점수/세종대학교';
import { 광운대학교 } from '@/components/대학점수/광운대학교';
import { 삼육대학교 } from '@/components/대학점수/삼육대학교';
import { 상명대학교 } from '@/components/대학점수/상명대학교';
import { 인천대학교 } from '@/components/대학점수/인천대학교';
import { 아주대학교 } from '@/components/대학점수/아주대학교';
import { 동덕여자대학교 } from '@/components/대학점수/동덕여자대학교';
import { 성신여자대학교 } from '@/components/대학점수/성신여자대학교';
import { 숙명여자대학교 } from '@/components/대학점수/숙명여자대학교';
import { 이화여자대학교 } from '@/components/대학점수/이화여자대학교';
import { 고려대학교세종} from '@/components/대학점수/고려대학교(세종)';
import { 한양대학교에리카} from '@/components/대학점수/한양대학교(에리카)';
import { 한국공학대학교 } from '@/components/대학점수/한국공학대학교';
import { 한국항공대학교 } from '@/components/대학점수/한국항공대학교';
import { 인하대학교 } from '@/components/대학점수/인하대학교';
import { 경인교육대학교 } from '@/components/대학점수/경인교육대학교';
import { 대구교육대학교 } from '@/components/대학점수/대구교육대학교';
import { 경기대학교 } from '@/components/대학점수/경기대학교';

import Seoul from '@/components/상세정보/seoul';
import Korea from '@/components/상세정보/korea1';

import down from '@/components/caret-down.svg'

import up from '@/components/caret-up.svg'
import sorted from '@/components/sortarrow.svg'
import Image from "next/image";

const scoreCalculators = {
  '서울대학교': 서울대학교,
  '연세대학교': 연세대학교,
  '고려대학교': 고려대학교,
  '서강대학교': 서강대학교,
  '한양대학교(서울)': 한양대학교,
  '중앙대학교' : 중앙대학교,
  '경희대학교(서울)' : 경희대학교서울,
  '경희대학교(국제)' : 경희대학교국제,
  '한국외국어대학교(서울)' : 한국외국어대학교서울,
  '한국외국어대학교(글로벌)' : 한국외국어대학교글로벌,
  '서울시립대학교' : 서울시립대학교,
  '건국대학교' : 건국대학교,
  '동국대학교' : 동국대학교,
  '홍익대학교(서울)' : 홍익대학교서울,
  '홍익대학교(세종)' : 홍익대학교세종,
  '숭실대학교' : 숭실대학교,
  '세종대학교' : 세종대학교, 
  '광운대학교' : 광운대학교,
  '삼육대학교' : 삼육대학교,
  '상명대학교' : 상명대학교,
  '인천대학교' : 인천대학교,
  '아주대학교' : 아주대학교,
  '동덕여자대학교' : 동덕여자대학교,
  '성신여자대학교' : 성신여자대학교,
  '숙명여자대학교' : 숙명여자대학교,
  '이화여자대학교' : 이화여자대학교,
  '고려대학교(세종)' : 고려대학교세종,  
  '한양대학교(에리카)' : 한양대학교에리카,
  '한국공학대학교' : 한국공학대학교,
  '한국항공대학교' : 한국항공대학교,
  '인하대학교' : 인하대학교,  
  '경인교육대학교' : 경인교육대학교,
  '대구교육대학교' : 대구교육대학교,
  '경기대학교' : 경기대학교

};

const universityComponents = {
  'seoul1': Seoul,
  'seoul2': Seoul,
  'korea1': Korea,
  'korea2': Korea,
  'korea3': Korea

//   '연세대학교': 연세대학교,
//   '고려대학교': 고려대학교,
//   '서강대학교': 서강대학교,
//   '한양대학교(서울)': 한양대학교,
//   '중앙대학교' : 중앙대학교,
//   '경희대학교(서울)' : 경희대학교서울,
//   '경희대학교(국제)' : 경희대학교국제,
//   '한국외국어대학교(서울)' : 한국외국어대학교서울,
//   '한국외국어대학교(글로벌)' : 한국외국어대학교글로벌,
//   '서울시립대학교' : 서울시립대학교,
//   '건국대학교' : 건국대학교,
//   '동국대학교' : 동국대학교,
//   '홍익대학교(서울)' : 홍익대학교서울,
//   '홍익대학교(세종)' : 홍익대학교세종,
//   '숭실대학교' : 숭실대학교,
//   '세종대학교' : 세종대학교, 
//   '광운대학교' : 광운대학교,
//   '상명대학교' : 상명대학교,
//   '인천대학교' : 인천대학교,
//   '아주대학교' : 아주대학교,
//   '동덕여자대학교' : 동덕여자대학교,
//   '성신여자대학교' : 성신여자대학교,
//   '숙명여자대학교' : 숙명여자대학교,
//   '이화여자대학교' : 이화여자대학교,
//   '고려대학교(세종)' : 고려대학교세종,  
//   '한양대학교(에리카)' : 한양대학교에리카,
//   '한국공학대학교' : 한국공학대학교,
//   '한국항공대학교' : 한국항공대학교,
//   '인하대학교' : 인하대학교,  
//   '경인교육대학교' : 경인교육대학교,
//   '대구교육대학교' : 대구교육대학교,
//   '경기대학교' : 경기대학교

};

const Detail = () => {
  const searchParams = useSearchParams();
  const name = searchParams.get('name');
  const supabase = createClient();
  const [user, setUser] = useState(null);
  const [selections, setSelections] = useState([]);
  const [applications, setApplications] = useState([]);
  const [sortOrder, setSortOrder] = useState({ column: '계열', order: 'asc' });
  const [calculatedScores, setCalculatedScores] = useState({});
  const [activeTab, setActiveTab] = useState('합격예측');

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user && name) {
      fetchApplications();
    }
  }, [user, name]);

  useEffect(() => {
    if (name) {
      fetchUniversityDetails();
    }
  }, [name, sortOrder]);

  useEffect(() => {
    if (user && selections.length > 0) {
      calculateScoresForDepartments(selections);
    }
  }, [user, selections]);


  // 비교 결과 계산 함수
  const getComparisonResult = (score, selection) => {
    const 진짜안정 = selection.안정 * 1.05;
    const 안정 = selection.안정;
    const 적정 = selection.적정;
    const 소신 = selection.소신;
    const 상향 = selection.상향;
    const 진짜상향 = selection.상향 * 0.95;
                                            
    if (score >= 안정) {
      const percent = ((score - 안정) / (진짜안정 - 안정)) * 20 + 80; // 안정과 진짜안정 사이
      if (percent > 90) {
        return '90% 이상';
      }
      return `${percent.toFixed(1)}%`;
    } else if (score >= 적정 && score < 안정) {
      const percent = ((score - 적정) / (안정 - 적정)) * 20 + 60; // 적정과 안정 사이
      return `${percent.toFixed(1)}%`;
    } else if (score >= 소신 && score < 적정) {
      const percent = ((score - 소신) / (적정 - 소신)) * 20 + 40; // 소신과 적정 사이
      return `${percent.toFixed(1)}%`;
    } else if (score > 상향 && score < 소신) {
      const percent = ((score - 상향) / (소신 - 상향)) * 20 + 20; // 상향과 소신 사이
      return `${percent.toFixed(1)}%`;
    } else if (score >= 진짜상향) {
      const percent = ((score - 진짜상향) / (상향 - 진짜상향)) * 20;
      if (percent < 10) {
        return '10% 미만';
      }
      return `${percent.toFixed(1)}%`;
    }
    else if (score < 진짜상향) {return '10% 미만';}
    return '불가'
  };

  const getBackgroundColor = (comparisonResult) => {
    const percent = parseFloat(comparisonResult); 
    if (percent >= 90) {
      return 'bg-blue-700 text-white';
    }
    else if (percent >= 80) {
      return 'bg-blue-400 text-white';
     } else if (percent >= 60) {
      return 'bg-green-500 text-white';
    } else if (percent >= 40) {
      return 'bg-yellow-500 text-white';
    } else if (percent >= 20) {
      return 'bg-orange-500 text-white';
    } else if (percent > 10) {
      return 'bg-red-500 text-white';
    }
      else if (10 >= percent) {
      return 'bg-black text-white';
    }
  };

  const fetchUniversityDetails = async () => {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .eq('university_id', name);
  
    if (error) {
      console.error('Error fetching university details:', error);
    } else {
      const sortedData = data.sort((a, b) => {
        const column = sortOrder.column;
        const aValue = a[column] || '';
        const bValue = b[column] || '';
  
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          // 숫자 정렬
          return sortOrder.order === 'asc' ?  bValue - aValue : aValue - bValue ;
        } else if (typeof aValue === 'string' && typeof bValue === 'string') {
          // 문자열 정렬 (한글 포함)
          return sortOrder.order === 'asc'
            ? aValue.localeCompare(bValue, 'ko')
            : bValue.localeCompare(aValue, 'ko');
        } else {
          // 다른 경우 (타입 혼합 등)
          return 0;
        }
      });
  
      setSelections(sortedData);
  
      if (user) {
        calculateScoresForDepartments(sortedData); // Call this function only when user is available
      }
    }
  };
  
  const fetchApplications = async () => {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching applications:', error);
    } else {
      setApplications(data);
    }
  };

  const fetchUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setUser(session.user);
    }
  };

  const handleMockApplication = async (selection) => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    const score = calculatedScores[selection.id]; // 선택된 점수 가져오기

    if (score === null || score === undefined) {
      alert('점수 계산 완료 후 재시도해주세요.');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('applications')
        .insert({
          user_id: user.id,
          university_id: selection.university_id,
          department_id: selection.id,
          score: score
        });

      if (error) {
        alert('지원 정보 삽입에 실패했습니다. 콘솔에서 에러를 확인하세요.');
      } else {
        fetchApplications(); // Update the applications list
        alert('모의지원이 성공적으로 제출되었습니다.');
      }
    } catch (err) {
      alert('예기치 못한 오류가 발생했습니다. 콘솔에서 에러를 확인하세요.');
    }
  };

  const toggleSortOrder = (column) => {
    setSortOrder(prevOrder => ({
      column,
      order: prevOrder.column === column && prevOrder.order === 'asc' ? 'desc' : 'asc'
    }));
  };

  const calculateScoresForDepartments = async (departments) => {

    if (!user) return; // Ensure user is available
  
    const scores = {};
    for (let selection of departments) {
      const normalizedUniversityName = selection.name?.trim(); // Remove any leading/trailing whitespace
      const calculateScore = scoreCalculators[normalizedUniversityName];
  
      if (calculateScore) {
        try {
          const score = await calculateScore(user.id, selection);
          scores[selection.id] = score;
        } catch (error) {
          console.error(`Error calculating score for ${normalizedUniversityName}:`, error);
          scores[selection.id] = 'Error';
        }
      } else {
        console.warn(`No score calculator found for ${normalizedUniversityName}`);
        scores[selection.id] = 'Unavailable';
      }
    }
  
    setCalculatedScores(scores); // Update state with calculated scores
  };
  
  const UniversityComponent = universityComponents[name]

  return (
    <div className="container mx-auto p-4">
      <div className="mt-8">
      <h2 className="text-3xl font-bold mb-4">  {selections[0]?.name}
      </h2>

        <nav className="bg-gray-50 pt-2 sm:mt-8 mt-6 sm:sticky sm:top-0 top-9 z-30">
          <div className="flex items-center sm:gap-2 gap-3 max-sm:px-4">
            <button
              onClick={() => setActiveTab('합격예측')}
              className={`sm:text-xl text-lg font-bold sm:px-1 pb-1 border-b-2 duration-200  ${
                activeTab === '합격예측' ? 'border-orange-600  text-gray-800' : 'border-transparent text-gray-300'
              }`}
            >
              합격예측
            </button>
            {/* <button
              onClick={() => setActiveTab('상세정보')}
              className={`sm:text-xl text-lg font-bold sm:px-1 pb-1 border-b-2 duration-200 ${
                activeTab === '상세정보' ? 'border-orange-600 text-gray-800' : 'border-transparent text-gray-300'
              }`}
            >
              상세정보
            </button> */}
          </div>
          <hr />
        </nav>

        {activeTab === '합격예측' ? (
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal font-black">
            <tr>
              <th className="py-3 px-2 text-center">대학명</th>

              <th className="py-3 px-6 text-center w-64 max-w-xs break-words whitespace-normal">
                모집 단위
                <button onClick={() => toggleSortOrder('모집단위')}>
                  {sortOrder.column === '모집단위' ? (sortOrder.order === 'asc' ? <Image src={down} width={8} className='ml-1'/> : <Image src={up} width={8} className='ml-1'/>) : <Image src={sorted} width={10} className='ml-1'/>}
                </button>
              </th>              

              <th className="py-3 px-6 text-center">
                모집 군
                <button onClick={() => toggleSortOrder('군')}>
                  {sortOrder.column === '군' ? (sortOrder.order === 'asc' ? <Image src={down} width={8} className='ml-1'/> : <Image src={up} width={8} className='ml-1'/>) : <Image src={sorted} width={10} className='ml-1'/>}
                  </button>
              </th>              
              <th className="py-3 px-6 text-center">모집인원
              <button onClick={() => toggleSortOrder('모집인원')}>
                  {sortOrder.column === '모집인원' ? (sortOrder.order === 'asc' ? <Image src={down} width={8} className='ml-1'/> : <Image src={up} width={8} className='ml-1'/>) : <Image src={sorted} width={10} className='ml-1'/>}
                  </button></th>
              <th className="py-3 px-6 text-center">지난경쟁률</th>              
              <th className="py-3 px-6 text-center">
                환산점수

              </th>
              <th className="py-3 px-6 text-center">
                합격률

              </th>
              <th className="py-3 px-6 text-right"></th>
            </tr>
          </thead>
          <tbody className="text-black text-sm font-medium">
          {selections.map((selection) => {
          const calculatedScore = calculatedScores[selection.id];
          const comparisonResult =
            calculatedScore && selection.안정
              ? getComparisonResult(calculatedScore, selection)
              : <Calculate />;

         return (              
          <tr key={selection.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-center">{selection.name}</td>
                <td className="py-3 px-6 text-center w-1/3 break-keep	">{selection.모집단위}</td>

                <td className="py-3 px-6 text-center">{selection.군}</td>
                <td className="py-3 px-6 text-center">{selection.모집인원}</td>
                <td className="py-3 px-6 text-center">{selection.지난경쟁률}</td>                
                <td className="py-3 px-6 text-center">{calculatedScores[selection.id] || <Calculate />}</td>                
                <td className="py-3 px-6 text-center">
                <div
                  className={`h-8 flex items-center justify-center rounded-md ${getBackgroundColor(
                    comparisonResult
                  )}`}
                >
                  {comparisonResult}
                </div>
              </td>                
              <td className="text-right">
                  {/* <button
                    onClick={() => handleMockApplication(selection)}
                    className="rounded px-3 py-1 text-l font-bold bg-orange-600 text-white"
                  >
                    모의지원
                  </button> */}
                </td>
              </tr>
      );
    })}          
    </tbody>
        </table>
          ) : (
            <div>
            <UniversityComponent />
            </div>
        )}
      </div>
    </div>
  );
};

export default Detail;
