import { useContext, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import { unreadNotificationsFunc } from "../../utils/unreadNotifications";
import moment from "moment";

const Notification = () =>{
    const [isOpen, setIsOpen] = useState(false);
    const {user} = useContext(AuthContext);
    const {notifications, userChats, allUsers, markAllNotificationsAsRead,markNotificationsAsRead} = useContext(ChatContext);
    const unreadNotifications = unreadNotificationsFunc(notifications);
    const modifiedNotifications = notifications.map((n) =>{
        const sender = allUsers.find(user => user._id == n.senderId);

        return {
            ...n,
            senderName: sender?.name,
        }
    });
    
    console.log("un", unreadNotifications);
    console.log("mn", modifiedNotifications);


    return (<div className="notifications">
            <div className="notifications-icon" onClick={() =>setIsOpen(!isOpen)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-chat-right-fill" viewBox="0 0 16 16">
                <path d="M14 0a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2z"/>
                </svg>
                {unreadNotifications?.length === 0 ? null : (
                    <span className="notification-count">
                        <span>{unreadNotifications?.length}</span>
                    </span>
                )}
            </div>
            {isOpen ? <div className="notifications-box">
                <div className="notifications-header">
                    <h5>Notificações</h5>
                    <div className="mark-as-read" onClick={() => {markAllNotificationsAsRead(notifications);
                         setIsOpen(false);} }>Marcar como lidas</div>
                </div>
                {modifiedNotifications?.length === 0 ? <span className="notification">Sem notificações...</span> :
                 null}
                 {modifiedNotifications && modifiedNotifications.map((n, index) => {
                    return <div key={index} className={n.isRead ? 'notification' : 'notification not-read'}
                    onClick={() => {
                        markNotificationsAsRead(n,userChats,user,notifications);
                        setIsOpen(false);
                    }}
                    >
                            <span>{`${n.senderName} enviou uma nova mensagem`}</span>
                            <span className="notification-time">{moment(n.date).calendar()}</span>
                        </div>
                 })}
            </div> : null}
            
        </div> );
}
export default Notification;