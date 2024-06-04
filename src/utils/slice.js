export const nameSlice = (name) => {
  return name.length > 13 ? name.slice(0, 13) + "..." : name;
};
