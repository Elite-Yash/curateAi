import { useState } from "react";

const SignIn = () => {
    const [loading, setLoading] = useState(false);

    const handleSignIn = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            alert("Signed in successfully");
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="flex flex-col items-center justify-center bg-gray-100 mt-5">
            <label className="mb-4 text-gray-700">Please log in to continue</label>
            <button
                onClick={handleSignIn}
                className="bg-indigo-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-600 disabled:bg-gray-400"
                disabled={loading}
            >
                {loading ? "Signing in..." : "Sign In"}
            </button>
        </div>
    );
}

export default SignIn;
