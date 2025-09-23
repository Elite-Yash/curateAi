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

const CampaignModal = ({ isOpen, closeModalPoupBox, onCampaignCreated, editableCampaigns, resetEditableCampaign, typeValue }: any) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [templateData, setTemplateData] = useState<any[]>([]);
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
    const getAllTemplateData = async () => {
        try {
            // Replace with your actual template API endpoint
            await apiService.commonAPIRequest(
                "templates", // Adjust this endpoint as needed
                apiService.Method.get,
                undefined,
                {},
                (response: any) => {
                    if (response?.status === 200) {
                        setTemplateData(response.data || []);
                    }
                }
            );
        } catch (error) {
            console.error("Error fetching templates:", error);
        }
    };

    /**
     * Check if form has changes compared to initial data
     */
    const checkForChanges = () => {
        if (!editableCampaigns) return true;
        
        const currentValues = getValues();
        const changesDetected = Object.keys(initialFormData).some(key => {
            const formKey = key as keyof FormData;
            return currentValues[formKey] !== initialFormData[formKey];
        });
        
        setHasChanges(changesDetected);
        return changesDetected;
    };

    /**
     * Handle form submission: Calls `saveCampaign` or `updateCampaign` based on the mode (add/edit).
     */
    const onSubmit: SubmitHandler<FormData> = async (data) => {
        // Check if type is CSV and fileUpload is not provided (only for new campaigns)
        if (data.import_type === "csv" && !editableCampaigns && (!data.fileUpload || data.fileUpload.length === 0)) {
            setErrorMessage("File upload is required when type is CSV.");
            return;
        }

        // For updates, check if there are any changes
        if (editableCampaigns && !checkForChanges()) {
            Swal.fire({
                title: "No Changes Detected",
                text: "You haven't made any changes to update.",
                icon: "info",
                confirmButtonText: "OK",
                confirmButtonColor: "#2563eb"
            });
            return;
        }

        if (editableCampaigns) {
            await updateCampaign(data);
        } else {
            await saveCampaign(data);
        }
    };

    /**
     * Save a new campaign.
     */
    const saveCampaign = async (data: any) => {
        setIsLoading(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("type", typeValue === "message" ? "message" : "connect");
        formData.append("import_type", data.import_type);
        formData.append("max_connections", data.max_connections.toString());
        formData.append("message", data.message);

        if (data.url) {
            formData.append("url", data.url);
        }

        if (data.fileUpload && data.fileUpload.length > 0) {
            formData.append("file", data.fileUpload[0]);
        }

        try {
            await apiService.commonAPIRequest(
                apiService.EndPoint.createcampaign,
                apiService.Method.post,
                undefined,
                formData,
                (response: any) => {
                    setIsLoading(false);

                    if (response?.data.message === 'Campaign created successfully' && response?.data.statusCode === 200) {
                        setSuccessMessage("Campaign created successfully!");
                        Swal.fire({
                            title: "Success!",
                            text: "Campaign created successfully!",
                            icon: "success",
                            confirmButtonColor: "#2563eb",
                        }).then(() => {
                            closeModalPoup();
                            onCampaignCreated();
                        });
                    } else {
                        setErrorMessage(response?.data?.message || "Failed to create campaign. Please try again.");
                        Swal.fire({
                            title: "Error!",
                            text: response?.data?.message || "Failed to create campaign",
                            icon: "error",
                            confirmButtonColor: "#2563eb",
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
                confirmButtonColor: "#2563eb",
            });
        }
    };

    /**
     * Update an existing campaign.
     */
    const updateCampaign = async (data: any) => {
        setIsLoading(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("type", typeValue === "message" ? "message" : "connect");
        formData.append("import_type", data.import_type);
        formData.append("max_connections", data.max_connections.toString());
        formData.append("message", data.message);

        if (data.url) {
            formData.append("url", data.url);
        }

        if (data.fileUpload && data.fileUpload.length > 0) {
            formData.append("file", data.fileUpload[0]);
        }

        const endpoint = apiService.EndPoint.updatecampaign.replace(':campaignId', editableCampaigns.id);

        try {
            await apiService.commonAPIRequest(
                endpoint,
                apiService.Method.put,
                undefined,
                formData,
                (response: any) => {
                    setIsLoading(false);

                    if (response?.data.message === 'Campaign updated successfully' && response?.data?.statusCode === 200) {
                        setSuccessMessage("Campaign updated successfully!");
                        Swal.fire({
                            title: "Success!",
                            text: "Campaign updated successfully!",
                            icon: "success",
                            confirmButtonColor: "#2563eb",
                        }).then(() => {
                            closeModalPoup();
                            onCampaignCreated();
                        });
                    } else {
                        setErrorMessage(response?.data?.message || "Failed to update campaign. Please try again.");
                        Swal.fire({
                            title: "Error!",
                            text: response?.data?.message || "Failed to update campaign",
                            icon: "error",
                            confirmButtonColor: "#2563eb",
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
                confirmButtonColor: "#2563eb",
            });
        }
    };

    /**
     * Watch for modal state and populate fields if editing.
     */
    useEffect(() => {
        getAllTemplateData();
        setIsModalOpen(isOpen);
        setSuccessMessage(null);
        setErrorMessage(null);

        if (isOpen) {
            reset();
            if (editableCampaigns) {
                const initialValues = {
                    name: editableCampaigns.name || "",
                    message: editableCampaigns.message || "",
                    import_type: editableCampaigns.import_type || "",
                    max_connections: editableCampaigns.max_connections || 0,
                    url: editableCampaigns.url || "",
                    messageName: editableCampaigns.messageName || ""
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
    }, [isOpen, reset, editableCampaigns, setValue]);

    /**
     * Close modal logic.
     */
    const closeModalPoup = () => {
        setIsModalOpen(false);
        closeModalPoupBox(false);
        if (resetEditableCampaign) resetEditableCampaign();
        reset();
        setHasChanges(false);
    };

    const selectedType = watch("import_type");

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
                            <span className="relative p-logo border-[2.5px] border-solid rounded-full border-[#2563eb]">
                                <img src={getImage("fLogo")} alt="img" className="" />
                            </span>
                            <h4 className="popup-title font-semibold text-xl leading-10">
                                {editableCampaigns ? "Update Campaign" : "Create Campaign"}
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
                                                    // disabled={!!editableCampaigns}
                                                    {...register("name", { required: !editableCampaigns && "Name is required" })}
                                                    // className={`mt-1 block w-full rounded-md border-[#d1d5db] shadow-sm focus:ring-[#0080cc] focus:border-[#0080cc] p-2 ${errors.name ? "border-red" : ""
                                                    //     } ${nonEditableStyle}`}
                                                    className={`mt-1 block w-full rounded-md border-[#d1d5db] shadow-sm focus:ring-[#0080cc] focus:border-[#0080cc] !p-2 `}
                                                    placeholder="Campaign Name" 
                                                />
                                                {errors.name && (
                                                    <div className="text-red text-sm">{errors.name.message}</div>
                                                )}
                                            </div>

                                            {/* Type Field */}
                                            <div>
                                                <label htmlFor="import_type" className="block text-sm font-medium text-[#374151] ms-1">
                                                    Type <span className="text-red">*</span>
                                                </label>
                                                <select
                                                    id="import_type"
                                                    {...register("import_type", {
                                                        required: !editableCampaigns && "Please select a Type"
                                                    })}
                                                    // disabled={!!editableCampaigns}
                                                    className={`mt-1 block w-full rounded-md text-sm border-[#d1d5db] shadow-sm text-[#6b7280] focus:text-[#000] :ring-[#0080cc] focus:border-[#0080cc] p-2 `}
                                                >
                                                    <option value="">Select Type</option>
                                                    {/* <option value="csv">CSV</option> */}
                                                    <option value="url">URL</option>
                                                </select>
                                                {errors.import_type && (
                                                    <div className="text-red text-sm">{errors.import_type.message}</div>
                                                )}
                                            </div>

                                            {/* Conditional URL Input */}
                                            {selectedType === "url" && (
                                                <div>
                                                    <label htmlFor="url" className="block text-sm font-medium text-[#374151] ms-1">
                                                        URL <span className="text-red">*</span>
                                                    </label>
                                                    <input
                                                        type="url"
                                                        id="url"
                                                        {...register("url", {
                                                            required: selectedType === "url" && "URL is required",
                                                        })}
                                                        className="mt-1 block w-full rounded-md border-[#d1d5db] shadow-sm focus:ring-[#0080cc] focus:border-[#0080cc] p-2"
                                                        placeholder="https://example.com"
                                                    />
                                                    {errors.url && (
                                                        <div className="text-red text-sm">{errors.url.message}</div>
                                                    )}
                                                </div>
                                            )}

                                            {/* File Upload */}
                                            {selectedType === "csv" && (
                                                <div>
                                                    <label htmlFor="fileUpload" className="block text-sm font-medium text-[#374151] ms-1">
                                                        Upload File <span className="text-red">*</span>
                                                    </label>
                                                    <input
                                                        type="file"
                                                        id="fileUpload"
                                                        {...register("fileUpload", {
                                                            required: selectedType === "csv" && !editableCampaigns && "File upload is required when type is CSV."
                                                        })}
                                                        accept=".csv"
                                                        className="mt-1 block w-full text-sm text-[#6b7280] file:mr-4 file:py-2 file:px-4 file:rounded file:border file:border-[#d1d5db] file:bg-[#f9fafb] file:text-[#374151] hover:file:bg-[#f3f4f6]"
                                                    />
                                                    {errors.fileUpload && (
                                                        <div className="text-red text-sm">{errors.fileUpload.message}</div>
                                                    )}
                                                </div>
                                            )}

                                            {/* MAX CONNECTION Field */}
                                            <div>
                                                <label htmlFor="max_connections" className="block text-sm font-medium text-[#374151] ms-1">
                                                    Max Connection <span className="text-red">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    id="max_connections"
                                                    // disabled={!!editableCampaigns}
                                                    {...register("max_connections", {
                                                        required: !editableCampaigns && "Max connections is required",
                                                        valueAsNumber: true,
                                                        min: { value: 1, message: "Must be at least 1" },
                                                        max: { value: 100, message: "Must be 100 or less" },
                                                    })}
                                                    className={`mt-1 block w-full rounded-md border-[#d1d5db] shadow-sm focus:ring-[#0080cc] focus:border-[#0080cc] !p-2`}
                                                    placeholder="Enter maximum connections"
                                                    min="1"
                                                    max="100"
                                                />
                                                {errors.max_connections && (
                                                    <div className="text-red text-sm">{errors.max_connections.message}</div>
                                                )}
                                            </div>

                                            {/* Message Field */}
                                            <div className="relative">
                                                <label htmlFor="message" className="block text-sm font-medium text-[#374151] ms-1">
                                                    Message <span className="text-red">*</span>
                                                </label>

                                                {/* Dropdown for predefined messages */}
                                                <select
                                                    onChange={(e) => {
                                                        const selectedMessage = templateData.find((data: any) => data.name === e.target.value);
                                                        setValue("messageName", selectedMessage ? selectedMessage.name : "");
                                                        setValue("message", selectedMessage ? selectedMessage.message : "");
                                                    }}
                                                    className="mt-1 block w-full rounded-md border-[#d1d5db] text-sm text-[#6b7280] shadow-sm focus:ring-[#0080cc] focus:border-[#0080cc] p-2 mb-2"
                                                >
                                                    <option value="">Select a predefined message</option>
                                                    {templateData.map((data: any) => {
                                                        const isLongMessage = data.message && data.message.length > 150;
                                                        return (
                                                            <option key={data.id} value={data.name} disabled={typeValue === "connect" && isLongMessage}>
                                                                {data.name} {typeValue === "connect" && isLongMessage && "(Too long)"}
                                                            </option>
                                                        );
                                                    })}
                                                </select>

                                                {/* Textarea for message */}
                                                <textarea
                                                    id="message"
                                                    {...register("message", { required: "Message is required" })}
                                                    className={`mt-1 block w-full rounded-md text-sm border-[#d1d5db] shadow-sm focus:ring-[#0080cc] focus:border-[#0080cc] p-2 $ resize-none`}
                                                    style={{ height: "100px" }}
                                                    placeholder="Add Your Message"
                                                ></textarea>

                                                {/* Character Counter */}
                                                {typeValue === "connect" && (
                                                    <div className={`text-sm mt-1 ${watch("message")?.length >= 150 ? 'text-red' : 'text-gray-500'
                                                        }`}>
                                                        {watch("message")?.length || 0} / 150 characters
                                                    </div>
                                                )}

                                                {errors.message && (
                                                    <div className="text-red text-sm">{errors.message.message}</div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Modal Footer */}
                                        <div className="flex mt-4">
                                            {/* <div className="flex-1">
                                                {successMessage && (
                                                    <div className="text-green-600 text-sm">{successMessage}</div>
                                                )}
                                                {errorMessage && (
                                                    <div className="text-red text-sm">{errorMessage}</div>
                                                )}
                                            </div> */}
                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="w-full bg-[#2563eb] hover:bg-[#2455c0ee] text-white py-2 px-4 font-medium text-sm rounded-md disabled:opacity-50"
                                            >
                                                {isLoading ? (editableCampaigns ? "Updating..." : "Saving...") : (editableCampaigns ? "Update" : "Save")}
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

export default CampaignModal;