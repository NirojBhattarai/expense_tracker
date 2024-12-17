import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const accessToken = Cookies.get('accessToken');
        if (accessToken) {
            setIsAuthenticated(true);
        }
    }, []);

    const login = (accessToken, refreshToken) => {
        // Save the tokens in cookies
        Cookies.set('accessToken', accessToken, { expires: 15 / 1440 }); // 15 mins
        Cookies.set('refreshToken', refreshToken, { expires: 7 }); // 7 days
        setIsAuthenticated(true);
    };

    const logout = () => {
        // Remove the tokens from cookies
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        setIsAuthenticated(false);
    };

    const renewToken = async () => {
        try {
            const refreshToken = Cookies.get('refreshToken');
            const response = await axios.post('http://localhost:5000/api/v1/users/token', { token: refreshToken });
            Cookies.set('accessToken', response.data.accessToken, { expires: 15 / 1440 });
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