import { Box, Flex, Input } from "@chakra-ui/react";
import { FiPaperclip, FiSmile, FiMic } from "react-icons/fi";
import { uploadFile } from "../../../../service/api";
import { useEffect } from "react";

const ChatFooter = ({ sendText, setMsg, msg, setFile, file, setImage }) => {
    const onFileChange = (e) => {
        setMsg(e.target.files[0].name);
        setFile(e.target.files[0]);
    };

    useEffect(() => {
        const getFile = async () => {
            if (file) {
                const data = new FormData();
                data.append("name", file.name);
                data.append("file", file);
                const response = await uploadFile(data);
                setImage(response.data);
            }
        };
        getFile();
    }, [file]);

    return (
        <Box className="z-25 bg-[#FAF9F6] mb-148 w-full h-10">
            <Flex className="mt-1 ml-1">
                <Box className="mr-1 mt-0.5">
                    <FiSmile size="20px" />
                </Box>
                <Box className="mt-0.5">
                    <label htmlFor="fileInput">
                        <FiPaperclip size="20px" />
                    </label>
                    <input type="file" id="fileInput" className="hidden" onChange={onFileChange} />
                </Box>
                <Input className="z-1000 placeholder:text-gray-800 font-normal ml-1 h-2 _hover:outline-none _hover:shadow-none opacity-30 border-none max-w-full w-full mt-0.5" placeholder="Type a message" onChange={(e) => setMsg(e.target.value)} onKeyDown={(e) => sendText(e)} value={msg} />
                <Box className="ml-0.5 mt-0.5">
                    <FiMic />
                </Box>
            </Flex>
        </Box>
    );
}

export default ChatFooter;
