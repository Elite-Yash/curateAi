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
import iconLogo from "../../../public/icon.svg";
import sendIcon from "../../images/send-icon.svg";
import translate from "../../images/translate.svg";
import copyIcon from "../../images/copy-icon.svg";
import saveProfileIcon from "../../images/saveProfileIcon.svg";


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
  user,
  sendIcon,
  translate,
  copyIcon,
  saveProfileIcon
};

// Get Logo image
export const getImage = (imageName: string) => {
  if (window.chrome) {

    return chrome.runtime.getURL(imagePath[imageName]);
  }
  return logo;
};
