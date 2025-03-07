import { useContext, useEffect, useState } from "react";
import ChatFooter from "./ChatFooter";
import { AccountContext } from "../../../../context/AccountProvider";
import { addMessage } from "../../../../service/api";
import ChatBody from "./ChatBody";
import { Box } from "@chakra-ui/react";

const Message = ({ person, conversation }) => {
    const { account, socket } = useContext(AccountContext);
    const [msg, setMsg] = useState('');
    const [file, setFile] = useState();
    const [image, setImage] = useState();
    const [newMessageFlag, setNewMessageFlag] = useState(false);

    const sendText = async (e) => {
        const code = e.keyCode || e.which;
        if (code === 13) {
            let message = {};
            if (!file) {
                message = {
                    senderId: account.sub,
                    receiverId: person.sub,
                    conversationId: conversation._id,
                    type: 'text',
                    text: msg
                };
            } else {
                message = {
                    senderId: account.sub,
                    conversationId: conversation._id,
                    receiverId: person.sub,
                    type: 'file',
                    text: image
                };
            }
            socket.current.emit('sendMessage', message);
            await addMessage(message);
            setMsg('');
            setFile(null);
            setImage('');
            setNewMessageFlag(prev => !prev);
        }
    };

    return (
        <Box className="relative">
            <ChatBody conversation={conversation} person={person} newMessageFlag={newMessageFlag} />
            <ChatFooter file={file} sendText={sendText} setMsg={setMsg} msg={msg} setFile={setFile} setImage={setImage} />
        </Box>
    );
}

export default Message;
