import React, { useEffect, useState } from 'react'
import { useAuthContext } from '../../context/AuthContext/AuthContext'
import { useConversation } from '../../Zustand/UseConversation'

const UserGetUserAllConversations = () => {

    const [loading, setloading] = useState(false)

    const [AllConversationId, setAllConversationId] = useState([])

    const { authUser } = useAuthContext()

    const { messages, setMessages} = useConversation()


    useEffect(() => {

        const getConversations = async () => {

            setloading(true)

            try {

                const response = await fetch(`/api/messages/getUserAllConversations/${authUser._id}`)

                const data = await response.json()

                // console.log('data',data);

                if (data.error) {
                    throw new Error(data.error)
                }

                const sortedConversations = data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                // console.log('data', data);
                // console.log('sortedConversations', sortedConversations);



                setAllConversationId(sortedConversations)

            } catch (error) {
                toast.error(error.message)
            } finally {
                setloading(false)
            }

        }

        getConversations()

    }, [authUser,setMessages,messages])

    return { AllConversationId, loading }

}

export default UserGetUserAllConversations