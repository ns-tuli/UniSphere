import { Flex} from "@chakra-ui/react";
import TopNavItem from "./TopNavItem";


const TopBar=({className})=>{
    
    
    

    return(
        
        <>
        <Flex mb={20} className={className} pos={"relative"}  w={"410px"} h={"50px"} flexDir={"row"} justifyContent={"space-between"}  maxW="100vw" transition="height 0.3s ease" overflowX={'hidden'} overflowY={"hidden"} backgroundColor={"#fff"}>
        
         <Flex
        
            
                flexDir="row"
                alignItems={"flex-start"}
                as="nav"
                mt={-3}
                
            >
         
                
         <TopNavItem navSize={"10px"} title="Chats"/>

         {/* <Link as={ChatIcon} boxSize={6} color="gray.500" mt={"30.5px"} mr={10}/> */}
         {/* <MoreVert/> */}
         {/* <Link as={HamburgerIcon} boxSize={6} color="gray.500" mt={"30.5px"} mr={12}/> */}

     
        </Flex> 

        

       </Flex>


        </>
    )
}

export default TopBar;