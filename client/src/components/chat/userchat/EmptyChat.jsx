import { Flex, Image, Box } from "@chakra-ui/react";

const EmptyChat = () => {
    return (
        <Box className="max-w-full w-full">
            <Flex className="justify-center items-center bg-[#fafafa]">
                <Image className="justify-center h-62 mt-40" src="https://i.gadgets360cdn.com/large/whatsapp_multi_device_support_update_image_1636207150180.jpg" />
            </Flex>
            <Box className="ml-75 mt-7.5 w-125">
                <p>Send and receive messages without keeping your phone online</p>
            </Box>
        </Box>
    );
}

export default EmptyChat;
