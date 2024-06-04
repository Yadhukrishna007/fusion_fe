import { useRef } from "react";
import { FaFileCircleMinus } from "../../../icons";
import MimeTypes from "../../../utils/mimeTypes";
import { storeFiles } from "../../../store/chatSlice";
import { useDispatch } from "react-redux";
const AddFiles = ({ files }) => {
  const dispatch = useDispatch();
  const imgVidRef = useRef();
  const docRef = useRef();

  const imgVidHandler = (e) => {
    let imgVidselected = Array.from(e.target.files);

    imgVidselected.forEach((file) => {
      if (
        file.type !== "image/png" &&
        file.type !== "image/jpeg" &&
        file.type !== "image/jpg" &&
        file.type !== "image/webp" &&
        file.type !== "video/mp4" &&
        file.type !== "video/mpeg"
      ) {
        imgVidselected.filter((item) => item.name !== file.name);
        return;
      } else if (file.size > 1024 * 1024 * 10) {
        imgVidselected.filter((item) => item.name !== file.name);
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
            })
          );
        };
      }
    });
  };

  const docHandler = (e) => {
    let docSelected = Array.from(e.target.files);

    docSelected.forEach((file) => {
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
        docSelected.filter((item) => item.name !== file.name);
        return;
      } else if (file.size > 1024 * 1024 * 10) {
        docSelected.filter((item) => item.name !== file.name);
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
    <>
      <FaFileCircleMinus
        className="fill-white w-4 h-12"
        onClick={() => {
          if (
            files.some((item) => item.type === "IMAGE" || item.type == "VIDEO")
          ) {
            imgVidRef.current.click();
          } else {
            docRef.current.click();
          }
        }}
      />
      <input
        ref={imgVidRef}
        type="file"
        multiple
        className="hidden"
        accept="image/png,image/jpeg,image/jpg,image/webp,video/mp4,video/mpeg"
        onChange={(e) => imgVidHandler(e)}
      />

      <input
        ref={docRef}
        type="file"
        multiple
        className="hidden"
        accept="application/*,text/plain"
        onChange={(e) => docHandler(e)}
      />
    </>
  );
};

export default AddFiles;
