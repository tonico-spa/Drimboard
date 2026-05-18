// context/AuthContext.js
"use client";
import axios from 'axios';
import { createContext, useState, useContext, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const api = axios.create({ baseURL: API_URL });

    const checkUserStatus = async () => {
        try {
            const response = await api.get('/profile');
            if (response.status === 200 && response.data) {
                setUser(response.data);
            }
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkUserStatus();
    }, []);

    const login = async (credentials) => {
        try {
            const response = await api.post('/login', credentials);
            if (response.status === 200 && response.data) {
                setUser({ email: response.data.user });
                return { success: true, data: response.data };
            }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.detail || 'Error al iniciar sesión'
            };
        }
    };

    const logout = async () => {
        try {
            await api.post('/logout');
        } catch {
            // ignore — clear client state regardless
        } finally {
            setUser(null);
        }
    };

    const value = { user, loading, login, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);