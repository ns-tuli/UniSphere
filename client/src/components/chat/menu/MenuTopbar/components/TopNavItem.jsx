import React from 'react';
import {
  Flex,
  Text,
  Link,
  Menu,
  MenuButton,
  MenuList
} from '@chakra-ui/react';
import { FiMessageSquare, FiUsers, FiMail, FiSmile, FiBriefcase } from 'react-icons/fi';
import { useState } from "react";

const TopNavItem = ({ title, navSize, mr }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };
  return (
    <Flex
      className={`mt-15 flex-row w-full items-start ${mr}`}
    >
      <Menu placement="bottom-end" isOpen={menuOpen} onOpen={handleMenuToggle} onClose={() => setMenuOpen(false)}>
        <Link
          className={`p-3 rounded-lg hover:bg-transparent hover:no-underline w-${navSize === "large" ? "full" : "auto"}`}
        >
          <MenuButton
            className="w-full focus:outline-none focus:shadow-none hover:outline-none"
          >
            <Flex
              className="hover:outline-none hover:shadow-none focus:outline-none focus:shadow-none"
            >
              <Text className="text-20px ml-2 flex">{title}</Text>
            </Flex>
          </MenuButton>
        </Link>
        <MenuList className="py-0 border-none shadow-xl min-w-full max-w-screen">
          {/* Content can be added here */}
        </MenuList>
      </Menu>
    </Flex>
  );
}

export default TopNavItem;
