import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    Button,
    Input,
    Flex,
    Box,
    Image,
    Text,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import React, { useContext, useState, useEffect } from 'react';
import { AccountContext } from '../../context/AccountProvider';
import { uploadAbout, getUserBySub } from '../../service/api';

const ProfileDrawer = ({ open, onClose, user, which }) => {
    const { setAccount, setAbout } = useContext(AccountContext);
    const [tempAbout, setTempAbout] = useState('');
    const drawerClass = which === 'left' ? "drawer-left" : "drawer-right";

    useEffect(() => {
        if (user && user.sub) {
            const fetchUser = async () => {
                try {
                    const fetchedUser = await getUserBySub(user.sub);
                    setTempAbout(fetchedUser.about || '');
                } catch (error) {
                    console.error('Error fetching user:', error);
                }
            };
            fetchUser();
        }
    }, [user]);

    const handleInputChange = (e) => {
        setTempAbout(e.target.value);
    };

    const setAb = async (e) => {
        const code = e.keyCode || e.which;
        if (code === 13) { // enter key
            try {
                await uploadAbout({ sub: user.sub, about: tempAbout });
                setAccount(prev => ({ ...prev, about: tempAbout }));
                setAbout(tempAbout);
            } catch (error) {
                console.error('Error updating about information:', error);
            }
        }
    };

    return (
        <Drawer isOpen={open} placement={which} onClose={onClose} className={`${drawerClass}`}>
            <DrawerOverlay className="bg-transparent" />
            <DrawerContent className={`w-${which === 'left' ? '470px' : '420px'} max-w-${which === 'left' ? '470px' : '420px'} h-178.375 ml-${which === 'left' ? '6' : '0'} mr-${which === 'right' ? '6' : '0'} mt-6`}>
                <Flex className="overflow-hidden bg-mistyrose h-32.75">
                    <Button variant="link" onClick={onClose} className="focus:outline-none focus:shadow-none">
                        <ArrowBackIcon />
                    </Button>
                    <DrawerHeader className="ml-2 mt-8">Profile</DrawerHeader>
                </Flex>
                <DrawerBody className="overflow-hidden">
                    <Box className="flex justify-center">
                        <Image src={user?.picture} className="rounded-full justify-center" />
                    </Box>

                    <Box className="bg-mistyrose ml-[-2rem] mt-3 w-132 h-30 flex flex-col justify-end">
                        <Box className="ml-4 mb-8">
                            <p>Your Name</p>
                            <Box className="ml-4 mt-6">
                                <p>{user?.name}</p>
                            </Box>
                        </Box>
                    </Box>
                    <Box className="bg-white ml-[-2rem] mt-0 w-132 h-30 flex flex-col">
                        <Box className="ml-4 mb-1 mt-4">
                            <Text className="text-lg mb-1">About</Text>
                        </Box>
                        {user?.about ? (
                            <Box className="ml-4">
                                <Text className="ml-4 mt-2">{user?.about}</Text>
                            </Box>
                        ) : (
                            <Box className="ml-4">
                                <Input
                                    className="w-100"
                                    value={tempAbout}
                                    onChange={handleInputChange}
                                    onKeyDown={setAb}
                                    placeholder="Tell us something about you..."
                                />
                            </Box>
                        )}
                    </Box>
                    <Box className="bg-mistyrose ml-[-2rem] mt-0 w-132 h-82.5 flex flex-col justify-end"></Box>
                </DrawerBody>
            </DrawerContent>
            <DrawerFooter>
            </DrawerFooter>
        </Drawer>
    );
};

export default ProfileDrawer;
