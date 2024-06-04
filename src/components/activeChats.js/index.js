import { useDispatch, useSelector } from "react-redux";
import ChatHeader from "./ChatHeader";
import ChatSpace from "./chatSpace";
import InputSpace from "./inputSpace";
import { useEffect, useState } from "react";
import axios from "axios";
import { storeMessages } from "../../store/chatSlice";

import Info from "./Profile/index.js";
import { AnimatePresence } from "framer-motion";

const ActiveChats = ({ typing, callUser }) => {
  const dispatch = useDispatch();
  const { activeConversation } = useSelector((store) => store.chat);
  const { token } = useSelector((store) => store.user.user);
  const [visible, setVisible] = useState(false);

  const getMessages = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_ENDPOINT}/message/${activeConversation._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      dispatch(storeMessages(res.data.populatedMessages));
    } catch (error) {
      alert(
        "An error occurred while fetching the chats.Please try again later."
      );
    }
  };

  useEffect(() => {
    getMessages();
  }, [activeConversation]);

  return (
    <div className=" h-screen w-[80%]  pl-0 bg-light-soft-gray_dark-black   max-lg:ml-[4px] ml-4   p-5 ">
      <div className="relative flex  w-full h-full   rounded-xl  border-nuetral_gray ">
        <div className="relative flex flex-col  h-full w-full   rounded-xl border-2 border-nuetral_gray ">
          <ChatHeader
            activeConversation={activeConversation}
            typing={typing}
            visible={visible}
            setVisible={setVisible}
            callUser={callUser}
          />
          <ChatSpace />
          <InputSpace id={activeConversation._id} />
        </div>

        <AnimatePresence>
          {visible && (
            <Info
              activeConversation={activeConversation}
              visible={visible}
              setVisible={setVisible}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ActiveChats;
