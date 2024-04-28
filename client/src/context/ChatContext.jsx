import { createContext, useState, useEffect, useCallback } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";

export const ChatContext = createContext();

export const ChatContextProvider = ({children,user}) =>{
    const [userChats, setUserChats] = useState(null);
    const [isUserChatLoading, setIsUserChatLoading] = useState(false);
    const [userChatsError, setUserChatsError] = useState(null);
    const [potentialChats, setPotentialChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState(null);
    const [isMessagesLoading, setIsMessagesLoading] = useState(false);
    const [messagesError, setMessagesError] = useState(null);
    const [sendTextMessageError, setSendTextMessageError] = useState(null);
    const [newMessage, setNewMessage] = useState(null);
    
    console.log("Mensagens", messages);
    useEffect(() =>{
        const getUsers = async() =>{
            const response = await getRequest(`${baseUrl}/users`);
            if(response.error){
                return console.log("Erro ao carregar Lista de usuarios", response);
            }
        const pChats =  response.filter((u) =>{ 
            let isChatCreated = false;
            if(user?._id === u._id) return false;
            if(userChats){
              isChatCreated = userChats?.some((chat)=>{
                    return chat.members[0] === u._id || chat.members[1] === u._id;
                });
            }

            return !isChatCreated;
            });

            setPotentialChats(pChats);
        };
        getUsers();
    }, [userChats]);

    useEffect(()=>{
        const getUserChats = async()=>{
            if(user?._id){
                setIsUserChatLoading(true);
                setUserChatsError(null);
                const response = await getRequest(`${baseUrl}/chats/${user?._id}`);
                
                setIsUserChatLoading(false);
                if(response.error){
                    return setUserChatsError(response);
                }
                setUserChats(response);
              }
        }
        getUserChats();
    },[user]);

    useEffect(()=>{ //Para listagem de conversas
        const getMessages = async()=> {
                setIsMessagesLoading(true);
                setMessagesError(null);
                const response = await getRequest(`${baseUrl}/messages/${currentChat?._id}`);                
                setIsMessagesLoading(false);
                if(response.error){
                    return setMessagesError(response);
                }
                setMessages(response);
              };

        getMessages();
    },[currentChat]);//O parametro enviado como dependencia, pra caso altere.

    const sendTextMesage = useCallback( async(textMessage, sender, currentChatId, setTextMessage) => {
        if(!textMessage) return console.log("Por favor digite alguma coisa");
        const response = await postRequest(`${baseUrl}/messages`, JSON.stringify({
            chatId: currentChatId,
            senderId:  sender._id,
            text: textMessage
        }));

        if(response.error){
            return setSendTextMessageError(response);
        }

        setNewMessage(response);
        setMessages((prev)=> [...prev, response]);
        setTextMessage("");
    }, []);

    const updateCurrentChat = useCallback((chat) => {
        setCurrentChat(chat);  
        console.log(": ",currentChat);   
    },[]);

   // console.log("Conversa actual: ", currentChat);

    const createChat = useCallback( async(primeiroId, segundoId) => {
        const response = await postRequest(`${baseUrl}/chats`, JSON.stringify({
            firstId: primeiroId,
            secondId:  segundoId
        }));

        if(response.error){
            return console("Falha ao criar conversa", response);
        }
        setUserChats((prev) => [...prev, response]);   
    }, []);
    return (
    <ChatContext.Provider value={
        {
            userChats,
            userChatsError,
            isUserChatLoading,
            updateCurrentChat,
            potentialChats,
            createChat,
            messages,
            isMessagesLoading,
            messagesError,
            sendTextMesage            
        }
    }    
    >{children}
    </ChatContext.Provider>
    )
}