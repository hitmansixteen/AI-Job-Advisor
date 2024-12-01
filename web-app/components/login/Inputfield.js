import React from "react";
import styles from "./Inputfield.module.css";

export default function InputField({ label, id, type, placeholder, refProp }) {
    return (
        <div className={styles.inputContainer}>
            <label htmlFor={id} className={styles.label}>
                {label}:
            </label>
            <input
                ref={refProp}
                type={type}
                id={id}
                className={styles.input}
                placeholder={placeholder}
                required
            />
        </div>
    );
}
