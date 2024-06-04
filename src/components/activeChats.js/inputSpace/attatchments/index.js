import { GrAttachment } from "../../../../icons";
import InputImage from "./InputImage";
import InputFile from "./InputFile";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Attatchments = ({
  showAtttachments,
  setShowAttachments,
  setShowEmoji,
}) => {
  const [hideIcons, setHideIcons] = useState(false);
  return (
    <div className={"relative"}>
      <GrAttachment
        className="text-2xl text-light-black_dark-white"
        onClick={() => {
          setShowAttachments((prev) => !prev);
          setShowEmoji(false);
          setHideIcons(false);
        }}
      />
      <AnimatePresence>
        {showAtttachments && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.1 }}
            exit={{ opacity: 0, y: 100 }}
            className={`absolute top-[-184px]  bg-light-white_dark-charcoal-gray dark:text-white rounded-xl  w-60 h-40 flex border-2 border-gray-400
         flex-col   ${hideIcons ? "hidden" : ""}`}
          >
            <InputFile
              setShowAttachments={setShowAttachments}
              setHideIcons={setHideIcons}
            />

            <InputImage
              setShowAttachments={setShowAttachments}
              setHideIcons={setHideIcons}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Attatchments;
