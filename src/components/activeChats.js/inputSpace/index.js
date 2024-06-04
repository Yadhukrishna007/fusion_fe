import Emoji from "./Emoji";
import Attatchments from "./attatchments";
import { IoSendSharp } from "../../../icons";
import { useRef, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { storeSendMessage } from "../../../store/chatSlice";
import { Formik, Form } from "formik";
import { MoonLoader } from "react-spinners";
import { SocketContext } from "../../context";
import { useContext } from "react";
import { SearchContext } from "../../context";
import { lang } from "../../../utils/languageConstants";
const InputSpace = ({ id, socket }) => {
  const dispatch = useDispatch();
  const [inputMessage, setInputMessage] = useState("");
  const { user, language: langKey } = useSelector((store) => store.user);
  const token = user.token;
  const inputRef = useRef();

  const [showEmoji, setShowEmoji] = useState(false);
  const [showAtttachments, setShowAttachments] = useState();
  const [loading, setLoading] = useState(false);
  const { activeConversation } = useSelector((store) => store.chat);

  const { setToggleSearch, setSearchResults, searchInputRef } =
    useContext(SearchContext);
  const inputHandler = async () => {
    if (inputMessage) {
      searchInputRef.current.value = "";
      setSearchResults([]);
      setToggleSearch(false);
      try {
        setLoading(true);
        const res = await axios.post(
          `${process.env.REACT_APP_API_ENDPOINT}/message/`,
          { conversationId: id, message: inputMessage },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        dispatch(storeSendMessage(res.data.populateMessage));
        socket.emit("send_message", res.data.populateMessage);

        setInputMessage("");
      } catch (error) {
        alert("An error occurred while sending data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
  };

  const inputChangeHandler = (e) => {
    setInputMessage(e.target.value);
  };
  let typingTimeout; // Variable to store timeout ID
  let isTyping = false; // Variable to track typing status

  // Function to emit "start_typing" event
  const startTyping = () => {
    if (!isTyping) {
      socket.emit("start_typing", activeConversation._id);
      isTyping = true;
    }
  };

  // Function to emit "stop_typing" event
  const stopTyping = () => {
    if (isTyping) {
      socket.emit("stop_typing", activeConversation._id);
      isTyping = false;
    }
  };

  // Event listener for keydown event
  const keyDownHandler = () => {
    startTyping(); // Call startTyping immediately
    clearTimeout(typingTimeout); // Clear previous timeout (if any)

    // Set a new timeout for 2 seconds
    typingTimeout = setTimeout(() => {
      stopTyping(); // Call stopTyping after 2 seconds
    }, 1000);
  };

  // Event listener for keyup event
  const keyUpHandler = () => {
    clearTimeout(typingTimeout); // Clear timeout if key is released before 2 seconds
    typingTimeout = setTimeout(() => {
      stopTyping(); // Call stopTyping after 2 seconds
    }, 1000);
  };

  return (
    <div className="h-20 p-2 bg-white dark:bg-[#1f2128] rounded-xl">
      <Formik
        enableReinitialize
        initialValues={{ inputMessage }}
        onSubmit={(e) => inputHandler(e)}
      >
        {(form) => (
          <Form
            className="bg-gray-200  flex p-2 space-x-8 items-center w-full rounded-xl  h-14 border-[2px] box 
          placeholder:font-semibold placeholder:text-neutral_gray  dark:bg-[#242731]"
          >
            <div className="flex space-x-2">
              <Emoji
                setInputMessage={setInputMessage}
                inputRef={inputRef}
                inputMessage={inputMessage}
                showEmoji={showEmoji}
                setShowEmoji={setShowEmoji}
                setShowAttachments={setShowAttachments}
              />
              <Attatchments
                showAtttachments={showAtttachments}
                setShowAttachments={setShowAttachments}
                setShowEmoji={setShowEmoji}
              />
            </div>

            <input
              ref={inputRef}
              name={inputMessage}
              className="w-full h-10 outline-none bg-gray-200 dark:bg-[#242731] placeholder:text-neutral_gray placeholder:font-semibold text-light-black_dark-white"
              placeholder={`${lang[langKey].message}...`}
              value={inputMessage}
              onChange={(e) => inputChangeHandler(e)}
              onKeyDown={keyDownHandler}
              onKeyUp={keyUpHandler}
              onClick={() => {
                setShowEmoji(false);
                setShowAttachments(false);
              }}
            />

            {loading ? (
              <MoonLoader color="#36d7b7" size={25} />
            ) : (
              <button
                type="submit"
                onClick={() => {
                  setShowEmoji(false);
                  setShowAttachments(false);
                }}
              >
                <IoSendSharp className="text-2xl text-light-black_dark-white" />
              </button>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};

const InputSpaceWithContext = (props) => (
  <SocketContext.Consumer>
    {(socket) => <InputSpace {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default InputSpaceWithContext;
