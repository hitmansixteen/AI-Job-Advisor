import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function UserProfile() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/"); // Redirect to home page if not logged in
        }
    }, [status, router]);

    // Show a loading state while session is being checked
    if (status === "loading") {
        return <div>Loading...</div>;
    }

    // Render the user profile if the user is authenticated
    return (
        <div>
            <h1>User Profile</h1>
            <p>Welcome, {session?.user?.email || "User"}!</p>
        </div>
    );
}
