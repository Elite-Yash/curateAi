import { useEffect, useState } from "react";
import { getImage } from "../../common/utils/logoUtils";
import { apiService } from "../../common/config/apiService"; // Import API function

// Define the props interface
interface SaveProfileFormProps {
    onClose: () => void; // Type the onClose prop as a function that returns void
    profileName: string;
    position: string;
    company: string;
    profileImg: string;
    activePlan: boolean;
}

const SaveProfileForm: React.FC<SaveProfileFormProps> = ({ onClose, profileName, position, company, profileImg, activePlan }) => {
    const [name, setName] = useState(profileName);
    const [positionState, setPosition] = useState(position);
    const [companyState, setCompany] = useState(company);
    const [email, setEmail] = useState(""); // Handle email input
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState<string | null>(null); // Error handling
    const [success, setSuccess] = useState(false); // Success message

    useEffect(() => {
        setName(profileName);
        setPosition(position);
        setCompany(company);
    }, [profileName, position, company]);

    const validateForm = () => {
        if (!name.trim()) return "Name is required.";
        if (!email.trim()) return "Email is required.";
        if (!positionState.trim()) return "Position is required.";
        if (!companyState.trim()) return "Company is required.";
        return null;
    };

    const handleSave = async () => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            setTimeout(() => setError(null), 2000);
            setLoading(false);
            return;
        }

        const payload = {
            name,
            email,
            position: positionState,
            organization: companyState,
            url: window.location.href,
            profile: profileImg,
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
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
            setTimeout(() => setError(null), 2000);
        } finally {
            setLoading(false);
        }
    };




    return (
        <>
            <div className="inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="popup-container bg-white shadow-lg w-96 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-3xl overflow-hidden w-400">
                    <div className="relative header-top p-9 py-6 flex justify-between item-center">
                        <span className="relative s-logo border-[2.5px] border-solid rounded-full border-[#ff5c35]">
                            <img src={getImage('fLogo')} alt="img" className="" />
                        </span>
                        <h4 className="popup-title font-semibold text-xl leading-10">Save Profile</h4>
                        <span
                            onClick={onClose}
                            className="close-box w-6 h-6 bg-no-repeat bg-center cursor-pointer"

                        ><img src={getImage('close')} alt="img" className="w-full h-full rounded-full" /></span>
                    </div>
                    {
                        activePlan ?
                            <div className="p-9 flex justify-between item-center flex-col gap-5">
                                <div className="w-full input-group">
                                    <input type="text" className="popup-input w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-[#ff9479]" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className="w-full input-group">
                                    <input type="email" className="popup-input w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-[#ff9479]" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                                <div className="w-full input-group">
                                    <input type="text" className="popup-input w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-[#ff9479]" placeholder="Position" value={positionState} onChange={(e) => setPosition(e.target.value)} />
                                </div>
                                <div className="w-full input-group">
                                    <input type="text" className="popup-input w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-[#ff9479]" placeholder="Company/Institution" value={companyState} onChange={(e) => setCompany(e.target.value)} />
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
