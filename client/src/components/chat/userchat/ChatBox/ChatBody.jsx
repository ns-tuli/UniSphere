import { Box, Image } from "@chakra-ui/react";
import { useContext, useEffect, useRef, useState } from "react";
import { getMessage } from "../../../../service/api";
import OneMessage from "./OneMessage";
import { AccountContext } from "../../../../context/AccountProvider";
import ExampleImage from './Shundoraa.jpg';

const ChatBody = ({ conversation, person, newMessageFlag, messageEndRef }) => {
    const [messages, setMessages] = useState([]);
    const [incomingMessage, setIncomingMessage] = useState(null);
    const { socket } = useContext(AccountContext);

    const scrollRef = useRef();

    useEffect(() => {
        socket.current.on('getMessage', data => {
            setIncomingMessage({
                ...data,
                createdAt: Date.now()
            });
        });
    }, []);

    useEffect(() => {
        incomingMessage && conversation?.members?.includes(incomingMessage.senderId) &&
            setMessages((prev) => [...prev, incomingMessage]);

    }, [incomingMessage, conversation]);

    useEffect(() => {
        const getMessageDetails = async () => {
            let data = await getMessage(conversation._id);
            console.log(data);
            setMessages(data);
        }
        getMessageDetails();
    }, [conversation._id, newMessageFlag])

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }, [messages]);

    return (
        <Box className="z-20 overflow-y-auto h-[76vh] bg-cover bg-center" style={{ backgroundImage: `url(${ExampleImage})` }}>
            {messages && messages.map(message => (
                <>
                    <Box key={message._id}>
                        <OneMessage message={message} />
                    </Box>
                    <div ref={scrollRef} />
                </>
            ))}
        </Box>
    );
}

export default ChatBody;
