import { Link } from "react-router-dom";
import dateHandler from "../../../utils/date";
import { IoMdDownload } from "react-icons/io";
const DocumentContainer = ({ file, item, me }) => {
  return (
    <div
      className={`${me ? "rounded-l-xl rounded-br-xl" : "rounded-r-xl rounded-bl-xl"} flex flex-col  rounded-bl-xl rounded-br-xl
       w-full  border-8 border-gray-400  break-all relative`}
    >
      <div className="flex items-center justify-between h-16 pr-4 bg-gray-400 w-full ">
        <img
          src={`../images/fileLogos/${file.type}.png`}
          className=" relative w-12  h-12 object-contain"
        />
        <div className="flex flex-col w-full ">
          <h1>{file.file.original_filename}</h1>
          <p className="w-full px-2">
            {file.file.bytes / (1024 * 1024) < 1
              ? (file.file.bytes / (1024 * 1024)).toFixed(3)
              : (file.file.bytes / (1024 * 1024)).toFixed()}
            MB - {file.type.toLowerCase()}
          </p>
        </div>
        <Link to={file.file.secure_url} target="_blank" download>
          <IoMdDownload className="w-8 h-8" />
        </Link>
      </div>

      {file.message && (
        <div className="w-full min-h-[4px]  p-[1.5px] h-auto  text-black  overflow bg-gray-400 font-medium ">
          <p className="w-full px-2 text-justify">{file.message}</p>
        </div>
      )}
      <div
        className={`absolute flex w-full top-[-32px]  right-0 justify-between text-sm    text-neutral_gray `}
      >
        <span className="font-bold">{me ? "You" : item.sender.name}</span>
        {dateHandler(item.createdAt)}
      </div>
    </div>
  );
};

export default DocumentContainer;
