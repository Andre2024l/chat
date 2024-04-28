import { useEffect, useState } from "react";
import { baseUrl, getRequest } from "../utils/services";

export const useFetchRecipientUser = (chat, user) =>{
    const [recipientUser, setRecipientUser] = useState(null);
    const [error, setError] = useState(null);

    const recipientId = `662e3423c79854a8141f2b67`;
    // chat?.members.find((id)=> id !== user?._id);    
    useEffect(()=>{
        const getUser = async()=>{
            if(!recipientId) return null;

           // const response = await getRequest(`${baseUrl}/users/find/${recipientId}`);

            const response = await getRequest(`${baseUrl}/users/find/${recipientId}`);                
            //console.log("-----------: ",response);

            if(response.error){
                console.log(error);
                return setError(error);
            }

            setRecipientUser(response);
        };

        getUser();
    }, [recipientId]);
    return {recipientUser}
}