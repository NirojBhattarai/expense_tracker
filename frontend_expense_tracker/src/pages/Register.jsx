import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext.js";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("/api/register", { username, email, password });
            login(response.data.accessToken, response.data.refreshToken);
            navigate("/");
        } catch (error) {
            console.error("Registration failed", error.response.data.message);
        }
    };

    return (
        <form onSubmit={handleRegister} className="flex flex-col space-y-4">
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="px-4 py-2 border rounded"
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-2 border rounded"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="px-4 py-2 border rounded"
            />
            <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
                Register
            </button>
        </form>
    );
};

export default Register;
