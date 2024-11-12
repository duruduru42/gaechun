"use client"
import React from "react";
import { Button } from "./button";
import Link from "next/link"
import useUser from "@/app/hook/useUser"
import { createClient } from "@/utils/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function Profile(){

    const {isFetching, data} = useUser()
    const queryClient = useQueryClient()
    const router = useRouter()

    if(isFetching){

        return <></>;
    }


    const handleLogout = async ()=>{
        const supabase = createClient();
        queryClient.clear();
        await supabase.auth.signOut();
        router.refresh();

    }


    return(
        <div className="p-3 mr-16">
            {!data?.id ?(      
            <Link href="/auth">          
            <Button variant="outline" className="bg-orange-500 text-white">로그인</Button>
             </Link>)
             :(
             <h1
             onClick={handleLogout} style={{ cursor: 'pointer' }}><span className="font-bold text-lg">{data?.display_name}</span>님
             반갑습니다.</h1>
            )}
            {/* <Button  onClick={handleLogout}>로그아웃</Button> */}
 
        </div>
    )
}