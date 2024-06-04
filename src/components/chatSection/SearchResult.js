import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { storeActiveConversation } from "../../store/chatSlice";
import axios from "axios";
import onlineStatus from "../../utils/onlineStatus";
const SearchResult = ({ item }) => {
  const { user, onlineUsers } = useSelector((store) => store.user);
  const token = user.token;
  const isOnline = onlineStatus(item._id, onlineUsers);
  const { _id: receiverId, name, picture } = item;

  const dispatch = useDispatch();
  const conversationHandler = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/conversation/`,
        { receiverId, isGroup: item.isGroup ? item._id : false },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(storeActiveConversation(res.data.conversation));
    } catch (error) {
      alert(
        "An error occurred while fetching the  data. Please try again later."
      );
    }
  };
  return (
    <div
      className="group h-18 w-full flex space-x-3 p-5 hover:bg-light-soft-gray_dark-black"
      onClick={() => conversationHandler()}
    >
      <div className=" relative h-[51px] w-[64px] rounded-full ">
        <img
          src={picture}
          alt="profile_pic"
          className="object-cover w-full h-full rounded-full"
        />

        {!item.isGroup && (
          <div
            className={`  absolute bottom-1 -right-1 ${
              isOnline ? "bg-online" : "bg-offline "
            }  h-3 w-3 rounded-full border-[2px]  border-light-white_dark-charcoal-gray `}
          ></div>
        )}
      </div>

      <div className="flex items-center justify-between  w-full">
        <div>
          <h1 className="text-xl font-semibold ">{name}</h1>
        </div>
      </div>
    </div>
  );
};

export default SearchResult;
