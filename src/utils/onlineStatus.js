const onlineStatus = (receiverId, onlineUsers) => {
  return onlineUsers?.some((item) => item.userId === receiverId);
};
export default onlineStatus;
