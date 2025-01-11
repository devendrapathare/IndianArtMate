import React, { useEffect, useState } from 'react'
import { useConversation } from '../../Zustand/UseConversation'
import toast from 'react-hot-toast'

const UseGetMessages = () => {

    const [loading, setloading] = useState(false)

    const { messages, setMessages, selectedConversation } = useConversation()

    useEffect(() => {

        const getMessages = async () => {
            
            setloading(true)

            try {

                const res = await fetch(`/api/messages/${selectedConversation}`)
                
                const data = await res.json()

                if (data.error) {
                    throw new Error(data.error)
                }

                setMessages(data)       

            } catch (error) {
                toast.error(error.message)
            } finally {
                setloading(false)
            }

        }
        if (selectedConversation) {
            getMessages()
        }

    }, [selectedConversation, setMessages])
    
    return { messages, loading }

}

export default UseGetMessages