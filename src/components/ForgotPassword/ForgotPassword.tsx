import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../../common/config/apiService";
import { getImage } from "../../common/utils/logoUtils";
import Loader from "../Loader/Loader";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "" }>({ text: "", type: "" });
    const [load, setLoad] = useState(true)
    useEffect(() => {
        const timeout = setTimeout(() => {
            setLoad(false);
        }, 500);
        return () => clearTimeout(timeout);
    }, []);

    // Handle email input change
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    // Validate email format
    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // Show message for 2 seconds
    const showMessage = (text: string, type: "success" | "error") => {
        setMessage({ text, type });
        setTimeout(() => {
            setMessage({ text: "", type: "" });
        }, 2000);
    };

    // Handle form submission
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!email) {
            showMessage("Email is required.", "error");
            return;
        }

        if (!isValidEmail(email)) {
            showMessage("Invalid email format.", "error");
            return;
        }

        const data = {
            email,
        };

        try {
            apiService.commonAPIRequest(
                apiService.EndPoint.forgotPassword,
                apiService.Method.post,
                undefined,
                data,
                (response: any) => {
                    if (response.status === 201 && response.data.message === "Password reset email sent successfully") {
                        showMessage("Password reset link sent to your email!", "success");
                        setTimeout(() => {
                            navigate("/change-password");
                        }, 2500);
                    } else {
                        showMessage(response.message || "Failed to send reset link. Try again.", "error");
                    }
                }
            );
        } catch (error) {
            showMessage("Something went wrong. Please try again.", "error");
            console.error("Forgot Password error:", error);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen background-three">
            <div className="form-section bg-white p-10 rounded-2xl">
                {
                    load ?
                        <div className="flex justify-center m-28">
                            <Loader />
                        </div>
                        :
                        <>
                            <div className="form-title flex flex-col gap-3">
                                <div className="logo">
                                    <a href="#" className="logo flex items-center w-full gap-2 color-one justify-center mb-6">
                                        <img src={getImage("logoBlack")} className="re-logo-b-o transition w-32" alt="img" />
                                    </a>
                                </div>
                                <span className="dark-color font-semibold text-3xl">Forgot Password</span>
                                <span className="w-64 h-px background-one flex"></span>
                            </div>

                            <form className="mt-6 gap-3 flex flex-col" onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <span>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Enter your Email"
                                            value={email}
                                            onChange={handleChange}
                                            className="h-14 background-three w-full p-3 bg-white text-black rounded-lg focus:ring-[#ff9479]"
                                        />
                                    </span>
                                </div>

                                <div className="text-end">
                                    <button
                                        type="submit"
                                        className="w-full h-14 text-white background-one font-medium rounded-lg text-base px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:ring-[#ff9479] dark:focus:ring-blue-800"
                                    >
                                        Reset Password
                                    </button>
                                </div>

                                <span className="dec-color text-base text-center">
                                    Remembered your password?{" "}
                                    <a href="#" className="color-one text-base" onClick={() => navigate("/signin")}>
                                        Back to Sign In
                                    </a>
                                </span>
                            </form>

                            {/* Error/Success Message Box */}
                            {message.text && (
                                <div
                                    className={`text-center text-[17px] mt-3 border p-2 rounded-md 
                            ${message.type === "error" ? "text-red border-red" : "text-green border-green"}`}
                                >
                                    {message.text}
                                </div>
                            )}
                        </>
                }
            </div>
        </div>
    );
};

export default ForgotPassword;
