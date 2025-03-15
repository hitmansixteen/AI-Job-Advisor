import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import ChangePassword from "@/components/user/changepass";

const ChangePasswordPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/"); // Redirect to home page if the user is not logged in
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "authenticated" && session.user) {
    return (
      <div className="container mx-auto mt-8">
        <ChangePassword userEmail={session.user.email} />
      </div>
    );
  }

  return null;
};

export default ChangePasswordPage;
