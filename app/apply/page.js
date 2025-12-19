'use client'

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const ItemTypes = {
    APPLICATION: 'application',
};

const truncateText = (text, maxLength) => {
    if (!text || text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
};

// ... Application 컴포넌트 (동일) ...
const Application = ({ app, handleAddToPriority, handleDelete }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.APPLICATION,
        item: { id: app.department_id, 군: app.departments.군 },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    return (
        <div
            ref={drag}
            className="border rounded-lg p-2 m-2 cursor-pointer flex items-center bg-white shadow-sm hover:shadow-md transition-shadow"
            style={{ opacity: isDragging ? 0.5 : 1 }}
        >
            <img src={app.departments.university.logo_url} alt="logo" className="w-10 h-10 mr-2 rounded-full" />
            <div>
                <div className="font-semibold">{app.departments.university.name}</div>
                <div className="text-sm text-gray-400">{truncateText(app.departments.모집단위, 15)}</div>
                <div className="text-sm text-blue-500 font-bold">{app.departments.군}군</div>
            </div>
            <button onClick={() => handleAddToPriority(app.department_id, app.departments.군)} className="bg-blue-500 text-white px-3 py-1 rounded ml-auto text-sm">
                담기
            </button>
            <button onClick={() => handleDelete(app.id)} className="bg-red-500 text-white px-3 py-1 rounded ml-2 text-sm">
                삭제
            </button>
        </div>
    );
};

const TestPage = () => {
    const supabase = createClient();
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [departmentCounts, setDepartmentCounts] = useState({});
    const [priorities, setPriorities] = useState({
        1: { 가: null, 나: null, 다: null },
        2: { 가: null, 나: null, 다: null },
        3: { 가: null, 나: null, 다: null }
    });
    const [storedPriorities, setStoredPriorities] = useState(null);
    const [modificationCount, setModificationCount] = useState(null);

    useEffect(() => { fetchUser(); }, []);

    useEffect(() => {
        if (user && user.id) {
            fetchApplications(user.id);
            fetchStoredPriorities(user.id);
            fetchModificationCount(user.id);
        }
    }, [user]);

    const fetchUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) setUser(session.user);
    };

    const fetchApplications = async (user_id) => {
        setLoading(true);
        const { data, error } = await supabase
            .from('applications')
            .select(`id, department_id, departments(군, 모집단위, university:university_id(name, logo_url))`)
            .eq('user_id', user_id);
        if (!error) setApplications(data);
        setLoading(false);
    };

    /**
     * [핵심 수정] priorities 테이블을 기준으로 실제 지원자 수 집계
     */
    const fetchApplicantCounts = async (departmentIds) => {
        if (departmentIds.length === 0) return {};

        const { data, error } = await supabase
            .from('priorities') // 1. priorities 테이블에서 가져옴
            .select('department_id, user_id')
            .in('department_id', departmentIds);

        if (error) {
            console.error('Error fetching priorities counts:', error);
            return {};
        }

        // 2. 유저 중복을 제외하고 학과별 인원수 집계 (Set 활용)
        const userMap = data.reduce((acc, { department_id, user_id }) => {
            if (!acc[department_id]) acc[department_id] = new Set();
            acc[department_id].add(user_id);
            return acc;
        }, {});

        const counts = {};
        Object.keys(userMap).forEach(id => {
            counts[id] = userMap[id].size;
        });

        return counts;
    };

    useEffect(() => {
        const departmentIds = applications.map(app => app.department_id);
        // 저장된 데이터가 있다면 그 데이터의 ID들도 포함시켜야 정확한 카운트가 나옵니다.
        if (departmentIds.length > 0) {
            fetchApplicantCounts(departmentIds).then(setDepartmentCounts);
        }
    }, [applications, storedPriorities]); // 저장 상태 변화 시에도 다시 계산

    // ... PriorityCell 컴포넌트 (동일) ...
    const PriorityCell = ({ priority, 군, selected, handleRemove, handleDrop }) => {
        const [{ isOver }, drop] = useDrop(() => ({
            accept: ItemTypes.APPLICATION,
            drop: (item) => handleDrop(priority, 군, item),
            collect: (monitor) => ({ isOver: !!monitor.isOver() }),
        }));
        return (
            <td ref={drop} className={`border p-2 ${isOver ? 'bg-green-100' : ''}`}>
                {selected ? (
                    <div className="flex items-center bg-gray-50 p-2 rounded border">
                        <img src={selected.university.logo_url} className="w-8 h-8 mr-2 rounded-full" />
                        <div className="flex-1 overflow-hidden">
                            <div className="text-xs font-bold truncate">{selected.university.name}</div>
                            <div className="text-[10px] text-gray-400 truncate">{truncateText(selected.모집단위, 10)}</div>
                        </div>
                        <button onClick={() => handleRemove(priority, 군)} className="text-red-500 font-bold ml-1">×</button>
                    </div>
                ) : (
                    <div className="text-[10px] text-gray-300 text-center py-4">비어있음</div>
                )}
            </td>
        );
    };

    const PriorityCell2 = ({ selected, departmentCounts }) => {
        const applicantCount = selected ? (departmentCounts[selected.department_id] || 0) : 0;
        const handleNavigate = () => { if (selected?.department_id) router.push(`/more?id=${selected.department_id}`); };

        return (
            <td className="border p-2 cursor-pointer hover:bg-orange-50" onClick={handleNavigate}>
                {selected ? (
                    <div className="flex items-center">
                        <img src={selected.university.logo_url} className="w-10 h-10 mr-2 rounded-full shadow-sm" />
                        <div className="flex-1">
                            <div className="font-bold text-sm">{selected.university.name}</div>
                            <div className="text-xs text-gray-400">{truncateText(selected.모집단위, 12)}</div>
                            <div className="text-xs font-bold text-orange-600 mt-1">실제 지원: {applicantCount}명</div>
                        </div>
                    </div>
                ) : <div className="text-gray-300 text-center">-</div>}
            </td>
        );
    };

    // ... handleAddToPriority, handleDelete, handleRemove, handleDrop (기존 코드와 동일) ...
    const handleAddToPriority = (department_id, 군) => {
        const app = applications.find(app => app.department_id === department_id);
        if (!app) return;
        for (let p = 1; p <= 3; p++) {
            if (!priorities[p][군]) {
                const newPriorities = { ...priorities };
                newPriorities[p][군] = { ...app.departments, id: department_id };
                setPriorities(newPriorities);
                break;
            }
        }
    };

    const handleDelete = async (applicationId) => {
        const { error } = await supabase.from('applications').delete().eq('id', applicationId);
        if (!error) setApplications(prev => prev.filter(app => app.id !== applicationId));
    };

    const handleRemove = (priority, 군) => {
        const newP = { ...priorities };
        newP[priority][군] = null;
        setPriorities(newP);
    };

    const handleDrop = (priority, 군, item) => {
        const application = applications.find(app => app.department_id === item.id);
        if (!application || application.departments.군 !== 군) {
            alert('해당 군에 맞는 대학을 담아주세요.');
            return;
        }
        const newP = { ...priorities };
        newP[priority][군] = { ...application.departments, id: application.department_id };
        setPriorities(newP);
    };

    const fetchStoredPriorities = async (user_id) => {
        const { data, error } = await supabase
            .from('priorities')
            .select(`priority, 군, department_id, departments:department_id (university:university_id (name, logo_url), 모집단위)`)
            .eq('user_id', user_id);

        if (!error && data.length > 0) {
            const map = {};
            data.forEach(item => {
                if (!map[item.priority]) map[item.priority] = {};
                map[item.priority][item.군] = { ...item.departments, department_id: item.department_id };
            });
            setStoredPriorities(map);
        }
    };

    const fetchModificationCount = async (id) => {
        const { data } = await supabase.from('profile').select('coins').eq('id', id).single();
        setModificationCount(data?.coins ?? 0);
    };

    const handleSave = async () => {
        for (let p = 1; p <= 3; p++) {
            if (!priorities[p].가 || !priorities[p].나 || !priorities[p].다) return alert('모든 우선순위를 채워주세요');
        }
        if (modificationCount <= 0) return alert('수정 횟수가 부족합니다.');

        setLoading(true);
        try {
            const prioritiesArray = [];
            for (let p = 1; p <= 3; p++) {
                ['가', '나', '다'].forEach(군 => {
                    const dept = priorities[p][군];
                    const id = dept.id || dept.department_id;
                    const getOtherId = (g) => priorities[p][g].id || priorities[p][g].department_id;
                    
                    prioritiesArray.push({
                        user_id: user.id,
                        priority: p,
                        군,
                        department_id: id,
                        another1: getOtherId(군 === '가' ? '나' : (군 === '나' ? '가' : '가')),
                        another2: getOtherId(군 === '다' ? '나' : (군 === '가' ? '다' : '다')),
                    });
                });
            }

            await supabase.from('priorities').delete().eq('user_id', user.id);
            const { error: insError } = await supabase.from('priorities').insert(prioritiesArray);
            if (insError) throw insError;

            const newCount = modificationCount - 1;
            await supabase.from('profile').update({ coins: newCount }).eq('id', user.id);
            setModificationCount(newCount);
            
            alert('저장되었습니다.');
            window.location.reload(); 
        } catch (error) {
            alert(`오류: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="container mx-auto p-4 md:p-10 max-w-6xl">
                {storedPriorities ? (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">나의 확정 우선순위</h2>
                        <table className="w-full border-collapse">
                            <thead className="bg-orange-100">
                                <tr>
                                    <th className="p-3 border text-center w-16">순위</th>
                                    <th className="p-3 border text-center font-bold">가군</th>
                                    <th className="p-3 border text-center font-bold">나군</th>
                                    <th className="p-3 border text-center font-bold">다군</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[1, 2, 3].map(p => (
                                    <tr key={p}>
                                        <td className="border text-center font-bold text-lg text-gray-500">{p}</td>
                                        <PriorityCell2 selected={storedPriorities[p]?.가} departmentCounts={departmentCounts} />
                                        <PriorityCell2 selected={storedPriorities[p]?.나} departmentCounts={departmentCounts} />
                                        <PriorityCell2 selected={storedPriorities[p]?.다} departmentCounts={departmentCounts} />
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="mt-8 flex justify-center">
                            <button onClick={() => { if (modificationCount > 0) setStoredPriorities(null); else alert('횟수 부족'); }} 
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded-full transition-colors shadow-lg">
                                수정하기 (남은 횟수: {modificationCount})
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-10">
                        <section>
                            <h2 className="text-2xl font-bold mb-4">1. 지원할 대학 및 학과 선택</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 bg-gray-50 p-4 rounded-xl">
                                {applications.map((app) => (
                                    <Application key={app.id} app={app} handleAddToPriority={handleAddToPriority} handleDelete={handleDelete} />
                                ))}
                                {applications.length === 0 && <div className="col-span-full py-10 text-center text-gray-400">담은 학과가 없습니다.</div>}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-2">2. 우선순위 배치</h2>
                            <p className="text-red-500 text-sm mb-4 font-medium italic">* 가, 나, 다군을 모두 채워야 저장이 가능하며, 저장 시 수정 가능 횟수가 1회 차감됩니다.</p>
                            <table className="w-full border-collapse bg-white shadow-sm overflow-hidden rounded-lg">
                                <thead className="bg-gray-800 text-white">
                                    <tr>
                                        <th className="p-3 w-16">순위</th>
                                        <th className="p-3">가군</th>
                                        <th className="p-3">나군</th>
                                        <th className="p-3">다군</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[1, 2, 3].map((p) => (
                                        <tr key={p}>
                                            <td className="border text-center font-black bg-gray-50">{p}</td>
                                            <PriorityCell priority={p} 군="가" selected={priorities[p].가} handleRemove={handleRemove} handleDrop={handleDrop} />
                                            <PriorityCell priority={p} 군="나" selected={priorities[p].나} handleRemove={handleRemove} handleDrop={handleDrop} />
                                            <PriorityCell priority={p} 군="다" selected={priorities[p].다} handleRemove={handleRemove} handleDrop={handleDrop} />
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="mt-6 flex justify-end">
                                <button onClick={handleSave} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all">
                                    모의지원 결과 저장하기
                                </button>
                            </div>
                        </section>
                    </div>
                )}
            </div>
        </DndProvider>
    );
};

export default TestPage;