import React from "react";
import { useSelector } from "react-redux";
import { FaLongArrowAltLeft } from "../../../icons";
import GroupInfo from "./GroupInfo";
import UserInfo from "./UserInfo";
import { motion } from "framer-motion";
import { lang } from "../../../utils/languageConstants";
const Info = ({ activeConversation, visible, setVisible }) => {
  const { user, language: langKey } = useSelector((store) => store.user);
  const { userId, token } = user;
  const isGroup = activeConversation?.isGroup;

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.1 }}
      exit={{ opacity: 0, x: 100 }}
      className={`${visible ? "block" : "hidden"}  h-full bg-light-white_dark-charcoal-gray  rounded-xl  right-0 top-0 w-[60%] border-[2px] 
      border-nuetral_gray flex flex-col gap-10 items-center overflow-y-auto -scrollbar `}
    >
      <div
        className="font-extrabold items-center text-2xl  flex gap-4 w-full p-4  h-[10%] text-light-black_dark-white   
       lg:w-[20rem] xl:w-full"
      >
        <FaLongArrowAltLeft onClick={() => setVisible(false)} />
        <span>
          {isGroup ? lang[langKey].group_info : lang[langKey].contact_info}
        </span>
      </div>
      {isGroup ? (
        <GroupInfo
          activeConversation={activeConversation}
          token={token}
          lang={lang}
          langKey={langKey}
        />
      ) : (
        <UserInfo
          activeConversation={activeConversation}
          userId={userId}
          lang={lang}
          langKey={langKey}
        />
      )}
    </motion.div>
  );
};

export default Info;
