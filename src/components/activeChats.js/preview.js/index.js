import { IoClose, MdDelete } from "../../../icons";
import { useEffect, useRef, useState } from "react";
import { deleteFiles, emptyFiles } from "../../../store/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import AddFiles from "./AddFiles";
import SendMessage from "./SendMessage";
import VideoThumbnail from "react-video-thumbnail";
import { lang } from "../../../utils/languageConstants";

const Preview = ({ files }) => {
  const videoRef = useRef(null);
  const { language: langKey } = useSelector((store) => store.user);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.disablePictureInPicture = true;
    }
  }, []);
  const dispatch = useDispatch();
  const [index, setIndex] = useState(0);
  const [message, setMessage] = useState([]);
  const deleteHandler = () => {
    const i = index;
    const newfiles = files.filter((item, i) => i !== index);
    let newMessage = message.filter((item, i) => i !== index);
    let count = 0;
    newMessage.forEach((item) => {
      item.key = count;
      count += 1;
    });

    setMessage(newMessage);
    dispatch(deleteFiles(newfiles));
    i == 0 ? setIndex(0) : setIndex((prev) => prev - 1);
  };

  return (
    <div className="absolute flex items-center  justify-center w-full h-full   bg-white/50 z-10">
      <div className="  top-[15%] left-[20%]  rounded-lg w-[40%] h-[70%]  z-20 ">
        <div className="w-full h-full flex flex-col  bg-black pt-4 ">
          <div className="flex items-center pr-8 justify-between">
            <div
              className="w-8 h-8 bg-slate-50 bg-opacity-25 items-center justify-center  rounded-full ml-4 "
              onClick={() => {
                dispatch(emptyFiles());
                setMessage([]);
              }}
            >
              <IoClose className="w-8 h-8 fill-white  hover:fill-red-600" />
            </div>

            {files.length > 1 && (
              <div
                className="bg-slate-50 bg-opacity-25 w-8 h-8 flex items-center justify-center rounded-full"
                onClick={() => deleteHandler()}
              >
                <MdDelete className="fill-white  hover:fill-red-600 text-2xl " />
              </div>
            )}
          </div>

          <div className="  h-[75%] w-3/4 mx-auto flex justify-center items-center ">
            {files[index]?.type === "IMAGE" ? (
              <img
                src={files[index]?.fileData}
                alt="image"
                className="w-full h-full object-contain"
              />
            ) : files[index]?.type === "VIDEO" ? (
              <video
                ref={videoRef}
                src={files[index]?.fileData}
                controls
                playsInline
                controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
                className="w-full h-[65%] object-contain  -top-10"
              />
            ) : (
              <div className="  flex flex-col  items-center justify-center">
                <img
                  src={`../../images/fileLogos/${files[index]?.type}.png`}
                  className="w-24 h-24"
                />

                <h1 className="text-white font-bold">
                  {files[index]?.fileDefault.name}
                </h1>
                <h1 className="text-white">
                  {files[index]?.type} document -{" "}
                  {files[index]?.fileDefault.size / (1024 * 1024) < 1
                    ? (files[index]?.fileDefault.size / (1024 * 1024)).toFixed(
                        3
                      )
                    : (
                        files[index]?.fileDefault.size /
                        (1024 * 1024)
                      ).toFixed()}
                  MB
                </h1>
              </div>
            )}
          </div>
          {/* Input */}
          <div className=" relative w-full flex items-center justify-center h-8 px-12 ">
            <div className="w-full  flex items-center  space-x-2 h-full pl-4  shadow-lg border border-gray-400 rounded-lg pr-2 ">
              <AddFiles files={files} />
              {files.map(
                (item, i) =>
                  i === index && (
                    <div className="w-full" key={index}>
                      <input
                        type="text"
                        value={message[i]?.message || ""}
                        placeholder={`${lang[langKey].add_caption}...`}
                        className="w-full h-full outline-none pl-3 py-1 bg-black text-white"
                        onChange={(e) => {
                          const updatedMessages = [...message];
                          const index = updatedMessages.findIndex(
                            (item) => item.key === i
                          );
                          if (index !== -1) {
                            updatedMessages[index] = {
                              ...updatedMessages[index],
                              message: e.target.value,
                            };
                          } else {
                            updatedMessages.push({
                              key: i,
                              message: e.target.value,
                            });
                          }
                          setMessage(updatedMessages);
                        }}
                      />
                    </div>
                  )
              )}
            </div>
            {/*Lists of Contents */}
            <div className=" absolute  top-[-90px] flex justify-center w-full  space-x-2 h-20   overflow-x-auto ">
              {files.map((item, i) => (
                <div
                  onClick={() => setIndex(i)}
                  className={` min-w-[40px] max-w-[40px] h-full flex items-center justify-center overflow-hidden border-2 border-violet-400 ${
                    i == index ? "border-green-400 " : ""
                  } `}
                  key={i}
                >
                  {item.type === "IMAGE" ? (
                    <img
                      src={item.fileData}
                      className="w-full h-full object-cover"
                    />
                  ) : item.type === "VIDEO" ? (
                    <video
                      src={item.fileData}
                      controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
                      className="w-full h-full  object-fill "
                    />
                  ) : (
                    <img
                      src={`../../images/fileLogos/${item.type}.png`}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <SendMessage files={files} messages={message} />
        </div>
      </div>
    </div>
  );
};

export default Preview;
