import React from 'react';
import { Box, useDisclosure } from '@chakra-ui/react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
} from '@chakra-ui/react';


const ChatModal = ({children}) => {
  const {onClose } = useDisclosure();

    

     //curly braces for useContext, normal braces for create Context, square bracket for useState
  return (
    <>
      

      <Modal closeOnOverlayClick={false} isOpen={true} onClose={onClose}>
        
        <ModalContent   borderRadius={"none"} 
       overflow={"hidden"}
        maxW={"4000px"}
         height="92vh" 
        boxShadow={"0 4px 12px rgba(0, 0, 0, 0.4)"} 
        m={6}
        p={0}
        zIndex={100}
        >
          {/* <ModalHeader 
          // fontSize={25} 
          // pl={10} 
          // pt={16}
          ></ModalHeader> */}
         
         
          <ModalBody 
          // pl={10} 
          // pt={3}
          overflow={"hidden"}
          p={0}
          pt={0}
           >
            
           {children}
          </ModalBody>
          
        </ModalContent>
      </Modal>
    </>
  );
};

export default ChatModal;