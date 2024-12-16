import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const login = (accessToken, refreshToken) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setIsAuthenticated(false);
    };

    const renewToken = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            const response = await axios.post('/api/', { token: refreshToken });
            localStorage.setItem('accessToken', response.data.accessToken);
            return response.data.accessToken;
        } catch (error) {
            logout();
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, renewToken }}>
            {children}
        </AuthContext.Provider>
    );
};
