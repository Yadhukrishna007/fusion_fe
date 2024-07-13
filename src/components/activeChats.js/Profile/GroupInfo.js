import React, { useRef, useState } from "react";
import { IoCheckmark, IoMdClose, MdEdit } from "../../../icons";
import { MoonLoader } from "react-spinners";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { updateGroup } from "../../../store/chatSlice";
import { updatePhoto } from "../../../store/photoSlice";
import { SocketContext } from "../../context";
import { DEFAULT_GROUP_PICTURE } from "../../../utils/constants";

const GroupInfo = ({ activeConversation, token, socket, lang, langKey }) => {
  const { name, picture, description, users, admin } = activeConversation;
  const { userId } = useSelector((store) => store.user.user);

  const isAdmin = admin._id === userId ? true : false;
  const dispatch = useDispatch();
  const [visible, setVisible] = useState({
    showName: false,
    showDescription: false,
  });
  const initialValues = {
    name,
    description,
  };

  const [userData, setUserData] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const nameInputRef = useRef(null);
  const descriptionInputRef = useRef(null);
  const imageRef = useRef(null);
  const [nameErrorMessage, setNameErrorMessage] = useState("");
  const [descriptionErrorMessage, setDescriptionErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    if (userData.name.length < 2) {
      setNameErrorMessage(
        lang[langKey].Group_name_should_be_atleast_2_characters
      );
      return;
    } else if (userData.name.length > 20) {
      setNameErrorMessage(
        lang[langKey].Group_name_should_not_exceed_20_characters
      );
      return;
    } else if (userData.description.length > 20) {
      setDescriptionErrorMessage(
        lang[langKey].Group_description_should_not_exceed_20_characters
      );
      return;
    }
    if (e.current.value === "") return;
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/conversation/updateGroup`,
        { ...userData, id: activeConversation._id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.statusText === "OK") {
        dispatch(updateGroup(res.data.gpInfo));
        socket.emit("update_group_info", res.data.gpInfo);
      }
    } catch (error) {
      alert("An error occurred while updating group. Please try again later.");
    } finally {
      setLoading(false);
      setVisible({
        showName: false,
        showDescription: false,
      });
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
          isGroup: true,
        })
      );
    };
    e.target.value = "";
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center text-light-black_dark-white ">
        <img
          src={picture}
          className="w-40 h-40 rounded-full  border-2 border-[#F5F4F6] "
        />
        {isAdmin && (
          <div
            className="flex items-center justify-between text-sm px-10 xl:px-4 font-bold mt-10 gap-8 
          mb-6 "
          >
            <button
              className="hover:text-[#397e35]"
              onClick={() => imageRef.current.click()}
            >
              {lang[langKey].change_picture}
            </button>
            {picture !== DEFAULT_GROUP_PICTURE && (
              <button
                className="text-[#FF033E]"
                onClick={() =>
                  dispatch(
                    updatePhoto({ file: "", default: true, isGroup: true })
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
        )}
      </div>

      {/* Details */}
      <div className=" w-full flex flex-col mx-auto items-center justify-center gap-6 ">
        {/* Name */}
        <div className="flex flex-col gap-[2px] w-[70%]">
          <h1 className="text-neutral_gray"> {lang[langKey].name}</h1>

          <div className="font-bold flex items-center justify-between text-light-black_dark-white ">
            {visible.showName ? (
              <input
                ref={nameInputRef}
                type="text"
                placeholder="Enter name"
                className="border-0 border-b-[1.5px] focus:outline-none
                 placeholder:font-semibold placeholder:text-neutral_gray dark:bg-[#242731]"
                onChange={(e) => {
                  setNameErrorMessage("");
                  setDescriptionErrorMessage("");
                  setUserData((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }));
                }}
              />
            ) : (
              <span>{name}</span>
            )}
            {isAdmin && (
              <div>
                {!visible.showName ? (
                  <MdEdit
                    onClick={() => {
                      setNameErrorMessage("");
                      setDescriptionErrorMessage("");
                      setUserData({ name, description });

                      setVisible({
                        showName: true,
                        showDescription: false,
                      });
                    }}
                  />
                ) : (
                  <div className="flex ">
                    <IoMdClose
                      onClick={() => {
                        setNameErrorMessage("");
                        setDescriptionErrorMessage("");
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
            )}
          </div>
        </div>
        {nameErrorMessage && (
          <span className="w-[70%] mx-auto  text-red-400  ">
            {nameErrorMessage}
          </span>
        )}

        {/* Description */}
        <div className="flex flex-col gap-[2px] w-[70%]">
          <h1 className="text-neutral_gray "> {lang[langKey].description}</h1>

          <div className="font-bold flex items-center justify-between text-light-black_dark-white ">
            {visible.showDescription ? (
              <textarea
                ref={descriptionInputRef}
                type="text"
                placeholder="Enter Status"
                className="border-2 rounded-xl  focus:outline-none  textarea p-2
                 placeholder:font-semibold placeholder:text-neutral_gray dark:bg-[#242731]"
                onChange={(e) => {
                  setNameErrorMessage("");
                  setDescriptionErrorMessage("");
                  setUserData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }));
                }}
              />
            ) : (
              <span>{description}</span>
            )}
            {isAdmin && (
              <div>
                {!visible.showDescription ? (
                  <MdEdit
                    onClick={() => {
                      setNameErrorMessage("");
                      setDescriptionErrorMessage("");
                      setUserData({ name, description });
                      setVisible({
                        showName: false,
                        showDescription: true,
                      });
                    }}
                  />
                ) : (
                  <div className="flex ">
                    <IoMdClose
                      onClick={() => {
                        setNameErrorMessage("");
                        setDescriptionErrorMessage("");

                        setVisible((prev) => ({
                          ...prev,
                          showDescription: false,
                        }));
                      }}
                    />
                    {loading ? (
                      <MoonLoader color="#820ab0" size={20} />
                    ) : (
                      <IoCheckmark
                        onClick={() => handleSubmit(descriptionInputRef)}
                      />
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {descriptionErrorMessage && (
          <span className="w-[70%] mx-auto  text-red-400  ">
            {descriptionErrorMessage}
          </span>
        )}
      </div>
      {/* List memebers */}
      <div className=" w-[70%] h-full mx-auto flex flex-col gap-2 mt-4">
        <div className="flex gap-4 text-neutral_gray">
          <span>{users.length}</span>
          <h1> {lang[langKey].members}</h1>
        </div>
        {activeConversation.users.map((user) => (
          <div key={user._id} className="flex items-center   gap-4 ">
            <img
              src={user.picture}
              className="w-10 h-10 rounded-full"
              alt={`Avatar of ${user.name}`}
            />
            <div className="flex flex-col">
              <h1 className="font-semibold text-light-black_dark-white ">
                {user.name}
              </h1>
              <h1 className="text-neutral_gray">{user.status}</h1>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

const UpdateGroupInfoWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <GroupInfo {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default UpdateGroupInfoWithSocket;

{
  /* <div className="flex flex-col gap-4 items-center justify-center  w-full h-full  text-light-black_dark-white "></div> */
}
