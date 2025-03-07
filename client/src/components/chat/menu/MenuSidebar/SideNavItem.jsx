import React from 'react';
import { Flex, Text, Button, Icon } from '@chakra-ui/react';

const SideNavItem = ({ icon, title, navSize }) => {
    return (
        <Flex
            className={`mt-18 flex-col w-full items-center ${navSize === "small" ? "items-center" : "items-start"}`}
        >
            <Button
                className={`p-3 rounded-lg variant-ghost hover:bg-blue-200 w-full focus:outline-none focus:shadow-none ${navSize === "large" ? "w-full" : "w-auto"}`}
                onClick={() => {}}
            >
                <Flex align="center">
                    <Icon as={icon} className="text-xl text-gray-500" />
                    <Text className={`ml-5 ${navSize === "small" ? "hidden" : "flex"}`}>
                        {title}
                    </Text>
                </Flex>
            </Button>
        </Flex>
    );
}

export default SideNavItem;
