'use client'

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/ui/LoadingSpinner'; // Adjust the filename accordingly

const ItemTypes = {
    APPLICATION: 'application',
};

const truncateText = (text, maxLength) => {
    if (!text || text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  };

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
            className="border rounded-lg p-2 m-2 cursor-pointer flex items-center"
            style={{ opacity: isDragging ? 0.5 : 1 }}
        >
            <img src={app.departments.university.logo_url} alt="logo" className="w-10 h-10 mr-2 rounded-full" />
            <div>
                <div className="">{app.departments.university.name}</div>
                <div className="text-sm text-gray-400">{truncateText(app.departments.모집단위, 15)}
                </div>
                <div className="text-sm text-gray-400">{app.departments.군}군</div>
            </div>
            <button onClick={() => handleAddToPriority(app.department_id, app.departments.군)} className="bg-blue-500 text-white p-1 rounded ml-2">
                담기
            </button>
            <button
                onClick={() => handleDelete(app.id)}
                className="bg-red-500 text-white p-1 rounded ml-2"
            >
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
    const [modificationCount, setModificationCount] = useState(null); // Default value

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        if (user && user.id) {
            fetchApplications(user.id);
            fetchStoredPriorities(user.id);
            fetchModificationCount(user.id); // Fetch modification count
        }
    }, [user]);

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


    
    const fetchApplications = async (user_id) => {
        if (!user_id) {
            console.log('No user ID provided');
            return;
        }

        setLoading(true);

        const { data, error } = await supabase
            .from('applications')
            .select(`
                id,
                user_id,
                score,
                department_id,
                departments (
                    군,
                    모집단위,
                    university:university_id (
                        name,
                        logo_url
                    )
                )
            `)
            .eq('user_id', user_id);

        if (error) {
            console.error('Error fetching applications:', error);
        } else {
            console.log('Applications data:', data);
            setApplications(data);
        }

        setLoading(false);
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

    useEffect(() => {
        const departmentIds = applications.map(app => app.department_id);
        if (departmentIds.length > 0) {
            fetchApplicantCounts(departmentIds).then(setDepartmentCounts);
        }
    }, [applications]);


    const PriorityCell = ({ priority, 군, selected, handleRemove, handleDrop }) => {
        const [{ isOver }, drop] = useDrop(() => ({
            accept: ItemTypes.APPLICATION,
            drop: (item) => handleDrop(priority, 군, item),
            collect: (monitor) => ({
                isOver: !!monitor.isOver(),
            }),
        }));

        return (
            <td ref={drop} className={`border w-1/3 ${isOver ? 'bg-green-200' : ''}`}>
                {selected ? (
                    <div className="flex items-center border rounded-lg p-2 m-2 bg-gray-100">
                        <img src={selected.university.logo_url} alt="logo" className="w-10 h-10 mr-2 rounded-full" />
                        <div>
                            <div>{selected.university.name}</div>
                            <div className="text-sm text-gray-400">{truncateText(selected.모집단위, 15)}</div>
                        </div>
                        <button onClick={() => handleRemove(priority, 군)} className="bg-red-500 text-white p-1 rounded ml-2">
                            삭제
                        </button>
                    </div>
                ) : (
                    <div className="border rounded-lg p-2 m-2 h-full">드래그 or '담기' 버튼 클릭</div>
                )}
            </td>
        );
    };

    const PriorityCell2 = ({ priority, 군, selected, departmentCounts }) => {
        const router = useRouter();
        const applicantCount = selected ? departmentCounts[selected.department_id] || 0 : 0;
    
        const handleNavigate = () => {
            if (selected) {
                console.log("Selected Department ID:", selected.department_id);
                if (selected.department_id) {
                    router.push(`/more?id=${selected.department_id}`);
                } else {
                    console.error("department_id is undefined");
                }
            }
        };
        
    
        return (
            <td
                className="border w-1/3 cursor-pointer"
                onClick={handleNavigate}
            >
                {selected ? (
                    <div className="border rounded-lg p-2 m-2 flex items-center">
                        <img src={selected.university.logo_url} alt="logo" className="w-10 h-10 mr-2 rounded-full" />
                        <div>
                            <div className="font-bold">{selected.university.name}</div>
                            <div className="text-sm text-gray-400">{truncateText(selected.모집단위, 15)}
                            </div>
                            <div className="text-sm text-gray-400">지원자 수: {applicantCount}</div>
                        </div>
                        <button 
                        onClick={handleNavigate}
                        className="bg-orange-200 text-gray-600 font-bold p-2 rounded ml-auto"
                        >
                        상세 보기
                    </button>
                    </div>
                ) : (
                    <div className="border rounded-lg p-2 m-2 h-full">우선순위를 설정하세요</div>
                )}
            </td>
        );
    };

    

    const handleAddToPriority = (department_id, 군) => {
        for (let priority = 1; priority <= 3; priority++) {
            if (!priorities[priority][군]) {
                const newPriorities = { ...priorities };
                const department = applications.find(app => app.department_id === department_id).departments;
                department.id = department_id; // Ensure department object has department_id
                newPriorities[priority][군] = department;
                setPriorities(newPriorities);
                break;
            }
        }
    };

    const handleDelete = async (applicationId) => {
        const { error } = await supabase
            .from('applications')
            .delete()
            .eq('id', applicationId);

        if (error) {
            console.error('Error deleting application:', error);
        } else {
            setApplications((prev) => prev.filter((app) => app.id !== applicationId));
        }
    };

    const handleRemove = (priority, 군) => {
        const newPriorities = { ...priorities };
        newPriorities[priority][군] = null;
        setPriorities(newPriorities);
    };

    const handleDrop = (priority, 군, item) => {
        console.log('Item:', item);
        console.log('군:', 군);
        console.log('Applications:', applications);

        if (applications.length === 0) {
            console.error('Applications data is empty');
            alert('애플리케이션 데이터가 비어 있습니다.');
            fetchApplications(user.id); // Reload applications data
            return;
        }

        const application = applications.find(app => app.department_id === item.id);
        if (!application || !application.departments) {
            console.error('Invalid application or departments data:', application);
            alert('해당 군에 맞는 대학을 담아주세요.');
            return;
        }

        if (application.departments.군 !== 군) {
            alert('해당 군에 맞는 대학을 담아주세요.');
            return;
        }

        const newPriorities = { ...priorities };
        newPriorities[priority][군] = application.departments;
        setPriorities(newPriorities);
    };

    const fetchStoredPriorities = async (user_id) => {
        const { data, error } = await supabase
            .from('priorities')
            .select(`
                priority,
                군,
                department_id,
                departments:department_id (
                    university:university_id (
                        name,
                        logo_url
                    ),
                    모집단위
                )
            `)
            .eq('user_id', user_id);
    
        if (error) {
            console.error('Error fetching stored priorities:', error);
        } else {
            const priorityMap = {};
            data.forEach(item => {
                if (!priorityMap[item.priority]) {
                    priorityMap[item.priority] = {};
                }
                priorityMap[item.priority][item.군] = {
                    ...item.departments,
                    department_id: item.department_id, // Ensure department_id is available
                };
            });
    
            setStoredPriorities(priorityMap); // Update stored priorities
        }
    };
    

    const fetchModificationCount = async (user_id) => {
        const { data, error } = await supabase
            .from('profile')
            .select('coins')
            .eq('id', user_id)
            .single();

        if (error) {
            console.error('Error fetching modification count:', error);
            setModificationCount(3); // Default to 3 if not found, for new users
        } else {
            setModificationCount(data.coins);
        }
    };

    const updateModificationCount = async (user_id, newCount) => {
        const { error } = await supabase
            .from('profile')
            .update({ coins: newCount })
            .eq('id', user_id);

        if (error) {
            console.error('Error updating modification count:', error);
        }
    };

    const handleSave = async () => {
    
        // Ensure all priorities are filled
        for (let priority = 1; priority <= 3; priority++) {
            if (!priorities[priority].가 || !priorities[priority].나 || !priorities[priority].다) {
                alert('모든 우선순위를 채워주세요');
                return;
            }
        }
    
        const prioritiesArray = [];
        for (let priority = 1; priority <= 3; priority++) {
            for (let 군 in priorities[priority]) {
                if (priorities[priority][군]) {
                    const department = priorities[priority][군];
    
                    // Determine `another1` and `another2` based on the current `군`
                    let another1 = null;
                    let another2 = null;
    
                    if (군 === '가') {
                        another1 = priorities[priority]['나'] ? priorities[priority]['나'].id : null;
                        another2 = priorities[priority]['다'] ? priorities[priority]['다'].id : null;
                    } else if (군 === '나') {
                        another1 = priorities[priority]['가'] ? priorities[priority]['가'].id : null;
                        another2 = priorities[priority]['다'] ? priorities[priority]['다'].id : null;
                    } else if (군 === '다') {
                        another1 = priorities[priority]['가'] ? priorities[priority]['가'].id : null;
                        another2 = priorities[priority]['나'] ? priorities[priority]['나'].id : null;
                    }
    
                    prioritiesArray.push({
                        user_id: user.id,
                        priority,
                        군,
                        department_id: department.id, // Ensure correct department_id
                        another1,
                        another2,
                    });
                }
            }
        }
    
        console.log('Priorities Array:', prioritiesArray); // Log for verification
    
        const { error: deleteError } = await supabase
            .from('priorities')
            .delete()
            .eq('user_id', user.id);
    
        if (deleteError) {
            console.error('Error deleting existing priorities:', deleteError);
            return;
        }
    
        const { error } = await supabase
            .from('priorities')
            .insert(prioritiesArray);
    
        if (error) {
            console.error('Error saving priorities:', error);
        } else {
            alert('우선순위가 저장되었습니다.');
            await fetchStoredPriorities(user.id);
            const newCount = modificationCount - 1;
            setModificationCount(newCount);
            updateModificationCount(user.id, newCount);
        }
    };
    
    
    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="container mx-auto p-10">
                {storedPriorities && Object.keys(storedPriorities).length > 0 ? (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">저장된 우선순위</h2>
                        <table className="min-w-full table-auto bg-white">
                            <thead className="bg-orange-200 text-gray-600 uppercase text-sm leading-normal font-black">
                                <tr>
                                    <th className="py-3 px-10 text-center whitespace-nowrap">순위</th>
                                    <th className="py-3 px-6 text-center">가</th>
                                    <th className="py-3 px-6 text-center">나</th>
                                    <th className="py-3 px-6 text-center">다</th>
                                </tr>
                            </thead>
                            <tbody className="text-black text-sm font-medium">
                                {Object.keys(storedPriorities).map(priority => (
                                    <tr key={priority}>
                                        <td className="text-center text-sm font-semibold">{priority}</td>
                                        <PriorityCell2 priority={priority} 군="가" selected={storedPriorities[priority]['가']} departmentCounts={departmentCounts} />
                                        <PriorityCell2 priority={priority} 군="나" selected={storedPriorities[priority]['나']} departmentCounts={departmentCounts} />
                                        <PriorityCell2 priority={priority} 군="다" selected={storedPriorities[priority]['다']} departmentCounts={departmentCounts} />
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="flex justify-center mt-4">
                        <button
                            onClick={() => {
                                if (modificationCount <= 0) {
                                    alert('수정 횟수를 초과했습니다.');
                                } else {
                                    setStoredPriorities(null); // Reset priorities for editing
                                }
                            }}
                            className="bg-blue-500 text-white p-2 rounded"
                        >
                            수정하기 ({modificationCount}/3)
                        </button>
                        </div>
                    </div>
                ) : (<div className="mt-8">
                    <h2 className="text-2xl font-bold mb-4">모의지원한 대학 및 학과</h2>
                    <div className="flex flex-wrap">
                        {applications.map((app) => (
                            <Application key={app.id} app={app} handleAddToPriority={handleAddToPriority} handleDelete={handleDelete} 
/>
                        ))}
                    </div>
                    <h3 className="text-xl font-bold mt-8 mb-8">우선순위 설정</h3>
                    <table className="min-w-full table-auto">
                        <thead className="bg-orange-200 text-gray-600 uppercase text-sm leading-normal font-black">
                            <tr>
                                <th className="py-3 px-10 text-center whitespace-nowrap">순위</th>
                                <th className="py-3 px-6 text-center">가</th>
                                <th className="py-3 px-6 text-center">나</th>
                                <th className="py-3 px-6 text-center">다</th>
                            </tr>
                        </thead>
                        <tbody className="text-black text-sm font-medium">
                            {[1, 2, 3].map((priority) => (
                                <tr key={priority} className="border-b border-gray-200 hover:bg-gray-100">
                                    <td className="py-3 px-10 text-center flex flex-row justify-center">
                                        <span className="mt-1 font-bold">{priority}</span>
                                    </td>
                                    <PriorityCell
                                        priority={priority}
                                        군="가"
                                        selected={priorities[priority].가}
                                        handleRemove={handleRemove}
                                        handleDrop={handleDrop}
                                    />
                                    <PriorityCell
                                        priority={priority}
                                        군="나"
                                        selected={priorities[priority].나}
                                        handleRemove={handleRemove}
                                        handleDrop={handleDrop}
                                    />
                                    <PriorityCell
                                        priority={priority}
                                        군="다"
                                        selected={priorities[priority].다}
                                        handleRemove={handleRemove}
                                        handleDrop={handleDrop}
                                    />
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex justify-end space-x-4 mt-4">

                        <button
                            onClick={handleSave}
                            className="bg-green-500 text-white p-2 rounded"
                        >
                            모의지원 저장
                        </button>
                    </div>
                </div>
                )}
            </div>
        </DndProvider>
    );
};

export default TestPage;
