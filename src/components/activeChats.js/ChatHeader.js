import { IoVideocamOutline, IoCallOutline, HiDotsVertical } from "../../icons";
import { useSelector } from "react-redux";
import onlineStatus from "../../utils/onlineStatus";
import {
  findReceiverId,
  findReceiverName,
  findReceiverPicture,
} from "../../utils/findReceiverDetails";
import { useState } from "react";
import { lang } from "../../utils/languageConstants";

const ChatHeader = ({
  activeConversation,
  typing,
  visible,
  setVisible,
  callUser,
}) => {
  const {
    user,
    onlineUsers,
    language: langKey,
  } = useSelector((store) => store.user);
  const receiverId = findReceiverId(user.userId, activeConversation.users);
  const isOnline = onlineStatus(receiverId, onlineUsers);
  const [contactInfo, setContactInfo] = useState(false);

  return (
    <div className="flex w-full items-center space-x-8 justify-between px-4  rounded-lg  h-[85px] border-[2px] border-nuetral_gray    bg-light-white_dark-charcoal-gray text-light-black_dark-white ">
      <div className="flex space-x-6 pb-2 items-center justify-center">
        {/* image */}
        <div
          className=" relative w-12 h-12  rounded-full "
          onClick={() => {
            setContactInfo(false);
            setVisible((prev) => !prev);
          }}
        >
          <img
            className="object-cover w-full h-full rounded-full border-2  border-[#F5F4F6]"
            src={
              activeConversation.isGroup
                ? activeConversation.picture
                : findReceiverPicture(user.userId, activeConversation.users)
            }
          />
          {!activeConversation.isGroup && (
            <div
              className={`  absolute bottom-1 -right-1 ${
                isOnline ? "bg-online" : "bg-offline"
              }  h-3 w-3 rounded-full border-[2px]  border-light-white_dark-charcoal-gray    `}
            ></div>
          )}
        </div>

        <div className="h-14 mt-2">
          <h1 className="font-bold text-xl max-h-[50%] ">
            {activeConversation.isGroup
              ? activeConversation.name
              : findReceiverName(user.userId, activeConversation.users)}
          </h1>

          <div className="w-full max-h-[50%]  text-light-black_dark-white text-lg">
            {typing && typing === activeConversation._id
              ? `${lang[langKey].typing}...`
              : ""}
          </div>
        </div>
      </div>

      <div className="relative flex space-x-8 ">
        {!activeConversation.isGroup && (
          <button
            className="chat_header_btn group"
            onClick={() => {
              setContactInfo(false);
              callUser();
            }}
          >
            <IoVideocamOutline className="group-hover:scale-110" />
          </button>
        )}

        {!visible && (
          <button
            className="chat_header_btn group"
            onClick={() => setContactInfo((prev) => !prev)}
          >
            <HiDotsVertical className="group-hover:scale-110" />
          </button>
        )}

        {contactInfo && (
          <button
            className="absolute bg-white -bottom-[66px] rounded-xl border-2 z-10 -right-1 w-40 py-4 px-2 bg-light-white_dark-charcoal-gray  hover:bg-light-soft-gray_dark-black  "
            onClick={() => {
              setVisible(true);
              setContactInfo(false);
            }}
          >
            {activeConversation.isGroup
              ? lang[langKey].group_info
              : lang[langKey].contact_info}
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
