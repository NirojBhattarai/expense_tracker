import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/users/view');
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
      } 
    };

    fetchData();
  }, []);

  return (
    <UserContext.Provider value={{ user, error }}>
      {children}
    </UserContext.Provider>
  );
};