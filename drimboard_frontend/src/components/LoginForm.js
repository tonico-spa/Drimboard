"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "../styles/LoginForm.module.css";
import useAppStore from '@/store/useAppStore';
import { api } from '@/lib/api';

const LoginForm = () => {


    const [email, setEmail] = useState('');
    const [kitCode, setKitCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const setOpenLoginForm = useAppStore((s) => s.setOpenLoginForm);
    const setLogged = useAppStore((s) => s.setLogged);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await api.post('/login', { email, kit_code: kitCode });
            setOpenLoginForm(false);
            setLogged({ user_email: email, kit_code: kitCode, user_name: response.data.name });
        } catch (err) {
            const message = err.response?.data?.detail || err.response?.data?.message || 'Credenciales inválidas';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };
    const closeLoginForm = (e) => {
        e.preventDefault()
        setOpenLoginForm(false)
    }



    return (

        <div className={styles.loginFormContainer}>
            <button type="button" className={styles.loginFormClose} onClick={closeLoginForm} aria-label="Cerrar">
                x
            </button>
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