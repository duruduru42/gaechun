"use client";

import { useState, useEffect, Suspense, memo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from "@/utils/supabase/client";

// 대학별 계산기 임포트 (기존 임포트문 유지)
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

// --- [컴포넌트 1: 개별 학과 카드] ---
const DeptCard = memo(({ dept, studentId, calculatedScore, onCalculate, onSelect, allAppliedData, isDGroup }) => {
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    if (!calculatedScore && !isCalculating && dept?.name) {
      const calculate = async () => {
        setIsCalculating(true);
        const calculator = scoreCalculators[dept.name.trim()];
        if (calculator) {
          try {
            const score = await calculator(studentId, dept, true);
            onCalculate(dept.id, score);
          } catch (e) { console.error(e); }
        }
        setIsCalculating(false);
      };
      calculate();
    }
  }, [dept.id, studentId, calculatedScore]);

  // sum=y 통합 확정 인원 계산 로직
  let competitors = [];
  if (dept.sum === 'y') {
    const baseId = String(dept.university_id).replace(/[12]$/, '');
    competitors = allAppliedData.filter(a => 
      a.status === '확정' && 
      a.departments?.모집단위 === dept.모집단위 && 
      String(a.departments?.university_id).replace(/[12]$/, '') === baseId
    );
  } else {
    competitors = allAppliedData.filter(a => a.department_id === dept.id && a.status === '확정');
  }

  const confirmedCount = competitors.length;
  const betterCompetitors = calculatedScore 
    ? competitors.filter(a => (Number(a.converted_score) || 0) > calculatedScore).length 
    : 0;
  const capacity = Math.round((dept.모집인원 || 0) * 0.5);
  const isFull = !isDGroup && calculatedScore && betterCompetitors >= capacity;

  return (
    <div 
      onClick={() => !isFull && onSelect(dept, calculatedScore, isFull)}
      className={`p-7 rounded-[32px] border transition-all flex justify-between items-center group ${isFull ? 'bg-gray-100 opacity-50 cursor-not-allowed' : 'bg-white border-gray-100 hover:border-blue-300 cursor-pointer shadow-sm'}`}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="text-[10px] font-black text-blue-500 uppercase">{dept.name}</p>
          {dept.sum === 'y' && <span className="text-[9px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded font-black">통합</span>}
        </div>
        <p className="text-xl font-black text-gray-800">{dept.모집단위}</p>
        <div className="flex items-center gap-3 mt-1">
          <p className="text-xs font-bold text-gray-400">모집: {dept.모집인원}명</p>
          {!isDGroup && (
            <p className={`text-xs font-bold ${isFull ? 'text-red-500' : 'text-blue-600'}`}>
              확정 {confirmedCount}명 / 제한 {capacity}명
            </p>
          )}
        </div>
      </div>
      <div className="text-right flex items-center gap-8">
        <div>
          <p className="text-[9px] font-black text-gray-400 uppercase">My Score</p>
          <p className="text-3xl font-black text-blue-600 italic">{isCalculating ? "..." : (calculatedScore || '---')}</p>
        </div>
        {isFull ? <span className="bg-red-50 text-red-600 px-5 py-3 rounded-2xl text-[11px] font-black">성적마감</span> : 
        <div className="bg-gray-900 text-white group-hover:bg-blue-600 px-7 py-4 rounded-2xl text-xs font-black transition-all">선택</div>}
      </div>
    </div>
  );
});

