'use client'

import Image from 'next/image';
import 국어 from '@/components/국어.svg';
import 수학 from '@/components/수학.svg';
import 탐구 from '@/components/탐구.svg';
import 합 from '@/components/합.svg';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import LoadingSpinner from '@/components/ui/LoadingSpinner'; // Adjust the filename accordingly
import { useRouter } from 'next/navigation';


export default function Home() {
    const supabase = createClient();
    const router = useRouter(null);
    const [user, setUser] = useState(null);
    const [koreanRank, setKoreanRank] = useState(null);
    const [mathRank, setMathRank] = useState(null);
    const [scienceRank, setScienceRank] = useState(null);
    const [totalRank, setTotalRank] = useState(null);
    const [totalUsers, setTotalUsers] = useState(null);
    const [topUniversities, setTopUniversities] = useState([]);
    const [currentGunTopUniversities, setCurrentGunTopUniversities] = useState('가');
    const [userPriorities, setUserPriorities] = useState([]);
    const [currentGunUserPriorities, setCurrentGunUserPriorities] = useState('가');
    const [isLoadingUserPriorities, setIsLoadingUserPriorities] = useState(false);
    const [isLoadingTopUniversities, setIsLoadingTopUniversities] = useState(false);
    
    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        if (user) {
            fetchRankAndTotalUsers();
            fetchTopUniversities(currentGunTopUniversities);
        }
    }, [user, currentGunTopUniversities]);

    useEffect(() => {
        if (user) {
            fetchUserPriorities(currentGunUserPriorities);
        }
    }, [user, currentGunUserPriorities]);

    const fetchUser = async () => {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
            console.error('Error fetching user session:', error);
            return;
        }
        if (session) {
            console.log('User session:', session);
            setUser(session.user);
        } else {
            console.log('No user session found');
        }
    };

    const truncateText = (text, maxLength) => {
        if (!text || text.length <= maxLength) return text;
        return `${text.substring(0, maxLength)}...`;
      };

      const calculateRank = (sortedResults, userId, scoreExtractor) => {
        let rank = 1;
        let previousScore = scoreExtractor(sortedResults[0]);
        let userRank = null;
    
        for (let i = 0; i < sortedResults.length; i++) {
            const currentScore = scoreExtractor(sortedResults[i]);
    
            // 동점이 아니면 현재 인덱스에 맞는 순위로 업데이트
            if (currentScore !== previousScore) {
                rank = i + 1;
            }
    
            // 유저의 순위를 찾으면 저장
            if (sortedResults[i].user_id === userId) {
                userRank = rank;
                break;
            }
    
            previousScore = currentScore;
        }
    
        return userRank;
    };
    
    const fetchRankAndTotalUsers = async () => {
        const { data: results, error } = await supabase
            .from('exam_results')
            .select('id, user_id, standard_score_korean, standard_score_math, standard_score_science1, standard_score_science2, noRank')
            .order('standard_score_korean', { ascending: false });
    
        if (error) {
            console.error('Error fetching exam results:', error);
            return;
        }
    
        if (results) {
            // noRank가 'y'가 아닌 데이터만 필터링
            const filteredResults = results.filter((result) => result.noRank !== 'y');
            const total = filteredResults.length;
    
            const koreanResults = [...filteredResults].sort((a, b) => b.standard_score_korean - a.standard_score_korean);
            const koreanRank = calculateRank(koreanResults, user.id, (result) => result.standard_score_korean);
    
            const mathResults = [...filteredResults].sort((a, b) => b.standard_score_math - a.standard_score_math);
            const mathRank = calculateRank(mathResults, user.id, (result) => result.standard_score_math);
    
            const scienceResults = [...filteredResults].sort((a, b) => 
                (b.standard_score_science1 + b.standard_score_science2) - (a.standard_score_science1 + a.standard_score_science2)
            );
            const scienceRank = calculateRank(scienceResults, user.id, (result) => result.standard_score_science1 + result.standard_score_science2);
    
            const totalResults = [...filteredResults].sort((a, b) => 
                (b.standard_score_korean + b.standard_score_math + b.standard_score_science1 + b.standard_score_science2) - 
                (a.standard_score_korean + a.standard_score_math + a.standard_score_science1 + a.standard_score_science2)
            );
            const totalRank = calculateRank(totalResults, user.id, (result) => 
                result.standard_score_korean + result.standard_score_math + result.standard_score_science1 + result.standard_score_science2
            );
    
            setTotalUsers(total + 13);
            setKoreanRank(koreanRank + 1);
            setMathRank(mathRank);
            setScienceRank(scienceRank);
            setTotalRank(totalRank);
        }
    };
    
    

    const fetchTopUniversities = async (gun) => {
        if (isLoadingTopUniversities) return; // 이미 로딩 중이라면 함수 실행을 막음
        setIsLoadingTopUniversities(true);
    
        try {
            // applications 데이터 가져오기
            const { data: applications, error: applicationsError } = await supabase
                .from('applications')
                .select(`
                    university_id,
                    departments!inner(name, 계열, 군, university:university_id(logo_url))
                `)
                .eq('departments.군', gun); // 특정 군에 해당하는 데이터 필터링
    
            if (applicationsError || !applications) {
                console.error('Error fetching applications:', applicationsError);
                return;
            }
    
            // name 기준으로 지원자 수 계산
            const universityCounts = {};
            applications.forEach((app) => {
                const { name } = app.departments;
    
                if (universityCounts[name]) {
                    universityCounts[name] += 1;
                } else {
                    universityCounts[name] = 1;
                }
            });
    
            // 대학별 지원자 수 정렬 및 상위 5개 선택
            const sortedUniversityCounts = Object.entries(universityCounts)
                .sort(([, countA], [, countB]) => countB - countA)
                .slice(0, 5);
    
            // 상위 5개 대학 데이터 매핑
            const topUniversities = sortedUniversityCounts.map(([name, count]) => {
                const matchingApp = applications.find(app => app.departments.name === name);
                if (!matchingApp) return null;
    
                const { 계열, university } = matchingApp.departments;
                return {
                    name,
                    계열,
                    logo_url: university.logo_url,
                    count // 지원자 수 추가
                };
            }).filter(Boolean); // null 데이터 필터링
    
            setTopUniversities(topUniversities); // 상태 업데이트
        } finally {
            setIsLoadingTopUniversities(false);
        }
    };
    
    

    const fetchUserPriorities = async (gun) => {
        if (isLoadingUserPriorities) return;
        setIsLoadingUserPriorities(true);
        try {
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            if (sessionError) {
                console.error('Error fetching user session:', sessionError);
                return;
            }
    
            if (session) {
                const userId = session.user.id;
    
                const { data: priorities, error: prioritiesError } = await supabase
                    .from('priorities')
                    .select('priority, department_id, departments!inner(name, 모집단위, 군, university:university_id(name, logo_url))')
                    .eq('user_id', userId)
                    .eq('departments.군', gun)
                    .order('priority', { ascending: true });
    
                if (prioritiesError) {
                    console.error('Error fetching user priorities:', prioritiesError);
                    return;
                }
    
                const departmentCounts = await Promise.all(priorities.map(async (priority) => {
                    const { data: countData, error: countError } = await supabase
                        .from('applications')
                        .select('department_id, user_id')
                        .eq('department_id', priority.department_id);
    
                    if (countError) {
                        console.error('Error fetching department counts:', countError);
                        return 0;
                    }
    
                    // 모든 user_id를 포함한 지원 인원 수
                    const uniqueUserCount = new Set(countData.map(item => item.user_id)).size;
                    return {
                        ...priority,
                        count: uniqueUserCount
                    };
                }));
                const userPriorityData = departmentCounts.map(priority => ({
                    ...priority,
                    count: priority.count
                }));
    
                setUserPriorities(userPriorityData); // 데이터를 한 번에 업데이트

            }
        } finally {
            setIsLoadingUserPriorities(false); // 로딩 상태 해제
        }
    };
    
    // handleNavigate 함수
    const handleNavigate = (priority) => {
        if (priority) {
            console.log("Selected Department ID:", priority.department_id);
            if (priority.department_id) {
                router.push(`/more?id=${priority.department_id}`);
            } else {
                console.error("department_id is undefined");
            }
        }
    };
    

    const handleGunChangeTopUniversities = async (direction2) => {
        if (isLoadingTopUniversities) return; // 이미 로딩 중이라면 함수 실행을 막음

        const gunOrder2 = ['가', '나', '다'];
        const currentIndex2 = gunOrder2.indexOf(currentGunTopUniversities);
        const newIndex2 = direction2 === 'up2' ? Math.max(currentIndex2 - 1, 0) : Math.min(currentIndex2 + 1, gunOrder2.length - 1);
        const newGun2 = gunOrder2[newIndex2];
        setCurrentGunTopUniversities(newGun2);
        await fetchTopUniversities(newGun2); // 군 변경 시 대학 순위 데이터를 새로 가져오도록 수정
    };
    
    const handleGunChangeUserPriorities = async (direction1) => {
        if (isLoadingUserPriorities) return; // 이미 로딩 중이라면 함수 실행을 막음

        const gunOrder1 = ['가', '나', '다'];
        const currentIndex1 = gunOrder1.indexOf(currentGunUserPriorities);
        const newIndex1 = direction1 === 'up1' ? Math.max(currentIndex1 - 1, 0) : Math.min(currentIndex1 + 1, gunOrder1.length - 1);
        const newGun1 = gunOrder1[newIndex1];
        setCurrentGunUserPriorities(newGun1);
        await fetchUserPriorities(newGun1); // 군 변경 시 데이터 새로 가져오기
    };

    return (
        <div className="flex">
            {/* Main Content */}
            <div className="flex-1 p-5">
                <h1 className="text-3xl font-bold p-5">홈</h1>
                <div className="mb-5 p-4 bg-white rounded-lg shadow-sm cursor-pointer hover:shadow-md">
                    <p><span className='font-bold'>안내 | 12/13</span> 수정권한 리셋</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-5">
                    <div className="p-3 md:p-4 flex flex-col gap-3 bg-white rounded-xl grow cursor-pointer hover:shadow-md">
                        <div>
                            <Image src={국어} alt="korean" className="mb-1" width={30} priority />
                            <div className="text-lg mb-3 font-bold text-neutral-600">국어</div>
                            <div className="text-xs mb-1 text-neutral-600">내 등수 / 전체 인원</div>
                            <div className="text-lg font-bold text-neutral-800">{koreanRank}/{totalUsers }</div>
                        </div>
                    </div>

                    <div className="p-3 md:p-4 flex flex-col gap-3 bg-white rounded-xl grow cursor-pointer hover:shadow-md">
                        <div>
                            <Image src={수학} alt="math" className="mb-1" width={30} priority />
                            <div className="text-lg mb-3 font-bold text-neutral-600">수학</div>
                            <div className="text-xs mb-1 text-neutral-600">내 등수 / 전체 인원</div>
                            <div className="text-lg font-bold text-neutral-800">{mathRank }/{totalUsers}</div>
                        </div>
                    </div>

                    <div className="p-3 md:p-4 flex flex-col gap-3 bg-white rounded-xl grow cursor-pointer hover:shadow-md">
                        <div>
                            <Image src={탐구} alt="science" className="mb-1" width={30} priority />
                            <div className="text-lg mb-3 font-bold text-neutral-600">탐구</div>
                            <div className="text-xs mb-1 text-neutral-600">내 등수 / 전체 인원</div>
                            <div className="text-lg font-bold text-neutral-800">{scienceRank}/{totalUsers}</div>
                        </div>
                    </div>

                    <div className="p-3 md:p-4 flex flex-col gap-3 bg-white rounded-xl grow cursor-pointer hover:shadow-md">
                        <div>
                            <Image src={합} alt="total" className="mb-2" width={30} priority />
                            <div className="text-lg mb-3 font-bold text-neutral-600">표준점수 합</div>
                            <div className="text-xs mb-1 text-neutral-600">내 등수 / 전체 인원</div>
                            <div className="text-lg font-bold text-neutral-800">{totalRank}/{totalUsers}</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="bg-white p-6 w-full rounded-xl">
                <div className="chartjs-size-monitor">
                    <div className="chartjs-size-monitor-expand">
                        <div className=""></div>
                    </div>
                    <div className="chartjs-size-monitor-shrink">
                        <div className=""></div>
                    </div>
                </div>
                <div className="mb-6">
                    <div className="flex justify-between items-center">
                        <h6 className="font-semibold mb-0">내 모의지원 대학</h6>
                        <div className="justify-between flex items-center gap-2 cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" className="w-4 h-4 hover:bg-neutral-100 rounded-full" onClick={() => handleGunChangeUserPriorities('up1')}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"></path>
                            </svg>
                            <span className="inline-block text-sm mb-px ">{currentGunUserPriorities}군</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" className="w-4 h-4 hover:bg-neutral-100 rounded-full" onClick={() => handleGunChangeUserPriorities('down1')}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"></path>
                            </svg>
                        </div>
                    </div>
                </div>
                {isLoadingUserPriorities ? (
                        <LoadingSpinner />
                    ) : (
<div className="bg-white p-6 w-full rounded-xl summaryCard undefined">
    <div className="flex flex-col ">
        <div className="flex gap-5 w-full justify-between text-sm text-neutral-400 h-8 border-0 border-b border-neutral-100 border-solid">
            <div className="w-full justify-center text-center" style={{ maxWidth: '90px' }}>우선순위</div>
            <div className="w-full justify-center text-center" style={{ maxWidth: '160px' }}>대학명</div>
            <div className="w-full justify-center text-center" style={{ maxWidth: 'auto' }}>학과명</div>
            <div className="w-full justify-center text-center" style={{ maxWidth: '120px' }}>지원인원</div>
            <div className="w-full justify-center text-center" style={{ maxWidth: '100px' }}></div>
        </div>
        {userPriorities.map((priority) => (
            <div key={priority.department_id} className="flex gap-5 justify-between text-center h-12 border-b border-neutral-100 border-0 border-solid cursor-pointer hover:bg-neutral-50">
                <div className="w-full flex items-center text-sm justify-center" style={{ maxWidth: '90px' }}>
                    <div className="Base JDflex JDtextColor--default JDflex--center JDflex--vCenter JDflex--column" style={{ position: 'relative' }}>
                        {priority.priority}
                    </div>
                </div>
                <div className="w-full flex items-center text-sm justify-center" style={{ maxWidth: '160px' }}>
                    <img src={priority.departments.university.logo_url} alt="logo" className="w-6 h-6 mr-2 rounded-full" />
                    <div className="line-clamp-1">{priority.departments.university.name}</div>
                </div>
                <div className="w-full flex items-center text-sm justify-center">
                    <div className="flex relative">{truncateText(priority.departments.모집단위,15)}</div>
                </div>
                <div className="w-full flex items-center text-sm justify-center" style={{ maxWidth: '120px' }}>
                    <div className="p-1 justify-center items-center gap-5 inline-flex h-6 px-3 rounded-full">
                        <div className="whitespace-nowrap text-xs lg:text-xs font-semibold">{priority.count}</div>
                    </div>
                </div>
                <div className="w-full flex items-center text-sm justify-center" style={{ maxWidth: '100px' }}>
                <button 
                    onClick={() => handleNavigate(priority)}
                    className="bg-orange-200 text-gray-600 font-bold p-2 rounded ml-auto"
                        >
                        상세 보기
                    </button>               
                     </div>
            </div>
        ))}
    </div>
</div>

                )}
            </div>

                    <div className="bg-white p-6 w-full rounded-xl">
                        <div className="mb-6">
                            <div className="flex justify-between items-center">
                                <h6 className="font-semibold mb-0">모의지원 대학 순위</h6>
                                <div className="justify-between flex items-center gap-2 cursor-pointer">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" className="w-4 h-4 hover:bg-neutral-100 rounded-full" onClick={() => handleGunChangeTopUniversities('up2')}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"></path>
                                    </svg>
                                    <span className="inline-block text-sm mb-px ">{currentGunTopUniversities}군</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" className="w-4 h-4 hover:bg-neutral-100 rounded-full" onClick={() => handleGunChangeTopUniversities('down2')}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        {isLoadingTopUniversities ? (
                            <LoadingSpinner />
                        ) : (
                        <div className="bg-white p-6 w-full rounded-xl summaryCard undefined">
                            <div className="flex flex-col">
                                <div className="flex gap-5 w-full justify-between text-sm text-neutral-400 h-8 border-0 border-b border-neutral-100 border-solid">
                                    <div className="w-1/6 text-center">순위</div>
                                    <div className="w-1/3 text-center">대학명</div>
                                    <div className="w-1/6 text-center">지원자</div>
                                </div>
                                {topUniversities.map((university, index) => (
                                    <div key={university.university_id} className="flex gap-5 justify-between text-center h-12 border-b border-neutral-100 border-0 border-solid cursor-pointer hover:bg-neutral-50">
                                        <div className="w-1/6 flex items-center text-sm justify-center">
                                            <div>{index + 1} 등</div>
                                        </div>
                                        <div className="w-1/3 flex items-center text-sm justify-center">
                                            <img src={university.logo_url} alt="logo" className="w-6 h-6 mr-2 rounded-full" />
                                            <div>{university.name}</div>
                                        </div>
                                        <div className="w-1/6 flex items-center text-sm justify-center">
                                            <span>{university.count}명</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
