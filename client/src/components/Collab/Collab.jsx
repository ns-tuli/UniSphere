import React, { useState } from "react";
import RoomForm from "./RoomForm";
import CollabEditor from "./CollabEditor";

const Collab = () => {
  const [roomInfo, setRoomInfo] = useState(null);

  const handleJoinRoom = (info) => {
    setRoomInfo(info);
  };

  return (
    <div>
      {!roomInfo ? (
        <RoomForm onJoinRoom={handleJoinRoom} />
      ) : (
        <CollabEditor roomId={roomInfo.roomId} username={roomInfo.username} />
      )}
    </div>
  );
};

export default Collab;
