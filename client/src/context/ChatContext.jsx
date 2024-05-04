import { createContext, useState, useEffect, useCallback } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";
import { io } from "socket.io-client"

export const ChatContext = createContext()
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
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    
    console.log("CurrentChat: ",currentChat);
    console.log("Notifications", notifications);

    console.log("Mensagens", messages);
    console.log("Usuarios online", onlineUsers);

    //Inicializacao do socket
    useEffect(() => {
        const newSocket = io("http://localhost:3000");
        setSocket(newSocket);       
        
        return () =>{
            newSocket.disconnect();
        }
    }, [user]); //Dependencia do user, para que sempre que algum ficar online, o socket seja criado

    useEffect(()=>{ //Use efect responsavel por buscar os usuarios online
        if(socket === null) return 
        socket.emit("addNewUser", user?._id);
        socket.on("getOnlineUsers", (res) =>{
            setOnlineUsers(res);
        });

        return () => {
            socket.off("getOnlineUsers");
        };
    }, [socket]);

    //Envio de mensagens
    useEffect(()=>{ //Use efect responsavel por buscar os usuarios online
        if(socket === null) return; 
        const recipientId = currentChat?.members?.find((id) => id !== user?._id);
        socket.emit("sendMessage", {...newMessage, recipientId});
    }, [newMessage]); //Envia ao Socket Server que existe nova mensagem

    //Recepcao de mensagens e Notificacoes
    useEffect(()=>{ 
        if(socket === null) return; 
        socket.on("getMessage", res =>{
            if(currentChat?._id !== res.chatId) return;

            setMessages((prev) => [...prev, res]);
        });//Adiciona a mensagem recebida no sinal para o array.

        socket.on("getNotification", (res) =>{
            const isChatOpen = currentChat?.members.some(id => id === res.senderId);

            if(isChatOpen){
                setNotifications(prev => [{...res, isRead: true}, ...prev]);
            } else {
                setNotifications(prev => [res, ...prev]);
            }
        });
        return () =>{
            socket.off("getMessage");
            socket.off("getNotification");
        }
    }, [socket, currentChat]);


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
                console.log("U - id: ", u.id);
              isChatCreated = userChats?.some((chat)=>{
                    return chat.members[0] === u._id || chat.members[1] === u._id;
                });
            } 

            return !isChatCreated; 
            });

            setPotentialChats(pChats);
            setAllUsers(response);
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
    },[user, notifications]);

    useEffect(()=>{
        const getMessages = async()=>{
                setIsMessagesLoading(true);
                setMessagesError(null);
                const response = await getRequest(`${baseUrl}/messages/${currentChat?._id}`);
                
                setIsMessagesLoading(false);
                if(response.error){
                    return setMessagesError(response);
                }
                setMessages(response);
        }
        getMessages();
        
    },[currentChat]);


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
    //Funcao para marcar notificacoes como lidas
    const markAllNotificationsAsRead = useCallback((notifications) => {
        const mNotifications = notifications.map((n)=> {
            return {...n, isRead: true};
    });
    setNotifications(mNotifications);
    },[])

    const markNotificationsAsRead = useCallback((n, userChats, user, notifications) => {
       //Procurar a conversa a abrir
       const desiredChat = userChats.find((chat) =>{
        const chatMembers = [user._id, n.senderId];
        const  isDesiredChat = chat?.members.every((member) =>{
            return chatMembers.includes(member);
        });

        return isDesiredChat;
       });
       
       //Marcar a notificação como ja lida

       const mNotifications = notifications.map(el =>{
        if(n.senderId == el.senderId){
            return {...n, isRead: true}
        }
        else{
            return el;
        }
       });
       updateCurrentChat(desiredChat);
       setNotifications(mNotifications);
    }, [])

    const markThisUserNotificationsAsRead = useCallback((thisUserNotifications, notifications) =>{
        const mNotifications = notifications.map(el =>{
            let notification;
            thisUserNotifications.forEach(n => {
                if(n.senderId === el.senderId){
                    notification = {...n, isRead: true}
                } else{
                    notification = el;
                }
            });

            return notification
        });

        setNotifications(mNotifications);
    }, [])
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
            currentChat,
            onlineUsers,
            notifications,
            allUsers,
            markAllNotificationsAsRead,
            markNotificationsAsRead,
            markThisUserNotificationsAsRead,
            sendTextMesage            
        }
    }    
    >{children}
    </ChatContext.Provider>
    )
}