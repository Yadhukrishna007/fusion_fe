import axios from "axios";
import React, { useRef, useState } from "react";
import {
  FaArrowLeft,
  FaArrowAltCircleRight,
  BiSolidImageAdd,
  MdDelete,
} from "../../../icons";
import { useDispatch } from "react-redux";
import { createGroup } from "../../../store/chatSlice";
import { SocketContext } from "../../context";
import { MoonLoader } from "react-spinners";
import { motion } from "framer-motion";
import { DEFAULT_GROUP_PICTURE } from "../../../utils/constants";
import { photoUpload } from "../../../utils/photoUpload";
const Profile = ({
  setVisible,
  selectedUsers,
  token,
  setGroupVisible,
  setSelectedUsers,
  socket,
  lang,
  langKey,
}) => {
  const dispatch = useDispatch();
  const imageRef = useRef(null);
  const [nameErrorMessage, setNameErrorMessage] = useState("");
  const [descriptionErrorMessage, setDescriptionErrorMessage] = useState("");
  const initialValues = {
    name: "",
    description: "",
  };
  const [gpDetails, setGpDetails] = useState(initialValues);
  const [picture, setPicture] = useState({
    fileDefault: "",
    fileData: DEFAULT_GROUP_PICTURE,
  });
  const { name, description } = gpDetails;
  const [loading, setLoading] = useState(false);
  let uploadedPicture = "";

  const handleSubmit = async () => {
    if (gpDetails.name === "") {
      setNameErrorMessage(lang[langKey].Group_name_cannot_be_empty);
      return;
    } else if (gpDetails.name.length < 2) {
      setNameErrorMessage(
        lang[langKey].Group_name_should_be_atleast_2_characters
      );
      return;
    } else if (gpDetails.name.length > 20) {
      setNameErrorMessage(
        lang[langKey].Group_name_should_not_exceed_20_characters
      );
      return;
    } else if (gpDetails.description.length > 20) {
      setDescriptionErrorMessage(
        lang[langKey].Group_description_should_not_exceed_20_characters
      );
      return;
    }

    try {
      setLoading(true);
      const users = selectedUsers.map((user) => user._id);
      if (picture.fileData !== DEFAULT_GROUP_PICTURE) {
        const response = await photoUpload(picture.fileDefault);
        const url = response.url;
        uploadedPicture = url;
      }

      const res = await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/conversation/group`,
        { name, description, users, uploadedPicture },

        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSelectedUsers([]);
      setGroupVisible(false);
      dispatch(createGroup(res.data));
      socket.emit("create_group", res.data);
    } catch (error) {
      alert("An error occurred while group creation. Please try again later.");
    } finally {
      setLoading(false);
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
      setPicture({
        fileDefault: file,
        fileData: e.target.result,
      });
    };
    e.target.value = "";
  };
  return (
    <motion.div
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.1 }}
      exit={{ opacity: 0, x: -80 }}
      className="absolute  flex flex-col gap-10 items-center  bg-light-white_dark-charcoal-gray inset-0"
    >
      <div className="flex w-full gap-6 items-center  text-2xl p-2  px-4 mt-10 ">
        <FaArrowLeft
          onClick={() => setVisible(false)}
          className="cursor-pointer"
        />

        <h1 className="font-bold ">{lang[langKey].group_details}</h1>
      </div>
      {/* Gp picture */}
      <div className="relative group  rounded-full w-40 h-40 overflow-hidden border-2  border-[#F5F4F6]">
        <img
          className="rounded-full o object-cover w-40 h-40"
          src={picture.fileData}
        ></img>

        <div className="absolute hidden group-hover:block   inset-0  w-full h-full  bg-black/70">
          {picture.fileData === DEFAULT_GROUP_PICTURE ? (
            <BiSolidImageAdd
              className="text-6xl mx-auto my-auto mt-12 fill-green-400  hover:scale-125 transition duration-300 ease-in-out"
              onClick={() => imageRef.current.click()}
            />
          ) : (
            <MdDelete
              className="text-4xl mx-auto my-auto mt-16 fill-red-400  "
              onClick={() =>
                setPicture({ fileDefault: "", fileData: DEFAULT_GROUP_PICTURE })
              }
            />
          )}
        </div>
      </div>
      <input
        ref={imageRef}
        type="file"
        className="hidden"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        onChange={(e) => changeHandler(e)}
      />
      <div className="relative w-full flex flex-col items-center justify-center gap-2">
        <input
          type="text"
          placeholder={lang[langKey].enter_group_name}
          className="p-2 w-[70%] mx-auto border-0 border-b-2 focus:outline-none focus:border-green-600 
          placeholder:font-semibold placeholder:text-neutral_gray dark:bg-[#242731]"
          onChange={(e) => {
            setNameErrorMessage("");

            setGpDetails((prev) => ({ ...prev, name: e.target.value }));
          }}
        />
        {nameErrorMessage && (
          <span className="w-[70%] mx-auto  text-red-400  ">
            {nameErrorMessage}
          </span>
        )}
      </div>

      <div className=" w-full flex flex-col items-center justify-center gap-2">
        <textarea
          type="text"
          placeholder={lang[langKey].enter_group_description}
          className="p-2 w-3/4 border-2 placeholder:font-semibold placeholder:text-neutral_gray dark:bg-[#242731] rounded-xl textarea focus:border-green-600 focus:outline-none "
          onChange={(e) => {
            setDescriptionErrorMessage("");
            setGpDetails((prev) => ({ ...prev, description: e.target.value }));
          }}
        />
        {descriptionErrorMessage && (
          <span className="w-[70%] mx-auto  text-red-400  ">
            {descriptionErrorMessage}
          </span>
        )}
      </div>
      {loading ? (
        <MoonLoader color="#36d7b7" size={30} />
      ) : (
        <FaArrowAltCircleRight
          className="text-4xl fill-green-400 cursor-pointer"
          onClick={() => handleSubmit()}
        />
      )}
    </motion.div>
  );
};

const SendProfileWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <Profile {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default SendProfileWithSocket;
