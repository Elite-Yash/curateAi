import { useState, useEffect, useCallback } from "react";
import SaveProfileForm from "../components/aiPopup/SaveProfileForm";
import { getImage } from "../common/utils/logoUtils";
import { createCustomButton } from "../common/utils/createCustomButton";
import { apiService } from "../common/config/apiService";
import useLinkedInUrlChange from "../hooks/useLinkedInUrlChange";

const LinkedInProfile = () => {
    const [openAiPopup, setOpenAiPopup] = useState(false);
    // const [profileName, setProfileName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [position, setPosition] = useState("");
    const [company, setCompany] = useState("");
    const [profileImg, setProfileImg] = useState("")
    const [city, setCity] = useState("")
    const [phone, setPhone] = useState("")
    const [education, setEducation] = useState("");
    const [companyUrl, setCompanyUrl] = useState("");
    const [skill, setSkill] = useState<string[]>([]);
    const [activePlan, setActiveplan] = useState(false);

    const scrapeProfileData = () => {
        const profileNameElement = document.querySelector("div.ph5 div.mt2.relative h1");
        const cityElement = document.querySelector(".text-body-small.inline.t-black--light.break-words")
        const experienceSection = document.querySelector("section.artdeco-card.pv-profile-card.break-words.mt2 div#experience")?.closest("section");
        const experienceData = experienceSection?.lastElementChild;
        const positionElement = experienceData?.querySelector("div.display-flex.flex-column .t-bold span");
        const companyElement = experienceData?.querySelector("div.display-flex.flex-column .t-14.t-normal span");
        const companyUrlElement = experienceData?.querySelector("div.display-flex.flex-column .display-flex.flex-row.justify-space-between a");
        const educationSection = document.querySelector("section.artdeco-card.pv-profile-card.break-words.mt2 div#education")?.closest("section");
        // const education = educationSection?.querySelector(".display-flex.flex-column.align-self-center .justify-space-between .optional-action-target-wrapper .t-14.t-normal .visually-hidden")  deggree name
        const education = educationSection?.querySelector(".display-flex.flex-column.align-self-center .justify-space-between .optional-action-target-wrapper .t-bold span")

        const profileNameText = profileNameElement?.textContent?.trim() || "";
        const nameParts = profileNameText.split(" ");
        const cityText = cityElement?.textContent?.trim() || "";
        const educationText = education?.textContent?.trim() || "";
        const positionText = positionElement?.textContent?.trim() || "";
        const companyText = companyElement?.textContent?.trim() || "";
        const companyUrl = companyUrlElement?.getAttribute("href")?.trim() || "";


        const ProfileImage = document.querySelector("main section div.ph5 div.pv-top-card__non-self-photo-wrapper img") as HTMLImageElement | null;
        const cleanCompanyText = companyText.split("·")[0].trim();
        if (companyText.split(" ").includes("yrs") || companyText.split(" ").includes("mos") || companyText.split(" ").includes("mo")) {
            const position = experienceData?.querySelector("div.pvs-entity__sub-components ul li div.display-flex.flex-column.align-self-center.flex-grow-1 div.display-flex.full-width span") as HTMLElement | null;
            setPosition(position?.textContent?.trim() || "");
            setCompany(positionText);
        } else {
            setPosition(positionText);
            setCompany(cleanCompanyText);
        }

        setFirstName(nameParts[0] || "");
        setLastName(nameParts[nameParts.length - 1] || "");
        setProfileImg(ProfileImage?.src || "");
        setCity(cityText);
        setEducation(educationText);
        setCompanyUrl(companyUrl);
    };

    const handleClick = () => {
        findemailfun();
        findSkillfuc();
        scrapeProfileData();
        setOpenAiPopup(true);
    };



    const findemailfun = useCallback(() => {
        const emailUrl = `${window.location.href}overlay/contact-info/`;
        const iframe = document.createElement('iframe');
        iframe.src = emailUrl;
        iframe.id = 'emailFinder';
        iframe.style.width = '1px';
        iframe.style.height = '1px';
        iframe.style.border = 'none';
        document.body.appendChild(iframe);

        iframe.onload = () => {
            const iframeDocument = (iframe.contentDocument || iframe.contentWindow?.document) as Document;
            if (iframeDocument) {
                const bodyText = iframeDocument.body.innerText;
                // email Regex
                const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/gi;
                const emails = bodyText.match(emailRegex);
                const emailData = emails ? emails[0] : ""
                //  Phone Regex
                const phoneRegex = /(\+\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,5}[-.\s]?\d{4,6}/g;
                // const phoneRegex = /(\+?\d{1,4}[\s-]?)?(\(?\d{2,5}\)?[\s-]?)?[\d\s-]{5,15}\d/g;
                const phones = bodyText.match(phoneRegex);
                const phoneData = phones ? phones[0] : "";

                setEmail(emailData);
                setPhone(phoneData);

                document.body.removeChild(iframe);
            }
        };
    }, [scrapeProfileData]);


    const findSkillfuc = useCallback(() => {
        const skillUrl = `${window.location.href}details/skills/`;
        const iframe = document.createElement("iframe");
        iframe.src = skillUrl;
        iframe.style.position = "absolute";
        iframe.style.top = "0";
        iframe.style.left = "0";
        iframe.style.width = "1px";
        iframe.style.height = "1px";
        iframe.style.opacity = "0";
        iframe.style.pointerEvents = "none";
        iframe.style.border = "none";
        document.body.appendChild(iframe);

        iframe.onload = () => {
            const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
            if (!iframeDocument) return;

            let attempts = 0;
            const intervalId = setInterval(() => {
                attempts++;
                const skillElements = iframeDocument?.querySelectorAll(
                    "main div.artdeco-tabs div.artdeco-tabpanel.active.ember-view ul li a.optional-action-target-wrapper[data-field='skill_page_skill_topic'] div.display-flex span[aria-hidden='true']"
                )
                if (skillElements.length > 0) {
                    const skills = Array.from(skillElements)
                        .map((el) => el.textContent?.trim() || "")
                        .filter(Boolean);
                    setSkill(skills);

                    clearInterval(intervalId);
                    document.body.removeChild(iframe);
                } else if (attempts > 15) {
                    clearInterval(intervalId);
                    document.body.removeChild(iframe);
                }
            }, 1000);
        };
    }, [scrapeProfileData]);



    // Function to append the custom button
    const appendCustomButton = () => {
        removeOldButtons();
        const spans = document.querySelector("div.ph5 div.mt2.relative")?.querySelectorAll("span");

        if (spans && spans.length > 0) {
            const customSpan = createCustomButton('Save', getImage("saveProfileIcon"), 'Save Profile');
            customSpan.classList.add("custom-save-btn");
            spans[0].closest("div")?.appendChild(customSpan);

            // Add event listener to the button
            customSpan.addEventListener("click", handleClick);

            // Cleanup function to remove event listener
            return () => {
                customSpan.removeEventListener("click", handleClick);
            };
        } else {
            const mainDiv: any = document.querySelector("div._83fbf827._85c77598  div._0182ff4d div._0182ff4d.dc20e8a0")
            const customSpan = createCustomButton('Save', getImage("saveProfileIcon"), 'Save Profile');
            customSpan.classList.add("custom-save-btn");
            mainDiv?.appendChild(customSpan);
             // Add event listener to the button
            customSpan.addEventListener("click", handleClick);

            // Cleanup function to remove event listener
            return () => {
                customSpan.removeEventListener("click", handleClick);
            };
        }
    }
    const checkActivePlan = async () => {
        try {

            const url = apiService.EndPoint.checkActivePlan;

            await apiService.commonAPIRequest(
                url,
                apiService.Method.get,
                undefined, // No query params for this request
                {}, // No body required for GET request
                (result: any) => {
                    if (result.data.userDetails.isTrialExpired) {
                        if (result?.status === 200 && result?.data.message === "User does not have an active subscription.") {
                            setActiveplan(false);
                        } else {
                            setActiveplan(true);
                        }
                    } else {
                        setActiveplan(true);
                    }
                }
            );

        } catch (error) {
            console.error("Error fetching plans:", error);
        }
    };

    const appendSavedButton = () => {
        removeOldButtons();
        const spans = document.querySelector("div.ph5 div.mt2.relative")?.querySelectorAll("span");

        if (spans && spans.length > 0) {
            const savedSpan = createCustomButton('Already Saved', getImage("saveProfileIcon"), 'Already Save Profile');
            savedSpan.classList.add("custom-save-btn");

            // make it look disabled
            savedSpan.style.pointerEvents = "none";
            savedSpan.style.opacity = "0.6";
            savedSpan.style.cursor = "not-allowed";

            // Tooltip (native browser title works)
            savedSpan.setAttribute("title", "Already Save Profile");

            spans[0].closest("div")?.appendChild(savedSpan);
        }
    };

    const checkProfileAlreadyExist = async () => {
        try {
            const currentUrl = window.location.href;
            const url = apiService.EndPoint.getProfiles;

            return new Promise<boolean>((resolve) => {
                apiService.commonAPIRequest(
                    url,
                    apiService.Method.get,
                    undefined,
                    {},
                    (result: any) => {
                        const profilesData = result?.data?.data?.profiles || [];
                        const profileExists = profilesData.some(
                            (profile: any) => profile.url === currentUrl
                        );
                        resolve(profileExists);
                    }
                );
            });
        } catch (error) {
            console.error("Error fetching Profile:", error);
            return false;
        }
    };


    const init = async () => {
        await checkActivePlan();
        const exists = await checkProfileAlreadyExist();
        if (exists) {
            appendSavedButton();
        } else {
            appendCustomButton();
        }
    };

    const removeOldButtons = () => {
        const existingButtons = document.querySelectorAll(".custom-save-btn");
        existingButtons.forEach((btn) => btn.remove());
    };

    const switchButtonToSaved = () => {
        removeOldButtons();
        appendSavedButton();
    };

    useEffect(() => {
        init();
    }, []);

    useLinkedInUrlChange(() => {
        init();
    });

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
                <SaveProfileForm
                    onClose={() => setOpenAiPopup(false)}
                    firstName={firstName}
                    lastName={lastName}
                    position={position}
                    city={city}
                    phone={phone}
                    education_institution={education}
                    company={company}
                    companyUrl={companyUrl}
                    skill={skill}
                    profileImg={profileImg}
                    activePlan={activePlan}
                    findemail={email}
                    onSuccessSave={switchButtonToSaved} />
            </div>
        );

    }
    return null;
}

export default LinkedInProfile;

