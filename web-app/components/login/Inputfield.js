import React from "react";
import styles from "./Inputfield.module.css";

export default function InputField({
    label,
    id,
    type = "text", // Default type is "text"
    placeholder,
    refProp,
    error = false, // Optional: Boolean to indicate error state
    success = false, // Optional: Boolean to indicate success state
    disabled = false, // Optional: Boolean to disable the input
    errorMessage = "", // Optional: Error message to display
    successMessage = "", // Optional: Success message to display
}) {
    // Determine input class based on state (error, success, or default)
    const inputClass = `${styles.input} ${
        error ? styles.inputError : success ? styles.inputSuccess : ""
    }`;

    return (
        <div className={styles.inputContainer}>
            {/* Label */}
            <label htmlFor={id} className={styles.label}>
                {label}:
            </label>

            {/* Input Field */}
            <input
                ref={refProp}
                type={type}
                id={id}
                className={inputClass}
                placeholder={placeholder}
                required
                disabled={disabled}
            />

            {/* Error Message */}
            {error && errorMessage && (
                <p className={styles.errorMessage}>{errorMessage}</p>
            )}

            {/* Success Message */}
            {success && successMessage && (
                <p className={styles.successMessage}>{successMessage}</p>
            )}
        </div>
    );
}