import { getImage } from "../../common/utils/logoUtils";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
    const navigate = useNavigate();
    return (
        <div className="flex justify-center items-center min-h-screen background-three">
            <div className="form-section bg-white p-10 rounded-2xl">
                <div className="form-title flex flex-col gap-3">
                    <div className="logo">
                        <a href="#" className="logo flex items-center w-full gap-2 color-one justify-center">
                            <img
                                src={getImage('iconLogo')}
                                className="re-logo-b-o transition w-7"
                                alt="img"
                            />
                            <span className="color-one uppercase larger font-semibold">Curate ai</span>
                        </a>
                    </div>
                    <span className="dark-color font-semibold text-3xl">Change Password</span>
                    <span className="w-64 h-px background-one flex"></span>
                </div>

                <form className="mt-6 gap-3 flex flex-col">
                    <div className="form-group">
                        <span>
                            <input
                                type="password"
                                placeholder="New Password"
                                className="h-14 background-three w-full p-3 bg-white text-black rounded-lg focus:outline-none"
                            />
                        </span>
                    </div>

                    <div className="form-group">
                        <span>
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                className="h-14 background-three w-full p-3 bg-white text-black rounded-lg focus:outline-none"
                            />
                        </span>
                    </div>

                    <div className="text-end">
                        <button
                            type="button"
                            onClick={() => navigate("/signin")}
                            className="w-full h-14 text-white background-one font-medium rounded-lg text-base px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        >
                            Change Password
                        </button>
                    </div>

                    <span className="dec-color text-base text-center">
                        Remembered your password?{" "}
                        <a href="#" className="color-one text-base" onClick={() => navigate("/signin")}>
                            Back to Sign In
                        </a>
                    </span>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
