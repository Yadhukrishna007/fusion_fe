import { RiGalleryFill } from "../../../../icons";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { storeFiles } from "../../../../store/chatSlice";
import MimeTypes from "../../../../utils/mimeTypes";
import { lang } from "../../../../utils/languageConstants";

const InputImage = ({ setHideIcons }) => {
  const inputRef = useRef();
  const dispatch = useDispatch();
  const langKey = useSelector((store) => store.user.language);
  const changeHandler = (e) => {
    let files = Array.from(e.target.files);

    files.forEach((file) => {
      if (
        file.type !== "image/png" &&
        file.type !== "image/jpeg" &&
        file.type !== "image/jpg" &&
        file.type !== "image/webp" &&
        file.type !== "video/mp4" &&
        file.type !== "video/mpeg"
      ) {
        files.filter((item) => item.name !== file.name);
        return;
      } else if (file.size > 1024 * 1024 * 10) {
        files.filter((item) => item.name !== file.name);
        return;
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          dispatch(
            storeFiles({
              fileDefault: file,
              fileData: e.target.result,
              type: MimeTypes(file.type),
              isGroup: false,
            })
          );
        };
      }
    });
  };
  return (
    <div
      className="flex space-x-4 h-full items-center px-2 py-2 hover:bg-light-soft-gray_dark-black rounded-xl "
      onClick={() => {
        inputRef.current.click();
        setHideIcons(true);
      }}
    >
      <RiGalleryFill className="text-4xl  " />
      <h1 className="font-semibold ">{lang[langKey].Images_videos}</h1>
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        accept="image/png,image/jpeg,image/jpg,image/webp,video/mp4,video/mpeg"
        onChange={(e) => changeHandler(e)}
      />
    </div>
  );
};

export default InputImage;
