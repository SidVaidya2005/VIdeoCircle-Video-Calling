import axios from "axios";
import httpStatus from "http-status";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import server from "../environment";


export const AuthContext = createContext({});

const client = axios.create({
    baseURL: `${server}/api/v1/users`
})

function authHeader() {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export const AuthProvider = ({ children }) => {

    const authContext = useContext(AuthContext);
    const [userData, setUserData] = useState(authContext);
    const router = useNavigate();

    const handleRegister = async (name, username, password) => {
        try {
            let request = await client.post("/register", { name, username, password });
            if (request.status === httpStatus.CREATED) {
                return request.data.message;
            }
        } catch (err) {
            throw err;
        }
    }

    const handleLogin = async (username, password) => {
        try {
            let request = await client.post("/login", { username, password });
            if (request.status === httpStatus.OK) {
                localStorage.setItem("token", request.data.token);
                router("/guest");
            }
        } catch (err) {
            throw err;
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        router("/auth");
    }

    const verifyToken = async () => {
        try {
            await client.get("/verify", { headers: authHeader() });
            return true;
        } catch {
            return false;
        }
    }

    const getHistoryOfUser = async () => {
        try {
            let request = await client.get("/get_all_activity", {
                headers: authHeader()
            });
            return request.data;
        } catch (err) {
            throw err;
        }
    }

    const addToUserHistory = async (meetingCode) => {
        try {
            let request = await client.post("/add_to_activity",
                { meeting_code: meetingCode },
                { headers: authHeader() }
            );
            return request;
        } catch (e) {
            throw e;
        }
    }

    const data = {
        userData, setUserData,
        handleRegister, handleLogin, handleLogout,
        verifyToken,
        getHistoryOfUser, addToUserHistory
    }

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    )
}
