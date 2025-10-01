import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { apiService } from "../../common/config/apiService";
import Swal from "sweetalert2";
import { getImage } from "../../common/utils/logoUtils";

type FormData = {
    name: string;
    message: string;
};

const TemplateModal = ({ isOpen, closeModalPoupBox, onTemplateCreated, editableTemplate, resetEditableTemplate, }: any) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    // const [templateData, setTemplateData] = useState<any[]>([]);
    const [initialFormData, setInitialFormData] = useState<Partial<FormData>>({});
    const [hasChanges, setHasChanges] = useState(false);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    const insertTemplate = (template: string) => {
        const textarea = document.getElementById('message') as HTMLTextAreaElement;
        if (!textarea) return;

        const cursorPosition = textarea.selectionStart;
        const currentText = textarea.value;

        // Insert the template at the cursor position
        const newText =
            currentText.substring(0, cursorPosition) +
            template +
            currentText.substring(cursorPosition);

        // Set the updated message with the template inserted
        setValue('message', newText);

        // Move the cursor to the end of the inserted template
        setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = cursorPosition + template.length;
        }, 0);
        toggleDropdown();
    };

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
        reset,
        getValues
    } = useForm<FormData>();

    /**
   * Check if form has changes compared to initial data
   */
    const checkForChanges = () => {
        if (!editableTemplate) return true;

        const currentValues = getValues();
        const changesDetected = Object.keys(initialFormData).some(key => {
            const formKey = key as keyof FormData;
            return currentValues[formKey] !== initialFormData[formKey];
        });

        setHasChanges(changesDetected);
        return changesDetected;
    };

    /**
     * Handle form submission: Calls `saveTemplate` or `updateTemplate` based on the m  ode (add/edit).
     */
    const onSubmit: SubmitHandler<FormData> = async (data) => {
        // For updates, check if there are any changes
        if (editableTemplate && !checkForChanges()) {
            Swal.fire({
                title: "No Changes Detected",
                text: "You haven't made any changes to update.",
                icon: "info",
                confirmButtonText: "OK",
                confirmButtonColor: "#ff5c35"
            });
            return;
        }

        if (editableTemplate) {
            await updateTemplate(data);
        } else {
            await saveTemplate(data);
        }
    };

    /**
     * Save a new template.
     */
    const saveTemplate = async (data: any) => {
        setIsLoading(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        const payload = {
            name: data.name,
            message: data.message
        };

        try {
            await apiService.commonAPIRequest(
                apiService.EndPoint.createTemplate,
                apiService.Method.post,
                undefined,
                payload,
                (response: any) => {
                    setIsLoading(false);
                    if (response?.data?.message === 'Template created successfully' && response?.data?.statusCode === 200) {
                        setSuccessMessage("Template created successfully!");
                        Swal.fire({
                            title: "Success!",
                            text: "Template created successfully!",
                            icon: "success",
                            confirmButtonColor: "#ff5c35",
                        }).then(() => {
                            closeModalPoup();
                            onTemplateCreated();
                        });
                    } else {
                        setErrorMessage(response?.message || "Failed to create campaign. Please try again.");
                        Swal.fire({
                            title: "Error!",
                            text: response?.message || "Failed to create template",
                            icon: "error",
                            confirmButtonColor: "#ff5c35",
                        });
                    }
                }
            );
        } catch (err) {
            setIsLoading(false);
            console.error("Error creating template:", err);
            setErrorMessage("An unexpected error occurred. Please try again.");
            Swal.fire({
                title: "Error!",
                text: "An unexpected error occurred while creating template.",
                icon: "error",
                confirmButtonColor: "#ff5c35",
            });
        }
    };

    /**
     * Update an existing template.
     */
    const updateTemplate = async (data: any) => {
        setIsLoading(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        const payload = {
            name: data.name,
            message: data.message,
        };

        const endpoint = apiService.EndPoint.updateTemplate.replace(':id', editableTemplate.id)
        try {
            await apiService.commonAPIRequest(
                endpoint,
                apiService.Method.patch,
                undefined,
                payload,
                (response: any) => {
                    console.log("  ~ updateTemplate ~ response:", response)
                    setIsLoading(false);

                    if (response?.data?.message === 'Template updated successfully') {
                        setSuccessMessage("Template updated successfully!");
                        Swal.fire({
                            title: "Success!",
                            text: "Template updated successfully!",
                            icon: "success",
                            confirmButtonColor: "#ff5c35",
                        }).then(() => {
                            closeModalPoup();
                            onTemplateCreated();
                        });
                    } else {
                        setErrorMessage(response?.message || "Failed to update template. Please try again.");
                        Swal.fire({
                            title: "Error!",
                            text: response?.message || "Failed to update template",
                            icon: "error",
                            confirmButtonColor: "#ff5c35",
                        });
                    }
                }
            );
        } catch (err) {
            setIsLoading(false);
            console.error("Error updating template:", err);
            setErrorMessage("An unexpected error occurred. Please try again.");
            Swal.fire({
                title: "Error!",
                text: "An unexpected error occurred while updating template.",
                icon: "error",
                confirmButtonColor: "#ff5c35",
            });
        }
    };


    /**
     * Watch for modal state and populate fields if editing.
     */
    useEffect(() => {
        // getAllTemplateData();
        setIsModalOpen(isOpen);
        setSuccessMessage(null);
        setErrorMessage(null);

        if (isOpen) {
            reset();
            if (editableTemplate) {
                const initialValues = {
                    name: editableTemplate.name || "",
                    message: editableTemplate.message || "",
                };

                setValue("name", initialValues.name);
                setValue("message", initialValues.message);
                // Store initial values for change detection
                setInitialFormData(initialValues);
            } else {
                setInitialFormData({});
            }
        }
    }, [isOpen, reset, editableTemplate, setValue]);

    /**
     * Close modal logic.
     */
    const closeModalPoup = () => {
        setIsModalOpen(false);
        closeModalPoupBox(false);
        if (resetEditableTemplate) resetEditableTemplate();
        reset();
        setHasChanges(false);
    };



    return (
        <div>
            {isModalOpen && (
                <div
                    className={`popup-overlay ${isOpen ? "open" : ""
                        } fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20`}
                >
                    <div
                        className={`popup-container bg-white shadow-lg absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 overflow-hidden !w-[600px]
            }`}
                    >
                        {/* Modal Header */}
                        <div className="relative header-top p-9 py-4 flex justify-between item-center">
                            <span className="relative p-logo border-[2.5px] border-solid rounded-full border-[#ff5c35]">
                                <img src={getImage("fLogo")} alt="img" className="" />
                            </span>
                            <h4 className="popup-title font-semibold text-xl leading-10">
                                {editableTemplate ? "Update Template" : "Create Template"}
                            </h4>
                            <span
                                onClick={closeModalPoup}
                                className="close-box w-6 h-6 bg-no-repeat bg-center cursor-pointer"
                            >
                                <img
                                    src={getImage("close")}
                                    alt="img"
                                    className="w-full h-full rounded-full"
                                />
                            </span>
                        </div>


                        <div className="p-6 flex flex-col gap-5 item-center h-115">
                            <div className="grid grid-cols-1 gap-5">
                                <div className="w-full input-group flex-col col-span-1">
                                    {/* Modal Body */}
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className="space-y-4 h-[365px] *:px-[1px]">
                                            {/* Name Field */}
                                            <div>
                                                <label htmlFor="name" className="block text-sm font-medium text-[#374151] ms-1">
                                                    Name <span className="text-red">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    {...register("name", { required: !editableTemplate && "Name is required" })}
                                                    className={`mt-1 block w-full rounded-md border-[#d1d5db] shadow-sm focus:ring-[#ff5c35] focus:border-[#ff5c35] !p-2 `}
                                                    placeholder="Template Name"
                                                />
                                                {errors.name && (
                                                    <div className="text-red text-sm ms-1 absolute">{errors.name.message}</div>
                                                )}
                                            </div>

                                            {/* Message Field */}
                                            <div className="relative">
                                                <div className="flex justify-between">
                                                    <label
                                                        htmlFor="message"
                                                        className="block text-sm font-medium text-gray-700 mt-2"
                                                    >
                                                        Message <span className="text-red">*</span>
                                                    </label>

                                                    {/* Template Button */}
                                                    <div className="flex justify-end mb-2">
                                                        <button
                                                            type="button"
                                                            onClick={toggleDropdown}
                                                            className="bg-[#ff5c35] text-white text-sm font-medium py-1.5 px-3 rounded-lg border border-[#ff5c35] 
                 hover:bg-white hover:text-[#ff5c35] transition-all duration-200 shadow-sm focus:ring-[#ff5c35] focus:border-[#ff5c35]"
                                                        >
                                                            + Template
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Textarea */}
                                                <textarea
                                                    id="message"
                                                    {...register("message", { required: "Message is required" })}
                                                    value={watch("message")}
                                                    onChange={(e) => setValue("message", e.target.value)}
                                                    className="mt-1 block w-[100%] h-[240px] rounded-md shadow-sm border-[#d1d5db] focus:ring-[#ff5c35] focus:border-[#ff5c35] resize-none"
                                                    placeholder={
                                                        editableTemplate ? editableTemplate.message : "Add Your Message"
                                                    }
                                                ></textarea>

                                                {errors.message && (
                                                    <p className="text-red !text-sm ms-1 absolute">{errors.message.message}</p>
                                                )}

                                                {/* Dropdown - ab textarea ke upar dikhega */}
                                                {isDropdownOpen && (
                                                    <div className="absolute right-0 bottom-[45%] mb-2 w-36 bg-white border border-[#ff5c35] rounded-lg shadow-lg z-20 max-h-[160px] overflow-y-auto animate-fade-in">
                                                        <ul className=" text-sm text-gray-700">
                                                            <li
                                                                className="px-4 py-1 hover:bg-[#ff5c35] hover:text-white cursor-pointer"
                                                                onClick={() => insertTemplate(" {{firstname}} ")}
                                                            >
                                                                First Name
                                                            </li>
                                                            <li
                                                                className="px-4 py-1 hover:bg-[#ff5c35] hover:text-white cursor-pointer"
                                                                onClick={() => insertTemplate(" {{lastname}} ")}
                                                            >
                                                                Last Name
                                                            </li>
                                                            <li
                                                                className="px-4 py-1 hover:bg-[#ff5c35] hover:text-white cursor-pointer"
                                                                onClick={() => insertTemplate(" {{position}} ")}
                                                            >
                                                                Position
                                                            </li>
                                                            <li
                                                                className="px-4 py-1 hover:bg-[#ff5c35] hover:text-white cursor-pointer"
                                                                onClick={() => insertTemplate(" {{company}} ")}
                                                            >
                                                                Company
                                                            </li>
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Modal Footer */}
                                        <div className="flex mt-4">
                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="w-full bg-[#ff5c35] text-white py-2 px-4 font-medium text-sm rounded-md disabled:opacity-50"
                                            >
                                                {isLoading ? (editableTemplate ? "Updating..." : "Saving...") : (editableTemplate ? "Update" : "Save")}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TemplateModal;