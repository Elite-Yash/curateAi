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
  onSuccessSave?: () => void;   
}

const SaveProfileForm: React.FC<SaveProfileFormProps> = ({
  onClose,
  profileName,
  position,
  company,
  profileImg,
  activePlan,
  findemail,
  onSuccessSave,
}) => {
  const [name, setName] = useState("");
  const [positionState, setPosition] = useState("");
  const [companyState, setCompany] = useState("");
  const [email, setEmail] = useState(""); // Handle email input
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error handling
  const [success, setSuccess] = useState(false); // Success message
  const [load, setLoad] = useState(true);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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

    if (email && !emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      setTimeout(() => {
        setError(null);
      }, 1500);
      return;
    }

    const payload: any = {
      ...(name && name !== "N/A" && name !== "NA" && { name }),
      ...(email &&
        email !== "N/A" &&
        email !== "NA" &&
        emailRegex.test(email) && { email }),
      ...(positionState &&
        positionState !== "N/A" &&
        positionState !== "NA" && { position: positionState }),
      ...(companyState &&
        companyState !== "N/A" &&
        companyState !== "NA" && { organization: companyState }),
      ...(window.location.href && { url: window.location.href }),
      ...(profileImg && { profile: profileImg }),
    };

    // Check if the payload is empty
    if (Object.keys(payload).length === 0) {
      setError("No valid data to save.");
      setLoading(false);
      return;
    }

    try {
      const requestUrl = `${apiService.EndPoint.createProfile}`;

      await apiService.commonAPIRequest(
        requestUrl,
        apiService.Method.post,
        undefined, // No query params here
        payload, // The payload data
        (response: any) => {
          if (
            response?.status === 201 &&
            response?.data.message === "Profile saved successfully"
          ) {
            setSuccess(true);
            setTimeout(() => {
              setSuccess(false);
              onSuccessSave?.();
              onClose();
            }, 2000);
          } else {
            throw new Error(
              response?.data.message || "Failed to save profile."
            );
          }
        }
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message.includes("Duplicate entry")
            ? "Duplicate entry"
            : err.message
          : "An unknown error occurred."
      );
      setTimeout(() => setError(null), 2000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setLoad(false);
    }, 2000);
  }, []);
  return (
    <>
      <div className="inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="popup-container bg-white shadow-lg w-96 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-3xl w-400">
          <div className="relative save-pr header-top p-9 py-6 flex justify item-center">
            <span className="relative s-logo border-[2.5px] border-solid rounded-full border-[#ff5c35]">
              <img src={getImage("fLogo")} alt="img" className="" />
            </span>
            <h4 className="popup-title font-semibold text-xl leading-10">
              Save Profile
            </h4>
            <span
              onClick={onClose}
              className="w-6 h-6 bg-no-repeat bg-center cursor-pointer ml-auto"
            >
              <img
                src={getImage("close")}
                alt="img"
                className="w-full h-full rounded-full"
              />
            </span>
          </div>
          {load ? (
            <>
              <div className="flex justify-center h-80">
                <div className="flex flex-col justify-center items-center">
                  <span
                    className="loader relative w-32 h-32 object-cover p-2"
                    style={
                      {
                        "--loader-url": `url(${getImage("loader")})`,
                      } as React.CSSProperties
                    }
                  >
                    <img
                      src={getImage("fLogo")}
                      alt="img"
                      className="w-full h-full"
                    />
                  </span>
                  <span className="text-[#ff5c35] !text-2xl font-light">
                    Loading...
                  </span>
                </div>
              </div>
            </>
          ) : activePlan ? (
            <div className="p-9 flex flex-col gap-5">
              <div className="w-full input-group">
                <input
                  type="text"
                  className="popup-input w-full mt-1 p-2 border border-gray-300 rounded-md"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="w-full input-group">
                <input
                  type="email"
                  className="popup-input w-full mt-1 p-2 border border-gray-300 rounded-md"
                  placeholder={!email ? "Email not found" : "Email"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="w-full input-group">
                <input
                  type="text"
                  className="popup-input w-full mt-1 p-2 border border-gray-300 rounded-md"
                  placeholder={
                    !positionState ? "Position not found" : "Position"
                  }
                  value={positionState}
                  onChange={(e) => setPosition(e.target.value)}
                />
              </div>

              <div className="w-full input-group">
                <input
                  type="text"
                  className="popup-input w-full mt-1 p-2 border border-gray-300 rounded-md"
                  placeholder={!companyState ? "Company not found" : "Company"}
                  value={companyState}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>

              {/* ✅ Error & Success messages */}
              {error && (
                <p className="text-red text-xl ml-2.5 border border-red bg-red-50 p-4 rounded-lg">
                  {error}
                </p>
              )}
              {success && (
                <p className="text-green text-xl ml-2.5 border border-green bg-green-50 p-4 rounded-lg">
                  Profile saved successfully!
                </p>
              )}

              {/* ✅ Button always goes below messages */}
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="w-[36rem] h-[4rem] flex justify-center items-center gap-2 rounded-[8px] bg-[#ff5c35] text-white font-medium disabled:bg-gray-400"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-9 flex justify-between item-center flex-col gap-5">
              <span className="text-center text-5xl font-bold text-red">
                !! Alert !!
              </span>
              <span className="text-justify">
                Hey User, you don’t have an active plan on Evarobo yet. Go To the Evarobo Chrome Extension and 
                Subscribe now and start enjoying all the amazing features!
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SaveProfileForm;
