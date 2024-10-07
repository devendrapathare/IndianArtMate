import axios from 'axios';
import { createContext, useEffect, useState } from 'react';
import { usePostContext } from '../PostContext/PostContext';
import { useAuthContext } from '../AuthContext/AuthContext';

export const HireContext = createContext();

const HireContextProvider = (props) =>{

    const [fetchHiring, setfetchHiring] = useState([])
    const { url } = usePostContext()
    const { authUser } = useAuthContext()

    const applyHire = async (ProjectOwnerId, ContributerId, ProjectOwnerDetails, ContributerDetails) => {
        console.log("ythi", ProjectOwnerId, ContributerId, ProjectOwnerDetails, ContributerDetails);
    
        // Create the HiringData object
        const HiringData = {
            ProjectOwnerId,
            ContributerId,
            ProjectOwnerDetails,
            ContributerDetails
        };
    
        try {
            const response = await axios.post(`${url}/api/hiring/postHire`, { HiringData });
        } catch (error) {
            console.error("Error fetching cart data:", error);
        }              
    }

    const fetchHiringData = async () => {
        try {
            const response = await axios.get(`${url}/api/hiring/getHire/${authUser?._id}`);
            setfetchHiring(response.data.HiringData)
            // console.log("hiringdata",response.data.HiringData);
        } catch (error) {
            console.error("Error fetching cart data:", error);
        }
    }
    // console.log("hiringdata",fetchHiring);
    useEffect(() => {
        fetchHiringData()
    }, [])
    
    
    

    const contextValue = {
        // your context value here
        applyHire,
        fetchHiringData,
        fetchHiring,
    }

    return (
        <HireContext.Provider value={contextValue}>
        {props.children}
        </HireContext.Provider>
    )
}

export default HireContextProvider