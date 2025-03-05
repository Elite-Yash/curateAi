///<reference types="chrome"/>
import logo from "../../images/loggedOutButton.png";
import close from "../../images/closeIcon.svg";
import connect from "../../images/connect.svg";
import create from "../../images/create.svg";
import dashboard from "../../images/dashboard.svg";
import deleteIcon from "../../images/delete.svg";
import message from "../../images/message.svg";
import tools from "../../images/tools.svg";
import user from "../../images/user.svg";
import iconLogo from "../../../public/icon.png";


const imagePath: any = {
  panel: logo,
  iconLogo,
  close,
  connect,
  create,
  dashboard,
  message,
  deleteIcon,
  tools,
  user
};

// Get Logo image
export const getImage = (imageName: string) => {
  if (window.chrome) {

    return chrome.runtime.getURL(imagePath[imageName]);
  }
  return logo;
};
