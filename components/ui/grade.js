'use client'

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

const TablePage = () => {
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error);
      } else {
        setUser(user);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        const { data, error } = await supabase
          .from('exam_results')
          .select('*')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching data:', error);
        } else {
          setData(data[0]);
        }
      };

      fetchData();
    }
  }, [user]);

  if (!data) return <div>
    <h1 className='text-2xl font-bold mt-40 '>성적표 관리자 승인 전입니다...</h1>
    </div>;

  return (
    <div>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
        <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
          <tr>
            <th style={cellStyle}>영역</th>
            <th style={{ ...cellStyle, ...col2Style }}>한국사</th>
            <th style={{ ...cellStyle, ...col3Style }}>국어</th>
            <th style={{ ...cellStyle, ...col4Style }}>수학</th>
            <th style={{ ...cellStyle, ...col5Style }}>영어</th>
            <th style={{ ...cellStyle, ...col6Style }} colSpan="2">탐구</th>
            <th style={{ ...cellStyle, ...col7Style }}>제2외국어/한문</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={cellStyle}>선택과목</td>
            <td style={{ ...cellStyle, ...col2Style }}>{data.history}</td>
            <td style={{ ...cellStyle, ...col3Style }}>{data.korean}</td>
            <td style={{ ...cellStyle, ...col4Style }}>{data.math}</td>
            <td style={{ ...cellStyle, ...col5Style }}>{data.english}</td>
            <td style={{ ...cellStyle, ...col6Style }}>{data.science1}</td>
            <td style={{ ...cellStyle, ...col6Style }}>{data.science2}</td>
            <td style={{ ...cellStyle, ...col7Style }}>{data.foreign_language}</td>
          </tr>
          <tr>
            <td style={cellStyle}>표준점수</td>
            <td style={{ ...cellStyle, ...col4Style }}>{data.standard_score_history}</td>
            <td style={{ ...cellStyle, ...col1Style }}>{data.standard_score_korean}</td>
            <td style={{ ...cellStyle, ...col2Style }}>{data.standard_score_math}</td>
            <td style={{ ...cellStyle, ...col3Style }}>{data.standard_score_english}</td>
            <td style={{ ...cellStyle, ...col5Style }}>{data.standard_score_science1}</td>
            <td style={{ ...cellStyle, ...col6Style }}>{data.standard_score_science2}</td>
            <td style={{ ...cellStyle, ...col6Style }}>{data.standard_score_foreign_language}</td>
          </tr>
          <tr>
            <td style={cellStyle}>백분위</td>
            <td style={{ ...cellStyle, ...col4Style }}>{data.percentile_history}</td>
            <td style={{ ...cellStyle, ...col1Style }}>{data.percentile_korean}</td>
            <td style={{ ...cellStyle, ...col2Style }}>{data.percentile_math}</td>
            <td style={{ ...cellStyle, ...col3Style }}>{data.percentile_english}</td>
            <td style={{ ...cellStyle, ...col5Style }}>{data.percentile_science1}</td>
            <td style={{ ...cellStyle, ...col6Style }}>{data.percentile_science2}</td>
            <td style={{ ...cellStyle, ...col6Style }}>{data.percentile_foreign_language}</td>
          </tr>
          <tr>
            <td style={cellStyle}>등급</td>
            <td style={{ ...cellStyle, ...col4Style }}>{data.grade_history}</td>
            <td style={{ ...cellStyle, ...col1Style }}>{data.grade_korean}</td>
            <td style={{ ...cellStyle, ...col2Style }}>{data.grade_math}</td>
            <td style={{ ...cellStyle, ...col3Style }}>{data.grade_english}</td>
            <td style={{ ...cellStyle, ...col5Style }}>{data.grade_science1}</td>
            <td style={{ ...cellStyle, ...col6Style }}>{data.grade_science2}</td>
            <td style={{ ...cellStyle, ...col6Style }}>{data.grade_foreign_language}</td>
          </tr>
        </tbody>
      </table>
      <div>
          <div className='grid justify-items-end w-full mt-5 font-bold text-rose-500'>
          <p className='underline underline-offset-2'><a href="https://open.kakao.com/o/se4mzOnf">성적표에 오류가 있어요!</a></p>
          </div>


            <button
                className="rounded-1 px-10 py-3 text-l font-bold bg-red-500 text-white mt-9"
                onClick={() => { window.location.href = '/apply'; }}
               >
                모의지원
            </button>

      </div>

    </div>
  );
};

const cellStyle = {
  border: '1px solid black',
  padding: '16px',
};

// Define specific column styles
const col1Style = {
  width: '11%'
};
const col2Style = {
  width: '11%'
};
const col3Style = {
  width: '11%'
};
const col4Style = {
  width: '11%'
};
const col5Style = {
  width: '11%'
};
const col6Style = {
  width: '11%'
};
const col7Style = {
  width: '11%'
};

export default TablePage;
