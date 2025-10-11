import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaBriefcase, FaUser } from "react-icons/fa";
import Swal from "sweetalert2";
import { getImage } from "../../common/utils/logoUtils";
import { apiService } from "../../common/config/apiService";

type PersonaFormData = {
    name: string;
    bio: string;
    jobTitle: string;
    company: string;
    industry: string;
};

interface PersonasModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PersonasFormModal = ({ isOpen, onClose, }: PersonasModalProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<PersonaFormData>();

    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) reset();
    }, [isOpen, reset]);

    // API call to create persona
    const createPersonas = async (data: PersonaFormData) => {
        setIsLoading(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        const payload = {
            personas_name: data.name,
            personas_bio: data.bio,
            jobTitle: data.jobTitle,
            company: data.company,
            industry: data.industry,
        };

        try {
            await apiService.commonAPIRequest(
                apiService.EndPoint.createpersonas,
                apiService.Method.post,
                undefined,
                payload,
                (response: any) => {
                    setIsLoading(false);
                    if (response?.data?.success && response?.data?.message === "Persona created successfully") {
                        setSuccessMessage("Persona created successfully!");
                        Swal.fire({
                            title: "Success!",
                            text: response.message,
                            icon: "success",
                            confirmButtonColor: "#ff5c35",
                        }).then(() => {
                            reset();
                            onClose();
                        });
                    } else {
                        setErrorMessage(response?.data?.message || "Failed to create persona.");
                        Swal.fire({
                            title: "Error!",
                            text: response?.data?.message || "Failed to create persona.",
                            icon: "error",
                            confirmButtonColor: "#ff5c35",
                        });
                    }
                }
            );
        } catch (err) {
            setIsLoading(false);
            console.error("Error creating persona:", err);
            setErrorMessage("An unexpected error occurred. Please try again.");
            Swal.fire({
                title: "Error!",
                text: "An unexpected error occurred while creating persona.",
                icon: "error",
                confirmButtonColor: "#ff5c35",
            });
        }

    };

    const onSubmit = (data: PersonaFormData) => {
        createPersonas(data);
    };

    if (!isOpen) return null;

    return (
        <div className="popup-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
            <div className="popup-container bg-white shadow-lg absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 overflow-hidden !w-[700px]">
                {/* Header */}
                <div className="relative header-top p-9 py-4 flex justify-between items-center">
                    <span className="relative p-logo border-[2.5px] border-solid rounded-full border-[#ff5c35]">
                        <img src={getImage("fLogo")} alt="img" />
                    </span>
                    <h4 className="popup-title font-semibold text-xl leading-10">
                        Create Persona
                    </h4>
                    <span
                        onClick={onClose}
                        className="close-box w-6 h-6 bg-no-repeat bg-center cursor-pointer"
                    >
                        <img
                            src={getImage("close")}
                            alt="close"
                            className="w-full h-full rounded-full"
                        />
                    </span>
                </div>

                {/* Body */}
                <div className="p-6 flex flex-col gap-5 item-center h-[574px]">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-4 h-[470px] overflow-y-auto px-[1px]">
                            <div className="grid grid-cols-1 input-group gap-y-4">
                                <div className="col-span-2 flex items-center gap-2 mb-2">
                                    <FaUser className="text-[#ff5c35] text-lg" />
                                    <h2 className="!text-base !font-semibold text-gray-700">About You</h2>
                                </div>
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-medium text-[#374151] ms-1">
                                        Persona Name <span className="text-red">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        {...register("name", { required: "Persona name is required" })}
                                        className="mt-1 block w-full rounded-md border border-[#d1d5db] shadow-sm focus:ring-[#ff5c35] focus:border-[#ff5c35] p-2 text-sm"
                                        placeholder="e.g. Marketing Expert, Sales Representative"
                                    />
                                    {errors.name && (
                                        <p className="text-red text-sm ms-1">{errors.name.message}</p>
                                    )}
                                </div>

                                {/* Bio */}
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-[#374151] ms-1">
                                        Persona Bio / Description
                                    </label>
                                    <textarea
                                        {...register("bio")}
                                        className="mt-1 block w-full h-[100px] rounded-md border-[#d1d5db] shadow-sm focus:ring-[#ff5c35] focus:border-[#ff5c35] p-2 resize-none text-sm"
                                        placeholder="Describe your persona’s background, expertise, and role."
                                    ></textarea>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 flex items-center gap-2 mb-2">
                                    <FaBriefcase className="text-[#ff5c35] text-lg" />
                                    <h2 className="!text-base !font-semibold">Professional Details</h2>
                                </div>

                                {/* Job Title */}
                                <div>
                                    <label className="block text-sm font-medium text-[#374151] ms-1">
                                        Job Title
                                    </label>
                                    <input
                                        type="text"
                                        {...register("jobTitle")}
                                        className="mt-1 block w-full rounded-md border border-[#d1d5db] shadow-sm focus:ring-[#ff5c35] focus:border-[#ff5c35] p-2 text-sm"
                                        placeholder="e.g. Marketing Manager"
                                    />
                                </div>

                                {/* Company */}
                                <div>
                                    <label className="block text-sm font-medium text-[#374151] ms-1">
                                        Company
                                    </label>
                                    <input
                                        type="text"
                                        {...register("company")}
                                        className="mt-1 block w-full rounded-md border border-[#d1d5db] shadow-sm focus:ring-[#ff5c35] focus:border-[#ff5c35] p-2 text-sm"
                                        placeholder="Company Name"
                                    />
                                </div>

                                {/* Industry */}
                                <div>
                                    <label className="block text-sm font-medium text-[#374151] ms-1">
                                        Industry
                                    </label>
                                    <input
                                        type="text"
                                        {...register("industry")}
                                        className="mt-1 block w-full rounded-md border border-[#d1d5db] shadow-sm focus:ring-[#ff5c35] focus:border-[#ff5c35] p-2 text-sm"
                                        placeholder="e.g. SaaS, Retail"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex mt-4 gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-full border border-[#ff5c35] text-[#ff5c35] py-2 px-4 font-medium text-sm rounded-md"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="w-full bg-[#ff5c35] text-white py-2 px-4 font-medium text-sm rounded-md"
                                disabled={isLoading}
                            >
                                {isLoading ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PersonasFormModal;
