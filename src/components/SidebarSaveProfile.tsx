import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MdKeyboardArrowDown } from "react-icons/md";
import { apiService } from "../common/config/apiService";

// Group type
interface Group {
    id: number;
    name: string;
}

// Workspace type
interface Workspace {
    id: number;
    name: string;
    groups: Group[];
    isDefault: boolean;
}

// API response types
interface WorkspaceAPIResponse {
    id: number;
    name: string;
    groups: { id: number; name: string }[];
}

interface APIResponse<T = any> {
    data: {
        success: boolean;
        data: T;
    };
}

const SidebarSaveProfile = () => {
    const location = useLocation();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [addingWorkspace, setAddingWorkspace] = useState(false);
    const [newWorkspaceName, setNewWorkspaceName] = useState("");

    const [addingGroupId, setAddingGroupId] = useState<number | null>(null);
    const [newGroupNames, setNewGroupNames] = useState<Record<number, string>>({});
    const [expandedWorkspaceId, setExpandedWorkspaceId] = useState<number | null>(null);

    // Helper to build route with IDs
    const workspaceGroupPath = (workspaceId: number, groupId: number) =>
        `/workspace/${workspaceId}/group/${groupId}`;

    // Fetch all workspaces from API
    const getAllData = async () => {
        try {
            await apiService.commonAPIRequest(
                apiService.EndPoint.getAllDataOfWorkspace,
                apiService.Method.get,
                undefined,
                {},
                (response: APIResponse<WorkspaceAPIResponse[]>) => {
                    if (response?.data?.success && Array.isArray(response.data.data)) {
                        const transformed: Workspace[] = response.data.data.map((ws, idx) => ({
                            id: ws.id,
                            name: ws.name,
                            groups: ws.groups.map((g) => ({ id: g.id, name: g.name })),
                            isDefault: idx === 0,
                        }));
                        setWorkspaces(transformed);
                    }
                }
            );
        } catch (error) {
            console.error("Error fetching workspaces:", error);
        }
    };

    useEffect(() => {
        getAllData();
    }, []);

    // Add workspace API
    const addWorkspaceAPI = async (name: string) => {
        try {
            await apiService.commonAPIRequest(
                apiService.EndPoint.addWorkspace,
                apiService.Method.post,
                undefined,
                { name },
                (response: APIResponse<WorkspaceAPIResponse>) => {
                    if (response?.data?.success) {
                        const newWs = response.data.data;
                        setWorkspaces((prev) => [
                            ...prev,
                            { id: newWs.id, name: newWs.name, groups: [], isDefault: false },
                        ]);
                        setAddingWorkspace(false);
                        setNewWorkspaceName("");
                    }
                }
            );
        } catch (error) {
            console.error("Error adding workspace:", error);
        }
    };

    // Add group API
    const addGroupAPI = async (workspaceId: number, groupName: string) => {
        try {
            await apiService.commonAPIRequest(
                apiService.EndPoint.addGroup,
                apiService.Method.post,
                undefined,
                { name: groupName, workspaceId },
                (response: APIResponse<{ id: number; name: string }>) => {
                    if (response?.data?.success) {
                        const newGroup = response.data.data;
                        setWorkspaces((prev) =>
                            prev.map((ws) =>
                                ws.id === workspaceId ? { ...ws, groups: [...ws.groups, newGroup] } : ws
                            )
                        );
                        setAddingGroupId(null);
                        setNewGroupNames((prev) => ({ ...prev, [workspaceId]: "" }));
                    }
                }
            );
        } catch (error) {
            console.error("Error adding group:", error);
        }
    };

    const handleAddWorkspace = () => {
        if (newWorkspaceName.trim() && workspaces.length < 5) {
            addWorkspaceAPI(newWorkspaceName.trim());
        }
    };

    const handleAddGroup = (workspaceId: number) => {
        const newName = newGroupNames[workspaceId]?.trim();
        const workspace = workspaces.find((ws) => ws.id === workspaceId);
        if (newName && workspace && workspace.groups.length < 5) {
            addGroupAPI(workspaceId, newName);
        }
    };

    return (
        <li>
            {/* Main Save Profile Button */}
            <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`flex items-start gap-3 rounded-xl px-[16px] py-[7px] w-full hover:!bg-[#ff5c350f] transition-all duration-200 ${isProfileOpen ? "text-[#ff5c35] shadow-sm !bg-[#ff5c350f]" : "text-[#334155] hover:text-[#ff5c35]"
                    }`}
            >
                <span className="mt-1 flex w-[20px] justify-center">
                    <i className="fa-solid fa-user-plus text-sm"></i>
                </span>
                <div className="flex flex-col flex-1 text-left">
                    <span className="font-medium text-sm">Save Profile</span>
                    <span className="text-xs text-[#6b7280]">AI-powered LinkedIn</span>
                </div>
                <MdKeyboardArrowDown
                    className={`transition-transform duration-300 ml-auto ${isProfileOpen ? "rotate-180" : "rotate-0"}`}
                    size={22}
                />
            </button>

            {/* Submenu */}
            {isProfileOpen && (
                <ul className="pl-8 mt-1 space-y-3">
                    {workspaces.map((ws) => (
                        <li key={ws.id}>
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <span className="mt-1 flex w-[20px] justify-center">
                                        <i className="fa-solid fa-briefcase text-sm"></i>
                                    </span>
                                    <div className="flex flex-col flex-1 text-left">
                                        <span className="font-medium text-sm">{ws.name}</span>
                                        <span className="text-xs text-[#6b7280]">Manage your Groups</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() =>
                                        setExpandedWorkspaceId(expandedWorkspaceId === ws.id ? null : ws.id)
                                    }
                                    className="ml-2 text-gray-400"
                                >
                                    <MdKeyboardArrowDown
                                        className={`transition-transform duration-300 ${expandedWorkspaceId === ws.id ? "rotate-180" : "rotate-0"
                                            }`}
                                        size={18}
                                    />
                                </button>
                            </div>

                            {expandedWorkspaceId === ws.id && (
                                <ul className="pl-4 space-y-1">
                                    {ws.groups.map((group) => (
                                        <li key={group.id}>
                                            <Link
                                                to={workspaceGroupPath(ws.id, group.id)}
                                                className={`flex items-start gap-2 rounded-xl px-1 py-1 transition-all duration-200 ${location.pathname === workspaceGroupPath(ws.id, group.id)
                                                        ? "text-[#ff5c35] shadow-sm !bg-[#ff5c350f]"
                                                        : "text-[#334155] hover:text-[#ff5c35]"
                                                    }`}
                                            >
                                                <span className="mt-[6px] flex w-[10px] justify-center">
                                                    <i className="fas fa-circle text-[6px]"></i>
                                                </span>
                                                <span className="font-medium text-sm">{group.name}</span>
                                            </Link>
                                        </li>
                                    ))}

                                    {addingGroupId === ws.id && ws.groups.length < 5 && (
                                        <li className="flex items-center gap-1 mt-1">
                                            <input
                                                type="text"
                                                value={newGroupNames[ws.id] || ""}
                                                onChange={(e) =>
                                                    setNewGroupNames({ ...newGroupNames, [ws.id]: e.target.value })
                                                }
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        handleAddGroup(ws.id);
                                                    }
                                                }}
                                                placeholder="New group"
                                                className="block w-full rounded-md border-[#d1d5db] shadow-sm focus:ring-[#ff5c35] focus:border-[#ff5c35] py-0.5 px-1"
                                            />
                                            <button
                                                onClick={() => handleAddGroup(ws.id)}
                                                className="text-[#ff5c35] text-sm border px-2 rounded"
                                            >
                                                <i className="fa-solid fa-check"></i>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setAddingGroupId(null);
                                                    setNewGroupNames({ ...newGroupNames, [ws.id]: "" });
                                                }}
                                                className="text-[#ff5c35] text-sm border px-2 rounded"
                                            >
                                                ✖
                                            </button>
                                        </li>
                                    )}

                                    {ws.groups.length < 5 && addingGroupId !== ws.id && (
                                        <li>
                                            <button
                                                onClick={() => setAddingGroupId(ws.id)}
                                                className="text-[#ff5c35] text-sm border px-2 rounded mt-1"
                                            >
                                                + Group
                                            </button>
                                        </li>
                                    )}
                                </ul>
                            )}
                        </li>
                    ))}

                    {workspaces.length < 5 && (
                        <li>
                            {!addingWorkspace ? (
                                <button
                                    onClick={() => setAddingWorkspace(true)}
                                    className="text-[#ff5c35] text-sm border px-2 rounded"
                                >
                                    + Workspace
                                </button>
                            ) : (
                                <div className="flex items-center gap-2 mt-1">
                                    <input
                                        type="text"
                                        value={newWorkspaceName}
                                        onChange={(e) => setNewWorkspaceName(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                handleAddWorkspace();
                                            }
                                        }}
                                        placeholder="New workspace"
                                        className="block w-full rounded-md border-[#d1d5db] shadow-sm focus:ring-[#ff5c35] focus:border-[#ff5c35] py-0.5 px-1"
                                    />
                                    <button
                                        onClick={handleAddWorkspace}
                                        className="text-[#ff5c35] text-sm border px-2 rounded"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => {
                                            setAddingWorkspace(false);
                                            setNewWorkspaceName("");
                                        }}
                                        className="text-gray-500 text-sm"
                                    >
                                        ✖
                                    </button>
                                </div>
                            )}
                        </li>
                    )}
                </ul>
            )}
        </li>
    );
};

export default SidebarSaveProfile;
