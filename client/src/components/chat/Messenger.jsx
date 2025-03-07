import React, { useContext } from "react";
import ChatSidebar from "../../components/chat/modal/ChatSidebar";
import { AccountContext } from "../../context/AccountProvider";

const Messenger = () => {
    const { account } = useContext(AccountContext);

    return (
        <div className="overflow-hidden">
            <ChatSidebar className="sidebar" style={{ zIndex: 100 }} />
        </div>
    );
}

export default Messenger;
