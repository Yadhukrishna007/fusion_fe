import { useDispatch, useSelector } from "react-redux";
import ChatSection from "../components/chatSection";
import SidePanel from "../components/sidePanel";
import DefaultSection from "../components/defaultSection";
import ActiveChats from "../components/activeChats.js";
import { SocketContext } from "../components/context/index.js";
import {
  storeOpenConversation,
  updateGroupPic,
  createGroup,
  updateGroupInfo,
  updateUserInfo,
  updateUserPic,
} from "../store/chatSlice.js";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { updateMessagesAndConversations } from "../store/chatSlice";
import { storeOnlineusers } from "../store/userSlice.js";
import { SearchContext } from "../components/context/index.js";
import Call from "../components/call/Call.js";
import Peer from "simple-peer";
import UpdatePhoto from "../components/UpdatePhoto.js";
import Preview from "../components/activeChats.js/preview.js/index.js";
import { findReceiverId } from "../utils/findReceiverDetails.js";

const Home = ({ socket }) => {
  const user = useSelector((store) => store.user.user);
  const { files, activeConversation } = useSelector((store) => store.chat);

  const dispatch = useDispatch();
  const [typing, setTyping] = useState(false);
  const token = user.token;
  const [groupVisible, setGroupVisible] = useState(false);
  const [toggleSearch, setToggleSearch] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const searchInputRef = useRef(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  //Calling---------------->
  const [me, setMe] = useState("");
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(true);
  const [name, setName] = useState("");
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const [initiator, setInitiator] = useState(false);
  const [switchVideo, setSwitchVideo] = useState(false);
  const [receiverId, setReceiverId] = useState("");
  const [error, setError] = useState(false);
  const data = useSelector((store) => store.photo);

  //join user into the socket io
  useEffect(() => {
    const hasReloaded = sessionStorage.getItem("hasReloaded");

    if (hasReloaded === "true") {
      window.location.reload();
      sessionStorage.setItem("hasReloaded", "false");
    }
  }, []);
  useEffect(() => {
    function handleGetOnlineUsers(users) {
      dispatch(storeOnlineusers(users));
    }

    function handleSetupSocket(userId) {
      setMe(userId);
    }

    // Emit join event
    socket.emit("join", user.userId);

    // Add event listeners
    socket.on("get-online-users", handleGetOnlineUsers);
    socket.on("setup_socket", handleSetupSocket);

    // Cleanup function to remove event listeners
    return () => {
      socket.off("get-online-users", handleGetOnlineUsers);
      socket.off("setup_socket", handleSetupSocket);
    };
  }, []);

  useEffect(() => {
    const callUser = (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    };

    const userState = () => {
      setError(true);
    };

    const endCall = () => {
      setStream(null);
      myVideo.current.srcObject = null;
      if (userVideo && userVideo.current) {
        userVideo.current.srcObject = null;
      }

      window?.localStream?.getTracks().forEach((track) => {
        track.stop();
      });

      setCallEnded(true);
      setCallAccepted(false);
      setReceivingCall(false);
      setInitiator(false);
      setCallAccepted(false);
      setReceiverId(false);
      setCaller(null);
      setSwitchVideo(false);
      setCaller("");

      connectionRef?.current?.destroy();
      connectionRef.current = null;
      socket.emit("join", user.userId);
    };

    socket.on("callUser", callUser);
    socket.on("user_not_online", userState);
    socket.on("end call", endCall);

    return () => {
      socket.off("callUser", callUser);
      socket.off("user_not_online", userState);
      socket.off("end call", endCall);
    };
  }, []);

  const callUser = () => {
    setInitiator(true);
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        window.localStream = stream;
        setStream(stream);

        myVideo.current.srcObject = stream;
        const peer = new Peer({
          initiator: true,
          trickle: false,
          stream: stream,
        });
        peer.on("signal", (data) => {
          socket.emit("callUser", {
            userToCall: findReceiverId(user.userId, activeConversation.users),
            signalData: data,
            from: me,
            name: user.name,
          });
        });
        peer.on("stream", (stream) => {
          userVideo.current.srcObject = stream;
        });

        peer.on("close", () => {
          socket.off("callAccepted");
        });

        peer.on("error", (err) => {
          alert("Connection error.Please try again later");
        });

        socket.on("callAccepted", (data) => {
          const { signal, receiverId } = data;

          setReceiverId(receiverId);
          setCallAccepted(true);
          setSwitchVideo(true);
          setCallEnded(false);

          peer.signal(signal);
        });

        connectionRef.current = peer;
      })
      .catch((err) => {
        alert("Connection error.Please try again later");
      });
  };

  const answerCall = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        window.localStream = stream;
        setStream(stream);

        myVideo.current.srcObject = stream;
        setSwitchVideo(true);
        setCallAccepted(true);
        setCallEnded(false);
        const peer = new Peer({
          initiator: false,
          trickle: false,
          stream: stream,
        });
        peer.on("signal", (data) => {
          socket.emit("answerCall", {
            signal: data,
            to: caller,
            receiverId: me,
          });
        });
        peer.on("stream", (stream) => {
          userVideo.current.srcObject = stream;
        });

        peer.on("close", () => {});

        peer.on("error", (err) => {
          alert("Connection error.Please try again later");
        });

        peer.signal(callerSignal);

        connectionRef.current = peer;
      })
      .catch((err) => {
        alert("Connection error.Please try again later");
      });
  };

  const leaveCall = () => {
    setError(false);
    myVideo.current.srcObject = null;
    if (userVideo && userVideo.current) {
      userVideo.current.srcObject = null;
    }

    setStream(null);
    window?.localStream?.getTracks().forEach((track) => {
      track.stop();
    });

    setCallEnded(true);
    setReceivingCall(false);
    setInitiator(false);
    setCallAccepted(false);

    if (caller) {
      socket.emit("end call", { flag: false, socketId: caller });
    } else if (receiverId) {
      socket.emit("end call", { flag: false, socketId: receiverId });
    } else {
      socket.emit("end call", {
        flag: true,
        id: findReceiverId(user.userId, activeConversation.users),
      });
    }
    setCaller("");
    setReceiverId(false);
    setSwitchVideo(false);

    connectionRef?.current?.destroy();
    connectionRef.current = null;

    socket.emit("join", user.userId);
  };

  //get Conversations
  useEffect(() => {
    if (user?.token) {
      getConversation();
    }
  }, []);

  useEffect(() => {
    const receiveMessage = (message) => {
      dispatch(updateMessagesAndConversations(message));
    };
    // Typing
    const startTyping = (conversationId) => {
      setTyping(conversationId);
    };
    const stopTyping = () => {
      setTyping(false);
    };

    const creatingGroup = (data) => {
      dispatch(createGroup(data));
    };

    const updatingGroupPic = (data) => {
      dispatch(updateGroupPic(data));
    };
    const updatingGroupInfo = (data) => {
      dispatch(updateGroupInfo(data));
    };
    const updatingUserInfo = (data) => {
      dispatch(updateUserInfo(data));
    };
    const updatingUserPic = (data) => {
      dispatch(updateUserPic(data));
    };

    socket.on("receive_message", receiveMessage);
    socket.on("start_typing", startTyping);
    socket.on("stop_typing", stopTyping);
    socket.on("create_group", creatingGroup);
    socket.on("update_group_pic", updatingGroupPic);
    socket.on("update_group_info", updatingGroupInfo);
    socket.on("update_user_info", updatingUserInfo);
    socket.on("update_user_pic", updatingUserPic);

    return () => {
      socket.off("receive_message", receiveMessage);
      socket.off("start_typing", startTyping);
      socket.off("stop_typing", stopTyping);
      socket.off("create_group", creatingGroup);
      socket.off("update_group_pic", updatingGroupPic);
      socket.off("update_group_info", updatingGroupInfo);
      socket.off("update_user_info", updatingUserInfo);
      socket.off("update_user_pic", updatingUserPic);
    };
  }, []);

  const getConversation = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_ENDPOINT}/conversation/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const conversationData = res.data.conversation; //Array

      dispatch(storeOpenConversation(conversationData));
    } catch (error) {
      alert("Unexpected error.");
    }
  };

  const disconnetSocket = () => {
    socket.disconnect();
  };

  return (
    <>
      <div className=" relative h-screen w-screen  bg-light-soft-gray_dark-black  flex overflow-hidden">
        {files?.length > 0 && <Preview files={files} />}

        {(data.file || data.default) && <UpdatePhoto data={data} />}
        <Call
          me={me}
          stream={stream}
          receivingCall={receivingCall}
          caller={caller}
          callerSignal={callerSignal}
          callAccepted={callAccepted}
          callEnded={callEnded}
          name={name}
          myVideo={myVideo}
          userVideo={userVideo}
          connectionRef={connectionRef}
          callUser={callUser}
          answerCall={answerCall}
          leaveCall={leaveCall}
          initiator={initiator}
          setInitiator={setInitiator}
          switchVideo={switchVideo}
          setSwitchVideo={setSwitchVideo}
          userId={user.userId}
          error={error}
        />
        <SidePanel
          picture={user.picture}
          setGroupVisible={setGroupVisible}
          setShowProfile={setShowProfile}
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          disconnetSocket={disconnetSocket}
        />
        <SearchContext.Provider
          value={{
            toggleSearch,
            setToggleSearch,
            searchResults,
            setSearchResults,
            searchInputRef,
          }}
        >
          <ChatSection
            typing={typing}
            groupVisible={groupVisible}
            setGroupVisible={setGroupVisible}
            showProfile={showProfile}
            setShowProfile={setShowProfile}
            showSettings={showSettings}
            setShowSettings={setShowSettings}
          />

          {activeConversation ? (
            <ActiveChats typing={typing} callUser={callUser} />
          ) : (
            <DefaultSection />
          )}
        </SearchContext.Provider>
      </div>
    </>
  );
};

const HomeWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <Home {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default HomeWithSocket;
