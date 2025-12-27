"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from "@/utils/supabase/client";

// 대학별 계산기 임포트
import { 서울대학교 } from '@/components/대학점수/서울대학교';
import { 고려대학교 } from '@/components/대학점수/고려대학교';
import { 연세대학교 } from '@/components/대학점수/연세대학교';
import { 서강대학교 } from '@/components/대학점수/서강대학교';
import { 한양대학교 } from '@/components/대학점수/한양대학교';
import { 중앙대학교 } from '@/components/대학점수/중앙대학교';
import { 경희대학교 } from '@/components/대학점수/경희대학교';
import { 경희대학교국제 } from '@/components/대학점수/경희대학교국제';
import { 한국외국어대학교서울 } from '@/components/대학점수/한국외국어대학교';
import { 한국외국어대학교글로벌 } from '@/components/대학점수/한국외국어대학교글로벌';
import { 서울시립대학교 } from '@/components/대학점수/서울시립대학교';
import { 건국대학교 } from '@/components/대학점수/건국대학교';
import { 동국대학교 } from '@/components/대학점수/동국대학교';
import { 홍익대학교 } from '@/components/대학점수/홍익대학교';
import { 홍익대학교세종 } from '@/components/대학점수/홍익대학교세종';
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
import { 고려대학교세종} from '@/components/대학점수/고려대학교세종';
import { 한양대학교에리카} from '@/components/대학점수/한양대학교에리카';
import { 한국공학대학교 } from '@/components/대학점수/한국공학대학교';
import { 한국항공대학교 } from '@/components/대학점수/한국항공대학교';
import { 인하대학교 } from '@/components/대학점수/인하대학교';
import { 경인교육대학교 } from '@/components/대학점수/경인교육대학교';
import { 대구교육대학교 } from '@/components/대학점수/대구교육대학교';
import { 경기대학교 } from '@/components/대학점수/경기대학교';
import { 충북대학교 } from '@/components/대학점수/충북대학교';
import { 계명대학교 } from '@/components/대학점수/계명대학교';
import { 성균관대학교 } from '@/components/대학점수/성균관대학교';

const scoreCalculators = {
  '서울대학교': 서울대학교,
  '연세대학교': 연세대학교,
  '고려대학교': 고려대학교,
  '서강대학교': 서강대학교,
  '한양대학교': 한양대학교,
  '중앙대학교' : 중앙대학교,
  '경희대학교' : 경희대학교,
  '경희국제' : 경희대학교국제,
  '한국외대' : 한국외국어대학교서울,
  '외대글로벌' : 한국외국어대학교글로벌,
  '서울시립대' : 서울시립대학교,
  '건국대학교' : 건국대학교,
  '동국대학교' : 동국대학교,
  '홍익대' : 홍익대학교,
  '홍익세종' : 홍익대학교세종,
  '숭실대학교' : 숭실대학교,
  '세종대학교' : 세종대학교, 
  '광운대학교' : 광운대학교,
  '삼육대학교' : 삼육대학교,
  '상명대학교' : 상명대학교,
  '인천대학교' : 인천대학교,
  '아주대학교' : 아주대학교,
  '동덕여대' : 동덕여자대학교,
  '성신여대' : 성신여자대학교,
  '숙명여대' : 숙명여자대학교,
  '이화여대' : 이화여자대학교,
  '고려세종' : 고려대학교세종,  
  '한양에리카' : 한양대학교에리카,
  '공학대' : 한국공학대학교,
  '항공대' : 한국항공대학교,
  '인하대학교' : 인하대학교,  
  '경인교대' : 경인교육대학교,
  '대구교대' : 대구교육대학교,
  '경기대학교' : 경기대학교,
  '충북대학교' : 충북대학교,
  '계명대학교' : 계명대학교,
  '성균관대' : 성균관대학교,
};



