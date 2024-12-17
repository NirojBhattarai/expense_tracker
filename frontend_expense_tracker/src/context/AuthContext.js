import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUserId] = useState("");

    // Check if the accessToken exists in localStorage when the component mounts
    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        const userId = localStorage.getItem('userId');
        if (accessToken && userId) {
            setUserId(userId);
            setIsAuthenticated(true);
        }
    }, []);

    // Store tokens in localStorage
    const login = (accessToken, refreshToken, userId) => {
        localStorage.setItem('accessToken', accessToken); // Store access token
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('userId', userId); // Store refresh token
        setIsAuthenticated(true);
        setUserId(userId)
    };

    // Remove tokens from localStorage and set isAuthenticated to false
    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userId');
        setIsAuthenticated(false);
    };

    // Renew the access token using the refresh token stored in localStorage
    const renewToken = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                throw new Error('No refresh token available');
            }

            const response = await axios.post('https://expense-tracker-qyva.onrender.com/api/v1/users/token', { token: refreshToken });

            // Store the new access token in localStorage
            localStorage.setItem('accessToken', response.data.accessToken);
            return response.data.accessToken;
        } catch (error) {
            logout(); // If the refresh token is invalid, logout the user
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, renewToken, userId }}>
            {children}
        </AuthContext.Provider>
    );
};
