///<reference types="chrome"/>
import close from "../../images/closeIcon.svg";
import user from "../../images/user.svg";
import sendIcon from "../../images/send-icon.svg";
import translate from "../../images/translate.svg";
import copyIcon from "../../images/copy-icon.svg";
import saveProfileIcon from "../../images/saveProfileIcon.svg";
import logoBlack from "../../../public/logo.png";
import fLogo from "../../../public/f-logo.png";


const imagePath: any = {
  close,
  user,
  sendIcon,
  translate,
  copyIcon,
  saveProfileIcon,
  fLogo,
  logoBlack
};

// Get Logo image
export const getImage = (imageName: string) => {
  if (window.chrome) {

    return chrome.runtime.getURL(imagePath[imageName]);
  }
};
