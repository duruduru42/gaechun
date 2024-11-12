"use client";

import { useState, useEffect } from 'react';
import { createClient } from "@/utils/supabase/client";

const Fourth = () => {
  const [universities, setUniversities] = useState([]);
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [selectionType, setSelectionType] = useState('기회균형전형');
  const supabase = createClient();

  useEffect(() => {
    fetchUniversities();
  }, []);

  useEffect(() => {
    if (universities.length > 0 && selectionType) {
      filterAndSortUniversities();
    }
  }, [universities, selectionType]);

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

  const filterAndSortUniversities = () => {
    const filtered = universities.filter(
      (university) => university.selection_type_name === selectionType
    );
    setFilteredUniversities(filtered);
  };

  const handleSelectionTypeChange = (type) => {
    setSelectionType(type);
  };

  return (
    
    <div className="container mx-auto px-4 py-28">

        <div className="text-center mb-14 ">
        <h1 className="text-4xl font-bold text-gray-800 leading-normal tracking-tight mb-6">고른기회 전형으로 선발하는,<br/> <span className="underline underline-offset-4 decoration-4 decoration-orange-500">모든 대학 및 모집단위</span>를 다룹니다.</h1>
          <p className="text-lg text-gray-600 font-semibold">
            기회균형전형 23개 대학, 농어촌전형 28개 대학, 특성화고전형 22개 대학<br /> 총 1130개의 모집단위를 다룹니다.
          </p>
        </div>

      <div className="bg-white shadow-xl rounded my-6 w-2/3 mx-auto overflow-hidden">
        <div className="flex flex-col items-start p-4">
          <div className="flex space-x-2 mb-4">
            {['기회균형전형', '농어촌전형', '특성화고전형'].map((type) => (
              <button
                key={type}
                onClick={() => handleSelectionTypeChange(type)}
                className={`px-3 py-2 rounded text-sm ${selectionType === type ? 'bg-orange-500 text-white' : 'text-black'} hover:bg-orange-300`}
              >
                {type}
              </button>
            ))}
          </div>
          
          <div className="w-full overflow-x-auto" style={{ height: '50vh', overflowY: 'auto' }}>
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 border-b">
                <tr>
                  <th className="py-3 text-center border-b" style={{ minWidth: '200px' }}>대학명</th>
                  <th className="py-3 text-center border-b" style={{ minWidth: '150px' }}>모집전형</th>
                  <th className="py-3 text-center border-b" style={{ minWidth: '100px' }}>모집군</th>
                  <th className="py-3 text-center border-b" style={{ minWidth: '100px' }}>전체 모집인원(명)</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                {filteredUniversities.map((university) => (
                  <tr key={university.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 text-center border-b" style={{ minWidth: '200px' }}>
                      <div className="flex items-center justify-center">
                        <img src={university.logo_url} alt={`${university.name} logo`} className="w-6 h-6 mr-2" />
                        <span className="font-medium">{university.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-center border-b" style={{ minWidth: '150px' }}>{university.selection_type_name}</td>
                    <td className="py-3 text-center border-b" style={{ minWidth: '100px' }}>{university.모집군}</td>
                    <td className="py-3 text-center border-b" style={{ minWidth: '100px' }}>{university.recruited_number}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fourth;