// --- [컴포넌트 2: 메인 페이지] ---
function PriorityContent() {
  const searchParams = useSearchParams();
  const studentId = searchParams.get('studentId');
  const router = useRouter();
  const supabase = createClient();

  const [studentInfo, setStudentInfo] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [allAppliedData, setAllAppliedData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSelection, setActiveSelection] = useState({ group: '가', priority: 1 });
  const [calculatedScores, setCalculatedScores] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [choices, setChoices] = useState({ '가': {1:null, 2:null, 3:null}, '나': {1:null, 2:null, 3:null}, '다': {1:null, 2:null, 3:null} });

  useEffect(() => {
    if (studentId) fetchInitialData();
  }, [studentId]);

  const fetchInitialData = async () => {
    const { data: student } = await supabase.from('admin_managed_students').select('*').eq('id', studentId).single();
    if (!student) return;
    setStudentInfo(student);

    // Pagination Fetch
    let allDepts = [];
    let from = 0;
    while(true) {
      const { data } = await supabase.from('departments').select('*').range(from, from + 999);
      if(!data || data.length === 0) break;
      allDepts = [...allDepts, ...data];
      from += 1000;
    }

    const suffix = student.selection_type === '기회균형전형' ? '1' : student.selection_type === '농어촌전형' ? '2' : '';
    setDepartments(suffix ? allDepts.filter(d => String(d.university_id || '').endsWith(suffix)) : allDepts);

    const { data: globalChoices } = await supabase.from('student_choices').select('*, departments(*)').range(0, 2500);
    setAllAppliedData(globalChoices || []);

    const { data: myExisting } = await supabase.from('student_choices').select('*, departments(*)').eq('student_id', studentId);
    if (myExisting) {
      const loaded = { '가': {1:null, 2:null, 3:null}, '나': {1:null, 2:null, 3:null}, '다': {1:null, 2:null, 3:null} };
      myExisting.forEach(c => {
        if (c.group_type && c.priority) {
          loaded[c.group_type][c.priority] = { ...c.departments, id: c.department_id, score: c.converted_score, status: c.status };
        }
      });
      setChoices(loaded);
    }
  };

  const renderStatusBadge = (status) => {
    const styles = { '확정': 'bg-blue-100 text-blue-700 border-blue-200', '보류': 'bg-yellow-100 text-yellow-700 border-yellow-200', '변경': 'bg-red-100 text-red-700 border-red-200' };
    return <span className={`text-[9px] px-2 py-0.5 rounded-full border font-black ml-1.5 ${styles[status] || 'bg-gray-100'}`}>{status || '대기'}</span>;
  };

  // --- [마스터 알고리즘: 전 수험생 재배정] ---
// --- [마스터 알고리즘: 전 수험생 재배정] ---
const reorderAllStudents = async () => {
  const { data: allChoices } = await supabase.from('student_choices').select('*, departments(*)').range(0, 2500);
  if (!allChoices) return;

  // 1. 학과별 그룹화 (sum=y 통합 로직 포함)
  const deptGroups = allChoices.reduce((acc, curr) => {
    const dId = curr.department_id;
    if (!acc[dId]) acc[dId] = [];
    
    // 해당 학과에 신청한 모든 데이터를 일단 수집
    if (curr.departments?.sum === 'y') {
      const base = String(curr.departments.university_id).replace(/[12]$/, '');
      const relatives = allChoices.filter(o => 
        o.departments?.모집단위 === curr.departments.모집단위 && 
        String(o.departments?.university_id).replace(/[12]$/, '') === base
      );
      acc[dId] = relatives;
    } else {
      acc[dId] = allChoices.filter(o => o.department_id === dId);
    }
    return acc;
  }, {});

  // 2. 학생별로 지망 리스트 그룹화
  const stdMap = allChoices.reduce((acc, curr) => {
    if (!acc[curr.student_id]) acc[curr.student_id] = { '가': [], '나': [], '다': [] };
    acc[curr.student_id][curr.group_type].push(curr);
    return acc;
  }, {});

  const updatePayload = new Map();

  // 3. 재배정 로직 실행
  for (const sId in stdMap) {
    ['가', '나', '다'].forEach(group => {
      const sortedChoices = stdMap[sId][group].sort((a, b) => a.priority - b.priority);
      let hasConfirmedInGroup = false; // 해당 군(가,나,다)에서 이미 확정된 지망이 있는지 체크

      sortedChoices.forEach(choice => {
        // [핵심 수정 부분]: '확정' 상태인 경쟁자들만 필터링 (나 자신 포함)
        const competitors = (deptGroups[choice.department_id] || []).filter(user => 
          user.status === '확정' || user.id === choice.id
        );

        // 중복 제거 후 점수 순 정렬
        const sortedComp = Array.from(new Set(competitors.map(JSON.stringify)))
          .map(JSON.parse)
          .sort((a, b) => Number(b.converted_score) - Number(a.converted_score));

        // 내 등수 계산
        const rank = sortedComp.findIndex(x => x.id === choice.id);
        const cap = Math.round((choice.departments?.모집인원 || 0) * 0.5);

        // '다'군은 순위 제한 없음, 그 외는 정원 내(rank < cap)여야 함
        const isRankEligible = choice.departments?.군 === '다' || (rank !== -1 && rank < cap);

        if (!hasConfirmedInGroup && isRankEligible) {
          // 1) 아직 이 군에서 확정된 상위지망이 없고 + 성적이 정원 내라면 -> '확정'
          updatePayload.set(choice.id, '확정');
          hasConfirmedInGroup = true; 
        } else if (!isRankEligible) {
          // 2) 성적 자체가 확정자들 사이에서 밀려난다면 -> '변경' (보류는 고려하지 않음)
          updatePayload.set(choice.id, '변경');
        } else {
          // 3) 성적은 정원 내이지만, 이미 상위 우선순위에서 확정되었다면 -> '보류'
          updatePayload.set(choice.id, '보류');
        }
      });
    });
  }

  // 4. DB 일괄 업데이트
  const promises = Array.from(updatePayload).map(([id, status]) => 
    supabase.from('student_choices').update({ status }).eq('id', id)
  );
  await Promise.all(promises);
};

const savePriorities = async () => {
  setIsProcessing(true);
  try {
    const insertData = [];
    for (const group in choices) {
      const seenInThisGroup = new Set();
      
      // 1순위부터 3순위까지 순회하며 데이터 준비
      for (const p of [1, 2, 3]) {
        const item = choices[group][p];
        if (item) {
          if (!seenInThisGroup.has(item.id)) {
            insertData.push({ 
              student_id: studentId, 
              group_type: group, 
              priority: parseInt(p), 
              department_id: item.id, 
              converted_score: parseFloat(item.score) || 0, 
              // 초기 상태는 '보류'나 '대기'로 넣어도 reorderAllStudents가 정렬해줍니다.
              status: '보류' 
            });
            seenInThisGroup.add(item.id);
          }
        }
      }
    }
    
    // 1. 기존 내 선택 삭제
    await supabase.from('student_choices').delete().eq('student_id', studentId);
    
    // 2. 새로운 선택 저장
    if (insertData.length > 0) {
      await supabase.from('student_choices').insert(insertData);
    }

    // 3. [핵심] 수정된 로직으로 전체 수험생 상태 재배정
    // 이 함수 안에서 '확정' 인원 기준으로 '변경' 여부를 판단합니다.
    await reorderAllStudents();
    
    alert("지망 리스트 저장 및 배정 알고리즘이 완료되었습니다.");
    router.push('/admin/students');
  } catch (e) { 
    console.error(e);
    alert("오류 발생: " + e.message); 
  } finally {
    setIsProcessing(false);
  }
};

  const handleDeptSelect = useCallback((dept, score) => {
    setChoices(prev => ({
      ...prev,
      [activeSelection.group]: { ...prev[activeSelection.group], [activeSelection.priority]: { ...dept, score, status: '대기' } }
    }));
  }, [activeSelection]);

  const onCalculate = useCallback((id, score) => {
    setCalculatedScores(prev => ({ ...prev, [id]: score }));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-[1440px] h-[88vh] flex gap-8">
        
        {/* LEFT: STUDENT CHOICES */}
        <div className="w-[420px] shrink-0 bg-white shadow-2xl rounded-[40px] p-10 flex flex-col border border-gray-100 relative">
          {isProcessing && <div className="absolute inset-0 bg-white/80 z-50 flex flex-col items-center justify-center rounded-[40px]"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div><p className="font-black text-blue-600">알고리즘 계산 중...</p></div>}
          
          <div className="mb-8">
            <h1 className="text-3xl font-black text-gray-900 leading-tight">{studentInfo?.student_name}</h1>
            <p className="text-blue-600 font-bold text-xs mt-1 uppercase tracking-widest">{studentInfo?.selection_type}</p>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {['가', '나', '다'].map(group => (
              <div key={group} className="mb-8">
                <h2 className="text-lg font-black text-gray-800 mb-4 flex items-center gap-2"><div className="w-1.5 h-4 bg-blue-600 rounded-full"/>{group}군 지망</h2>
                {[1, 2, 3].map(p => (
                  <div key={p} onClick={() => setActiveSelection({ group, priority: p })} className={`p-4 mb-2 rounded-2xl border-2 cursor-pointer transition-all ${activeSelection.group === group && activeSelection.priority === p ? 'border-blue-600 bg-blue-50' : 'border-gray-50 bg-white hover:border-gray-200'}`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[9px] font-black text-gray-400 uppercase">Choice 0{p}</span>
                      {choices[group][p] && <div className="flex items-center">{renderStatusBadge(choices[group][p].status)}<span className="text-blue-700 font-black text-[10px] ml-2">{choices[group][p].score}점</span></div>}
                    </div>
                    <p className={`font-black text-sm truncate ${choices[group][p] ? 'text-gray-900' : 'text-gray-300'}`}>{choices[group][p] ? `[${choices[group][p].name}] ${choices[group][p].모집단위}` : '선택해주세요'}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <button onClick={savePriorities} className="w-full bg-gray-900 text-white py-5 rounded-[24px] font-black text-lg hover:bg-blue-600 transition-all shadow-xl">지망 리스트 확정</button>
            <button onClick={reorderAllStudents} className="w-full bg-blue-50 text-blue-600 py-3 rounded-xl font-bold text-xs hover:bg-blue-100 transition-all border border-blue-100 uppercase tracking-widest">Master Reorder (전체 동기화)</button>
          </div>
        </div>

        {/* RIGHT: SEARCH */}
        <div className="flex-1 bg-white shadow-2xl rounded-[40px] p-10 flex flex-col border border-gray-100 overflow-hidden">
          <div className="mb-8">
            <div className="flex justify-between items-end mb-6">
                <h2 className="text-3xl font-black text-gray-900"><span className="text-blue-600">{activeSelection.group}군</span> 학과 검색</h2>
                <p className="text-[10px] font-bold text-gray-400">모집인원 상위 50% 이내만 확정 가능</p>
            </div>
            <input type="text" placeholder="대학명 또는 학과명을 입력하세요..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-6 bg-gray-50 border-2 border-transparent rounded-[28px] focus:bg-white focus:border-blue-600 outline-none font-bold shadow-inner" />
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {departments.filter(d => d.군 === activeSelection.group && (d.name?.includes(searchTerm) || d.모집단위?.includes(searchTerm))).map(dept => (
              <DeptCard 
                key={dept.id} dept={dept} studentId={studentId} 
                calculatedScore={calculatedScores[dept.id]} 
                onCalculate={onCalculate} onSelect={handleDeptSelect} 
                allAppliedData={allAppliedData} isDGroup={dept.군 === '다'} 
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default function SetPriorityPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen font-black text-2xl text-blue-600 animate-pulse italic">SYSTEM BOOTING...</div>}>
      <PriorityContent />
    </Suspense>
  );
}