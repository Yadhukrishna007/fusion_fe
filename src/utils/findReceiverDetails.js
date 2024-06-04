export const findReceiverName = (userId, users) => {
  return users[0]._id === userId ? users[1].name : users[0].name;
};

export const findReceiverPicture = (userId, users) => {
  return users[0]._id === userId ? users[1].picture : users[0].picture;
};

export const findReceiver = (userId, users) => {
  return users[0]._id === userId ? users[1] : users[0];
};

export const findReceiverId = (userId, users) => {
  return users[0]._id === userId ? users[1]._id : users[0]._id;
};
