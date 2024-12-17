import React, { useContext, useEffect, useState } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
    // const { isAuthenticated, renewToken } = useContext(AuthContext);
    // const [isTokenValid, setIsTokenValid] = useState(isAuthenticated);

    // useEffect(() => {
    //     const checkToken = async () => {
    //         if (!isAuthenticated) {
    //             const newToken = await renewToken();
    //             setIsTokenValid(!!newToken);
    //         }
    //     };
    //     checkToken();
    // }, [isAuthenticated, renewToken]);

    if(false)return (
        children
    );
    else return <Navigate to={"/login"}/>
};

export default PrivateRoute;
