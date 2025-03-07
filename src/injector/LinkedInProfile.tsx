import { useState, useEffect } from "react";
import SaveProfileForm from "../components/aiPopup/SaveProfileForm";
import { getImage } from "../common/utils/logoUtils";
import { createCustomButton } from "../common/utils/createCustomButton";

const LinkedInProfile = () => {
    const [openAiPopup, setOpenAiPopup] = useState(false);

    useEffect(() => {
        const spans = document.querySelector("div.ph5 div.mt2.relative").querySelectorAll("span");
        if (spans.length > 0) {

            const customeSpan = createCustomButton('Save', getImage("saveProfileIcon"), 'Save Profile');
            // Append main span to the closest div
            spans[0].closest("div").appendChild(customeSpan);

            // Add click event listener to open the form popup
            customeSpan.addEventListener("click", openFormPopup);
        }
    }, []); // Empty dependency array to run once after mount

    const openFormPopup = () => {
        setOpenAiPopup(true);
    }

    if (openAiPopup) {
        return (
            <div
                style={{
                    position: "fixed",
                    width: "100%",
                    height: "100vh",
                    maxHeight: "100vh",
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                    top: 0,
                    left: 0,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 21213123,
                }}
            >
                <SaveProfileForm onClose={() => setOpenAiPopup(false)} />
            </div>
        );
    }
    return null;
}

export default LinkedInProfile;
