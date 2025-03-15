import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import SignUpPage from "@/components/signup/SignUpPage";

export default function Signup() {
    const { data: session, status } = useSession(); // Access session and authentication status
    const router = useRouter();
    
    useEffect(() => {
        
        if (status === "authenticated") {
            router.push("http://localhost:3000/user/profile"); 
        }
    }, [status, router]);

    
    if (status === "loading") {
        return <div>Loading...</div>;
    }

    
    return (
        <SignUpPage />
    );
}
