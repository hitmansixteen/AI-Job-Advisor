import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Userprofile from "@/components/user/Profile";

export default function UserProfile() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/"); // Redirect to home page if not logged in
        }
    }, [status, router]);

    if (status === "loading") {
        return <div>Loading...</div>;
    }
    console.log(session);


    return <Userprofile />;
}
