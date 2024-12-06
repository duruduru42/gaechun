"use client"

import { useState, useRef, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client'; // 실제 경로로 변경
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
import sungjuk from "@/components/sungjuk.svg";
import { useRouter } from 'next/navigation';

export default function Submit() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [user, setUser] = useState(null);
    const inputRef = useRef(null);
    const supabase = createClient();
    const router = useRouter(); // useRouter 훅 사용

    useEffect(() => {
        const fetchUser = async () => {
            const { data, error } = await supabase.auth.getUser();
            if (error) {
                console.error('Error fetching user:', error);
                return;
            }
            setUser(data.user);

            // profile.image_url 확인
            const { data: profileData, error: profileError } = await supabase
                .from('profile')
                .select('image_url')
                .eq('id', data.user.id)
                .single();

            if (profileError) {
                console.error('Error fetching profile:', profileError);
                return;
            }

            if (profileData.image_url) {
                alert('성적표를 이미 제출하셨습니다.');
                router.push('/home');
            }
        };
        fetchUser();
    }, []);

    const handleImageChange = (e) => {
        const selectedFile = e.target.files?.[0] || null;
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = async () => {
        if (!file) {
            alert('Please upload an image first.');
            return;
        }

        if (!user) {
            alert('User not logged in.');
            return;
        }

        const sanitizedFileName = file.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const uniqueFileName = `${uuidv4()}_${sanitizedFileName}`;
        const filePath = `public/${uniqueFileName}`;

        try {
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('images') // 이미지 저장을 위한 스토리지 버킷 이름
                .upload(filePath, file);

            if (uploadError) {
                console.error('Error uploading image:', uploadError);
                alert(`Failed to upload image: ${uploadError.message}`);
                return;
            }

            const { data: publicUrlData, } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);

            const imageUrl = publicUrlData.publicUrl;

            const { data: updateData, error: updateError } = await supabase
                .from('profile') // 테이블 이름
                .update({ image_url: imageUrl }) // 업데이트할 데이터
                .eq('id', user.id); // 현재 로그인한 사용자의 ID를 기준으로 업데이트

            if (updateError) {
                console.error('Error updating data:', updateError);
                alert(`Failed to submit data: ${updateError.message}`);
                return;
            }

            // 'exam_results' 테이블에 'user_id'를 삽입
            const { data: insertData, error: insertError } = await supabase
                .from('exam_results')
                .insert({ user_id: user.id });

            if (insertError) {
                console.error('Error inserting exam results:', insertError);
                alert(`Failed to insert exam results: ${insertError.message}`);
                return;
            }

            alert('성적표 제출이 완료되었습니다.');
            router.push('/inputpage'); // 제출 완료 후 /inputpage 페이지로 이동
        } catch (error) {
            console.error('Unexpected error:', error);
            alert('An unexpected error occurred');
        }
    };

    const handleDelete = () => {
        setFile(null);
        setPreview(null);
    };

    return (
        <div className='text-center box-border p-4 border-4 flex flex-col items-center'>
            <h1 className='font-bold text-4xl text-black mt-20 mb-12'>성적표 제출</h1>
            <Image src={sungjuk} alt="sungjuk" width={800} />
            <p className='font-bold text-l text-red-500 mt-5 mb-12'>
                주의사항 : 본인 명의로 된 성적표 원본만 제출이 가능합니다.(위 사진 참고 바람)
                <br />본인명의 계정이 아닌 허수 계정 시, 별도 통보와 환불 없이 삭제될 수 있습니다.
            </p>
            <p className='font-bold text-xl text-black mt-1 mb-12'>
                제출 24시간 내에 관리자 승인 후 해당 계정의 '성적'이 확정됩니다.
                <br />성적표가 나온 당일에는 인원이 몰릴 수 있으니, 여유를 가지고 기다려주시기 바랍니다.</p>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageChange}
            />
            {!preview && (
                <button
                    className="rounded-l px-10 py-3 text-l font-bold bg-red-500 text-white mt-2"
                    onClick={() => inputRef.current?.click()}
                >
                    Upload
                </button>
            )}
            {preview && (
                <div>
                    <img src={preview} alt="Image Preview" style={{ width: '800px', height: '500px' }} />
                    <button className="mt-5 font-bold" onClick={handleDelete}>(click) 다시 올리기</button>
                </div>
            )}
            {preview && (
                <button
                    className="rounded-l px-10 py-3 text-l font-bold bg-red-600 text-white mt-9"
                    onClick={handleSubmit}
                >
                    제출하기
                </button>
            )}
        </div>
    );
}
