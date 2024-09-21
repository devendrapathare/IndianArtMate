import React, { useState } from 'react'
import { useAuthContext } from '../../context/AuthContext/AuthContext'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const UseLogout = () => {

    const [loading, setloading] = useState(false)

    const { setauthUser } = useAuthContext()

    const navigate =  useNavigate();

    const logout = async () => {

        setloading(true)
        try {

            const res = await fetch("/api/auth/logout",{
                method: "POST",
                headers: {"Content-Type":"application/json"}
            })

            const data = await res.json()

            if (data.error) {
                throw new Error(data.error)
            }

            localStorage.removeItem("user-info")
            navigate('/')

            setauthUser(null)
            
        } catch (error) {
            toast.error(error.message)
        } finally{
            setloading(false)
        }
    }

    return { loading,logout }

}

export default UseLogout
