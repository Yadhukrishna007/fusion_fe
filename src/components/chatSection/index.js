import React, { useContext } from "react";
import { useSelector } from "react-redux";
import Chat from "./Chat";
import SearchUser from "./SearchUser.js";
import SearchResult from "./SearchResult.js";
import CreateGroup from "./group/CreateGroup.js";
import { SearchContext } from "../context/index.js";
import UserProfile from "./UserProfile.js";
import { AnimatePresence } from "framer-motion";
import { lang } from "../../utils/languageConstants";
import Settings from "./Settings.js";

const ChatSection = ({
  groupVisible,
  setGroupVisible,
  showProfile,
  setShowProfile,
  showSettings,
  setShowSettings,
  typing,
}) => {
  const conversations = useSelector((store) => store.chat.conversations);
  const langKey = useSelector((store) => store.user.language);
  const { toggleSearch, searchResults } = useContext(SearchContext);

  return (
    <div className="relative chat_section  bg-light-white_dark-charcoal-gray  text-light-black_dark-white  overflow-hidden">
      <div className="flex flex-col space-y-6">
        <h1 className="font-bold text-2xl ml-5 mt-10">{lang[langKey].chats}</h1>

        <SearchUser lang={lang} langKey={langKey} />
      </div>

      {!toggleSearch ? (
        <div className="flex flex-col  max-h-[85%]  w-full  overflow-y-auto -scrollbar overflow-x-hidden mt-4">
          {conversations
            ?.filter((item) => item.latestMessage || item.isGroup === true)
            .map((item) => (
              <Chat
                key={item._id}
                item={item}
                typing={typing}
                lang={lang}
                langKey={langKey}
              />
            ))}
        </div>
      ) : searchResults.length > 0 ? (
        <div className="flex flex-col max-h-[85%] overflow-y-auto -scrollbar overflow-x-hidden">
          {searchResults?.map((item) => (
            <SearchResult key={item._id} item={item} />
          ))}
        </div>
      ) : (
        <div className="h-full flex items-center justify-center ">
          <h1 className="font-bold text-2xl">{lang[langKey].no_user}</h1>
        </div>
      )}
      <AnimatePresence>
        {groupVisible && (
          <CreateGroup
            setGroupVisible={setGroupVisible}
            lang={lang}
            langKey={langKey}
          />
        )}

        {showProfile && (
          <UserProfile
            setShowProfile={setShowProfile}
            lang={lang}
            langKey={langKey}
          />
        )}
        {showSettings && (
          <Settings
            setShowSettings={setShowSettings}
            lang={lang}
            langKey={langKey}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatSection;
