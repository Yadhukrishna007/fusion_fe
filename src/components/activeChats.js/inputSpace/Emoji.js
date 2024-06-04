import { MdOutlineEmojiEmotions } from "../../../icons";
import EmojiPicker from "emoji-picker-react";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../context";

const Emoji = ({
  setInputMessage,
  inputRef,
  inputMessage,
  showEmoji,
  setShowEmoji,
  setShowAttachments,
}) => {
  const [cursorPosition, setCursorPosition] = useState();
  const { mode } = useContext(ThemeContext);
  useEffect(() => {
    inputRef.current.selectionEnd = cursorPosition;
  }, [cursorPosition]);
  const emojiHandler = (e) => {
    const { emoji } = e;

    const ref = inputRef.current;
    ref.focus();
    const start = inputMessage.substring(0, ref.selectionStart);
    const end = inputMessage.substring(ref.selectionStart);
    const newText = start + emoji + end;
    setInputMessage(newText);
    setCursorPosition(start.length + emoji.length);
  };
  return (
    <div className="relative">
      <MdOutlineEmojiEmotions
        className="text-2xl text-light-black_dark-white "
        onClick={() => {
          setShowEmoji((prev) => !prev);
          setShowAttachments(false);
        }}
      />

      {showEmoji && (
        <div className="absolute openEmojiAnimation ">
          <EmojiPicker
            theme={mode === "dark" ? "dark" : "light"}
            className="absolute top-[-500px]"
            onEmojiClick={(e) => {
              emojiHandler(e);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Emoji;
