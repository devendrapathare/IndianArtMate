import { createContext, useContext, useState } from "react";
import axios from 'axios'


export const AuthContext = createContext();

export const useAuthContext = () =>{
    return useContext(AuthContext)
}   

const fetchUserData = async (userId) => {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/userData', { userId });
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

const fetchUserByName = async (name)=>{
    try {
        const response = await axios.post('http://localhost:5000/api/auth/userSearch', { name });
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }

}


export const AuthContextProvider = ({ children }) => {

    const [authUser, setauthUser] = useState(JSON.parse(localStorage.getItem("user-info")) || null)
   

    return <AuthContext.Provider value={{authUser, setauthUser, fetchUserData, fetchUserByName}}>
        {children}
    </AuthContext.Provider>
}
