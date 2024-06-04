import { useSelector } from "react-redux";
import Messages from "./Messages";
import { useEffect, useRef } from "react";

const ChatSpace = () => {
  const { messages } = useSelector((store) => store.chat);
  const userId = useSelector((store) => store.user.user.userId);
  const positionRef = useRef();

  useEffect(() => {
    positionRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="  bg-gray-100 dark:bg-[#1f2128] h-full w-full px-10  pb-2    overflow-auto flex flex-col  -scrollbar">
      <div>
        {messages.map((item) => (
          <Messages
            key={item._id}
            item={item}
            me={item.sender._id === userId}
          />
        ))}
      </div>

      <div ref={positionRef}></div>
    </div>
  );
};

export default ChatSpace;
