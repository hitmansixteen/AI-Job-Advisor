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


    return (
        <div>
            <Userprofile/>  
            <div className="flex justify-center mb-16 mt-8">
                <button
                    onClick={() => router.push("/user/chngpasspage")}
                    className="px-4 py-3 bg-green-800 hover:bg-green-700 text-white rounded-lg"
                >
                    Change Password
                </button>
            </div>          
        </div> 
    );
}
