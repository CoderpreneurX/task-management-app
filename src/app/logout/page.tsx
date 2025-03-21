"use client";

import { useRouter } from "next/navigation";

export default function LogoutPage() {
    const router = useRouter();
    
    return (
        <div className="text-center my-14 font-bold text-xl">Logout Successful, redirecting...!</div>
    )
}