import { Box, Flex, Image, Text, Link } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { AccountContext } from "../../../../context/AccountProvider";
import ProfileDrawer from "../../../profile/ProfileDrawer";
import { HamburgerIcon } from "@chakra-ui/icons";

const ChatHeader = ({ person }) => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const { activeUsers } = useContext(AccountContext);
    const which = 'right';

    const openDraw = () => {
        setOpenDrawer(true);
    };

    const handleClose = () => {
        setOpenDrawer(false);
    };

    return (
        <Flex className="overflow-hidden bg-[#FBCEB1] max-w-full w-full">
            <Box className="ml-1 mt-1 mb-1">
                <Link onClick={openDraw}>
                    <Image className="rounded-full h-12" src={person.picture} />
                </Link>
            </Box>
            <Box className="ml-1 mt-1 w-20">
                <Text className="whitespace-nowrap overflow-ellipsis">
                    {person.name}
                </Text>
                <Text className="whitespace-nowrap overflow-ellipsis">
                    {activeUsers?.find(user => user.sub === person.sub) ? 'Online' : 'Offline'}
                </Text>
            </Box>
            <HamburgerIcon className="cursor-pointer ml-[780px] mt-1.5" onClick={openDraw} />
        </Flex>
    );
}

export default ChatHeader;
