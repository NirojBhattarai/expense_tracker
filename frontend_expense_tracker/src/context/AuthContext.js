import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check if the accessToken exists in localStorage when the component mounts
    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            setIsAuthenticated(true);
        }
    }, []);

    // Store tokens in localStorage
    const login = (accessToken, refreshToken) => {
        localStorage.setItem('accessToken', accessToken); // Store access token
        localStorage.setItem('refreshToken', refreshToken); // Store refresh token
        setIsAuthenticated(true);
    };

    // Remove tokens from localStorage and set isAuthenticated to false
    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
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
        <AuthContext.Provider value={{ isAuthenticated, login, logout, renewToken }}>
            {children}
        </AuthContext.Provider>
    );
};
