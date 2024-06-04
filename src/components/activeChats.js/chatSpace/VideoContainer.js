import dateHandler from "../../../utils/date";
const VideoContainer = ({ file, item, me }) => {
  return (
    <div
      className={`${me ? "rounded-l-xl rounded-br-xl" : "rounded-r-xl rounded-bl-xl"}
     flex flex-col w-full   bg-violet-400 border-8 border-gray-400 break-all   rounded-bl-xl rounded-br-xl relative`}
    >
      <video
        src={file.file.url}
        controls
        className=" relative w-full  h-90 object-contain"
      />
      {file.message && (
        <div className="w-full min-h-[4px]  p-[1.5px] h-auto  text-black  overflow bg-gray-400 font-medium ">
          <p className="w-full px-2 text-justify">{file.message}</p>
        </div>
      )}
      <div
        className={`absolute flex w-full top-[-32px]  right-0 justify-between text-sm   text-neutral_gray   `}
      >
        <span className="font-bold">{me ? "You" : item.sender.name}</span>
        {dateHandler(item.createdAt)}
      </div>
    </div>
  );
};

export default VideoContainer;
