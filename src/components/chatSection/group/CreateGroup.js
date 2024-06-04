import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeft, IoSearchSharp, IoIosAddCircle } from "../../../icons";
import { useSelector } from "react-redux";
import axios from "axios";
import ListUser from "./ListUser";
import Snippets from "./Snippets";
import SearchList from "./SearchList";
import Profile from "./Profile";
import { AnimatePresence, motion } from "framer-motion";

const CreateGroup = ({ setGroupVisible, lang, langKey }) => {
  const inputRef = useRef(null);
  const [userList, setUserList] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const { token } = useSelector((store) => store.user.user);
  const [visible, setVisible] = useState(false);
  const getUsers = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_ENDPOINT}/users/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const result = await res.data.users;

      result.length > 0 && setUserList(result);
    } catch (error) {
      alert("An error occurred while getting users.");
    }
  };

  useEffect(() => {
    getUsers();
  }, []);
  const handleSearch = (e) => {
    const name = e.target.value;
    const result = userList.filter((user) =>
      user.name.toLowerCase().includes(name.toLowerCase())
    );
    setSearchResult(result);
  };

  return (
    <motion.div
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.1 }}
      exit={{ opacity: 0, x: -80 }}
      className="absolute inset-0 bg-light-white_dark-charcoal-gray h-full"
    >
      <div className="flex justify-between items-center ml-5 mt-10 text-2xl pr-4 space-y-[6px]">
        <div className="flex items-center gap-6">
          <FaArrowLeft onClick={() => setGroupVisible(false)} />
          <h1 className="font-bold ">{lang[langKey].create_group}</h1>
        </div>

        {selectedUsers.length > 0 && (
          <IoIosAddCircle
            className="fill-green-400 mr-4 text-[40px] "
            onClick={() => setVisible(true)}
          />
        )}
      </div>

      <Snippets
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
        setUserList={setUserList}
      />

      {/* searchbar */}
      <div className="group border-2  w-[80%] mx-auto flex   space-x-2 items-center p-2 rounded-xl box dark:box">
        <IoSearchSharp className=" text-xl fill-[#888888]" />
        <input
          ref={inputRef}
          type="text"
          placeholder={lang[langKey].search}
          className="outline-none   w-full placeholder:font-semibold placeholder:text-neutral_gray dark:bg-[#1f2128]"
          onChange={(e) => handleSearch(e)}
        />
      </div>

      <div className="overflow-y-auto -scrollbar h-[80%]">
        {searchResult.length > 0 ? (
          <SearchList
            searchResult={searchResult}
            setSelectedUsers={setSelectedUsers}
            setUserList={setUserList}
            setSearchResult={setSearchResult}
            inputRef={inputRef}
          />
        ) : inputRef?.current?.value !== "" ? (
          <div className="h-full flex items-center justify-center ">
            <h1 className="font-bold text-2xl">{lang[langKey].no_user}</h1>
          </div>
        ) : (
          <ListUser
            userList={userList}
            setSelectedUsers={setSelectedUsers}
            setUserList={setUserList}
          />
        )}
      </div>
      <AnimatePresence>
        {visible && (
          <Profile
            setVisible={setVisible}
            selectedUsers={selectedUsers}
            setSelectedUsers={setSelectedUsers}
            token={token}
            setGroupVisible={setGroupVisible}
            lang={lang}
            langKey={langKey}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CreateGroup;
