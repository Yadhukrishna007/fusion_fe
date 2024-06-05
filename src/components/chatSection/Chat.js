import { useSelector } from "react-redux";
import dateHandler from "../../utils/date";
import { useDispatch } from "react-redux";
import { storeActiveConversation } from "../../store/chatSlice";
import axios from "axios";
import { SocketContext } from "../context";
import onlineStatus from "../../utils/onlineStatus";
import { IoIosCamera, BiSolidCameraMovie, IoIosDocument } from "../../icons";

import {
  findReceiverId,
  findReceiverName,
  findReceiverPicture,
} from "../../utils/findReceiverDetails";

import { nameSlice } from "../../utils/slice";

const Chat = ({ socket, item, typing, lang, langKey }) => {
  const { user, onlineUsers } = useSelector((store) => store.user);

  const token = user.token;

  const receiverId = findReceiverId(user.userId, item.users);
  const isOnline = onlineStatus(receiverId, onlineUsers);
  const message = item?.latestMessage;
  const time = item?.latestMessage?.createdAt;

  const dispatch = useDispatch();
  let icon;
  let finalMessage;
  if (message?.files.length > 0) {
    let type = message?.message?.split("_")[0];
    if (type === "IMAGE") {
      icon = <IoIosCamera />;
    } else if (type === "VIDEO") {
      icon = <BiSolidCameraMovie />;
    } else {
      icon = <IoIosDocument />;
    }
    finalMessage = (
      <div className="flex space-x-1  items-center ">
        {icon && icon}

        <p>
          {message?.message?.split("_")[1]?.slice(0, 12)
            ? `${message.message.split("_")[1].slice(0, 12)}...`
            : ""}
        </p>
      </div>
    );
  }
  const todo = finalMessage ? finalMessage : message?.message;

  const conversationHandler = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/conversation/`,
        { receiverId, isGroup: item.isGroup ? item._id : false },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(storeActiveConversation(res.data.conversation));
      socket.emit("join_conversation", res.data.conversation._id);
    } catch (error) {
      alert(
        "An error occurred while fetching the  data. Please try again later."
      );
    }
  };
  return (
    <div
      className="group h-18 w-full flex space-x-3 p-5 hover:bg-light-soft-gray_dark-black "
      onClick={() => {
        conversationHandler();
      }}
    >
      <div className=" relative h-[51px] w-[64px] rounded-full  ">
        <img
          src={
            item.isGroup
              ? item.picture
              : findReceiverPicture(user.userId, item.users)
          }
          alt="profile_pic"
          className="object-cover w-full h-full rounded-full"
        />

        {!item.isGroup && (
          <div
            className={`  absolute bottom-1 -right-1 ${
              isOnline ? "bg-online" : "bg-offline "
            }  h-3 w-3 rounded-full border-[2px]  border-light-white_dark-charcoal-gray `}
          ></div>
        )}
      </div>

      <div className="flex items-center justify-between  w-full ">
        <div>
          <h1 className="text-xl font-semibold ">
            {item.isGroup
              ? nameSlice(item.name)
              : nameSlice(findReceiverName(user.userId, item.users))}
          </h1>
          {/* Typing */}
          {typing === item._id ? (
            <span className="text-neutral_gray">
              `${lang[langKey].typing}...`
            </span>
          ) : (
            <span className="text-neutral_gray">
              {finalMessage
                ? finalMessage
                : message?.message.length > 14
                  ? message?.message.slice(0, 15) + "..."
                  : message?.message}
            </span>
          )}
        </div>
        <div className="text-neutral_gray">{time && dateHandler(time)}</div>
      </div>
    </div>
  );
};

const ChatWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <Chat {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default ChatWithSocket;
