// import { linkedin_url } from "../../common/config/constMessage";
import { goToDashBoard } from "../../common/helpers/commonHelpers";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/selector/usersSelector";
import { getImage } from "../../common/utils/logoUtils";
/**
 * Popup component that displays a button to connect to LinkedIn.
 * 
 * This component renders a button styled with Tailwind CSS classes. When clicked,
 * it opens a new browser tab to the LinkedIn URL, using the `openWindowTab` helper function.
 * 
 * @component
 * 
 * @returns {JSX.Element} The rendered Popup component.
 */

interface PopupProps {
    // userLogOut: () => void; // Type the userLogOut function
}

const Popup: React.FC<PopupProps> = () => {
    // const handleLinkedInSignIn = () => {
    //     openWindowTab(linkedin_url);
    //     chrome.runtime.sendMessage({ type: "fetchProfileLink" });
    // };
    const loginUser = useSelector(selectUser);
    console.log("loginUser123", loginUser)
    return (
        <div className="flex-item justify-center item-center w-[300px] p-6 background-three">
            {/* Icon above the title */}
            <div className="flex items-center gap-2 mb-3">
                <img src={getImage('iconLogo')} className="re-logo-b-o transition w-7" alt="img" />
                <span className="color-one uppercase larger font-semibold dark-color text-xl">Curate ai</span>
            </div>
            <div className="absolute top-6 right-5">

                <button >
                    <i className="fa-solid fa-power-off color-one" style={{ fontSize: "1rem" }}></i>
                </button>

            </div>

            <span className="w-full flex justify-center item-center h-px border-bg"></span>
            <p className="dec-color mb-3 mt-3 font-normal leading-7 text-center"> You have successfully logged in. Please connect your account to LinkedIn.</p>
            <div className="text-center">
                <button
                    type="button"
                    onClick={() => goToDashBoard()}
                    // className="text-white background-one focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    className="text-white bg-gradient-to-r background-one font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                    Open DashBoard
                </button>
            </div>
        </div>
    );
};

export default Popup;   
