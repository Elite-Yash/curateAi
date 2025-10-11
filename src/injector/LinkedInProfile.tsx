// import { useState, useEffect, useCallback } from "react";
// import SaveProfileForm from "../components/aiPopup/SaveProfileForm";
// import { getImage } from "../common/utils/logoUtils";
// import { createCustomButton } from "../common/utils/createCustomButton";
// import { apiService } from "../common/config/apiService";
// import useLinkedInUrlChange from "../hooks/useLinkedInUrlChange";

// const LinkedInProfile = () => {
//     const [openAiPopup, setOpenAiPopup] = useState(false);
//     const [profileName, setProfileName] = useState("");
//     const [email, setEmail] = useState("");
//     const [position, setPosition] = useState("");
//     const [company, setCompany] = useState("");
//     const [profileImg, setProfileImg] = useState("")
//     const [activePlan, setActiveplan] = useState(false);

//     const scrapeProfileData = () => {
//         const profileNameElement = document.querySelector("div.ph5 div.mt2.relative h1");
//         const experienceSection = document.querySelector("section.artdeco-card.pv-profile-card.break-words.mt2 div#experience")?.closest("section");
//         const experienceData = experienceSection?.lastElementChild;
//         const positionElement = experienceData?.querySelector("div.display-flex.flex-column .t-bold span");
//         const companyElement = experienceData?.querySelector("div.display-flex.flex-column .t-14.t-normal span");

//         const profileNameText = profileNameElement?.textContent?.trim() || "";
//         const positionText = positionElement?.textContent?.trim() || "";
//         const companyText = companyElement?.textContent?.trim() || "";

//         const ProfileImage = document.querySelector("main section div.ph5 div.pv-top-card__non-self-photo-wrapper img") as HTMLImageElement | null;
//         const cleanCompanyText = companyText.split("·")[0].trim();
//         if (companyText.split(" ").includes("yrs") || companyText.split(" ").includes("mos") || companyText.split(" ").includes("mo")) {
//             const position = experienceData?.querySelector("div.pvs-entity__sub-components ul li div.display-flex.flex-column.align-self-center.flex-grow-1 div.display-flex.full-width span") as HTMLElement | null;
//             setPosition(position?.textContent?.trim() || "");
//             setCompany(positionText);
//         } else {
//             setPosition(positionText);
//             setCompany(cleanCompanyText);
//         }

//         setProfileName(profileNameText);
//         setProfileImg(ProfileImage?.src || "");
//     };

//     const handleClick = () => {
//         findemailfun();
//         scrapeProfileData();
//         setOpenAiPopup(true);
//     };

//     // const findemailfun = () => {
//     //     return new Promise<void>((resolve) => {
//     //         const findemail = document.querySelector("div.ph5 div.mt2 .mt2 a");
//     //         if (findemail) {
//     //             (findemail as HTMLAnchorElement).click();
//     //             setTimeout(() => {
//     //                 function findEmailsOnPage() {
//     //                     const bodyText = document.body.innerText;
//     //                     const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/gi;
//     //                     const emails = bodyText.match(emailRegex);
//     //                     return emails ? [...new Set(emails)] : [];
//     //                 }

//     //                 const emails = findEmailsOnPage();
//     //                 const firstEmail = emails[0];
//     //                 setEmail(firstEmail); // Set the email state

//     //                 // const closeBtn = document.querySelector('button[aria-label="Dismiss"]');
//     //                 // if (closeBtn) {
//     //                 //     (closeBtn as HTMLAnchorElement).click();
//     //                 // }

//     //                 // Resolve the promise after setting the email
//     //                 resolve();
//     //             }, 2500);
//     //         } else {
//     //             resolve(); // Resolve immediately if no email link found
//     //         }
//     //     });
//     // };


//     const findemailfun = useCallback(() => {
//         const emailUrl = `${window.location.href}overlay/contact-info/`;
//         const iframe = document.createElement('iframe');
//         iframe.src = emailUrl;
//         iframe.id = 'emailFinder';
//         iframe.style.width = '1px';
//         iframe.style.height = '1px';
//         iframe.style.border = 'none';
//         document.body.appendChild(iframe);

//         iframe.onload = () => {
//             const iframeDocument = (iframe.contentDocument || iframe.contentWindow?.document) as Document;
//             if (iframeDocument) {
//                 const bodyText = iframeDocument.body.innerText;
//                 const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/gi;
//                 const emails = bodyText.match(emailRegex);
//                 const emailData = emails ? emails[0] : ""
//                 setEmail(emailData);
//                 document.body.removeChild(iframe);
//             }
//         };
//     }, [scrapeProfileData]);

