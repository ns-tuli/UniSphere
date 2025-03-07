import React, { useContext, useState } from 'react';
import {
    Flex,
    Avatar,
    Button
} from '@chakra-ui/react';
import SideNavItem from './SideNavItem';
import { MoonIcon } from '@chakra-ui/icons';
import { AccountContext } from '../../../../context/AccountProvider';
import ProfileDrawer from '../../../profile/ProfileDrawer';
import { FiLogOut } from 'react-icons/fi';

export default function Sidebar() {
    const [navSize, changeNavSize] = useState("small");
    const { account, setLogin, setAccount, person } = useContext(AccountContext);
    const [openDrawer, setOpenDrawer] = useState(false);
    const which = 'left';

    const openDraw = () => {
        setOpenDrawer(true);
    };

    const handleClose = () => {
        setOpenDrawer(false);
    };

    const LogOut = () => {
        setAccount(null);
        setLogin('0');
    };

    return (
        <Flex
            className={`sticky top-0 z-20 shadow-md rounded-none ${navSize === "small" ? "w-15" : "w-50"} flex-col justify-between h-screen`}
            onClick={LogOut}
        >
            <Flex
                className="flex-col w-full items-center nav"
            >
                <SideNavItem navSize={navSize} icon={FiLogOut} title="Calendar" />
            </Flex>

            <Flex
                className="p-1 flex-col w-full items-center mb-20"
            >
                <Button className="link focus:outline-none focus:shadow-none" onClick={openDraw}>
                    <Avatar size="sm" src={account?.picture} />
                </Button>
            </Flex>
            <ProfileDrawer open={openDrawer} onClose={handleClose} user={account} which={which} />
        </Flex>
    );
}
