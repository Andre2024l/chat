import { Stack } from "react-bootstrap";
import avatar from "../../assets/avatar.svg";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";

const UserChat = ({chat, user}) => {
    const {recipientUser} = useFetchRecipientUser(chat, user);

    //console.log(recipientUser);
    return <Stack direction="horizontal" gap={3} className="user-card align-items-center p-2 justify-content-between" role="button">
        <div className="d-flex">
            <div className="me-2">
                <img src={avatar} height="35px" />
            </div>
            <div className="text-content">
                <div className="name">{recipientUser?.name}</div>
                <div className="text">Mensagem de Texto</div>
            </div>
         </div>
         <div className="d-flex flex-column align-items-end">
            <div className="date">
                25/04/2024
            </div>
            <div className="this-user-notifications">3</div>
            <span className="user-online"></span>
         </div>
    </Stack>
}

export default UserChat;