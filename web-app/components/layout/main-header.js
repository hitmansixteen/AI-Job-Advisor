import Link from "next/link";
import styles from './main-header.module.css';
import { useRouter } from 'next/router';
import { useSession, signOut } from "next-auth/react";

export default function Header() {
    const router = useRouter();
    const { data: session } = useSession(); // Check user's session

    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                <Link href='/'>AI Job Advisor</Link>
            </div>
            <nav className={styles.navigation}>
                <ul>
                    {!session ? ( // If user is not logged in
                        <>
                            <li>
                                <button
                                    onClick={() => router.push("/auth/signup")}
                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg mx-2"
                                >
                                    Sign Up
                                </button>
                                <button
                                    onClick={() => router.push("/auth/login")}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg mx-2"
                                >
                                    Login
                                </button>
                            </li>
                        </>
                    ) : ( // If user is logged in
                        <>
                            <li>
                                <button
                                    onClick={() => signOut()}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg mx-2"
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
