import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchAPI, Method, Endpoints } from "../../common/config/apiService";
import { getImage } from "../../common/utils/logoUtils";
import { API_URL } from "../../common/config/constMessage";
interface SignUpFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const SignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<SignUpFormData>({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    // Handle input changes
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Validate email format
    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // Handle form submission
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const { name, email, password, confirmPassword } = formData;
        console.log("formData", formData)
        // Validation checks
        if (!name || !email || !password || !confirmPassword) {
            toast.error("All fields are required.");
            return;
        }

        if (!isValidEmail(email)) {
            toast.error("Invalid email format.");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        try {
            const url = API_URL + Endpoints.register;
            const response = await fetchAPI(url, { method: Method.post, data: formData });

            if (response.success) {
                toast.success("Account created successfully!");
                setFormData({ name: "", email: "", password: "", confirmPassword: "", });
                setTimeout(() => navigate("/signin"), 1500);
            } else {
                toast.error(response.message || "Sign-up failed. Try again.");
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
            console.error("Sign-up error:", error);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen background-three">
            <div className="form-section bg-white p-10 rounded-2xl">
                <div className="form-title flex flex-col gap-3">
                    <div className="logo">
                        <a href="#" className="logo flex items-center w-full gap-2 color-one justify-center">
                            <img src={getImage('iconLogo')} className="re-logo-b-o transition w-7" alt="img" />
                            <span className="color-one uppercase larger font-semibold">Curate ai</span>
                        </a>
                    </div>
                    <span className="dark-color font-semibold text-3xl">Sign Up</span>
                    <span className="w-28 h-px background-one flex"></span>
                </div>

                <form className="mt-6 gap-3 flex flex-col" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="h-14 background-three w-full p-3 bg-white text-black rounded-lg focus:outline-none"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="h-14 background-three w-full p-3 bg-white text-black rounded-lg focus:outline-none"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="h-14 background-three w-full p-3 bg-white text-black rounded-lg focus:outline-none"
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="h-14 background-three w-full p-3 bg-white text-black rounded-lg focus:outline-none"
                    />
                    <button
                        type="submit"
                        className="w-full h-14 text-white background-one font-medium rounded-lg text-base px-5 py-2.5"
                    >
                        Sign up
                    </button>
                    <span className="dec-color text-base">
                        Already have an account?{" "}
                        <a onClick={() => navigate("/signin")} className="color-one text-base cursor-pointer">
                            Sign in here
                        </a>
                    </span>
                </form>
            </div>
        </div>
    );
};

export default SignUp;
