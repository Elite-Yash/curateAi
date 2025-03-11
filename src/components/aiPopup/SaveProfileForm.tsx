import { getImage } from "../../common/utils/logoUtils";

// Define the props interface
interface SaveProfileFormProps {
    onClose: () => void; // Type the onClose prop as a function that returns void
    profileName: string;
    position: string;
    company: string;
}

const SaveProfileForm: React.FC<SaveProfileFormProps> = ({ onClose, profileName, position, company }) => {
    return (
        <>
            <div className="inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="popup-container bg-white shadow-lg w-96 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-3xl overflow-hidden w-400">
                    <div className="header-top p-9 py-10 flex justify-start item-center">
                        <span className="relative mr-3 pr-9">
                            <img src={getImage('iconLogo')} alt="img" className="absolute w-11" />
                        </span>
                        <h4 className="popup-title font-semibold text-xl">Save Profile</h4>
                        <span onClick={onClose} className="close-box absolute top-6 right-6 w-6 h-6 bg-no-repeat bg-center cursor-pointer">
                            <img src={getImage('close')} alt="img" className="w-full h-full rounded-full" />
                        </span>
                    </div>
                    <div className="p-9 flex justify-between item-center flex-col gap-5">
                        <div className="w-full input-group">
                            <input type="text" className="popup-input w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200" placeholder="Name" value={profileName} />
                        </div>
                        <div className="w-full input-group">
                            <input type="email" className="popup-input w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200" placeholder="Email" />
                        </div>
                        <div className="w-full input-group">
                            <input type="text" className="popup-input w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200" placeholder="Position" value={position} />
                        </div>
                        <div className="w-full input-group">
                            <input type="text" className="popup-input w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200" placeholder="Company/Institution" value={company} />
                        </div>
                        <div className="popup-buttons justify-end space-x-2 text-right relative">
                            <button className="justify-center flex gap-2 ml-auto leading-6 popup-button-submit px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-md hover:bg-indigo-600 disabled:bg-gray-400" style={{ "width": "80px" }}>
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SaveProfileForm;
