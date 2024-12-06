"use client";

import { KeyRound, Link as LucideLink } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import gaechunLogo from "@/components/gaechun.svg";
import { ArrowLeft } from "lucide-react";
import NextLink from 'next/link';
import { useQueryClient } from "@tanstack/react-query"; // Import useQueryClient

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const params = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient(); // Initialize queryClient here
  const next = params.get("next") || "/";

  const handleKeyDown = (e, nextElementId) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const nextElement = document.getElementById(nextElementId);
      if (nextElement) {
        nextElement.focus();
      }
    } 
    // else if (e.key === 'Enter') {
    //   if (nextElementId === 'login') {
    //     handleLoginWithEmail();
    //   } else {
    //     const nextElement = document.getElementById(nextElementId);
    //     if (nextElement) {
    //       nextElement.focus();
    //     }
    //   }
    // }
  };

  const handleLoginWithEmail = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) {
      console.error("Login error: ", error.message);
      alert("아이디/비밀번호를 다시 확인해주세요."); // 실패 시 경고창 표시
    } else {
      console.log("User logged in: ", data.user);
      queryClient.invalidateQueries(["user"]); // Refresh user query cache
      router.refresh();
      router.push("/home"); // Redirect after refreshing
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-screen bg-gray-50">
      <div className="absolute top-4 left-4">
        <button onClick={() => router.push('/')}>
          <ArrowLeft size={24} />
        </button>
      </div>
      <div className="w-full max-w-md bg-white p-8 rounded-md shadow-md space-y-5">
        <div className="flex justify-center mb-6">
          <Image src={gaechunLogo} alt="Gaechun Logo" width={60} height={60} />
        </div>
        <h1 className="text-2xl font-bold text-center mb-6">로그인</h1>
        <div className="space-y-3">
          <input
            type="email"
            placeholder="이메일 주소"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'password')}
            className="w-full p-3 border rounded"
            id="email"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded"
            onKeyDown={(e) => handleKeyDown(e, 'login')}
            id="password"
          />
          <Button
            className="w-full bg-red-500 text-white p-3 rounded mt-3"
            onClick={() => alert("오픈 후 이용해주세요")}
            id="login"
          >
            로그인
          </Button>
        </div>
        <div className="flex justify-center mt-6">
          <p>계정이 없으신가요? 
            <span
              className="text-blue-500 cursor-pointer ml-1"
              onClick={() => router.push('/signup')}
              >
              회원가입
            </span>
          </p>
        </div>
        <p className="text-center text-gray-500 mt-6">
          아이디, 비밀번호를 분실하셨다면{" "}
          <NextLink href="https://open.kakao.com/o/sR7ToArf" className="text-blue-500">
            고객센터
          </NextLink>
          로 문의주세요.
        </p>
      </div>
    </div>
  );
}
