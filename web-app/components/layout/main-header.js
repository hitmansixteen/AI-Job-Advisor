import Link from "next/link";
import styles from "./main-header.module.css";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
    const router = useRouter();
    const { data: session } = useSession();

    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                {!session ? (
                    <Link href="/">AI Job Advisor</Link>
                ) : (
                    <Link href="/dashboard">AI Job Advisor</Link>
                )}
            </div>
            <nav className={styles.navigation}>
                <ul className={styles.navList}>
                    {!session ? (
                        <>
                            <li className={styles.navItem}>
                                <button
                                    className={styles.customButton}
                                    onClick={() => router.push("/auth/signup")}
                                >
                                    Signup
                                </button>
                            </li>
                            <li className={styles.navItem}>
                                <button
                                    className={styles.customButton}
                                    onClick={() => router.push("/auth/login")}
                                >
                                    Login
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className={styles.navItem}>
                                <button
                                    className={styles.customButton}
                                    onClick={() => router.push("/dashboard")}
                                >
                                    Dashboard
                                </button>
                            </li>
                            <li className={styles.navItem}>
                                <button
                                    className={styles.customButton}
                                    onClick={() => router.push("/user/profile")}
                                >
                                    Profile
                                </button>
                            </li>
                            <li className={styles.navItem}>
                                <button
                                    className={styles.customButton}
                                    onClick={() => router.push("/job/allJobs")}
                                >
                                    All Jobs
                                </button>
                            </li>
                            <li className={styles.navItem}>
                                <button
                                    className={styles.customButton}
                                    onClick={() =>
                                        router.push("/job/recommendedJobs")
                                    }
                                >
                                    Recommended Jobs
                                </button>
                            </li>
                            <li className={styles.navItem}>
                                <button
                                    className={styles.customButton}
                                    onClick={() => router.push("/uploadjob")}
                                >
                                    Upload Job
                                </button>
                            </li>
                            <li className={styles.navItem}>
                                <button
                                    className={styles.customButton}
                                    onClick={() => router.push("/cover_letter")}
                                >
                                    Generate Cover Letter
                                </button>
                            </li>
                            <li className={styles.navItem}>
                                <button
                                    className={styles.customButtonLogout}
                                    onClick={() => signOut()}
                                >
                                    Logout
                                </button>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
}
