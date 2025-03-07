import { HamburgerIcon } from "@chakra-ui/icons";
import { Button, Icon, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { useState } from "react";

const MoreVert = () => {
    const [opensProfile, setOpensProfile] = useState(false);

    const handleToggle = () => {
        setOpensProfile(!opensProfile);
    };

    return (
        <Menu isOpen={opensProfile} onClose={() => setOpensProfile(false)}>
            <MenuButton as={Button} className="link focus:outline-none focus:shadow-none" onClick={handleToggle}>
                <Icon as={HamburgerIcon} className="box-7 text-gray-500 mt-6 mr-2" />
            </MenuButton>
            <MenuList className="relative ml-32 mt-[-16px] fixed right-0 z-100">
                <MenuItem>New Window</MenuItem>
                <MenuItem>Open Closed Tab</MenuItem>
                <MenuItem>Open File</MenuItem>
            </MenuList>
        </Menu>
    );
}

export default MoreVert;
