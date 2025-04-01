import { useState, useEffect } from "react";
import SaveProfileForm from "../components/aiPopup/SaveProfileForm";
import { getImage } from "../common/utils/logoUtils";
import { createCustomButton } from "../common/utils/createCustomButton";
import { API_URL } from "../common/config/constMessage";
import { Endpoints, fetchAPI, Method } from "../common/config/apiService";

const LinkedInProfile = () => {
    const [openAiPopup, setOpenAiPopup] = useState(false);
    const [profileName, setProfileName] = useState("");
    // const [email, setEmail] = useState("");
    const [position, setPosition] = useState("");
    const [company, setCompany] = useState("");
    const [profileImg, setProfileImg] = useState("")
    const [activePlan, setActiveplan] = useState(false);

    const scrapeProfileData = () => {
        const profileNameElement = document.querySelector("div.ph5 div.mt2.relative h1");
        const experienceSection = document.querySelector("section.artdeco-card.pv-profile-card.break-words.mt2 div#experience")?.closest("section");
        const experienceData = experienceSection?.lastElementChild;
        const positionElement = experienceData?.querySelector("div.display-flex.flex-column .t-bold span");
        const companyElement = experienceData?.querySelector("div.display-flex.flex-column .t-14.t-normal span");

        const profileNameText = profileNameElement?.textContent?.trim() || "";
        const positionText = positionElement?.textContent?.trim() || "";
        const companyText = companyElement?.textContent?.trim() || "";

        const ProfileImage = document.querySelector("main section div.ph5 div.pv-top-card__non-self-photo-wrapper img") as HTMLImageElement | null;
        const cleanCompanyText = companyText.split("·")[0].trim();
        if (companyText.includes("yrs") || companyText.includes("mos") || companyText.includes("mo")) {
            const position = experienceData?.querySelector("div.pvs-entity__sub-components ul li div.display-flex.flex-column.align-self-center.flex-grow-1 div.display-flex.full-width span") as HTMLElement | null;
            setPosition(position?.textContent?.trim() || "");
            setCompany(positionText);
        } else {
            setPosition(positionText);
            setCompany(cleanCompanyText);
        }

        setProfileName(profileNameText);
        setProfileImg(ProfileImage?.src || "");
    };

    const handleClick = () => {
        scrapeProfileData();
        setOpenAiPopup(true);
    };

    useEffect(() => {
        // Function to append the custom button
        const appendCustomButton = () => {
            const spans = document.querySelector("div.ph5 div.mt2.relative")?.querySelectorAll("span");

            if (spans && spans.length > 0) {
                const customSpan = createCustomButton('Save', getImage("saveProfileIcon"), 'Save Profile');
                spans[0].closest("div")?.appendChild(customSpan);

                // Add event listener to the button
                customSpan.addEventListener("click", handleClick);

                // Cleanup function to remove event listener
                return () => {
                    customSpan.removeEventListener("click", handleClick);
                };
            }
        }
        const checkActivePlan = async () => {
            chrome.runtime.sendMessage({ type: "getCookies" }, async (response) => {
                if (!response || !response.success || !response.token) {
                    console.error("Failed to retrieve auth token.");
                } else {
                    try {
                        const authToken = response.token;
                        const url = `${API_URL}/${Endpoints.checkActivePlan}`;
                        const result = await fetchAPI(
                            url,
                            {
                                method: Method.get,
                                headers: {
                                    Authorization: `Bearer ${authToken}`,
                                    "Content-Type": "application/json",
                                },
                            });
                        console.log("result", result)
                        if (result.status === 200 && result.success === false) {
                            setActiveplan(false);
                        } else {
                            setActiveplan(true)
                        }
                    } catch (error) {
                        console.error("Error fetching plans:", error);
                    }
                    finally {
                        appendCustomButton();
                    }
                }
            });
        };
        checkActivePlan();
    }, []);


    useEffect(() => {

    }, []);

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
                <SaveProfileForm onClose={() => setOpenAiPopup(false)} profileName={profileName} position={position} company={company} profileImg={profileImg} activePlan={activePlan} />
            </div>
        );
    }
    return null;
}

export default LinkedInProfile;
