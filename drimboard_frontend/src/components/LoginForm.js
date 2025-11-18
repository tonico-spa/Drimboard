"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "../styles/LoginForm.module.css";
import { useAuth } from '../context/AuthContext';
import useAppStore from '@/store/useAppStore';

const LoginForm = () => {


    const [email, setEmail] = useState('');
    const [kitCode, setKitCode] = useState('');
    const { login } = useAuth();
        // State for handling loading and error messages
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { setOpenLoginForm } = useAppStore((state) => state);
    const { setLogged } = useAppStore((state) => state);
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the browser from reloading the page
        setError('');       // Clear previous errors
        setIsLoading(true); // Show a loading state

        try {
            console.log("logging")
            const result = await login({ email: email, kit_code: kitCode });

            if (result.success) {
                console.log('Login successful! Welcome', result.data.user);
                setOpenLoginForm(false); // Close the modal on success
                setLogged({ user_email: email, kit_code: kitCode, user_name: result.data.name })
            } else {
                // If the login function returns an error, display it
                setError(result.message || 'An unknown error occurred.');
            }
        } catch (err) {
            // Catch any unexpected errors during the API call
            setError('Could not connect to the server.');
        } finally {
            setIsLoading(false); // Stop the loading state
        }
    };
    const closeLoginForm = (e) => {
        e.preventDefault()
        setOpenLoginForm(false)
    }



    return (

        <div className={styles.loginFormContainer}>
            <div className={styles.loginFormClose} onClick={(e) => closeLoginForm(e)}>
                x
            </div>
            <div className={styles.loginFormTitle}>
                Login
            </div>
            <form className={styles.loginFormContent} onSubmit={handleSubmit}>

                <div className={styles.inputGroup}>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tucorreo@ejemplo.com"
                        required
                        className={styles.input}
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="kit_code">Código de Kit</label>
                    <input
                        id="kit_code"
                        type="text"
                        value={kitCode}
                        onChange={(e) => setKitCode(e.target.value)}
                        placeholder="Tu código único"
                        required
                        className={styles.input}
                    />
                </div>

                {/* Conditionally render the error message */}
                {error && <p className={styles.error}>{error}</p>}

                <button type="submit" disabled={isLoading} className={styles.submitButton}>
                    {isLoading ? 'Ingresando...' : 'Ingresar'}
                </button>
            </form>
        </div>
    )
}

export default LoginForm