//     // Function to append the custom button
//     const appendCustomButton = () => {
//         removeOldButtons();
//         const spans = document.querySelector("div.ph5 div.mt2.relative")?.querySelectorAll("span");

//         if (spans && spans.length > 0) {
//             const customSpan = createCustomButton('Save', getImage("saveProfileIcon"), 'Save Profile');
//             customSpan.classList.add("custom-save-btn");
//             spans[0].closest("div")?.appendChild(customSpan);

//             // Add event listener to the button
//             customSpan.addEventListener("click", handleClick);

//             // Cleanup function to remove event listener
//             return () => {
//                 customSpan.removeEventListener("click", handleClick);
//             };
//         }
//     }
//     const checkActivePlan = async () => {
//         try {

//             const url = apiService.EndPoint.checkActivePlan;

//             await apiService.commonAPIRequest(
//                 url,
//                 apiService.Method.get,
//                 undefined, // No query params for this request
//                 {}, // No body required for GET request
//                 (result: any) => {
//                     if (result.data.userDetails.isTrialExpired) {
//                         if (result?.status === 200 && result?.data.message === "User does not have an active subscription.") {
//                             setActiveplan(false);
//                         } else {
//                             setActiveplan(true);
//                         }
//                     } else {
//                         setActiveplan(true);
//                     }
//                 }
//             );

//         } catch (error) {
//             console.error("Error fetching plans:", error);
//         }
//     };

//     const appendSavedButton = () => {
//         removeOldButtons();
//         const spans = document.querySelector("div.ph5 div.mt2.relative")?.querySelectorAll("span");

//         if (spans && spans.length > 0) {
//             const savedSpan = createCustomButton('Already Saved', getImage("saveProfileIcon"), 'Already Save Profile');
//             savedSpan.classList.add("custom-save-btn");

//             // make it look disabled
//             savedSpan.style.pointerEvents = "none";
//             savedSpan.style.opacity = "0.6";
//             savedSpan.style.cursor = "not-allowed";

//             // Tooltip (native browser title works)
//             savedSpan.setAttribute("title", "Already Save Profile");

//             spans[0].closest("div")?.appendChild(savedSpan);
//         }
//     };

//     const checkProfileAlreadyExist = async () => {
//         try {
//             const currentUrl = window.location.href;
//             const url = apiService.EndPoint.getProfiles;

//             return new Promise<boolean>((resolve) => {
//                 apiService.commonAPIRequest(
//                     url,
//                     apiService.Method.get,
//                     undefined,
//                     {},
//                     (result: any) => {
//                         const profilesData = result?.data?.data?.profiles || [];
//                         const profileExists = profilesData.some(
//                             (profile: any) => profile.url === currentUrl
//                         );
//                         resolve(profileExists);
//                     }
//                 );
//             });
//         } catch (error) {
//             console.error("Error fetching Profile:", error);
//             return false;
//         }
//     };


//     const init = async () => {
//         await checkActivePlan();
//         const exists = await checkProfileAlreadyExist();
//         if (exists) {
//             appendSavedButton();
//         } else {
//             appendCustomButton();
//         }
//     };

//     const removeOldButtons = () => {
//         const existingButtons = document.querySelectorAll(".custom-save-btn");
//         existingButtons.forEach((btn) => btn.remove());
//     };

//     const switchButtonToSaved = () => {
//         removeOldButtons();
//         appendSavedButton();
//     };

//     useEffect(() => {
//         init();
//     }, []);

//     useLinkedInUrlChange(() => {
//         init();
//     });

//     if (openAiPopup) {
//         return (
//             <div
//                 style={{
//                     position: "fixed",
//                     width: "100%",
//                     height: "100vh",
//                     backgroundColor: "rgba(0, 0, 0, 0.3)",
//                     top: 0,
//                     left: 0,
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "center",
//                     zIndex: 21213123,
//                 }}
//             >
//                 <SaveProfileForm onClose={() => setOpenAiPopup(false)} profileName={profileName} position={position} company={company} profileImg={profileImg} activePlan={activePlan} findemail={email} onSuccessSave={switchButtonToSaved} />
//             </div>
//         );
//     }
//     return null;
// }

// export default LinkedInProfile;


