import { goToDashBoard, openWindowTab } from "../../common/helpers/commonHelpers";
import { getImage } from "../../common/utils/logoUtils";
import { useEffect, useState } from "react";
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


const Popup: React.FC = () => {
    const [login, setLogin] = useState<string | null>(null);

    const goToLinkedIn = () => {
        openWindowTab("https://linkedin.com/");
    };
    // Fetch the token from Chrome storage on component mount
    useEffect(() => {
        chrome.storage.local.get(["token"], (result) => {
            if (result.token) {
                setLogin(result.token);
            } else {
                console.log("No token found in Chrome storage.");
            }
        });
    }, []);

    // Send a message to background.js to handle logout
    const LogOut = () => {
        chrome.runtime.sendMessage({ type: "LogOut" }, () => { });

        setLogin(null)
    };

    return (
        <div className={`flex-item justify-center item-center p-6 background-three ${login ? "w-[345px]" : "w-[300px]"}`}>
            {/* Header with logo and title */}
            <div className="flex items-center gap-2 mb-3">
                <img src={getImage('fLogo')} className="re-logo-b-o transition w-12 border-[2.5px] border-solid rounded-full border-[#ff5c35]" alt="img" />
                <span className="color-one uppercase larger font-semibold dark-color text-xl">Evarobo</span>
            </div>

            {/* Logout button (only works when logged in) */}
            <div className="absolute top-6 right-5">
                {login &&
                    (
                        <button onClick={LogOut}>
                            <i className="fa-solid fa-power-off color-one" style={{ fontSize: "1rem" }}></i>
                        </button>

                    )}
            </div>


            <span className="w-full flex justify-center item-center h-px border-bg"></span>

            {/* Message based on login status */}
            <p className="dark-color mb-3 mt-3 font-normal leading-7 text-center">
                {login
                    ? "Welcome to Evarobo"
                    : "Please log in to Evarobo"
                }
            </p>
            <p className="dec-color mb-3 mt-3 font-normal leading-7 text-center">
                {login
                    ? "How to use the Evarobo pleas click here"
                    : ""
                }
            </p>

            {/* Button changes based on login state */}
            <div className="text-center">
                {login ? (
                    <>
                        <button
                            onClick={() => goToDashBoard()}
                            type="button"
                            className="text-white bg-gradient-to-r background-one font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:ring-[#ff9479] dark:focus:ring-blue-800"
                        >
                            Open Dashboard
                        </button>
                        <button
                            onClick={() => goToLinkedIn()}
                            type="button"
                            className="text-white bg-gradient-to-r background-one font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:ring-[#ff9479] dark:focus:ring-blue-800"
                        >
                            Go to LinkedIn
                        </button>
                    </>
                ) : (
                    <button
                        type="button"
                        onClick={() => { goToDashBoard() }}
                        className="text-white w-28 bg-gradient-to-r background-one font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:ring-[#ff9479] dark:focus:ring-blue-800"
                    >
                        Sign In
                    </button>
                )}
            </div>
        </div >
    );
};

export default Popup;