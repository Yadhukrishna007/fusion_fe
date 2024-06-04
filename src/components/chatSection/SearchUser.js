import { IoSearchSharp, AiFillCloseCircle } from "../../icons";
import { useSelector } from "react-redux";
import axios from "axios";
import { useContext } from "react";
import { SearchContext } from "../context";

const SearchUser = ({ lang, langKey }) => {
  const { toggleSearch, setToggleSearch, setSearchResults, searchInputRef } =
    useContext(SearchContext);

  const token = useSelector((store) => store.user.user.token);

  const handleSearch = async (e) => {
    if (e.target.value === "") {
      setSearchResults([]);
      setToggleSearch(false);
    } else {
      try {
        setToggleSearch(true);
        const res = await axios.get(
          `${process.env.REACT_APP_API_ENDPOINT}/search?search=${e.target.value}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setSearchResults(res.data.users);
      } catch (error) {
        alert("An error occurred while searching users.");
      }
    }
  };
  return (
    <div className="group border-2  w-[80%] mx-auto flex   space-x-2 items-center p-2 rounded-xl box dark:box">
      <IoSearchSharp className=" text-xl fill-[#888888]" />
      <input
        ref={searchInputRef}
        className="outline-none   w-full placeholder:font-semibold placeholder:text-neutral_gray dark:bg-[#1f2128]"
        type="text"
        placeholder={`${lang[langKey].search}...`}
        onChange={(e) => handleSearch(e)}
      />
      {toggleSearch && (
        <AiFillCloseCircle
          className="  text-2xl dark:fill-[#FF033E] cursor-pointer"
          onClick={() => {
            searchInputRef.current.value = "";
            setSearchResults([]);
            setToggleSearch(false);
          }}
        />
      )}
    </div>
  );
};

export default SearchUser;
