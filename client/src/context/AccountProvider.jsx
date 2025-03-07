import { createContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
export const AccountContext= createContext(null);

const AccountProvider=({children})=>
{
    const [account, setAccount]= useState(null);
    const [person, setPerson]= useState({});
    const [activeUsers, setActiveUsers] = useState([]);
    const [about, setAbout]= useState('');
    const socket = useRef();
    const [login, setLogin]= useState('0');

    useEffect(() => {
        socket.current = io('ws://localhost:9000');
    }, [])

    useEffect(() => {
        if (account && account.about !== undefined) {
            setAbout(account.about);
        } else {
            setAbout('');
        }
    }, [account]);
    return(
        <>
        <AccountContext.Provider value={{
            account, setAccount, person, setPerson, activeUsers, setActiveUsers, socket, about, setAbout, login, setLogin
        }}>
            {children}
        </AccountContext.Provider>
        </>
    )
}

export default AccountProvider;