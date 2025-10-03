import { useEffect, useState } from "react";
import { IoDocumentTextSharp, IoSearchOutline } from "react-icons/io5";
import Swal from "sweetalert2";
import { apiService } from "../../common/config/apiService";
import TemplateModal from "./TemplateModal";

const MessageTamplateTable = () => {
    const [templates, setTemplates] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editableTemplate, setEditableTemplate] = useState<any>(null);

    useEffect(() => {
        fetchTemplate();
    }, []);

    const fetchTemplate = async () => {
        try {
            await apiService.commonAPIRequest(
                apiService.EndPoint.getAllTemplate,
                apiService.Method.get,
                undefined,
                {},
                (response: any) => {
                    if (response?.status === 200 && response?.data?.data && response?.data?.message === 'Templates fetched successfully') {
                        setTemplates(response.data.data);
                    }
                }
            );
        } catch (err) {
            console.error("Error fetching templates:", err);
            Swal.fire({
                title: "Error!",
                text: "An unexpected error occurred while fetching templates.",
                icon: "error",
                confirmButtonColor: "#ff5c35",
            });
        }
    };

    const deleteTemplate = async (id: any) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ff5c35",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            try {
                const endpoint = apiService.EndPoint.deleteTemplate.replace(':id', id);
                await apiService.commonAPIRequest(
                    endpoint,
                    apiService.Method.delete,
                    undefined,
                    {},
                    (response: any) => {
                        if (response?.data.message === 'Template deleted successfully') {
                            setTemplates(prevTemplates =>
                                prevTemplates.filter(templates => templates.id !== id)
                            );
                            Swal.fire({
                                title: "Deleted!",
                                text: "Template deleted successfully.",
                                icon: "success",
                                confirmButtonColor: "#ff5c35",
                            }).then(() => {
                                fetchTemplate();
                            });;
                        } else {
                            Swal.fire({
                                title: "Error!",
                                text: response?.data?.message || "Failed to delete template.",
                                icon: "error",
                                confirmButtonColor: "#ff5c35",
                            });
                        }
                    }
                );
            } catch (err) {
                console.error("Error deleting template:", err);
                Swal.fire({
                    title: "Error!",
                    text: "An unexpected error occurred while deleting template.",
                    icon: "error",
                    confirmButtonColor: "#ff5c35",
                });
            }
        }
    };


    const handleCampaignCreated = () => {
        fetchTemplate();
    };

    const filteredTemplate = templates.filter(template =>
        template.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEditTemplate = (template: any) => {
        setEditableTemplate(template);
        setIsModalOpen(true);
    };

    return (
        <div className="c-padding-r py-[24px] relative pl-[320px] pr-[24px]">
            <div className="flex items-center justify-between bg-white z-10 mb-6 g-box p-4 rounded-lg">
                {/* Left Side: Title */}
                <div className="mb-0">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r bg-[#ff5c35] rounded-2xl flex items-center justify-center">
                            <i className="fas fa-file-alt text-xl text-white"></i>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-900">
                                Message Campaign
                            </div>
                            <div className="text-sm text-[#717c8c]">
                                Create and manage AI-powered message template with ease
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-sm text-slate-600">
                            {templates.length} Templates{templates.length !== 1 ? 's' : ''} available
                        </span>
                    </div>
                </div>

                {/* Right Side: Search + Buttons */}
                <div className="flex flex-wrap items-center gap-3 mt-3 md:mt-0">
                    {/* Search Box */}
                    <div className="flex items-center bg-white shadow-sm rounded-xl px-3 py-2 w-100 transition border border-[#ff5c35] h-[38px]">
                        <IoSearchOutline className="w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search Template by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-2 text-sm border-none placeholder-gray-400 focus:outline-none focus:ring-0"
                        />
                    </div>

                    <button
                        onClick={() => {
                            setEditableTemplate(null);
                            setIsModalOpen(true);
                        }}
                        className="flex items-center gap-2 border px-4 py-2 text-sm font-medium rounded-lg border-[#ff5c35] text-[#ff5c35] hover:bg-[#ff5c35] hover:text-white transition"
                    >
                        <i className="fas fa-file-alt text-x"></i>
                        <span>Create Template</span>
                    </button>
                    {/* </Tooltip> */}
                </div>
            </div>

            <div className="flex justify-between gap-6 w-full g-box">
                <div className="rounded-2xl w-full">
                    <div className="p-5 g-box g-box-table">
                        <div className="d-table h-connect-table !w-full ">
                            <div className="overflow-hidden border rounded-lg border-[#e0eaf3]">
                                <div className="overflow-y-auto max-h-[495px] rounded-lg w-full h-full">
                                    <table className="w-full overflow-auto border rounded-lg border-[#e0eaf3]">
                                        <thead className="sticky top-0 !bg-[#fbf7f8]">
                                            <tr
                                                className=""
                                            >
                                                <th className="font-semibold text-[14px] px-4 py-3 text-left w-[15%]">
                                                    Name
                                                </th>
                                                <th className="font-semibold text-[14px] px-4 py-3 text-left w-[75%]">
                                                    Messgae
                                                </th>
                                                <th className="font-semibold text-[14px] px-4 py-3 text-left w-[10%]">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {filteredTemplate.length > 0 ? (
                                                filteredTemplate.slice().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((template, index) => (
                                                    <tr
                                                        key={index}
                                                        className="py-4 px-4 odd:bg-[#fff] even:bg-[#fff5f380]"
                                                    >
                                                        {/* Name */}
                                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                            {template.name || "N/A"}
                                                        </td>

                                                        {/* message */}
                                                        <td className="px-4 py-3 text-sm text-gray-700">
                                                            {template.message || "N/A"}
                                                        </td>

                                                        {/* Actions */}
                                                        <td className="px-4 py-3 text-sm text-gray-700">
                                                            <div className="flex items-center gap-2">
                                                                {/* Edit */}
                                                                <button
                                                                    onClick={() => handleEditTemplate(template)}
                                                                    className="flex items-center justify-center w-8 h-8 rounded-full text-[#ff5c35] bg-[#fee2e2] hover:bg-[#ff5c35] hover:text-white transition"
                                                                    title="Edit Template"
                                                                >
                                                                    <i className="fa-solid fa-edit"></i>
                                                                </button>

                                                                {/* Delete */}
                                                                <button
                                                                    onClick={() => deleteTemplate(template.id)}
                                                                    className="flex items-center justify-center w-8 h-8 rounded-full text-[#dc2626] bg-[#fee2e2] hover:bg-[#dc2626] hover:text-white transition"
                                                                    title="Delete Template"
                                                                >
                                                                    <i className="fa-solid fa-trash"></i>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={7}>
                                                        <div className="flex flex-col items-center text-center py-12 h-[445px] max-h-[500px] justify-center">
                                                            <div className="w-20 h-20 rounded-full bg-[#ff5c350f] flex items-center justify-center mb-2">
                                                                <IoDocumentTextSharp className="w-8 h-8 text-[#ff5c35]" />
                                                            </div>

                                                            {/* Title */}
                                                            <div className="text-lg font-medium text-[#64748b] mb-2">
                                                                {searchTerm
                                                                    ? "No templates found matching your search"
                                                                    : "No templates available"}
                                                            </div>

                                                            {/* Subtitle */}
                                                            <div className="text-sm text-[#92a0b5] max-w-md">
                                                                {searchTerm
                                                                    ? "Try adjusting your search keywords or filters to find the right templates."
                                                                    : "Create a new templates to get started and manage your activities here."}
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <TemplateModal
                    isOpen={isModalOpen}
                    closeModalPoupBox={() => setIsModalOpen(false)}
                    onTemplateCreated={handleCampaignCreated}
                    editableTemplate={editableTemplate}
                />
            )}
        </div>
    );
};

export default MessageTamplateTable;