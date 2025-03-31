import { createContext, useContext, useState } from "react";
import axios from 'axios';

export const AuthContext = createContext();

export const useAuthContext = () => {
    return useContext(AuthContext);
}

// Function to fetch all user data
const fetchAllUserData = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/auth/getAllUserData');
        return response.data;
    } catch (error) {
        console.error("Error fetching all users: ", error);
        return null;
    }
};

const fetchUserData = async (userId) => {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/userData', { userId });
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

const fetchUserByName = async (name) => {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/userSearch', { name });
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const AuthContextProvider = ({ children }) => {
    const [authUser, setauthUser] = useState(JSON.parse(localStorage.getItem("user-info")) || null);

    return (
        <AuthContext.Provider value={{ authUser, setauthUser, fetchUserData, fetchUserByName, fetchAllUserData }}>
            {children}
        </AuthContext.Provider>
    );
};
