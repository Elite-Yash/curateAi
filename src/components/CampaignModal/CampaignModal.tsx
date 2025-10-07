import { useEffect, useRef, useState } from "react";
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
    const nonEditableStyle = editableCampaigns ? "bg-gray5 cursor-not-allowed" : "";
    const [isContextActive, setIsContextActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [fileName, setFileName] = useState("No file chosen");

    const handleClick = () => {
        if (!editableCampaigns) {
            fileInputRef?.current?.click();
        }
    };

    const handleFileChange = (e: any) => {
        const file = e.target.files[0];
        setFileName(file ? file.name : "No file chosen")
        setValue("fileUpload", e.target.files, { shouldValidate: true });
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

    // Fetch template data
    const getAllTemplateData = async () => {
        try {
            // Replace with your actual template API endpoint
            await apiService.commonAPIRequest(
                apiService.EndPoint.getAllTemplate, // Adjust this endpoint as needed
                apiService.Method.get,
                undefined,
                {},
                (response: any) => {
                    if (response?.status === 200 && response?.data?.data) {
                        setTemplateData(response?.data?.data || []);
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
        console.log("Form Submitted!", data);
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
                confirmButtonColor: "#ff5c35"
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

                    console.log("  ~ saveCampaign ~ response?.data:", response?.data)
                    console.log("  ~ saveCampaign ~ response?.data.message:", response?.data.message)
                    if (response?.message === "Campaign created successfully" && response?.statusCode === 200) {
                        setSuccessMessage("Campaign created successfully!");
                        Swal.fire({
                            title: "Success!",
                            text: "Campaign created successfully!",
                            icon: "success",
                            confirmButtonColor: "#ff5c35",
                        }).then(() => {
                            closeModalPoup();
                            onCampaignCreated();
                        });
                    } else {
                        setErrorMessage(response?.message || "Failed to create campaign. Please try again.");
                        Swal.fire({
                            title: "Error!",
                            text: response?.data?.message || "Failed to create campaign",
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
                    console.log("update response", response)
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
                            onCampaignCreated();
                        });
                    } else {
                        setErrorMessage(response?.data?.message || "Failed to update campaign. Please try again.");
                        Swal.fire({
                            title: "Error!",
                            text: response?.data?.message || "Failed to update campaign",
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
                        className={`popup-container bg-white shadow-lg absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 overflow-hidden !h-[680px]}`}
                    >
                        {/* Modal Header */}
                        <div className="relative header-top p-9 py-4 flex justify-between item-center">
                            <span className="relative p-logo border-[2.5px] border-solid rounded-full border-[#ff5c35]">
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
                            <div className="grid grid-cols-1 gap-5 p-[1px]">
                                <div className="w-full input-group flex-col col-span-1">
                                    {/* Modal Body */}
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className="space-y-5 *:px-[1px] max-h-[495px] overflow-auto">
                                            {/* Name Field */}
                                            <div className="relative">
                                                <label htmlFor="name" className="block text-sm font-medium text-[#374151] ms-1">
                                                    Name <span className="text-red">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    disabled={!!editableCampaigns}
                                                    {...register("name", { required: !editableCampaigns && "Name is required" })}
                                                    className={`mt-1 block w-full rounded-md border-[#d1d5db] shadow-sm focus:ring-[#ff5c35] focus:border-[#ff5c35] !p-2 ${nonEditableStyle}`}
                                                    // className={`mt-1 block w-full rounded-md border-[#d1d5db] shadow-sm focus:ring-[#ff5c35] focus:border-[#ff5c35] !p-2 `}
                                                    placeholder="Campaign Name"
                                                />
                                                {errors.name && (
                                                    <div className="text-red text-sm ms-1 absolute">{errors.name.message}</div>
                                                )}
                                            </div>

                                            {/* Type Field */}
                                            <div className="relative">
                                                <label htmlFor="import_type" className="block text-sm font-medium text-[#374151] ms-1">
                                                    Type <span className="text-red">*</span>
                                                </label>
                                                <select
                                                    id="import_type"
                                                    {...register("import_type", {
                                                        required: !editableCampaigns && "Please select a Type"
                                                    })}
                                                    disabled={!!editableCampaigns}
                                                    className={`mt-1 block w-full rounded-md text-sm border-[#d1d5db] shadow-sm text-[#6b7280] focus:outline-none focus:ring-1 focus:ring-[#ff5c35] focus:border-[#ff5c35] p-2 ${nonEditableStyle}`}
                                                >
                                                    <option value="">Select Type</option>
                                                    {/* <option value="csv">CSV</option> */}
                                                    <option value="url">URL</option>
                                                </select>
                                                {errors.import_type && (
                                                    <div className="text-red text-sm ms-1 absolute">{errors.import_type.message}</div>
                                                )}
                                            </div>

                                            {/* Conditional URL Input */}
                                            {selectedType === "url" && (
                                                <div className="relative">
                                                    <label
                                                        htmlFor="url"
                                                        className="block text-sm font-medium text-[#374151] ms-1"
                                                    >
                                                        URL <span className="text-red">*</span>
                                                    </label>

                                                    <input
                                                        type="url"
                                                        id="url"
                                                        placeholder="https://www.linkedin.com/search/results/all/?keywords=react"
                                                        {...register("url", {
                                                            required: selectedType === "url" ? "URL is required" : false,
                                                            // validate: (value: any) =>
                                                            //     if (!value) return true;
                                                            //     value.startsWith("https://www.linkedin.com/search/results/all/?keywords") ||
                                                            //     "Invalid URL: It must be a valid LinkedIn search URL",
                                                            validate: (value: any) => {
                                                                if (!value) return true; // allow empty if somehow skipped
                                                                return value.startsWith(
                                                                    "https://www.linkedin.com/search/results/all/?keywords"
                                                                ) || "Invalid URL: It must be a valid LinkedIn search URL";
                                                            },
                                                        })}
                                                        className="mt-1 block w-full rounded-md border-[#d1d5db] shadow-sm focus:ring-[#ff5c35] focus:border-[#ff5c35] p-2"
                                                    />

                                                    {/* ✅ Note text */}
                                                    {/* <div className="text-sm text-gray-500 ms-1 mt-1">
                                                        <span className="text-red">Note:</span> Only LinkedIn search URLs are allowed. The URL must start with{" "}
                                                        <span className="font-mono text-[#ff5c35]">
                                                            https://www.linkedin.com/search/results/all/?keywords
                                                        </span>{" "}
                                                        followed by your search query.  
                                                    </div> */}

                                                    {/* LinkedIn URL Note */}
                                                    <div className="p-4 bg-[#ff5c350f] rounded-lg mt-[10px]">
                                                        <div className="font-semibold text-sm ">
                                                            🤝 LinkedIn URL Guidelines:
                                                        </div>
                                                        <ul className="text-xs space-y-1">
                                                            <li className="flex gap-2"><span className="text-sm">•</span> <span>Open LinkedIn and perform a search (e.g., <b>"React Developer"</b> or <b>"Node Developer"</b>).</span></li>
                                                            <li className="flex gap-2"><span className="text-sm">•</span> <span>Copy the URL from the <b>search results page.</b></span></li>
                                                            <li className="flex gap-2"><span className="text-sm">•</span>  <span>
                                                                Only URLs starting with <span className="font-mono text-[#ff5c35]"> https://www.linkedin.com/search/results/all/?keywords</span>  are valid.
                                                            </span>
                                                            </li>
                                                            <li className="flex gap-2"><span className="text-sm">•</span> <span>Any other type of LinkedIn link (e.g., jobs, profiles, posts) will not be accepted.</span> </li>
                                                        </ul>
                                                    </div>

                                                    {errors.url && (
                                                        <div className="text-red text-sm ms-1 absolute">
                                                            {errors.url.message}
                                                        </div>
                                                    )}
                                                </div>

                                            )}

                                            {/* File Upload */}
                                            {selectedType === "csv" && (
                                                <div className="relative">
                                                    <label htmlFor="fileUpload" className="block text-sm font-medium text-[#374151] ms-1">
                                                        Upload File <span className="text-red">*</span>
                                                    </label>

                                                    <button type="button" className="relative UploadFile">
                                                        <span className="flex items-center gap-2 mt-[2px]">
                                                            <span
                                                                className="UploadFile-btn z-9 flex items-center gap-2 border px-4 py-2 text-sm font-medium rounded-lg border-[#ff5c35] text-[#ff5c35] hover:bg-[#ff5c35] hover:text-white transition cursor-pointer"
                                                                onClick={handleClick}
                                                            >
                                                                Choose File
                                                            </span>
                                                            <span className="UploadFile-text text-[#6b7280] text-[14px]">
                                                                {fileName}
                                                            </span>
                                                        </span>

                                                        <span className="input_UploadFile absolute top-1/2 left-0 -translate-y-1/2 opacity-0">
                                                            <input
                                                                type="file"
                                                                id="fileUpload"
                                                                {...register("fileUpload", {
                                                                    required:
                                                                        selectedType === "csv" &&
                                                                        !editableCampaigns &&
                                                                        "File upload is required when type is CSV.",
                                                                })}
                                                                accept=".csv"
                                                                disabled={!!editableCampaigns}
                                                                ref={fileInputRef}
                                                                onChange={handleFileChange}
                                                                className={`mt-1 block text-sm text-[#6b7280] file:mr-4 !p-0 !w-[109px] file:rounded file:border file:border-[#d1d5db] file:bg-[#f9fafb] file:text-[#374151] hover:file:bg-[#f3f4f6] ${nonEditableStyle}`}
                                                            />
                                                        </span>
                                                    </button>
                                                    {errors.fileUpload && (
                                                        <div className="text-red text-sm ms-1 absolute">{errors.fileUpload.message}</div>
                                                    )}
                                                </div>
                                            )}

                                            {/* MAX CONNECTION Field */}
                                            <div className="relative">
                                                <label htmlFor="max_connections" className="block text-sm font-medium text-[#374151] ms-1">
                                                    Max Connection <span className="text-red">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    id="max_connections"
                                                    disabled={!!editableCampaigns}
                                                    {...register("max_connections", {
                                                        required: !editableCampaigns && "Max connections is required",
                                                        valueAsNumber: true,
                                                        min: { value: 1, message: "Must be at least 1" },
                                                        max: { value: 100, message: "Must be 100 or less" },
                                                    })}
                                                    className={`mt-1 block w-full rounded-md border-[#d1d5db] shadow-sm focus:ring-[#ff5c35] focus:border-[#ff5c35] !p-2 ${nonEditableStyle}`}
                                                    placeholder="Enter maximum connections"
                                                    min="1"
                                                    max="100"
                                                />
                                                {errors.max_connections && (
                                                    <div className="text-red text-sm ms-1 absolute">{errors.max_connections.message}</div>
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
                                                    className="mt-1 block w-full rounded-md border-[#d1d5db] text-sm text-[#6b7280] shadow-sm focus:ring-[#ff5c35] focus:border-[#ff5c35] p-2 mb-2"
                                                >
                                                    <option value="">Select a predefined message</option>
                                                    {templateData?.map((data: any) => {
                                                        const isLongMessage = data.message && data.message.length > 150;
                                                        return (
                                                            <option key={data.id} value={data.name} disabled={typeValue === "connect" && isLongMessage}>
                                                                {data.name} {typeValue === "connect" && isLongMessage && "(Too long)"}
                                                            </option>
                                                        );
                                                    })}
                                                </select>

                                                {/* Textarea for message */}
                                                <div
                                                    className={`rounded-lg overflow-hidden border ${isContextActive ? "active" : "border-[#d1d5db]"
                                                        } custom_textarea`}
                                                >
                                                    <textarea
                                                        id="message"
                                                        {...register("message", { required: "Message is required" })}
                                                        className={`mt-1 block w-full rounded-md text-sm border-[#d1d5db focus:ring-[#ff5c35] focus:border-[#ff5c35] p-2 $ resize-none focus:ring-0 border-0`}
                                                        style={{ height: "100px" }}
                                                        placeholder="Add Your Message"
                                                        onFocus={() => setIsContextActive(true)}
                                                        onBlur={() => setIsContextActive(false)}
                                                    ></textarea>
                                                </div>

                                                {/* Character Counter */}
                                                {typeValue === "connect" && (
                                                    <div className={`text-sm mt-1 ${watch("message")?.length >= 150 ? 'text-red' : 'text-gray-500'
                                                        }`}>
                                                        {watch("message")?.length || 0} / 150 characters
                                                    </div>
                                                )}

                                                {errors.message && (
                                                    <div className="text-red text-sm ms-1 absolute ">{errors.message.message}</div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Modal Footer */}
                                        <div className="flex mt-6">
                                            {/* <div className="flex-1">
                                                {successMessage && (
                                                    <div className="text-green-600 text-sm">{successMessage}</div>
                                                )}
                                                {errorMessage && (
                                                    <div className="text-red text-sm ms-1 absolute">{errorMessage}</div>
                                                )}
                                            </div> */}
                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="w-full bg-[#ff5c35] text-white py-2 px-4 font-medium text-sm rounded-md disabled:opacity-50"
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