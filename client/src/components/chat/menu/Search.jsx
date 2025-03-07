import { Flex, Icon, Input } from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons';

const Search = ({ setText }) => {
    return (
        <Flex className="ml-16 mt-14 absolute z-20">
            <Input className="placeholder:text-gray-400 focus:border-none bg-[hsl(45,29%,95%)] pl-10 w-97 h-7.5" placeholder='Search or start a new chat' onChange={(e) => setText(e.target.value)} />
            <Flex className="absolute z-20 ml-1 mt-1.5">
                <Icon as={SearchIcon} />
            </Flex>
        </Flex>
    );
}

export default Search;
