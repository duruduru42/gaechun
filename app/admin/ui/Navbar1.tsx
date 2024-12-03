import React from "react";
import Image from "next/image";
import gaechun from "@/components/gaechun.svg";

export function Navbar1(){
    return(    
    <div className="flex w-screen justify-between items-center bg-white">
        <Image src={gaechun} alt="Gaechun logo" className="ml-24"   width={100}/>
        </div>
)
}