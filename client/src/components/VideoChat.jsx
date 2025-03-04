import React, { useEffect, useRef, useState } from "react";
import { useSocket } from "../context/SocketContext";

const VideoChat = () => {
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const videoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const socket = useSocket();

  useEffect(() => {
    const startVideo = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setMyStream(stream);
      videoRef.current.srcObject = stream;
    };
    startVideo();
  }, []);

  socket.on("video:incomingCall", async ({ from, offer }) => {
    const peerConnection = new RTCPeerConnection();
    myStream.getTracks().forEach(track => peerConnection.addTrack(track, myStream));
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    socket.emit("video:answer", { to: from, answer });
  });

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-lg font-bold">Video Chat</h2>
      <video ref={videoRef} autoPlay muted className="w-64 border" />
      <video ref={remoteVideoRef} autoPlay className="w-64 border mt-4" />
    </div>
  );
};

export default VideoChat;
