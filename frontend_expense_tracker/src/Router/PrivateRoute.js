import React, { useContext, useEffect, useState } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ element: Component, ...rest }) => {
    const { isAuthenticated, renewToken } = useContext(AuthContext);
    const [isTokenValid, setIsTokenValid] = useState(isAuthenticated);

    useEffect(() => {
        const checkToken = async () => {
            if (!isAuthenticated) {
                const newToken = await renewToken();
                setIsTokenValid(!!newToken);
            }
        };
        checkToken();
    }, [isAuthenticated, renewToken]);

    return (
        <Route
            {...rest}
            render={props =>
                isTokenValid ? <Component {...props} /> : <Navigate to="/login" />
            }
        />
    );
};

export default PrivateRoute;
