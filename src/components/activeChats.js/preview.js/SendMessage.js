import { IoSendSharp } from "../../../icons";
import { cloudinaryUpload } from "../../../utils/cloudinaryUpload";
import coupleMessages from "../../../utils/coupleMesages";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { emptyFiles, storeSendMessage } from "../../../store/chatSlice";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { SocketContext } from "../../context";
const SendMessage = ({ files, messages, socket }) => {
  const { activeConversation } = useSelector((store) => store.chat);
  const { token } = useSelector((store) => store.user.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const sendHandler = async () => {
    try {
      setLoading(true);
      const updatedFiles = coupleMessages(files, messages);
      const uploadfiles = await cloudinaryUpload(updatedFiles);

      let { type, message } = uploadfiles[updatedFiles.length - 1];
      const inputMessage = type + "_" + message;

      const res = await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/message/`,
        {
          conversationId: activeConversation._id,
          message: inputMessage,
          files: uploadfiles || [],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch(storeSendMessage(res.data.populateMessage));
      socket.emit("send_message", res.data.populateMessage);

      dispatch(emptyFiles());
    } catch (error) {
      alert("An error occurred while sending  data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex items-center  justify-end  pr-3 w-full h-20">
      <div
        className="flex items-center justify-center bg-green-400 w-[40px] h-[40px] pl-1 rounded-full"
        onClick={() => sendHandler()}
      >
        {!loading ? (
          <IoSendSharp className="text-xl fill-white" />
        ) : (
          <ClipLoader color="#ffffff" size={20} />
        )}
      </div>
    </div>
  );
};

const SendMessageWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <SendMessage {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default SendMessageWithSocket;
