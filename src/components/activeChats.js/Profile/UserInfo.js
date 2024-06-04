import React from "react";
import { findReceiver } from "../../../utils/findReceiverDetails";

const UserInfo = ({ activeConversation, userId, lang, langKey }) => {
  const { email, status, name, picture } = findReceiver(
    userId,
    activeConversation.users
  );
  return (
    <div className="flex flex-col items-center justify-center  w-full mt-10 text-light-black_dark-white ">
      <img
        src={picture}
        className="w-44 h-44 rounded-full border-2  border-[#F5F4F6] mt-4"
      />
      <div className="flex flex-col items-start justify-start  w-[50%] mx-auto gap-4 mt-10">
        <div>
          <h1 className="text-neutral_gray">{lang[langKey].name}</h1>

          <h1 className="font-bold">{name}</h1>
        </div>
        <div>
          <h1 className="text-neutral_gray">{lang[langKey].status}</h1>
          <h1 className="font-bold ">{status}</h1>
        </div>
        <div>
          <h1 className="text-neutral_gray">{lang[langKey].email}</h1>
          <h1 className="font-bold">{email}</h1>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
