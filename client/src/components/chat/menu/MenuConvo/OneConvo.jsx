import { useContext } from "react";
import { AccountContext } from "../../../../context/AccountProvider";
import { setConversation } from "../../../../service/api";

const OneConvo = ({ user }) => {
    const { setPerson, account } = useContext(AccountContext);

    const getAUser = async () => {
        if (!account || !account.sub) {
            console.error("Account details are not available.");
            return; // Optionally, handle this case more gracefully
        }
    
        try {
            setPerson(user);
            await setConversation({ senderId: account.sub, receiverId: user.sub });
        } catch (error) {
            console.error("Failed to start conversation:", error);
        }
    };
    

    return (
        <div className="flex mt-1 cursor-pointer" onClick={getAUser}>
            <div className="mt-3">
                <img className="rounded-full h-11" src={user?.picture} alt="display picture" />
            </div>
            <div className="ml-3 mt-5">
                <p>{user?.name}</p>
            </div>
        </div>
    );
};

export default OneConvo;
