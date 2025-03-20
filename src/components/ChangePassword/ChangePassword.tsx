import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAPI, Method, Endpoints } from "../../common/config/apiService";
import { getImage } from "../../common/utils/logoUtils";
import { API_URL } from "../../common/config/constMessage";
import Loader from "../Loader/Loader";

const ChangePassword = () => {
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "" }>({ text: "", type: "" });
    const [loading, setLoading] = useState(false);
    const [load, setLoad] = useState(true)
    useEffect(() => {
        const timeout = setTimeout(() => {
            setLoad(false);
        }, 500);
        return () => clearTimeout(timeout);
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === "newPassword") setNewPassword(e.target.value);
        if (e.target.name === "confirmPassword") setConfirmPassword(e.target.value);
    };

    const showMessage = (text: string, type: "success" | "error") => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: "", type: "" }), 2000);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!newPassword || !confirmPassword) return showMessage("All fields are required.", "error");
        if (newPassword !== confirmPassword) return showMessage("Passwords do not match.", "error");
        if (newPassword.length < 6) return showMessage("Password must be at least 6 characters.", "error");

        setLoading(true);
        try {
            const response = await fetchAPI(`${API_URL}/${Endpoints.changePassword}`, {
                method: Method.post,
                data: {
                    password: newPassword,   // Ensure both fields are sent correctly
                    confirmPassword: confirmPassword
                }
            });

            if (response?.success) {
                showMessage("Password changed successfully!", "success");
                setTimeout(() => navigate("/signin"), 2500);
            } else {
                showMessage(response?.message || "Failed to change password. Try again.", "error");
            }
        } catch (error) {
            console.error("Change Password error:", error);
            showMessage("Something went wrong. Please try again.", "error");
        } finally {
            setLoading(false);
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
                                        <img src={getImage("logoBlack")} className="re-logo-b-o transition w-32" alt="Company Logo" />
                                    </a>
                                </div>
                                <span className="dark-color font-semibold text-3xl">Change Password</span>
                                <span className="w-64 h-px background-one flex"></span>
                            </div>

                            <form className="mt-6 gap-3 flex flex-col" onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <input
                                        type="password"
                                        name="newPassword"
                                        placeholder="New Password"
                                        value={newPassword}
                                        onChange={handleChange}
                                        className="h-14 background-three w-full p-3 bg-white text-black rounded-lg focus:ring-[#ff9479]"
                                        aria-label="New Password"
                                    />
                                </div>

                                <div className="form-group">
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Confirm Password"
                                        value={confirmPassword}
                                        onChange={handleChange}
                                        className="h-14 background-three w-full p-3 bg-white text-black rounded-lg focus:ring-[#ff9479]"
                                        aria-label="Confirm Password"
                                    />
                                </div>

                                <div className="text-end">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`w-full h-14 text-white background-one font-medium rounded-lg text-base px-5 py-2.5 me-2 mb-2 
                                ${loading ? "opacity-50 cursor-not-allowed" : "dark:bg-blue-600 dark:hover:bg-blue-700 focus:ring-[#ff9479] dark:focus:ring-blue-800"}`}
                                        aria-label="Change Password"
                                    >
                                        {loading ? "Changing..." : "Change Password"}
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
                                <div role="alert" className={`text-center text-[17px] mt-3 border p-2 rounded-md 
                        ${message.type === "error" ? "text-red border-red" : "text-green border-green"}`}>
                                    {message.text}
                                </div>
                            )}
                        </>
                }
            </div>
        </div>
    );
};

export default ChangePassword;
