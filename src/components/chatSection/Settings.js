import React from "react";
import { FaArrowLeft, MdLanguage } from "../../icons";
import { motion } from "framer-motion";
import { SUPPORTED_LANGUAGES } from "../../utils/supportedLanguages";
import { useDispatch, useSelector } from "react-redux";
import { setlanguage } from "../../store/userSlice";

const Settings = ({ setShowSettings, lang, langKey }) => {
  const { language } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const languageHandler = (e) => {
    dispatch(setlanguage(e.target.value));
  };

  return (
    <motion.div
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.1 }}
      exit={{ opacity: 0, x: -80 }}
      className="absolute inset-0 bg-light-white_dark-charcoal-gray   gap-8 text-light-black_dark-white transform translate-x-0"
    >
      <div className="flex items-center gap-6 text-2xl mt-10 ml-5 ">
        <FaArrowLeft onClick={() => setShowSettings(false)} />
        <h1 className="font-bold ">{lang[langKey].settings}</h1>
      </div>
      <div className="w-full flex flex-col gap-4 px-10 mt-16">
        <div className="flex items-center justify-start gap-4">
          <MdLanguage className="text-2xl" />
          <h1>{lang[langKey].select_language}</h1>
        </div>
        <div className="relative">
          <select
            onChange={(e) => languageHandler(e)}
            className="rounded-xl dark:bg-black w-40 border-2 p-2 ml-2"
          >
            <option value={language}>
              {
                SUPPORTED_LANGUAGES.find((item) => item.identifier == language)
                  .name
              }
            </option>
            {SUPPORTED_LANGUAGES.filter(
              (item) => item.identifier !== language
            ).map((item) => (
              <option key={item.identifier} value={item.identifier}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;
