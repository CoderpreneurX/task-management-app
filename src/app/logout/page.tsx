"use client";

import api from "@/utils/axiosInstance";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LogoutPage() {
    const router = useRouter();

    useEffect(() => {
        async function logout() {
            try {
                await api.post('/auth/logout')
                router.push("/")
            } catch {
                console.log("Error logging out...")
            }
        }

        logout()
    }, [router])
    
    return (
        <div className="text-center my-14 font-bold text-xl">Logout Successful, redirecting...!</div>
    )
}