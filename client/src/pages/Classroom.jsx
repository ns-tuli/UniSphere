import React, { useState, useEffect, useCallback } from "react";
import ReactPlayer from "react-player";
import { useParams, useLocation } from "react-router-dom";
import Whiteboard from "../components/Whiteboard";
import { useSocket } from "../context/SocketContext";

const Classroom = () => {
  const { roomId } = useParams();
  const { state } = useLocation();
  const socket = useSocket();

  const room = localStorage.getItem("room");
  const email = localStorage.getItem("email");
  const emails = state?.email || '';  // Access email passed through state

  // Console log for debugging
  console.log("Room from LocalStorage:", room);
  console.log("Email from LocalStorage:", email);
  console.log("Email from State:", emails);

  const [myStream, setMyStream] = useState(null);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [muted, setMuted] = useState(false);
  const [remoteStream, setRemoteStream] = useState(null);
  const [remoteSocketId, setRemoteSocketId] = useState(null);

  const peer = new RTCPeerConnection();

  // Handle the user joining the room
  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room`);
    setRemoteSocketId(id);
  }, []);

  // Handle the start of the video
  const startVideo = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setMyStream(stream);
    setVideoEnabled(true);
    sendStreams(stream);
  };

  const sendStreams = useCallback((stream) => {
    for (const track of stream.getTracks()) {
      peer.addTrack(track, stream);
    }
  }, []);

  // Handle incoming call
  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log(`Incoming Call from ${from}`);
      const ans = await peer.createAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const handleCallAccepted = useCallback(async ({ from, ans }) => {
    try {
      await peer.setRemoteDescription(ans);
      sendStreams(myStream);
    } catch (err) {
      console.error("Error in handleCallAccepted", err);
    }
  }, [sendStreams, myStream]);

  useEffect(() => {
    // Ensure email and room values are correctly passed to the backend
    if (!email || !room) {
      console.error("Email or Room is missing!");
      return;
    }

    socket.emit("room:join", { email, room }); // Pass both email and room

    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
    };
  }, [email, room, socket, handleUserJoined, handleIncommingCall, handleCallAccepted]);

  const handleStopVideo = useCallback(() => {
    setVideoEnabled(false);
    myStream.getTracks().forEach((track) => track.stop());
    setMyStream(null);
  }, [myStream]);

  const handleMute = useCallback(() => {
    setMuted(!muted);
    myStream.getTracks().forEach((track) => track.kind === "audio" && (track.enabled = !muted));
  }, [muted, myStream]);

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex flex-col gap-20 w-[40%] p-4">
        {/* My Video Panel */}
        <div className="w-full h-[300px] text-center">
          <h2 className="text-black mb-2">My Video</h2>
          {videoEnabled ? (
            <ReactPlayer url={myStream} playing muted width="100%" height="100%" />
          ) : (
            <div className="border-2 border-yellow-200 h-full flex justify-center items-center text-white">
              Video sharing is turned off
            </div>
          )}
          <button onClick={videoEnabled ? handleStopVideo : startVideo} className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded">
            {videoEnabled ? "Stop Video" : "Start Video"}
          </button>
          <button onClick={handleMute} className="mt-2 ml-2 px-4 py-2 bg-yellow-600 text-white rounded">
            {muted ? "Unmute" : "Mute"}
          </button>
        </div>

        {/* Other's Video Panel */}
        <div className="w-full h-[300px] text-center">
          <h2 className="text-black-200 mb-2">Other's Video</h2>
          {remoteStream ? (
            <ReactPlayer url={remoteStream} playing muted width="100%" height="100%" />
          ) : (
            <div className="border-2 border-yellow-200 h-full flex justify-center items-center text-white">
              Waiting for other participant...
            </div>
          )}
        </div>
      </div>

      <div className="h-[60%] relative flex-grow">
        <Whiteboard roomId={roomId} socket={socket} />
      </div>
    </div>
  );
};

export default Classroom;
