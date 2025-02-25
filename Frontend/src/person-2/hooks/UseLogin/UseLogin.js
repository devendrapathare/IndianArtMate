import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useAuthContext } from '../../context/AuthContext/AuthContext'

const UseLogin = () => {

    const [loading, setloading] = useState(false)

    const { authUser,setauthUser } = useAuthContext()

    const login = async ({userName, password},setshowLogin) => {

        const success = handleInputErrors({ userName, password })
        if (!success) return
        

        setloading(true)
        try {
            // Create a request body object
            const requestBody = {};

            // Only include userName if it's provided
            if (userName.includes('@')) {
                requestBody.email = userName;
            }
            else{
                requestBody.userName = userName;
            }

            // Always include password if it's provided
            if (!password) {
                throw new Error('Password is required');
            }

            // Add password to request body
            requestBody.password = password;

            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json()

            if (data.error) {
                throw new Error(data.error)
            }
            localStorage.setItem('user-info', JSON.stringify(data))


            setauthUser(data)
            // console.log("data",data);

            if (setshowLogin) setshowLogin(false);
            

        } catch (error) {
            toast.error(error.message)
        } finally {
            setloading(false)
        }

    }

    return { loading, login }

}

function handleInputErrors({ userName, password }) {

    if(!userName){
        toast.error("username")
    }
    if(!password){
        toast.error("password")
        console.log("handle",password);
        
    }

    if (!userName  || !password) {
        toast.error('Please fill all the fields')
        return false
    }

    return true

}

export default UseLogin
