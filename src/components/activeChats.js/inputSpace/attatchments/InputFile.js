import { LuFiles } from "../../../../icons";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { storeFiles } from "../../../../store/chatSlice";
import MimeTypes from "../../../../utils/mimeTypes";
import { lang } from "../../../../utils/languageConstants";

const InputFile = ({ setHideIcons }) => {
  const inputRef = useRef();
  const dispatch = useDispatch();
  const langKey = useSelector((store) => store.user.language);
  const changeHandler = (e) => {
    let files = Array.from(e.target.files);

    files.forEach((file) => {
      if (
        file.type !== "text/plain" &&
        file.type !== "application/pdf" &&
        file.type !== "application/msword" &&
        file.type !==
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
        file.type !== "application/vnd.ms-powerpoint" &&
        file.type !==
          "application/vnd.openxmlformats-officedocument.presentationml.presentation" &&
        file.type !== "application/vnd.ms-excel" &&
        file.type !==
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
        file.type !== "application/zip"
      ) {
        files.filter((item) => item.name !== file.name);
        return;
      } else if (file.size > 1024 * 1024 * 10) {
        files.filter((item) => item.name !== file.name);
        return;
      } else {
        dispatch(
          storeFiles({
            fileDefault: file,
            type: MimeTypes(file.type),
          })
        );
      }
    });
  };
  return (
    <div
      className="flex space-x-4  p-2 py-4 items-center px-2  hover:bg-light-soft-gray_dark-black rounded-xl"
      onClick={() => {
        inputRef.current.click();
        setHideIcons(true);
      }}
    >
      <LuFiles className="text-4xl  " />
      <h1 className="font-semibold ">{lang[langKey].files}</h1>
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        accept="application/*,text/plain"
        onChange={(e) => changeHandler(e)}
      />
    </div>
  );
};

export default InputFile;
