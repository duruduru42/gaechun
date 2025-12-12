'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

const TablePage = () => {
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

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
      const fetchProfile = async () => {
        const { data: profile, error } = await supabase
          .from('profile')
          .select('display_name')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
        } else {
          setProfile(profile);
        }
      };

      fetchProfile();

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

  if (!data || !profile) return <div>
    <h1 className='text-2xl font-bold mt-40'></h1>
  </div>;

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold p-10">{profile.display_name}님의 성적표</h1>
      <div className="w-full max-w-4xl p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-center text-2xl font-bold mb-8">2025학년도 대학수학능력시험 성적표</h1>
        <table className="mt-2 text-sm w-full border-collapse border text-gray-600 border-gray-300">
          <thead className="uppercase leading-normal">
            <tr className="text-center">
              <td className="p-1 px-3 border" style={{ width: '13%', height: '50px' }}><div className="flex justify-between"><p>영</p> <p>역</p></div></td>
              <td className="p-1 border relative whitespace-nowrap" style={{ width: '13%', height: '50px' }}>한국사</td>
              <td className="p-1 border relative whitespace-nowrap" style={{ width: '11%', height: '50px' }}>국어</td>
              <td className="p-1 border relative whitespace-nowrap" style={{ width: '11%', height: '50px' }}>수학</td>
              <td className="p-1 border relative whitespace-nowrap" style={{ width: '11%', height: '50px' }}>영어</td>
              <td className="p-1 border relative whitespace-nowrap" style={{ width: '15%', height: '50px' }} colSpan="2">탐구</td>
              <td className="p-1 border relative whitespace-nowrap" style={{ width: '11%', height: '50px' }}>제2외국어<br />/한문</td>
            </tr>
          </thead>
          <tbody>
            <tr className="text-center">
              <td className="py-2 px-3 border" style={{ width: '13%', height: '50px' }}><div className="flex justify-between"><p>선</p> <p>택</p> <p>과</p> <p>목</p></div></td>
              <td className="p-1 border relative whitespace-nowrap table-cross" rowSpan="3" style={{ width: '13%'}}></td>
              <td className="p-1 border relative whitespace-nowrap" style={{ width: '11%', height: '50px' }}>{data.korean}</td>
              <td className="p-1 border relative whitespace-nowrap" style={{ width: '11%', height: '50px' }}>{data.math}</td>
              <td className="p-1 border relative whitespace-nowrap" rowSpan="3" style={{ width: '11%'}}></td>
              <td className="p-1 border relative whitespace-nowrap" style={{ width: '15%', height: '50px' }}>{data.science1}</td>
              <td className="p-1 border relative whitespace-nowrap" style={{ width: '15%', height: '50px' }}>{data.science2}</td>
              <td className="p-1 border relative whitespace-nowrap" style={{ width: '11%', height: '50px' }}>{data.foreign_language}</td>
            </tr>
            <tr className="text-center">
              <td className="py-2 px-3 border" style={{ width: '13%', height: '50px' }}><div className="flex justify-between"><p>표</p> <p>준</p> <p>점</p> <p>수</p></div></td>
              <td className="p-1 border relative whitespace-nowrap" style={{ width: '11%', height: '50px' }}>{data.standard_score_korean}</td>
              <td className="p-1 border relative whitespace-nowrap" style={{ width: '11%', height: '50px' }}>{data.standard_score_math}</td>
              <td className="p-1 border relative whitespace-nowrap" style={{ width: '15%', height: '50px' }}>{data.standard_score_science1}</td>
              <td className="p-1 border relative whitespace-nowrap" style={{ width: '15%', height: '50px' }}>{data.standard_score_science2}</td>
              <td className="p-1 border relative whitespace-nowrap table-cross" rowSpan="2" style={{ width: '11%', height: '100px' }}></td>
            </tr>
            <tr className="text-center">
              <td className="py-2 px-3 border" style={{ width: '13%', height: '50px' }}><div className="flex justify-between"><p>백</p> <p>분</p> <p>위</p></div></td>
              <td className="p-1 border relative whitespace-nowrap" style={{ width: '11%', height: '50px' }}>{data.percentile_korean}</td>
              <td className="p-1 border relative whitespace-nowrap" style={{ width: '11%', height: '50px' }}>{data.percentile_math}</td>
              <td className="p-1 border relative whitespace-nowrap" style={{ width: '15%', height: '50px' }}>{data.percentile_science1}</td>
              <td className="p-1 border relative whitespace-nowrap" style={{ width: '15%', height: '50px' }}>{data.percentile_science2}</td>
            </tr>
            <tr className="text-center">
              <td className="p-1 px-3 border" style={{ width: '13%', height: '50px' }}><div className="flex justify-between"><p>등</p> <p>급</p></div></td>
              <td className="p-1 border relative whitespace-nowrap" style={{ width: '13%', height: '50px' }}>{data.grade_history}</td>
              <td className="p-1 border relative whitespace-nowrap" style={{ width: '11%', height: '50px' }}>{data.grade_korean}</td>
              <td className="p-1 border relative whitespace-nowrap" style={{ width: '11%', height: '50px' }}>{data.grade_math}</td>
              <td className="p-1 border relative whitespace-nowrap" style={{ width: '11%', height: '50px' }}>{data.grade_english}</td>
              <td className="p-1 border relative whitespace-nowrap" style={{ width: '15%', height: '50px' }}>{data.grade_science1}</td>
              <td className="p-1 border relative whitespace-nowrap" style={{ width: '15%', height: '50px' }}>{data.grade_science2}</td>
              <td className="p-1 border relative whitespace-nowrap" style={{ width: '11%', height: '50px' }}>{data.grade_foreign_language}</td>
            </tr>
          </tbody>
        </table>
        <p className="text-center text-xl font-medium mt-6">2025. 12. 05</p>
        <p className="text-center text-xl font-medium tracking-widest mt-2">한국교육과정평가원장</p>
      </div>
      <div className="grid justify-items-center w-full mt-5 font-medium text-orange-400">
          <p className="underline underline-offset-2 font-bold text-lg"><a href="/admin">수정하기</a></p>
        </div>
    </div>
  );
};

export default TablePage;
