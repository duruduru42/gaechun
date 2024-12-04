// app/more/[id]/page.js

'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useSearchParams } from 'next/navigation';
import LoadingSpinner from '@/components/ui/LoadingSpinner'; // Adjust the filename accordingly

const MorePage = () => {
    const supabase = createClient();
    const searchParams = useSearchParams();
    const department_id = searchParams.get('id');
    const [universityName, setUniversityName] = useState('');
    const [departmentName, setDepartmentName] = useState('');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (department_id) {
            fetchData();
        }
    }, [department_id]);

    const truncateText = (text, maxLength) => {
        if (!text || text.length <= maxLength) return text;
        return `${text.substring(0, maxLength)}...`;
      };


    const fetchData = async () => {
        const { data: applications, error } = await supabase
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
            .eq('department_id', department_id);

        if (error) {
            console.error('Error fetching application data:', error);
            return;
        }

        if (applications.length > 0) {
            const universityName = applications[0].departments.university.name;
            const departmentName = applications[0].departments.모집단위;
            setUniversityName(universityName);
            setDepartmentName(departmentName);

            const { data: prioritiesData, error: prioritiesError } = await supabase
                .from('priorities')
                .select('*')
                .eq('department_id', department_id);

            if (prioritiesError) {
                console.error('Error fetching priorities data:', prioritiesError);
                return;
            }

            const combinedData = await Promise.all(
                applications.map(async (app) => {
                    const priority = prioritiesData.find(p => p.department_id === app.department_id);
                    
                    const another1Data = priority?.another1 ? await fetchAnotherUniversity(priority.another1) : null;
                    const another2Data = priority?.another2 ? await fetchAnotherUniversity(priority.another2) : null;
                    
                    return {
                        score: app.score,
                        우선순위: priority ? priority.priority : null,
                        다른_군_지원대학1: another1Data,
                        다른_군_지원대학2: another2Data,
                    };
                })
            );

            const sortedData = combinedData.sort((a, b) => b.score - a.score);
            setData(sortedData);
        }

        setLoading(false);
    };

    const fetchAnotherUniversity = async (anotherDepartmentId) => {
        try {
            const { data: anotherData, error } = await supabase
                .from('departments')
                .select(`
                    모집단위,
                    university:university_id (
                        name,
                        logo_url
                    )
                `)
                .eq('id', anotherDepartmentId)
                .single();
    
            if (error || !anotherData) {
                console.error('Error fetching another university data:', error);
                return null;
            }
    
            console.log('Fetched another university data:', anotherData);
            return anotherData;
        } catch (err) {
            console.error('Unexpected error in fetchAnotherUniversity:', err);
            return null;
        }
    };
    
    if (loading) return <div className='items-center justify-center'><LoadingSpinner size="10"/></div>


    return (
        <div className="container mx-auto p-10">
            <h2 className="text-3xl font-bold mb-2">{universityName}</h2>
            <div className="text-lg text-gray-500 mb-4">{departmentName}</div>
            <table className="min-w-full table-auto bg-white">
                <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal font-bold">
                    <tr>
                        <th className="py-3 px-6 text-center">순위</th>
                        <th className="py-3 px-6 text-center">환산점수</th>
                        <th className="py-3 px-6 text-center">우선순위</th>
                        <th className="py-3 px-6 text-center">다른 군 지원대학1</th>
                        <th className="py-3 px-6 text-center">다른 군 지원대학2</th>
                    </tr>
                </thead>
                <tbody className="text-black text-sm font-medium">
                    {data.map((item, index) => (
                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                            <td className="py-3 px-6 text-center">{index + 1} 등</td>
                            <td className="py-3 px-6 text-center">{item.score} 점</td>
                            <td className="py-3 px-6 text-center">{item.우선순위} 순위</td>
                            <td className="py-3 px-6 text-center">
                                {item.다른_군_지원대학1 ? (
                                <div className="flex items-center justify-center text-center p-2 m-2">
                                        <img src={item.다른_군_지원대학1.university.logo_url} alt="logo" className="w-10 h-10 mr-2 rounded-full" />
                                        <div>
                                            <div className='font-semibold'>{item.다른_군_지원대학1.university.name} {truncateText(item.다른_군_지원대학1.모집단위,15)}</div>
                                        </div>
                                    </div>
                                ) : '없음'}
                            </td>
                            <td className="py-3 px-6 text-center">
                                {item.다른_군_지원대학2 ? (
                                 <div className="flex items-center justify-center text-center p-2 m-2">
                                        <img src={item.다른_군_지원대학2.university.logo_url} alt="logo" className="w-10 h-10 mr-2 rounded-full" />
                                        <div>
                                            <div className='font-semibold'>{item.다른_군_지원대학2.university.name} {truncateText(item.다른_군_지원대학2.모집단위,15)}</div>
                                        </div>
                                    </div>
                                ) : '없음'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MorePage;
