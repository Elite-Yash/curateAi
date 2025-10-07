import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { getImage } from "../../common/utils/logoUtils";
import { FaBriefcase, FaPenFancy, FaUser } from "react-icons/fa";

type PersonaFormData = {
    name: string;
    headline: string;
    bio: string;
    jobTitle: string;
    company: string;
    industry: string;
    primaryGoal: string;
    preferredTone: string;
};

interface PersonasModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PersonasFormModal = ({ isOpen, onClose }: PersonasModalProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<PersonaFormData>();

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            reset();
        }
    }, [isOpen, reset]);

    const onSubmit = (data: PersonaFormData) => {
        console.log("Form Data:", data);
        onClose();
        reset();
    };

    if (!isOpen) return null;

    return (
        <div className="popup-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
            <div className="popup-container bg-white shadow-lg absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 overflow-hidden !w-[700px] max-[1800px]:scale-[0.9] max-[1550px]:scale-[0.75]">
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
                <div className="p-6 flex flex-col gap-5 item-center h-[700px]">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-4 h-[600px] overflow-y-auto px-[1px]">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 flex items-center gap-2 mb-2">
                                    <FaUser className="text-[#ff5c35] text-lg" />
                                    <h2 className="!text-base !font-semibold text-gray-700">About You</h2>
                                </div>
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-medium text-[#374151] ms-1">
                                        Name <span className="text-red">*</span>
                                    </label>
                                    <input
                                        type="text"
                                       // {...register("name", { required: "Name is required" })}
                                        className="mt-1 block w-full rounded-md border border-[#d1d5db] shadow-sm focus:ring-[#ff5c35] focus:border-[#ff5c35] p-2"
                                        placeholder="Persona Name"
                                    />
                                    {errors.name && (
                                        <p className="text-red text-sm ms-1">{errors.name.message}</p>
                                    )}
                                </div>

                                {/* Headline */}
                                <div>
                                    <label className="block text-sm font-medium text-[#374151] ms-1">
                                        Headline
                                    </label>
                                    <input
                                        type="text"
                                        {...register("headline")}
                                        className="mt-1 block w-full rounded-md border border-[#d1d5db] shadow-sm focus:ring-[#ff5c35] focus:border-[#ff5c35] p-2"
                                        placeholder="Headline"
                                    />
                                </div>

                                {/* Bio */}
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-[#374151] ms-1">
                                        Bio
                                    </label>
                                    <textarea
                                        {...register("bio")}
                                        className="mt-1 block w-full h-[100px] rounded-md border-[#d1d5db] shadow-sm focus:ring-[#ff5c35] focus:border-[#ff5c35] p-2 resize-none"
                                        placeholder="Short bio..."
                                    ></textarea>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 flex items-center gap-2 mb-2">
                                    <FaBriefcase className="text-[#ff5c35] text-lg" />
                                    <h2 className="!text-base !font-semibold text-gray-700">Professional Details</h2>
                                </div>
                                {/* Job Title */}
                                <div>
                                    <label className="block text-sm font-medium text-[#374151] ms-1">
                                        Job Title
                                    </label>
                                    <input
                                        type="text"
                                        {...register("jobTitle")}
                                        className="mt-1 block w-full rounded-md border border-[#d1d5db] shadow-sm focus:ring-[#ff5c35] focus:border-[#ff5c35] p-2"
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
                                        className="mt-1 block w-full rounded-md border border-[#d1d5db] shadow-sm focus:ring-[#ff5c35] focus:border-[#ff5c35] p-2"
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
                                        className="mt-1 block w-full rounded-md border border-[#d1d5db] shadow-sm focus:ring-[#ff5c35] focus:border-[#ff5c35] p-2"
                                        placeholder="e.g. SaaS, Retail"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 flex items-center gap-2 mb-2">
                                    <FaPenFancy className="text-[#ff5c35] text-lg" />
                                    <h2 className="!text-base !font-semibold text-gray-700">Content Preferences</h2>
                                </div>
                                {/* Primary Goal */}
                                <div>
                                    <label className="block text-sm font-medium text-[#374151] ms-1">
                                        Primary Goal
                                    </label>
                                    <select
                                        {...register("primaryGoal")}
                                        className="mt-1 block w-full rounded-md border-[#d1d5db] shadow-sm focus:ring-[#ff5c35] focus:border-[#ff5c35] p-2"
                                    >
                                        <option value="">Select Goal</option>
                                        <option value="brand">Build Brand</option>
                                        <option value="sales">Drive Sales</option>
                                        <option value="engagement">Increase Engagement</option>
                                    </select>
                                </div>

                                {/* Preferred Tone */}
                                <div>
                                    <label className="block text-sm font-medium text-[#374151] ms-1">
                                        Preferred Tone
                                    </label>
                                    <select
                                        {...register("preferredTone")}
                                        className="mt-1 block w-full rounded-md border-[#d1d5db] shadow-sm focus:ring-[#ff5c35] focus:border-[#ff5c35] p-2"
                                    >
                                        <option value="">Select Tone</option>
                                        <option value="professional">Professional</option>
                                        <option value="casual">Casual</option>
                                        <option value="friendly">Friendly</option>
                                    </select>
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
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PersonasFormModal;
