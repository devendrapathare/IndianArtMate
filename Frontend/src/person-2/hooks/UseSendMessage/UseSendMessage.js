import { useState } from "react"
import { useConversation } from "../../Zustand/UseConversation";
import toast from 'react-hot-toast'

const UseSendMessage = () =>{

    const [loading, setloading] = useState(false);

    const { messages,setMessages,selectedConversation } = useConversation()

    const sendMessage = async (message) => {

        setloading(true)
        // console.log('message',message);
        console.log('selectedConversation',selectedConversation);
        
        

        try {

            const response = await fetch(`/api/messages/send/${selectedConversation}`,{
                method: 'POST',
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify({message})
            })

            const data = await response.json()

            if (data.error) {
                throw new Error(data.error)
            }

            setMessages( [...messages, data] )
            
        } catch (error) {
            toast.error(error.message)
        }
        finally {
            setloading(false)
        }

    }

    return {sendMessage,loading}

}

export default UseSendMessage;