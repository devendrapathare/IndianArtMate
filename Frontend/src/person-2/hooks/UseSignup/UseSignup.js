import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useAuthContext } from '../../context/AuthContext/AuthContext'

const UseSignup = () => {

    const [loading, setloading] = useState(false)

    const { setauthUser } = useAuthContext()

    const signup = async ({userName,email,password,confirmPassword,gender},setshowLogin) => {
        
        
        const success = handleInputErrors({userName,email,password,confirmPassword,gender})
        if(!success) return false;

        setloading(true)

        try {

            const res = await fetch("/api/auth/signup",{
                method:'POST',
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({userName,email,password,confirmPassword,gender})
            })

            const data = await res.json()
            if(data.error) {
                throw new Error(data.error)
            }
            // So now we have to store the user data to the local storeage so that after refreshing the page the data will not get erases and for that purpose we will use the context like authContext
            localStorage.setItem("user-info",JSON.stringify(data))

            setauthUser(data)
            if (data.msg) {
                toast.error(data.msg)
            }
            console.log("from useSignup :",data);

            if (setshowLogin) setshowLogin(false);

            return true;
             
        } catch (error) {
            toast.error(error.message)
            return false;
        } finally{
            setloading(false)
        }
    }

    return { loading,signup  }

}

function handleInputErrors({userName,email,password,confirmPassword,gender}){
    if(!userName || !email || !password || !confirmPassword || !gender){
        toast.error('Please fill all the fields')
        return false
    }

    if (password != confirmPassword) {
        toast.error('Passwords do not match')
        return false
    }

    if (password.length<8) {
        toast.error("Password Must Contain atleast 8 characters")
        return false
    }

    return true
}

export default UseSignup
