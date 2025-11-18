// context/AuthContext.js
"use client";
import axios from 'axios';
import { createContext, useState, useContext, useEffect } from 'react';

// Use environment variable for the API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
console.log(API_URL)

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Start as true on initial load

    // Create a reusable axios instance
    const api = axios.create({
        // IMPORTANT: Point to the proxy path.
        // Do NOT include the host (http://localhost:3000). The browser will handle that.
        baseURL: API_URL,
    });
    // --- IMPROVEMENT 1: Check session on initial app load ---
    useEffect(() => {
        checkUserStatus();
    }, []); // Empty dependency array means this runs only once on mount


    // --- IMPROVEMENT 2 & 3: Parameterized and efficient login ---
    const login = async (credentials) => {
        try {
            // The `credentials` object should be { email, kit_code }

            const response = await api.post('/login', credentials);

            if (response.status === 200 && response.data) {
                // FIX: Set the user state DIRECTLY from the login response.
                // No need to call /profile again.
                setUser({ email: response.data.user }); // Our /profile route returns { email: ... } so let's be consistent
                console.log("Login successful, user set:", response.data);

                // FIX: Return the user data to the component that called login.
                return { success: true, data: response.data };
            }
        } catch (error) {
            console.error("Login failed:", error);
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const logout = async () => {
        try {
            await api.post('/logout');
        } catch (error) {
            console.error("Logout failed, but clearing user state anyway.", error);
        } finally {
            setUser(null); // Always clear the user state on logout
        }
    };

 const checkUserStatus = async () => {
            try {
                const response = await api.get('/profile');
                    console.log(response.data)

                if (response.status === 200 && response.data) {
                    setUser(response.data); // User is already logged in
                }
            } catch (error) {
                // No valid cookie or server is down; user is not logged in.
                setUser(null);
            } finally {
                setLoading(false); // Stop loading after the check is complete
            }
        };


    // Note: We don't need to export checkUserLoggedIn anymore as it's handled internally.
    const value = { user, loading, login, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook to easily use the auth context
export const useAuth = () => useContext(AuthContext);