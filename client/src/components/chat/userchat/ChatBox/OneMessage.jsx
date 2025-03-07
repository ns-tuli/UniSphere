import { Box, Text, Flex } from "@chakra-ui/react";
import { useContext } from "react";
import { AccountContext } from "../../../../context/AccountProvider";
import { formatDate, downloadMedia } from "../../../../utils/common-utils";
import { FiClock, FiDownload } from "react-icons/fi";

const iconPDF = 'https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/27_Pdf_File_Type_Adobe_logo_logos-512.png';

const OneMessage = ({ message }) => {
    const { account } = useContext(AccountContext);

    return (
        <>
            {account.sub === message.senderId ?
                (message.type === 'file' ? 
                    <SenderImage message={message} /> :
                    <SenderText message={message} />)
                :
                (message.type === 'file' ? 
                    <ReceiverImage message={message} /> :
                    <ReceiverText message={message}/>)
            }
        </>
    );
}

const SenderText = ({ message }) => {
    return (
        <Box className="flex justify-end mt-3 mb-3 ml-auto mr-5 bg-mistyrose w-fit-content rounded-lg">
            <Box className="pl-5 pr-5 pt-2 pb-2">
                <p>{message.text}</p>
                <Text className="text-sm flex justify-end">{formatDate(message.createdAt)}</Text>
            </Box>
        </Box>
    );
}

const ReceiverText = ({ message }) => {
    return (
        <Box className="flex justify-end mt-3 mb-3 ml-5 mr-auto bg-white w-fit-content rounded-lg">
            <Box className="pl-5 pr-5 pt-2 pb-2">
                <p>{message.text}</p>
                <Text className="text-sm flex justify-end">{formatDate(message.createdAt)}</Text>
            </Box>
        </Box>
    );
}

const SenderImage = ({ message }) => {
    return (
        <Box className="flex justify-end mt-3 mb-3 ml-auto mr-5 bg-mistyrose w-fit-content rounded-lg">
            <Box className="p-2">
                {message?.text?.includes('.pdf') ?
                    <div className="flex flex-col items-center">
                        <img className="w-30 max-h-3000 object-cover rounded-lg" src={iconPDF} alt="pdf-icon" />
                        <Text className="text-sm">{message.text.split("/").pop()}</Text>
                    </div>
                    : 
                    <img className="max-w-lg max-h-3000 object-cover rounded-lg" src={message.text} alt={message.text} />
                }
                <Flex className="mt-1 items-center">
                    <FiDownload
                        onClick={(e) => downloadMedia(e, message.text)}
                        className="mr-2.5 border border-gray-400 rounded-full cursor-pointer p-1"
                        size="large"
                    />
                    <Flex className="ml-auto mr-2 text-sm text-gray-500 items-center">
                        <FiClock className="mr-1" />
                        {formatDate(message.createdAt)}
                    </Flex>
                </Flex>
            </Box>
        </Box>
    );
}

const ReceiverImage = ({ message }) => {
    return (
        <Box className="flex justify-end mt-3 mb-3 ml-5 mr-auto bg-white w-fit-content rounded-lg">
            <Box className="p-2">
                {message?.text?.includes('.pdf') ?
                    <div className="flex flex-col items-center">
                        <img className="w-30" src={iconPDF} alt="pdf-icon" />
                        <Text className="text-sm">{message.text.split("/").pop()}</Text>
                    </div>
                    :
                    <img className="max-w-lg max-h-3000 object-cover rounded-lg" src={message.text} alt={message.text} />
                }
                <Flex className="mt-1 items-center">
                    <FiDownload
                        onClick={(e) => downloadMedia(e, message.text)}
                        className="mr-2.5 border border-gray-400 rounded-full cursor-pointer p-1"
                        size="large"
                    />
                    <Flex className="ml-auto mr-2 text-sm text-gray-500 items-center">
                        <FiClock className="mr-1" />
                        {formatDate(message.createdAt)}
                    </Flex>
                </Flex>
            </Box>
        </Box>
    );
}

export default OneMessage;
