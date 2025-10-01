import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { apiService } from "../../common/config/apiService";
import Swal from "sweetalert2";
import { getImage } from "../../common/utils/logoUtils";

type FormData = {
    name: string;
    type: string;
    url?: string;
    fileUpload?: FileList;
    max_connections: number;
    message: string;
    messageName: string;
    import_type: string;
};

const TemplateModal = ({ isOpen, closeModalPoupBox, onTemplateCreated, editableTemplates, resetEditableTemplate, }: any) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    // const [templateData, setTemplateData] = useState<any[]>([]);
    const [initialFormData, setInitialFormData] = useState<Partial<FormData>>({});
    const [hasChanges, setHasChanges] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
        reset,
        getValues
    } = useForm<FormData>();

    // Fetch template data
    // const getAllTemplateData = async () => {
    //     try {
    //         // Replace with your actual template API endpoint
    //         await apiService.commonAPIRequest(
    //             "templates", // Adjust this endpoint as needed
    //             apiService.Method.get,
    //             undefined,
    //             {},
    //             (response: any) => {
    //                 if (response?.status === 200) {
    //                     setTemplateData(response.data || []);
    //                 }
    //             }
    //         );
    //     } catch (error) {
    //         console.error("Error fetching templates:", error);
    //     }
    // };

    /**
     * Check if form has changes compared to initial data
     */
    const checkForChanges = () => {
        if (!editableTemplates) return true;

        const currentValues = getValues();
        const changesDetected = Object.keys(initialFormData).some(key => {
            const formKey = key as keyof FormData;
            return currentValues[formKey] !== initialFormData[formKey];
        });

        setHasChanges(changesDetected);
        return changesDetected;
    };

    /**
     * Handle form submission: Calls `saveTemplate` or `updateTemplate` based on the mode (add/edit).
     */
    const onSubmit: SubmitHandler<FormData> = async (data) => {
        // Check if type is CSV and fileUpload is not provided (only for new templates)
        if (data.import_type === "csv" && !editableTemplates && (!data.fileUpload || data.fileUpload.length === 0)) {
            setErrorMessage("File upload is required when type is CSV.");
            return;
        }

        // For updates, check if there are any changes
        if (editableTemplates && !checkForChanges()) {
            Swal.fire({
                title: "No Changes Detected",
                text: "You haven't made any changes to update.",
                icon: "info",
                confirmButtonText: "OK",
                confirmButtonColor: "#ff5c35"
            });
            return;
        }

        if (editableTemplates) {
            await updateTemplate(data);
        } else {
            await saveTemplate(data);
        }
    };

    /**
     * Save a new campaign.
     */
    const saveTemplate = async (data: any) => {
        setIsLoading(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("import_type", data.import_type);
        formData.append("max_connections", data.max_connections.toString());
        formData.append("message", data.message);

        if (data.url && data.import_type === 'url') {
            formData.append("url", data.url);
        }

        if (data.fileUpload && data.fileUpload.length > 0 && data.import_type === 'csv') {
            formData.append("csvFile", data.fileUpload[0]);
        }

        try {
            await apiService.commonAPIRequest(
                apiService.EndPoint.createcampaign,
                apiService.Method.post,
                undefined,
                formData,
                (response: any) => {
                    setIsLoading(false);

                    if (response?.message === 'Campaign created successfully' && response?.statusCode === 200) {
                        setSuccessMessage("Campaign created successfully!");
                        Swal.fire({
                            title: "Success!",
                            text: "Campaign created successfully!",
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
                            text: response?.message || "Failed to create campaign",
                            icon: "error",
                            confirmButtonColor: "#ff5c35",
                        });
                    }
                }
            );
        } catch (err) {
            setIsLoading(false);
            console.error("Error creating campaign:", err);
            setErrorMessage("An unexpected error occurred. Please try again.");
            Swal.fire({
                title: "Error!",
                text: "An unexpected error occurred while creating campaign.",
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

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("import_type", data.import_type);
        formData.append("max_connections", data.max_connections.toString());
        formData.append("message", data.message);

        if (data.url) {
            formData.append("url", data.url);
        }

        if (data.fileUpload && data.fileUpload.length > 0) {
            formData.append("csvFile", data.fileUpload[0]);
        }

        const endpoint = apiService.EndPoint.updateTemplate.replace(':campaignId', editableTemplates.id);

        try {
            await apiService.commonAPIRequest(
                endpoint,
                apiService.Method.put,
                undefined,
                formData,
                (response: any) => {
                    setIsLoading(false);

                    if (response?.message === 'Campaign updated successfully' && response?.statusCode === 200) {
                        setSuccessMessage("Campaign updated successfully!");
                        Swal.fire({
                            title: "Success!",
                            text: "Campaign updated successfully!",
                            icon: "success",
                            confirmButtonColor: "#ff5c35",
                        }).then(() => {
                            closeModalPoup();
                            onTemplateCreated();
                        });
                    } else {
                        setErrorMessage(response?.message || "Failed to update campaign. Please try again.");
                        Swal.fire({
                            title: "Error!",
                            text: response?.message || "Failed to update campaign",
                            icon: "error",
                            confirmButtonColor: "#ff5c35",
                        });
                    }
                }
            );
        } catch (err) {
            setIsLoading(false);
            console.error("Error updating campaign:", err);
            setErrorMessage("An unexpected error occurred. Please try again.");
            Swal.fire({
                title: "Error!",
                text: "An unexpected error occurred while updating campaign.",
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
            if (editableTemplates) {
                const initialValues = {
                    name: editableTemplates.name || "",
                    message: editableTemplates.message || "",
                    import_type: editableTemplates.import_type || "",
                    max_connections: editableTemplates.max_connections || 0,
                    url: editableTemplates.url || "",
                    messageName: editableTemplates.messageName || ""
                };

                setValue("name", initialValues.name);
                setValue("message", initialValues.message);
                setValue("import_type", initialValues.import_type);
                setValue("max_connections", initialValues.max_connections);
                setValue("url", initialValues.url);
                setValue("messageName", initialValues.messageName);

                // Store initial values for change detection
                setInitialFormData(initialValues);
            } else {
                setInitialFormData({});
            }
        }
    }, [isOpen, reset, editableTemplates, setValue]);

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
                        className={`popup-container bg-white shadow-lg absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 overflow-hidden
            }`}
                    >
                        {/* Modal Header */}
                        <div className="relative header-top p-9 py-4 flex justify-between item-center">
                            <span className="relative p-logo border-[2.5px] border-solid rounded-full border-[#ff5c35]">
                                <img src={getImage("fLogo")} alt="img" className="" />
                            </span>
                            <h4 className="popup-title font-semibold text-xl leading-10">
                                {editableTemplates ? "Update Template" : "Create Template"}
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


                        <div className="p-6 flex flex-col gap-5 item-center">
                            <div className="grid grid-cols-1 gap-5">
                                <div className="w-full input-group flex-col col-span-1">
                                    {/* Modal Body */}
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className="space-y-4 overflow-y-auto max-h-[60vh] *:px-[1px]">
                                            {/* Name Field */}
                                            <div>
                                                <label htmlFor="name" className="block text-sm font-medium text-[#374151] ms-1">
                                                    Name <span className="text-red">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    {...register("name", { required: !editableTemplates && "Name is required" })}
                                                    className={`mt-1 block w-full rounded-md border-[#d1d5db] shadow-sm focus:ring-[#ff5c35] focus:border-[#ff5c35] !p-2 `}
                                                    placeholder="Template Name"
                                                />
                                                {errors.name && (
                                                    <div className="text-red text-sm">{errors.name.message}</div>
                                                )}
                                            </div>

                                            {/* Message Field */}
                                            <div className="relative">
                                                <label htmlFor="message" className="block text-sm font-medium text-[#374151] ms-1">
                                                    Message <span className="text-red">*</span>
                                                </label>

                                                {/* Textarea for message */}
                                                <textarea
                                                    id="message"
                                                    {...register("message", { required: "Message is required" })}
                                                    className={`mt-1 block w-full rounded-md text-sm border-[#d1d5db] shadow-sm focus:ring-[#ff5c35] focus:border-[#ff5c35] p-2 $ resize-none`}
                                                    style={{ height: "100px" }}
                                                    placeholder="Add Your Message"
                                                ></textarea>
                                                {errors.message && (
                                                    <div className="text-red text-sm">{errors.message.message}</div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Modal Footer */}
                                        <div className="flex mt-4">
                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="w-full bg-[#ff5c35] hover:bg-[#2455c0ee] text-white py-2 px-4 font-medium text-sm rounded-md disabled:opacity-50"
                                            >
                                                {isLoading ? (editableTemplates ? "Updating..." : "Saving...") : (editableTemplates ? "Update" : "Save")}
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