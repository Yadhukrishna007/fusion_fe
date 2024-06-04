import { Link } from "react-router-dom";
import dateHandler from "../../../utils/date";
const ImageContainer = ({ file, item, me }) => {
  return (
    <div
      className={`${me ? "rounded-l-xl rounded-br-xl" : "rounded-r-xl rounded-bl-xl"} flex flex-col  w-full   border-8  border-slate-400
      rounded-bl-xl rounded-br-xl relative`}
    >
      <Link to={file.file.secure_url} target="_blank" download>
        <img
          src={file.file.url}
          alt="Image"
          className=" relative w-full  h-90 object-contain"
        />
      </Link>

      {file.message && (
        <div className="w-full min-h-[4px]  p-[1.5px] h-auto  text-black  overflow bg-gray-400 font-medium break-all ">
          <p className="w-full px-2 text-justify">{file.message}</p>
        </div>
      )}
      <div
        className={`absolute flex w-full top-[-32px]  right-0 justify-between text-sm    text-neutral_gray  `}
      >
        <span className="font-bold">{me ? "You" : item.sender.name}</span>
        {dateHandler(item.createdAt)}
      </div>
    </div>
  );
};

export default ImageContainer;
