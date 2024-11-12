import React from "react";
import Profile from "./Profile";
import Link from "next/link";
import Image from "next/image";
import gaechun from "@/components/gaechun.svg";

export default function Navbar(){
    return(    
    <div className="flex justify-between items-center">
        <Link href="/">
        <Image src={gaechun} alt="Gaechun logo" className="ml-24"   width={100}/>
        </Link>
        <Profile/>
        </div>
)
}