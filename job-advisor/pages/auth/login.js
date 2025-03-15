import React, { useRef, useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import LoginCard from "@/components/login/Logincard";
import styles from "./Loginpage.module.css";
import { useSession } from "next-auth/react";

const LoginPage = () => {
    const { data: session, status } = useSession(); // Get session info
    const router = useRouter(); // For client-side navigation

    const emailRef = useRef();
    const passwordRef = useRef();
    const [error, setError] = useState("");

   
    useEffect(() => {
        if (status === "authenticated") {
            router.push("/user/profile"); 
        }
    }, [status, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
            callbackUrl: "/job/allJobs",
        });

        if (result?.error) {
            setError(result.error);
        }
    };

    // Show a loading spinner or empty state while checking session status
    if (status === "loading") {
        return <div className={styles.pageContainer}>Loading...</div>;
    }

    // Render the login card if the user is not authenticated
    return (
        <div className={styles.pageContainer}>
            <LoginCard
                emailRef={emailRef}
                passwordRef={passwordRef}
                handleSubmit={handleSubmit}
                error={error}
            />
        </div>
    );
};

export default LoginPage;
