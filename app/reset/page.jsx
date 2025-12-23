'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function ResetPasswordPage() {
  const supabase = createClient();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
        router.push('/auth');
        return;
      }
      
      setLoading(false);
    };

    checkSession();
  }, [router]);

  const handleUpdate = async () => {
    if (!password) {
      alert('새 비밀번호를 입력해주세요.');
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);

    if (error) {
      alert('오류가 발생했습니다: ' + error.message);
      return;
    }

    alert('비밀번호가 변경되었습니다!');
    window.location.href = '/home';
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow">
        <h1 className="mb-6 text-2xl font-semibold text-gray-900">새 비밀번호 설정</h1>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          비밀번호
        </label>
        <input
          type="password"
          placeholder="새 비밀번호 입력"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full rounded border border-gray-300 p-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          onClick={handleUpdate}
          disabled={submitting}
          className="flex w-full items-center justify-center rounded bg-blue-600 px-4 py-3 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {submitting ? '변경 중...' : '비밀번호 변경하기'}
        </button>
      </div>
    </div>
  );
}

