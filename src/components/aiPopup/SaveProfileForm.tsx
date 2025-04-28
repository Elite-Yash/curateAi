import { useEffect, useState } from "react";
import { getImage } from "../../common/utils/logoUtils";
import { apiService } from "../../common/config/apiService"; // Import API function
// import { Tooltip } from "flowbite-react";

// Define the props interface
interface SaveProfileFormProps {
    onClose: () => void; // Type the onClose prop as a function that returns void
    profileName: string;
    position: string;
    company: string;
    profileImg: string;
    activePlan: boolean;
    findemail?: string | any;
}

const SaveProfileForm: React.FC<SaveProfileFormProps> = ({ onClose, profileName, position, company, profileImg, activePlan, findemail }) => {
    const [name, setName] = useState("");
    const [positionState, setPosition] = useState("");
    const [companyState, setCompany] = useState("");
    const [email, setEmail] = useState(""); // Handle email input
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState<string | null>(null); // Error handling
    const [success, setSuccess] = useState(false); // Success message
    const [load, setLoad] = useState(true);
    // const [crmError, setCrmError] = useState<string | null>(null);
    // const [crmSuccess, setCrmSuccess] = useState<string | null>(null);
    // const [crmConnection, setCrmConnection] = useState({
    //     crmConnection: false,
    //     crmName: null,
    //     token: null,
    //     url: null,
    // });

    // useEffect(() => {
    //     chrome.storage.local.get(["crmData"], (response) => {
    //         const { crmConnection, crmName, token, url } = response.crmData;
    //         if (crmConnection) {
    //             setCrmConnection({ crmConnection, crmName, token, url })
    //         }
    //     });
    // }, []);

    useEffect(() => {
        setName(profileName || "");
        setPosition(position || "");
        setCompany(company || "");
        setEmail(findemail || "");
    }, [profileName, position, company, findemail]);

    const handleSave = async () => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        const payload: any = {
            ...(name && { name }),
            ...(email && { email }),
            ...(positionState && { position: positionState }),
            ...(companyState && { organization: companyState }),
            ...(window.location.href && { url: window.location.href }),
            ...(profileImg && { profile: profileImg }),
        };

        try {
            const requestUrl = `${apiService.EndPoint.createProfile}`;

            // Since headers and Authorization are handled inside the apiService, no need to pass them here
            await apiService.commonAPIRequest(
                requestUrl,
                apiService.Method.post,
                undefined, // No query params here
                payload,  // The payload data
                (response: any) => {
                    if (response?.status === 201 && response?.data.message === "Profile saved successfully") {
                        setSuccess(true);
                        setTimeout(() => {
                            setSuccess(false);
                            onClose();
                        }, 2000);
                    } else {
                        throw new Error(response?.data.message || "Failed to save profile.");
                    }
                }
            );
        } catch (err) {
            setError(err instanceof Error ? err.message.includes("Duplicate entry") ? "Duplicate entry" : err.message : "An unknown error occurred.");
            setTimeout(() => setError(null), 2000);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setTimeout(() => {
            setLoad(false)
        }, 2000)
    }, [])

    // const saveToCRM = async () => {
    //     setLoad(true);
    //     setCrmError(null); // Reset error message

    //     // Check if the CRM connection exists
    //     if (!crmConnection.crmConnection) {
    //         setCrmError("You must connect to the CRM to save your profile.");
    //         setTimeout(() => {
    //             setCrmError(null);
    //         }, 3000);
    //         setLoad(false); // Stop loading
    //         return;
    //     }

    //     const payload: any = {
    //         ...(name && { name }),
    //         ...(email && { email }),
    //         ...(positionState && { position: positionState }),
    //         ...(companyState && { organization: companyState }),
    //         ...(window.location.href && { url: window.location.href }),
    //         ...(profileImg && { profile: profileImg }),
    //     };

    //     // Create the payload for the profile
    //     const crmPayload: any = {};

    //     if (name) crmPayload.name = name;
    //     if (email) crmPayload.email = email;
    //     if (positionState) crmPayload.title = positionState;
    //     if (companyState) crmPayload.industry = companyState;
    //     if (crmConnection?.url) crmPayload.crm_url = crmConnection.url;
    //     if (crmConnection?.token) crmPayload.token = crmConnection.token;

    //     try {

    //         // Create a new promise to handle the profile saving
    //         await new Promise((resolve, reject) => {
    //             apiService.commonAPIRequest(
    //                 apiService.EndPoint.createProfile,
    //                 apiService.Method.post,
    //                 undefined,
    //                 payload,
    //                 (response: any) => {
    //                     if (response?.status === 201 && response?.data.message === "Profile saved successfully") {
    //                         resolve(response);
    //                     } else {
    //                         reject(new Error(response?.data.message || "Failed to save profile."));
    //                     }
    //                 }
    //             );
    //         });

    //         // After successfully saving the profile, now save to CRM
    //         await apiService.commonAPIRequest(
    //             apiService.EndPoint.savToCRM,
    //             apiService.Method.post,
    //             undefined,
    //             crmPayload,
    //             (response: any) => {
    //                 if (response?.status === 201 && response?.data.message === "Profile successfully added to CRM.") {
    //                     setCrmSuccess("Success! The profile has been successfully saved to your CRM.");
    //                     setTimeout(() => {
    //                         setCrmSuccess(null);
    //                     }, 3000);
    //                     setTimeout(() => {
    //                         onClose();
    //                     }, 2000);
    //                 } else {
    //                     throw new Error(response?.data.message || "Failed to save profile.");
    //                 }
    //             }
    //         );

    //     } catch (err) {
    //         setError(err instanceof Error ? err.message : "An unknown error occurred.");
    //         setTimeout(() => setError(null), 2000);
    //     } finally {
    //         setLoad(false);
    //     }
    // };


    return (
        <>
            <div className="inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="popup-container bg-white shadow-lg w-96 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-3xl w-400">
                    <div className="relative save-pr header-top p-9 py-6 flex justify item-center">
                        <span className="relative s-logo border-[2.5px] border-solid rounded-full border-[#ff5c35]">
                            <img src={getImage('fLogo')} alt="img" className="" />
                        </span>
                        <h4 className="popup-title font-semibold text-xl leading-10">Save Profile</h4>
                        {/* <Tooltip content="Save To CRM" className="custom-tooltip popup-ex !w-auto ml-auto">
                            <span onClick={saveToCRM} className="flex items-center justify-center ml-auto mr-2 relative w-12 h-12 p-1  border-[2.5px] border-solid rounded-full border-[#ff5c35] cursor-pointer">
                                <svg className="relative !w-[16px] -top-px left-px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="#ff5c35" d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3zM504 312l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" /></svg>
                            </span>
                        </Tooltip> */}
                        <span
                            onClick={onClose}
                            className="w-6 h-6 bg-no-repeat bg-center cursor-pointer ml-auto"

                        ><img src={getImage('close')} alt="img" className="w-full h-full rounded-full" /></span>
                    </div>
                    {

                        load ?
                            <>
                                <div className="flex justify-center h-80">
                                    <div className="flex flex-col justify-center items-center">
                                        <span
                                            className="loader relative w-32 h-32 object-cover p-2"
                                            style={{ '--loader-url': `url(${getImage('loader')})` } as React.CSSProperties}
                                        >
                                            <img src={getImage('fLogo')} alt="img" className="w-full h-full" />
                                        </span>
                                        <span className="text-[#ff5c35] !text-2xl font-light">Loading...</span>
                                    </div >
                                </div>
                            </>
                            :
                            // !crmConnection.crmConnection && crmError || crmConnection.crmConnection && crmSuccess ?
                            //     <div className="p-9 flex justify-between item-center flex-col gap-5">
                            //         <span className={`text-center text-3xl font-bold ${crmError ? "text-red" : "text-green"}`}>{crmError ? "!! Connection Alert !!" : "!! Save To CRM !!"}</span>
                            //         <span className={`text-justify`}>
                            //             {crmError ? crmError : crmSuccess}

                            //         </span>
                            //     </div>
                            //     :
                            activePlan ?
                                <div className="p-9 flex justify-between item-center flex-col gap-5">
                                    <div className="w-full input-group">
                                        <input type="text" className="popup-input w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-[#ff9479]" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                                    </div>
                                    <div className="w-full input-group">
                                        <input type="email" className="popup-input w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-[#ff9479]" placeholder={!email ? "Email not found" : "Email"} value={email} onChange={(e) => setEmail(e.target.value)} />
                                    </div>
                                    <div className="w-full input-group">
                                        <input type="text" className="popup-input w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-[#ff9479]" placeholder={!positionState ? "Position not found" : "Position"} value={positionState} onChange={(e) => setPosition(e.target.value)} />
                                    </div>
                                    <div className="w-full input-group">
                                        <input type="text" className="popup-input w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-[#ff9479]" placeholder={!companyState ? "Company not found" : "Company"} value={companyState} onChange={(e) => setCompany(e.target.value)} />
                                    </div>
                                    <div className="popup-buttons justify-end space-x-2 text-right relative flex items-center">
                                        {error && <p className="text-red text-xl ml-2.5 absolute left-0 border border-solid p-4 rounded-lg">{error}</p>}
                                        {success && <p className="text-green text-xl ml-2.5 absolute left-0 border border-solid p-4 rounded-lg">Profile saved successfully!</p>}
                                        <button onClick={handleSave} disabled={loading} className="justify-center flex gap-2 ml-auto leading-6 popup-button-submit px-4 py-2 bg-[#ff5c35] text-white rounded-md hover:bg-[#c64e30] disabled:bg-gray-400" style={{ "width": "80px" }}>
                                            {loading ? "Saving..." : "Save"}
                                        </button>
                                    </div>
                                </div>
                                :
                                <div className="p-9 flex justify-between item-center flex-col gap-5">
                                    <span className="text-center text-5xl font-bold text-red">!! Alert !!</span>
                                    <span className="text-justify">
                                        Hey User, you don’t have an active plan on Evarobo yet. Subscribe now and start enjoying all the amazing features!
                                    </span>
                                </div>
                    }
                </div>
            </div>
        </>
    );
};

export default SaveProfileForm;
