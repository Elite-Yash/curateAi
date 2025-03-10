import { useState, useEffect } from "react";
import SaveProfileForm from "../components/aiPopup/SaveProfileForm";
import { getImage } from "../common/utils/logoUtils";
import { createCustomButton } from "../common/utils/createCustomButton";

const LinkedInProfile = () => {
    const [openAiPopup, setOpenAiPopup] = useState(false);
    const [profileName, setProfileName] = useState("");
    const [email, setEmail] = useState("");
    const [position, setPosition] = useState("");
    const [company, setCompany] = useState("");

    const scrapeProfileData = () => {
        const profileNameElement = document.querySelector("div.ph5 div.mt2.relative h1");
        const experienceSection = document.querySelector("section.artdeco-card.pv-profile-card.break-words.mt2 div#experience")?.closest("section");
        const experienceData = experienceSection?.lastElementChild;
        const positionElement = experienceData?.querySelector("div.display-flex.flex-column .t-bold span");
        const companyElement = experienceData?.querySelector("div.display-flex.flex-column .t-14.t-normal span");
        const profileNameText = profileNameElement?.textContent.trim() || "";
        const positionText = positionElement?.textContent.trim() || "";
        const companyText = companyElement?.textContent.trim() || "";

        const cleanCompanyText = companyText.split("·")[0].trim();
        if (companyText.includes("yrs") || companyText.includes("mos") || companyText.includes("mo")) {
            const position = experienceData?.querySelector("div.pvs-entity__sub-components ul li div.display-flex.flex-column.align-self-center.flex-grow-1 div.display-flex.full-width span");
            setPosition(position?.textContent.trim() || "");
            setCompany(positionText);
            setProfileName(profileNameText);
        } else {
            setProfileName(profileNameText);
            setPosition(positionText);
            setCompany(cleanCompanyText);
        }
    };

    const handleClick = () => {
        scrapeProfileData();
        setOpenAiPopup(true);
    };

    useEffect(() => {
        const spans = document.querySelector("div.ph5 div.mt2.relative")?.querySelectorAll("span");

        if (spans?.length > 0) {
            const customSpan = createCustomButton('Save', getImage("saveProfileIcon"), 'Save Profile');
            spans[0].closest("div").appendChild(customSpan);

            // Add event listener to the button
            customSpan.addEventListener("click", handleClick);

            // Cleanup function to remove event listener
            return () => {
                customSpan.removeEventListener("click", handleClick);
            };
        }
    }, []);

    // console.log("Profile Name: ", profileName);
    // console.log("Position: ", position);
    // console.log("Company: ", company);

    if (openAiPopup) {
        return (
            <div
                style={{
                    position: "fixed",
                    width: "100%",
                    height: "100vh",
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                    top: 0,
                    left: 0,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 21213123,
                }}
            >
                <SaveProfileForm onClose={() => setOpenAiPopup(false)} profileName={profileName} position={position} company={company} />
            </div>
        );
    }
    return null;
}

export default LinkedInProfile;
