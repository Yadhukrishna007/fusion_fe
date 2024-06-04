import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePhoto } from "../store/photoSlice";
import { IoCheckmark, IoClose } from "../icons";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { photoUpload } from "../utils/photoUpload";
import { updateUser } from "../store/userSlice";
import { updateGroup } from "../store/chatSlice";
import { SocketContext } from "./context";
import { lang } from "../utils/languageConstants";
const UpdatePhoto = ({ data, socket }) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const { user, language: langKey } = useSelector((store) => store.user);
  const { token } = user;
  const { activeConversation } = useSelector((store) => store.chat);
  let userData = {};

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (data.default === false) {
        //change picture
        const response = await photoUpload(data.file.fileDefault);
        const url = response.url;
        if (data.isGroup) {
          userData = {
            id: activeConversation._id,
            picture: url,
            default: false,
          };
        } else {
          userData = { picture: url, default: false };
        }
      } else {
        //Remove picture
        if (data.isGroup) {
          userData = { id: activeConversation._id, picture: "", default: true };
        } else {
          userData = {
            picture: "",
            default: true,
          };
        }
      }

      if (data.isGroup) {
        //change picture
        const res = await axios.post(
          `${process.env.REACT_APP_API_ENDPOINT}/conversation/updateGroup`,
          userData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.statusText === "OK") {
          dispatch(updateGroup(res.data.gpInfo));
          socket.emit("update_group_pic", res.data.gpInfo);
        }
      } else {
        const res = await axios.post(
          `${process.env.REACT_APP_API_ENDPOINT}/users/`,
          userData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.statusText === "OK") {
          dispatch(updateUser(res.data.userInfo));
          socket.emit("update_user_pic", res.data.userInfo);
        }
      }
    } catch (error) {
      alert("An error occurred .Please try again later");
    } finally {
      setLoading(false);
      dispatch(
        updatePhoto({
          file: "",
          default: false,
          isGroup: false,
        })
      );
    }
  };

  return (
    <div className="absolute w-full h-full   bg-white/50 z-10">
      <div
        className={`${data.default ? "w-[30%] h-[20%]" : "w-[40%] h-[60%]"} appear absolute top-1/2 left-1/2 -translate-x-1/2  -translate-y-1/2 rounded-lg  bg-black z-20 `}
      >
        {data.default && (
          <div className=" h-[70%] flex items-center justify-center font-bold text-2xl text-white">
            {lang[langKey].remove_picture}
          </div>
        )}
        <div
          className={`flex items-center ${data.default ? "justify-center " : "justify-start mt-4"} gap-20 `}
        >
          <button
            className="  w-8 h-8 bg-slate-50 bg-opacity-25 items-center justify-center  rounded-full ml-4 hover:scale-110"
            onClick={() =>
              dispatch(
                updatePhoto({
                  file: "",
                  default: "",
                })
              )
            }
          >
            <IoClose className="w-8 h-8 fill-white  hover:fill-red-600" />
          </button>
          {data.default && (
            <button
              className=" w-8 h-8 bg-green-400 flex items-center justify-center  rounded-full hover:scale-110"
              onClick={() => handleSubmit()}
            >
              {loading ? (
                <ClipLoader color="#ffffff" size={20} />
              ) : (
                <IoCheckmark className="w-8 h-8 fill-white " />
              )}
            </button>
          )}
        </div>

        {!data.default && (
          <div className="relative  h-[75%] w-3/4 mx-auto flex justify-center items-center">
            <img
              src={data.file.fileData}
              className="w-full h-full object-contain"
            />

            <button
              className=" absolute -bottom-6 w-12 h-12 bg-green-400 flex items-center justify-center  rounded-full hover:scale-110"
              onClick={() => handleSubmit()}
            >
              {loading ? (
                <ClipLoader color="#ffffff" size={20} />
              ) : (
                <IoCheckmark className="w-8 h-8 fill-white " />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const UpdatePhotoWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <UpdatePhoto {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default UpdatePhotoWithSocket;
