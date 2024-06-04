const coupleMessages = (files, messages) => {
  let updatedFiles = [];

  files.forEach((item, index) => {
    updatedFiles.push({ ...item, msg: messages[index]?.message || "" });
  });
  return updatedFiles;
};

export default coupleMessages;
