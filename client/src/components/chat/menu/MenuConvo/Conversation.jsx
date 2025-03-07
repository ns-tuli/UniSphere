import { Box, Divider } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getUsers } from "../../../../service/api.js"
import OneConvo from "./OneConvo.jsx"
import { AccountContext } from "../../../../context/AccountProvider";
import { useContext } from "react";

const Conversation = ({ text }) => {
    const [users, setUsers] = useState([]);
    const { account, setActiveUsers, socket } = useContext(AccountContext);

    useEffect(() => {
        const fetchData = async () => {
            let response = await getUsers();
            let filteredData = response.filter(user => user.name.toLowerCase().includes(text.toLowerCase()));
            console.log(response);
            setUsers(filteredData);
        }
        fetchData();
    }, [text]);

    useEffect(() => {
        socket.current.emit("addUser", account);
        socket.current.on("getUsers", (users) => {
            setActiveUsers(users);
        });

        return () => {
            socket.current.emit('userDisconnected');
            socket.current.off("getUsers");
        };
    }, [account]);

    return (
        <Box className="absolute z-100 mt-40 ml-5">
            {
                users && users?.map((user, index) => (
                    user?.sub !== account?.sub &&
                    <>
                        <OneConvo user={user} />
                        <Divider className="p-2 opacity-60" />
                    </>
                ))
            }
        </Box>
    );
}

export default Conversation;
