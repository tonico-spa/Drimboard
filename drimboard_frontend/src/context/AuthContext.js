// context/AuthContext.js
"use client";
import axios from 'axios';
import { createContext, useState, useContext, useEffect } from 'react';
const API_URL = process.env.NEXT_PUBLIC_API_URL

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const api = axios.create({
        baseURL: API_URL,
        withCredentials: true  // This is crucial for cookies
    });

    // Login user
    const login = async () => {
        try {
            const response = await api.post('/login', {
                "email": "ignaciabaeza.i@gmail.com",
                "kit_code": "p0s31d0n"
            });

            if (response.status === 200) {
                await checkUserLoggedIn();
                console.log("logged");
                return { success: true };
            }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const logout = async () => {
        await api.post('/logout');
        setUser(null);
    };

    const checkUserLoggedIn = async () => {
        setLoading(true);
        try {
            const response = await api.get('/profile');  // Remove the fetch API options

            if (response.status === 200) {
                setUser(response.data);
            } else {
                setUser(null);
            }
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const value = { user, loading, login, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to easily use the auth context
export const useAuth = () => useContext(AuthContext);