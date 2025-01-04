import React from "react";
import InputField from "./Inputfield";
import styles from "./Logincard.module.css";

export default function LoginCard({
    emailRef,
    passwordRef,
    handleSubmit,
    error,
}) {
    return (
        <div className={styles.card}>
            <h2 className={styles.title}>Login</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <InputField
                    label="Email"
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    refProp={emailRef}
                />
                <InputField
                    label="Password"
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    refProp={passwordRef}
                />
                {error && <p className={styles.error}>{error}</p>}
                <button type="submit" className={styles.submitButton}>
                    Login
                </button>
            </form>
        </div>
    );
}
