import React from "react";
const SearchList = ({
  searchResult,
  setSelectedUsers,
  setUserList,
  setSearchResult,
  inputRef,
}) => {
  return (
    <div>
      {searchResult.map((item) => (
        <div
          key={item._id}
          className="group  h-18 w-full flex space-x-3 p-5 hover:bg-light-soft-gray_dark-black "
          onClick={() => {
            setSelectedUsers((prev) => [...prev, item]);
            setUserList((prev) => prev.filter((user) => user._id !== item._id));

            setSearchResult([]);
            inputRef.current.value = "";
          }}
        >
          {/*Image */}
          <div className="h-[51px] w-[64px] rounded-full ">
            <img
              src={item.picture}
              alt="profile_pic"
              className="object-cover w-full h-full rounded-full"
            />
          </div>

          <div className="flex  flex-col items-left justify-between  w-full">
            <h1 className="text-xl font-semibold ">{item.name}</h1>
            <h2 className="text-neutral_gray">{item.status}</h2>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchList;
