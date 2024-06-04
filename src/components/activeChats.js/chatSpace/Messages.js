import dateHandler from "../../../utils/date";
import DocumentContainer from "./DocumentContainer";
import ImageContainer from "./ImageContainer";
import VideoContainer from "./VideoContainer";
import { lang } from "../../../utils/languageConstants";
import { useSelector } from "react-redux";
const Messages = ({ item, me }) => {
  const { language: langKey } = useSelector((store) => store.user);
  return (
    <div className={`flex   mt-10  text-white ${me ? "justify-end" : ""}`}>
      {item.files.length > 0 ? (
        <div
          className={`flex flex-col  
          justify-between items-end  min-w-72  max-w-[40%]  space-y-8  `}
        >
          {item.files.map((file, index) =>
            file.type === "IMAGE" ? (
              <ImageContainer file={file} item={item} key={index} me={me} />
            ) : file.type === "VIDEO" ? (
              <VideoContainer file={file} item={item} key={index} me={me} />
            ) : (
              <DocumentContainer file={file} item={item} key={index} me={me} />
            )
          )}
        </div>
      ) : (
        <div
          className={`relative  font-medium ${
            me
              ? "bg-green-400 dark:bg-green-600 text-black dark:text-white rounded-l-xl rounded-br-xl"
              : "bg-slate-300 text-black  rounded-r-xl rounded-bl-xl"
          }  min-w-56 w-auto max-w-[75%] py-[14px]  px-[20px] text-left break-all`}
        >
          {item.message}
          <div
            className={`absolute flex justify-between  w-full top-[-24px]   right-0  text-sm   text-neutral_gray `}
          >
            <span className="font-bold">
              {me ? lang[langKey].you : item.sender.name}
            </span>
            {dateHandler(item.createdAt)}
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