function PriorityContent() {
  const searchParams = useSearchParams();
  const studentId = searchParams.get('studentId');
  const selectionTypeParam = searchParams.get('type');
  const router = useRouter();
  const supabase = createClient();

  
  const [studentInfo, setStudentInfo] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [allAppliedData, setAllAppliedData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSelection, setActiveSelection] = useState({ group: '가', priority: 1 });
  const [calculatedScores, setCalculatedScores] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  
  
  const [choices, setChoices] = useState({
    '가': { 1: null, 2: null, 3: null },
    '나': { 1: null, 2: null, 3: null },
    '다': { 1: null, 2: null, 3: null }
  });

  useEffect(() => {
    if (!studentId) {
      alert("학생 정보가 없습니다.");
      router.push('/admin/students');
      return;
    }
    fetchInitialData();
  }, [studentId, selectionTypeParam]); // type 파라미터가 바뀌면 다시 로드

  useEffect(() => {
    if (studentId && departments.length > 0) {
      runCalculation();
    }
  }, [studentId, departments]);

  const fetchInitialData = async () => {
    // 1. 학생 기본 정보 로드
    const { data: student, error: studentError } = await supabase
      .from('admin_managed_students')
      .select('*')
      .eq('id', studentId)
      .single();

      
    if (studentError || !student) {
      console.error("학생 정보 로드 실패:", studentError);
      return;
    }

    
    setStudentInfo(student);

    // 2. [핵심] 파라미터로 받은 전형(type)을 기준으로 학과 데이터 필터링 로드
    // URL에 type이 있으면 그 값을 쓰고, 없으면 학생 DB의 전형 정보를 기본값으로 사용합니다.
    const targetType = selectionTypeParam || student.selection_type;
    
    // suffix 로직 (기존 호환성 유지)
    const suffix = targetType === '기회균형전형' ? '1' : targetType === '농어촌전형' ? '2' : '';

    const { data: deptData, error: deptError } = await supabase
      .from('departments')
      .select('*')
      .order('name', { ascending: true });

    if (deptError || !deptData) {
      console.error("학과 정보 로드 실패:", deptError);
      return;
    }

    // 3. 필터링 로직: university_id 접미사 매칭 (또는 필요시 selection_type 컬럼 직접 매칭 가능)
    const filteredByType = suffix 
      ? deptData.filter(d => String(d.university_id || '').endsWith(suffix)) 
      : deptData;

    console.log(`[필터링] 대상 전형: ${targetType}, 결과 수: ${filteredByType.length}`);
    setDepartments(filteredByType);

    // 4. 지망 현황 데이터 로드
    const { data: globalChoices } = await supabase
      .from('student_choices')
      .select('*, departments(university_id, 모집단위, sum)');
    setAllAppliedData(globalChoices || []);

    const { data: myExisting } = await supabase
      .from('student_choices')
      .select('*, departments(*)')
      .eq('student_id', studentId);

    if (myExisting) {
      const loaded = { '가': { 1: null, 2: null, 3: null }, '나': { 1: null, 2: null, 3: null }, '다': { 1: null, 2: null, 3: null } };
      myExisting.forEach(c => {
        if (c.group_type && c.priority && c.departments) {
          loaded[c.group_type][c.priority] = { 
            ...c.departments, 
            id: c.department_id, 
            score: c.converted_score, 
            status: c.status 
          };
        }
      });
      setChoices(loaded);
    }
  };
  const runCalculation = async () => {
    const scores = {};
    const deptGroups = {};
    departments.forEach(d => {
      const key = `${d.name}-${d.계열}`;
      if (!deptGroups[key]) deptGroups[key] = [];
      deptGroups[key].push(d);
    });

    for (const key in deptGroups) {
      const group = deptGroups[key];
      if (!group || group.length === 0) continue;
      const ref = group[0];
      if (!ref?.name) continue;

      const calculateScore = scoreCalculators[ref.name.trim()];
      if (calculateScore) {
        try {
          const score = await calculateScore(studentId, ref, true); 
          group.forEach(d => { scores[d.id] = score; });
        } catch (e) { console.error(e); }
      }
    }
    setCalculatedScores(scores);
  };

  const renderStatusBadge = (status) => {
    const statusStyles = {
      '확정': 'bg-blue-100 text-blue-700 border-blue-200',
      '보류': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      '변경': 'bg-red-100 text-red-700 border-red-200',
    };
    const style = statusStyles[status] || 'bg-gray-100 text-gray-500 border-gray-200';
    return (
      <span className={`text-[9px] px-2 py-0.5 rounded-full border font-black ml-1.5 ${style}`}>
        {status || '대기'}
      </span>
    );
  };

  const reorderAllStudents = async () => {
    const { data: allChoices } = await supabase.from('student_choices').select('*, departments(id, 모집인원, 군, university_id, 모집단위, sum)');
    if (!allChoices) return;

    const deptGroups = allChoices.reduce((acc, curr) => {
      const deptId = curr.department_id;
      if (!acc[deptId]) acc[deptId] = [];
      acc[deptId].push(curr);

      if (curr.departments?.sum === 'y') {
        const currentBase = String(curr.departments.university_id || '').replace(/[12]/, '');
        allChoices.forEach(other => {
          if (other.id !== curr.id && 
              other.departments?.모집단위 === curr.departments?.모집단위 &&
              String(other.departments?.university_id || '').replace(/[12]/, '') === currentBase) {
            acc[deptId].push(other);
          }
        });
      }
      return acc;
    }, {});

    const studentChoicesMap = allChoices.reduce((acc, curr) => {
      if (!acc[curr.student_id]) acc[curr.student_id] = { 가: [], 나: [], 다: [] };
      acc[curr.student_id][curr.group_type].push(curr);
      return acc;
    }, {});

    const updatePayload = new Map();

    for (const stdId in studentChoicesMap) {
      const studentGroups = studentChoicesMap[stdId];
      ['가', '나', '다'].forEach(group => {
        const choicesInGroup = studentGroups[group].sort((a, b) => a.priority - b.priority);
        let groupHasConfirmed = false;

        choicesInGroup.forEach(choice => {
          const isDGroup = choice.departments?.군 === '다';
          const competitors = Array.from(new Set(deptGroups[choice.department_id] || []))
            .sort((a, b) => (Number(b.converted_score) || 0) - (Number(a.converted_score) || 0));
          
          const myRank = competitors.findIndex(x => x.id === choice.id);
          const capacity = Math.round((choice.departments?.모집인원 || 0) * 0.5);

          const isEligible = isDGroup || myRank < capacity;

          if (!groupHasConfirmed && isEligible) {
            updatePayload.set(choice.id, '확정');
            groupHasConfirmed = true;
          } else if (!isEligible) {
            updatePayload.set(choice.id, '변경');
          } else {
            updatePayload.set(choice.id, '보류');
          }
        });
      });
    }

    for (const [id, status] of updatePayload) {
      await supabase.from('student_choices').update({ status }).eq('id', id);
    }
  };

  const savePriorities = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    const insertData = [];
    const seenDepts = new Set();

    for (const group of ['가', '나', '다']) {
      for (const priority of [1, 2, 3]) {
        const item = choices[group][priority];
        if (item && !seenDepts.has(`${group}-${item.id}`)) {
          insertData.push({
            student_id: studentId,
            group_type: group,
            priority: priority,
            department_id: item.id,
            converted_score: parseFloat(item.score) || 0,
            status: '보류'
          });
          seenDepts.add(`${group}-${item.id}`);
        }
      }
    }

    try {
      await supabase.from('student_choices').delete().eq('student_id', studentId);
      if (insertData.length > 0) await supabase.from('student_choices').insert(insertData);
      await reorderAllStudents();
      alert("배정 알고리즘 및 저장이 완료되었습니다.");
      router.push('/admin/students');
    } catch (e) {
      alert("오류 발생");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeptSelect = (dept) => {
    const score = calculatedScores[dept.id] || 0;
    setChoices(prev => ({
      ...prev,
      [activeSelection.group]: { 
        ...prev[activeSelection.group], 
        [activeSelection.priority]: { ...dept, score, status: '대기' } 
      }
    }));
  };

  const filteredList = (departments || []).filter(d => {
    // 탭에서 선택한 군(가/나/다)과 학과의 군이 일치해야 함
    const isGroupMatch = d?.군 === activeSelection.group;
    const univName = d?.name || '';
    const deptName = d?.모집단위 || '';
    const isSearchMatch = univName.includes(searchTerm) || deptName.includes(searchTerm);
    return isGroupMatch && isSearchMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 md:p-12 font-sans">
      <div className="w-full max-w-[1440px] h-[88vh] flex gap-8">
        
        {/* LEFT: STUDENT STATUS */}
        <div className="w-[420px] shrink-0 bg-white shadow-2xl rounded-[40px] p-10 flex flex-col border border-gray-100 relative overflow-hidden">
          {isProcessing && (
            <div className="absolute inset-0 bg-white/90 z-50 flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="font-black text-blue-600">배정 최적화 진행 중...</p>
            </div>
          )}
          
          <div className="mb-10">
            <h1 className="text-3xl font-black text-gray-900 leading-tight">{studentInfo?.student_name || '로딩 중...'}</h1>
            <div className="mt-3 flex gap-2">
              <span className="bg-blue-600 text-white px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest">{studentInfo?.selection_type}</span>
              <span className="bg-gray-100 text-gray-500 px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest">관리자 모드</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {['가', '나', '다'].map(group => (
              <div key={group} className="mb-10">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-2 h-6 bg-blue-600 rounded-full" />
                  <h2 className="text-xl font-black text-gray-800">{group}군</h2>
                </div>
                {[1, 2, 3].map(p => (
                  <div 
                    key={p} 
                    onClick={() => setActiveSelection({ group, priority: p })}
                    className={`p-5 mb-3 rounded-[24px] border-2 cursor-pointer transition-all ${activeSelection.group === group && activeSelection.priority === p ? 'border-blue-600 bg-blue-50' : 'border-gray-50'}`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center">
                        <span className="text-[10px] font-black text-gray-400">CHOICE 0{p}</span>
                        {choices[group][p] && renderStatusBadge(choices[group][p].status)}
                      </div>
                      {choices[group][p] && <span className="text-blue-700 font-black text-xs">{choices[group][p].score}점</span>}
                    </div>
                    <p className={`font-black text-sm truncate ${choices[group][p] ? 'text-gray-900' : 'text-gray-300'}`}>
                      {choices[group][p] ? `[${choices[group][p].name || choices[group][p].university_name}] ${choices[group][p].모집단위 || choices[group][p].department_name}` : '대학을 선택해주세요'}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <button onClick={savePriorities} disabled={isProcessing} className="w-full bg-gray-900 text-white py-6 rounded-[28px] font-black text-lg hover:bg-blue-600 transition-all mt-4">지망 리스트 확정</button>
        </div>

        {/* RIGHT: UNIVERSITY SEARCH */}
        <div className="flex-1 bg-white shadow-2xl rounded-[40px] p-10 flex flex-col border border-gray-100 overflow-hidden">
          <div className="mb-8">
            <h2 className="text-3xl font-black text-gray-900 mb-6"><span className="text-blue-600">{activeSelection.group}군</span> 검색</h2>
            <input 
              type="text" placeholder="대학 또는 학과 검색..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-6 bg-gray-50 border-2 border-transparent rounded-[28px] focus:bg-white focus:border-blue-600 outline-none font-bold shadow-inner"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {filteredList.map(dept => {
              const myScore = calculatedScores[dept.id] || 0;
              const isDGroup = dept.군 === '다';
              
              let confirmedCount = 0;
              let betterCompetitors = 0;

              if (dept.sum === 'y') {
                const currentBase = String(dept.university_id || '').replace(/[12]/, '');
                const integratedApps = allAppliedData.filter(a => 
                  a.status === '확정' &&
                  a.departments?.모집단위 === dept.모집단위 &&
                  String(a.departments?.university_id || '').replace(/[12]/, '') === currentBase
                );
                confirmedCount = integratedApps.length;
                betterCompetitors = integratedApps.filter(a => (Number(a.converted_score) || 0) > myScore).length;
              } else {
                const standardApps = allAppliedData.filter(a => a.department_id === dept.id && a.status === '확정');
                confirmedCount = standardApps.length;
                betterCompetitors = standardApps.filter(a => (Number(a.converted_score) || 0) > myScore).length;
              }
              
              const capacity = Math.round((dept.모집인원 || 0) * 0.5);
              const isFull = !isDGroup && betterCompetitors >= capacity;

              return (
                <div 
                  key={dept.id} onClick={() => !isFull && handleDeptSelect(dept)}
                  className={`p-7 rounded-[32px] border transition-all flex justify-between items-center group ${isFull ? 'bg-gray-100 opacity-50 cursor-not-allowed' : 'bg-white border-gray-100 hover:border-blue-300 cursor-pointer'}`}
                >
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-blue-500 uppercase">{dept.name}</p>
                    <p className="text-xl font-black text-gray-800">
                      {dept.모집단위}
                      {dept.sum === 'y' && <span className="ml-2 text-[9px] bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">통합모집</span>}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-xs font-bold text-gray-400">모집인원: {dept.모집인원}명</p>
                      {!isDGroup && (
                        <p className={`text-xs font-bold ${isFull ? 'text-red-500' : 'text-blue-600'}`}>
                          확정 {confirmedCount}명 / 제한 {capacity}명
                        </p>
                      )}
                      {isDGroup && <p className="text-xs font-bold text-green-600">제한 없음</p>}
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-8">
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase">My Score</p>
                      <p className="text-3xl font-black text-blue-600 italic">{myScore || '---'}</p>
                    </div>
                    {isFull ? <span className="bg-red-50 text-red-600 px-5 py-3 rounded-2xl text-[11px] font-black">성적순 마감</span> : 
                    <div className="bg-gray-900 text-white group-hover:bg-blue-600 px-7 py-4 rounded-2xl text-xs font-black transition-all shadow-lg">선택하기</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SetPriorityPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen font-black text-2xl text-blue-600 animate-pulse">시스템 초기화 중...</div>}>
      <PriorityContent />
    </Suspense>
  );
}