import { useState, useEffect, useCallback } from "react";
import SaveProfileForm from "../components/aiPopup/SaveProfileForm";
import { getImage } from "../common/utils/logoUtils";
import { createCustomButton } from "../common/utils/createCustomButton";
import { apiService } from "../common/config/apiService";
import useLinkedInUrlChange from "../hooks/useLinkedInUrlChange";

const LinkedInProfile = () => {
    const [openAiPopup, setOpenAiPopup] = useState(false);
    const [profileName, setProfileName] = useState("");
    const [email, setEmail] = useState("");
    const [position, setPosition] = useState("");
    const [company, setCompany] = useState("");
    const [profileImg, setProfileImg] = useState("")
    const [activePlan, setActiveplan] = useState(false);
    const [city, setCity] = useState("");
    const [education, setEducation] = useState("");
    const [skill, setSkill] = useState<string[]>([]);
    console.log("  ~ LinkedInProfile ~ skill:", skill)

    const resetProfileData = useCallback(() => {
        setProfileName("");
        setEmail("");
        setPosition("");
        setCompany("");
        setProfileImg("");
        setActiveplan(false);
        setCity("");
        setEducation("");
        setSkill([]);
    }, []);


    const scrapeProfileData = () => {
        const profileNameElement = document.querySelector("div.ph5 div.mt2.relative h1");
        const cityElement = document.querySelector(".text-body-small.inline.t-black--light.break-words")
        const educationSection = document.querySelector("section.artdeco-card.pv-profile-card.break-words.mt2 div#education")?.closest("section");
        const education = educationSection?.querySelector(".display-flex.flex-column.align-self-center .justify-space-between .optional-action-target-wrapper .t-14.t-normal .visually-hidden")
        const experienceSection = document.querySelector("section.artdeco-card.pv-profile-card.break-words.mt2 div#experience")?.closest("section");
        const experienceData = experienceSection?.lastElementChild;

        const positionElement = experienceData?.querySelector("div.display-flex.flex-column .t-bold span");
        const companyElement = experienceData?.querySelector("div.display-flex.flex-column .t-14.t-normal span");

        const profileNameText = profileNameElement?.textContent?.trim() || "";
        const cityText = cityElement?.textContent?.trim() || "";
        const educationText = education?.textContent?.trim() || "";
        const positionText = positionElement?.textContent?.trim() || "";
        const companyText = companyElement?.textContent?.trim() || "";
        ;

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
        setProfileName(profileNameText);
        setProfileImg(ProfileImage?.src || "");
        setCity(cityText);
        setEducation(educationText);
    };

    const handleClick = () => {
        findemailfun();
        skillfunction();
        scrapeProfileData();
        setOpenAiPopup(true);
    };

    const skillfunction = useCallback(() => {
        const skillurl = `${window.location.href}details/skills/`;
        const iframe = document.createElement('iframe');
        iframe.src = skillurl;
        iframe.id = 'skillSection';
        iframe.style.width = '1px';
        iframe.style.height = '1px';
        iframe.style.border = 'none';
        document.body.appendChild(iframe);

        iframe.onload = () => {
            const iframeDocument = (iframe.contentDocument || iframe.contentWindow?.document) as Document;
            if (!iframeDocument) return;
            const intervalId = setInterval(() => {
                const skillElements = iframeDocument.querySelectorAll(
                    ".scaffold-layout__inner.scaffold-layout-container .scaffold-layout__row main section .scaffold-finite-scroll__content ul li .t-bold span"
                );

                if (skillElements.length > 0) {
                    const newSkills = Array.from(skillElements).map(
                        (el) => el.textContent?.trim() || ""
                    );

                    // Merge old + new, remove duplicates
                    setSkill((prevSkills) => {
                        const merged = [...prevSkills, ...newSkills];
                        const unique = Array.from(new Set(merged));
                        return unique;
                    });

                    clearInterval(intervalId);
                    document.body.removeChild(iframe);
                }
            }, 1000);
        };

    }, [scrapeProfileData]);

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
                const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/gi;
                const emails = bodyText.match(emailRegex);
                const emailData = emails ? emails[0] : ""
                setEmail(emailData);
                document.body.removeChild(iframe);
            }
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
                <SaveProfileForm onClose={() => { setOpenAiPopup(false); resetProfileData() }} profileName={profileName} position={position} company={company} profileImg={profileImg} activePlan={activePlan} findemail={email} onSuccessSave={switchButtonToSaved} />
            </div>
        );
    }
    return null;
}

export default LinkedInProfile;

