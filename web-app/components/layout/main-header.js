import Link from "next/link";
import styles from './main-header.module.css';
import { useRouter } from 'next/router';
import { useSession, signOut } from "next-auth/react";
import Button from "../utils/Button";

export default function Header() {
    const router = useRouter();
    const { data: session } = useSession(); 

    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                {!session ? ( 
                    <Link href='/'>AI Job Advisor</Link>
                ) : ( 
                    <Link href='/job/allJobs'>AI Job Advisor</Link>
                )}
            </div>
            <nav className={styles.navigation}>
                <ul>
                    {!session ? ( 
                        <>
                            <li>
                                <Button 
                                    text="Signup" 
                                    bgColor="bg-green-600" 
                                    hoverColor="hover:bg-green-700" 
                                    onClick={() => router.push("/auth/signup")} 
                                />
                                <Button 
                                    text="Login" 
                                    bgColor="bg-blue-600" 
                                    hoverColor="hover:bg-green-700" 
                                    onClick={() => router.push("/auth/login")} 
                                />
                            </li>
                        </>
                    ) : ( 
                        <>
                            <li>
                                <Button 
                                    text="Profile" 
                                    bgColor="bg-green-600" 
                                    hoverColor="hover:bg-green-700" 
                                    onClick={() => router.push("/user/profile")} 
                                />
                                
                                <Button 
                                    text="All Jobs" 
                                    bgColor="bg-purple-600" 
                                    hoverColor="hover:bg-purple-700" 
                                    onClick={() => router.push("/job/allJobs")} 
                                />

                                <Button 
                                    text="Recommended Jobs" 
                                    bgColor="bg-yellow-600" 
                                    hoverColor="hover:bg-purple-700" 
                                    onClick={() => router.push("/job/recommendedJobs")} 
                                />

                                <Button 
                                    text="Generate CV" 
                                    bgColor="bg-orange-600" 
                                    hoverColor="hover:bg-red-700" 
                                    onClick={() => router.push("/job/generateCv")} 
                                />

                                <Button 
                                    text="Logout" 
                                    bgColor="bg-red-600" 
                                    hoverColor="hover:bg-red-700" 
                                    onClick={() => signOut()} 
                                />
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
}
