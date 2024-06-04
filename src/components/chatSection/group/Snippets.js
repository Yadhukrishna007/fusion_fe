import React from "react";
import { IoMdClose } from "../../../icons";

const Snippets = ({ selectedUsers, setSelectedUsers, setUserList }) => {
  const handleSnippet = (item) => {
    setSelectedUsers((prev) => prev.filter((user) => user._id !== item._id));
    setUserList((prev) =>
      [...prev, item].sort((a, b) => a.name.localeCompare(b.name))
    );
  };
  return (
    <div className="grid grid-cols-3 gap-2 p-6">
      {selectedUsers.length > 0 &&
        selectedUsers.map((item) => (
          <div
            key={item._id}
            className="flex  items-center justify-between bg-gray-400  border-[1px] border-violet-400 rounded-lg p-[3px] px-2"
          >
            <span>
              {item.name.length > 9 ? `${item.name.slice(0, 10)}` : item.name}
            </span>
            <div
              className="w-4 h-4 hover:bg-white rounded-full cursor-pointer "
              onClick={() => handleSnippet(item)}
            >
              <IoMdClose />
            </div>
          </div>
        ))}
    </div>
  );
};

export default Snippets;
