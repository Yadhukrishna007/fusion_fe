import React from "react";
import { IoCallSharp, FcEndCall } from "../../icons";
import { useSelector } from "react-redux";
import { findReceiverName } from "../../utils/findReceiverDetails";
import { lang } from "../../utils/languageConstants";

const Call = ({
  stream,
  receivingCall,
  initiator,
  callAccepted,
  callEnded,
  answerCall,
  leaveCall,
  myVideo,
  userVideo,
  switchVideo,
  setSwitchVideo,
  name,
  userId,
  error,
}) => {
  const { activeConversation } = useSelector((store) => store.chat);
  const { language: langKey } = useSelector((store) => store.user);

  return (
    <div
      className={`${
        stream || receivingCall ? "block" : "hidden"
      } h-full w-full bg-white/60 flex items-center justify-center absolute inset-0 z-20`}
    >
      <div
        className={` ${
          stream || receivingCall ? "block" : "hidden"
        }caller w-[50%] h-[60%]  rounded-2xl border-2 bg-black relative `}
      >
        {initiator && !callAccepted && (
          <div className="absolute flex flex-col gap-2 z-20 top-1/2 -translate-x-1/2 left-1/2 font-extrabold text-2xl text-white text_stroke ">
            <h1 className="">
              <span>{lang[langKey].calling}</span>{" "}
              {findReceiverName(userId, activeConversation?.users)}
            </h1>
            {error && (
              <h1 className="text-sm text-center">
                {lang[langKey].User_is_offline}
              </h1>
            )}
            <audio
              src="../../../../audio/marimba_soft.mp3"
              autoPlay
              loop
            ></audio>
          </div>
        )}

        {receivingCall && !callAccepted && (
          <div className="w-full h-full bg-black flex items-center justify-center">
            <h1 className="font-bold text-white text-2xl">
              {name} <span> {lang[langKey].is_calling}</span>
            </h1>
            <audio src="../../../../audio/incoming.mp3" autoPlay loop></audio>
          </div>
        )}

        <video
          onClick={() => {
            callAccepted && setSwitchVideo((prev) => !prev);
          }}
          playsInline
          muted
          ref={myVideo}
          autoPlay
          className={`absolute  ${
            switchVideo ? "bottom-0 right-0 w-60 h-50 z-20" : "w-full h-full"
          }`}
        />

        <video
          onClick={() => {
            callAccepted && setSwitchVideo((prev) => !prev);
          }}
          playsInline
          ref={userVideo}
          autoPlay
          className={`absolute  ${
            switchVideo ? "w-full h-full" : "bottom-0 right-0 w-60 h-50 z-20"
          } ${callAccepted && !callEnded ? "block" : "hidden"}
            }`}
        />

        <div className=" absolute  bottom-0  w-full h-20  flex  items-center gap-20 justify-center text-4xl">
          <button className=" " onClick={() => leaveCall()}>
            <div className="bg-black rounded-full p-2">
              <FcEndCall />
            </div>
          </button>

          {receivingCall && !callAccepted ? (
            <button className=" ">
              <div className="bg-black rounded-full p-2">
                <IoCallSharp className="text-green-400" onClick={answerCall} />
              </div>
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Call;
