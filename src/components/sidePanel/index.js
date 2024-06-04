import React, { useContext } from "react";
import { ThemeContext } from "../context";
import { logoutUser } from "../../store/userSlice";
import {
  BiSolidMessageAltDetail,
  MdGroups,
  RiLogoutBoxFill,
  IoSettingsSharp,
} from "../../icons";
import { useDispatch, useSelector } from "react-redux";
import { lang } from "../../utils/languageConstants";
import { motion } from "framer-motion";

const SidePanel = ({
  picture,
  setGroupVisible,
  setShowProfile,
  disconnetSocket,
  setShowSettings,
  showSettings,
}) => {
  const { mode, setMode } = useContext(ThemeContext);
  const langKey = useSelector((store) => store.user.language);

  const dispatch = useDispatch();

  return (
    <div className="sidepanel  flex flex-col items-center  pb-4 bg-light-white_dark-charcoal-gray ">
      <div className="flex flex-col items-center mb-10 mt-4 h-[70%]  w-full ">
        <div className=" flex items-center justify-center space-x-4 mt-4  font-bold lg:py-5 text-xl  w-full">
          <img src="/app_logo.png" alt="app_name" className="w-12 h-12" />
          <span className="sidepanel_txt text-[24px] font-bold">FUSION</span>
        </div>

        <button
          className="sidepanel_button "
          onClick={() => {
            setShowSettings(false);
            setGroupVisible(false);
            setShowProfile(false);
          }}
        >
          <BiSolidMessageAltDetail />
          <span className="sidepanel_txt">{lang[langKey].chats}</span>
        </button>

        <button
          className="sidepanel_button"
          onClick={() => {
            setShowSettings(false);
            setShowProfile(false);
            setGroupVisible((prev) => !prev);
          }}
        >
          <MdGroups />
          <span className="sidepanel_txt">{lang[langKey].groups}</span>
        </button>
      </div>

      <div className="bg-gray-500 w-full  h-[2px] mx-2 mb-[30px]"></div>

      <div className="flex flex-col items-center gap-2  mb-0  w-full ">
        <button
          className="profile"
          onClick={() => {
            setShowSettings(false);
            setGroupVisible(false);
            setShowProfile((prev) => !prev);
          }}
        >
          <img
            className="  w-12 h-12 rounded-full border-2  border-[#F5F4F6]"
            src={picture}
            alt="profile_pic"
          />

          <span className="sidepanel_txt">{lang[langKey].profile}</span>
        </button>
        {/* settings */}
        <button
          className="sidepanel_button "
          onClick={() => {
            setGroupVisible(false);
            setShowProfile(false);
            setShowSettings((prev) => !prev);
          }}
        >
          <motion.div animate={showSettings ? { rotate: 60 } : { rotate: 0 }}>
            <IoSettingsSharp className="text-2xl" />
          </motion.div>

          <span className="sidepanel_txt ">{lang[langKey].settings}</span>
        </button>

        <button
          className="relative font-bold rounded-xl bg-black w-[56px] h-[25px] "
          onClick={() =>
            setMode((prev) => (prev === "light" ? "dark" : "light"))
          }
        >
          {mode === "dark" ? (
            <img
              src="../theme/moon.svg"
              alt="moon"
              className=" absolute left-[2px] active-theme top-1/2 -translate-y-1/2"
            />
          ) : (
            <img
              src="../theme/sun.svg"
              alt="sun"
              className=" absolute right-[2px] active-theme top-1/2 -translate-y-1/2 "
            />
          )}

          <div
            className={`bg-white  z-20 rounded-full w-[22px] h-[22px] px-[10px] ${mode === "dark" ? "translate-x-8 " : "translate-x-0"}transition duration-700 ease-in-out`}
          ></div>
        </button>
        <button
          className="sidepanel_button "
          onClick={() => {
            dispatch(logoutUser());
            disconnetSocket();
          }}
        >
          <RiLogoutBoxFill className=" text-red-400 text-2xl" />
          <span className="sidepanel_txt ">{lang[langKey].logout}</span>
        </button>
      </div>
    </div>
  );
};

export default SidePanel;
