export const getProfileImage = (file: any, type: String = "avatar") => {
  if (file && typeof file === "string") return file;
  if (file && typeof file === "object") return file.uri;
  return type === "avatar"
    ? require("../assets/images/defaultAvatar.png")
    : require("../assets/images/walletIconPng.png");
};

export const getFilePath = (file: any, type: String = "avatar") => {
  if (file && typeof file === "string") return file;
  if (file && typeof file === "object") return file.uri;
  return null;
};
