import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaArrowLeft, IoCheckmark, IoMdClose, MdEdit } from "../../icons";
import { MoonLoader } from "react-spinners";
import axios from "axios";
import { updateUser } from "../../store/userSlice";
import { updatePhoto } from "../../store/photoSlice";

import { SocketContext } from "../context";
import { motion } from "framer-motion";
import { DEFAULT_USER_PICTURE } from "../../utils/constants";

const UserProfile = ({ setShowProfile, socket, lang, langKey }) => {
  const dispatch = useDispatch();
  const { name, email, status, picture, token } = useSelector(
    (store) => store.user.user
  );
  const [nameErrorMessage, setNameErrorMessage] = useState("");
  const [statusErrorMessage, setStatusErrorMessage] = useState("");

  const [visible, setVisible] = useState({
    showName: false,
    showStatus: false,
  });
  const initialValues = {
    name: name,
    status: status,
  };

  const [userData, setUserData] = useState(initialValues);

  const [loading, setLoading] = useState(false);

  const nameInputRef = useRef(null);
  const statusInputRef = useRef(null);
  const imageRef = useRef(null);

  const handleSubmit = async (e) => {
    if (userData.name.length < 2) {
      setNameErrorMessage(lang[langKey].Name_should_be_atleast_2_characters);
      return;
    } else if (userData.name.length > 20) {
      setNameErrorMessage(lang[langKey].Name_should_not_exceed_20_characters);
      return;
    } else if (userData.status.length > 20) {
      setStatusErrorMessage(
        lang[langKey].Status_should_not_exceed_20_characters
      );
      return;
    }

    if (e.current.value === "") return;

    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/users/`,
        userData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.statusText === "OK") {
        dispatch(updateUser(res.data.userInfo));
        socket.emit("update_user_info", res.data.userInfo);
      }
    } catch (error) {
      alert(
        "An error occurred while updating profile. Please try again later."
      );
    } finally {
      setLoading(false);
      setVisible({ showName: false, showStatus: false });
    }
  };
  const changeHandler = (e) => {
    let file = e.target.files[0];

    if (
      file.type !== "image/png" &&
      file.type !== "image/jpeg" &&
      file.type !== "image/jpg" &&
      file.type !== "image/webp"
    ) {
      alert("Invalid file type");
      return;
    }

    if (file.size > 1024 * 1024 * 10) {
      alert("File size exceeds the limit of 10MB");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      dispatch(
        updatePhoto({
          file: {
            fileDefault: file,
            fileData: e.target.result,
          },
          default: false,
          isGroup: false,
        })
      );
    };
    e.target.value = "";
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
        <FaArrowLeft onClick={() => setShowProfile(false)} />
        <h1 className="font-bold ">{lang[langKey].profile}</h1>
      </div>
      <div className="h-full flex flex-col items-center justify-start  gap-10 ">
        <img
          src={picture}
          alt="profile"
          className="w-44 h-44 rounded-full mx-auto mt-32 border-2  border-[#F5F4F6]"
        />

        {/* Change picture */}
        <div className="flex items-center justify-between text-sm px-10  font-bold gap-6">
          <button
            className="hover:text-[#397e35]"
            onClick={() => imageRef.current.click()}
          >
            {lang[langKey].change_picture}
          </button>
          {picture !== DEFAULT_USER_PICTURE && (
            <button
              className="text-[#FF033E]"
              onClick={() =>
                dispatch(
                  updatePhoto({ file: "", default: true, isGroup: false })
                )
              }
            >
              {lang[langKey].remove_picture}
            </button>
          )}

          <input
            ref={imageRef}
            type="file"
            className="hidden"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={(e) => changeHandler(e)}
          />
        </div>

        {/* Details */}

        <div className=" w-full flex flex-col mx-auto px-20 gap-6 ">
          {/* Name */}
          <div className="flex flex-col gap-[2px]">
            <h1 className="text-neutral_gray">{lang[langKey].name}</h1>

            <div className="font-bold flex items-center justify-between ">
              {visible.showName ? (
                <input
                  ref={nameInputRef}
                  type="text"
                  placeholder="Enter name"
                  className="border-0 border-b-[1.5px] focus:outline-none
                 placeholder:font-semibold placeholder:text-neutral_gray dark:bg-[#242731]"
                  onChange={(e) => {
                    setNameErrorMessage("");
                    setUserData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }));
                  }}
                />
              ) : (
                <span>{name}</span>
              )}
              <div>
                {!visible.showName ? (
                  <MdEdit
                    onClick={() => {
                      setNameErrorMessage("");
                      setStatusErrorMessage("");
                      setUserData({ name, status });
                      setVisible((prev) => ({
                        showName: true,
                        showStatus: false,
                      }));
                    }}
                  />
                ) : (
                  <div className="flex ">
                    <IoMdClose
                      onClick={() => {
                        setNameErrorMessage(""),
                          setVisible((prev) => ({ ...prev, showName: false }));
                      }}
                    />
                    {loading ? (
                      <MoonLoader color="#820ab0" size={20} />
                    ) : (
                      <IoCheckmark onClick={() => handleSubmit(nameInputRef)} />
                    )}
                  </div>
                )}
              </div>
            </div>
            {nameErrorMessage && (
              <span className="w-[100%] mx-auto  text-red-400  font-medium">
                {nameErrorMessage}
              </span>
            )}
          </div>

          {/* Status */}
          <div>
            <h1 className="text-neutral_gray">{lang[langKey].status}</h1>

            <div className="font-bold flex items-center justify-between ">
              {visible.showStatus ? (
                <input
                  ref={statusInputRef}
                  type="text"
                  placeholder="Enter Status"
                  className="border-0 border-b-[1.5px] focus:outline-none
                 placeholder:font-semibold placeholder:text-neutral_gray dark:bg-[#242731]"
                  onChange={(e) => {
                    setStatusErrorMessage("");
                    setUserData((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }));
                  }}
                />
              ) : (
                <span>{status}</span>
              )}
              <div>
                {!visible.showStatus ? (
                  <MdEdit
                    onClick={() => {
                      setNameErrorMessage("");
                      setStatusErrorMessage("");
                      setUserData({ name, status });
                      setVisible((prev) => ({
                        showName: false,
                        showStatus: true,
                      }));
                    }}
                  />
                ) : (
                  <div className="flex ">
                    <IoMdClose
                      onClick={() => {
                        setStatusErrorMessage(""),
                          setVisible((prev) => ({
                            ...prev,
                            showStatus: false,
                          }));
                      }}
                    />
                    {loading ? (
                      <MoonLoader color="#820ab0" size={20} />
                    ) : (
                      <IoCheckmark
                        onClick={() => handleSubmit(statusInputRef)}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
            {statusErrorMessage && (
              <span className="w-[70%] mx-auto  text-red-400  font-medium">
                {statusErrorMessage}
              </span>
            )}
          </div>
          {/* Email */}
          <div>
            <h1 className="text-neutral_gray">{lang[langKey].email}</h1>

            <div className="font-bold flex items-center justify-between ">
              <span>{email}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const UpdateUserProfileWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <UserProfile {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default UpdateUserProfileWithSocket;
