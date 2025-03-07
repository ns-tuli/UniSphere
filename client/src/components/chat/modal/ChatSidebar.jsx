import { Flex, Box } from "@chakra-ui/react";
import ChatModal from "./ChatModal";
import EmptyChat from "../userchat/EmptyChat";
import Menu from "../menu/Menu";
import ChatBox from "../userchat/ChatBox/ChatBox";
import { useContext } from "react";
import { AccountContext } from "../../../context/AccountProvider";

const ChatSidebar = ({ className }) => {
    const { person } = useContext(AccountContext);

    return (
        <Flex className={`absolute overflow-hidden ${className} shadow-md w-full h-1/4 flex-row justify-between bg-[#FBCEB1] transition-height duration-300 ease-in`}>
            <ChatModal>
                <Flex>
                    <Box>
                        <Menu />
                    </Box>
                    <Box className="z-100 bg-[#fafafa] border-l border-gray-200 overflow-hidden">
                        {Object.keys(person).length ? <ChatBox /> : <EmptyChat />}
                    </Box>
                </Flex>
            </ChatModal>
        </Flex>
    );
}

export default ChatSidebar;
