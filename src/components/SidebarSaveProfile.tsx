import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MdKeyboardArrowDown } from "react-icons/md";

// Define Workspace type
interface Workspace {
    name: string;
    groups: string[];
    isDefault: boolean;
}

const SidebarSaveProfile = () => {
    const location = useLocation();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Workspaces state
    const [workspaces, setWorkspaces] = useState<Workspace[]>([
        { name: "My Workspace", groups: ["My Group"], isDefault: true },
    ]);

    const [addingWorkspace, setAddingWorkspace] = useState(false);
    const [newWorkspaceName, setNewWorkspaceName] = useState("");

    // Track which workspace is adding a group
    const [addingGroupIndex, setAddingGroupIndex] = useState<number | null>(
        null
    );

    // Track new group names per workspace
    const [newGroupNames, setNewGroupNames] = useState<Record<number, string>>(
        {}
    );

    const [expandedWorkspace, setExpandedWorkspace] = useState<number | null>(0); // default workspace expanded

    // Add new workspace
    const handleAddWorkspace = () => {
        if (newWorkspaceName.trim() && workspaces.length < 5) {
            setWorkspaces([
                ...workspaces,
                { name: newWorkspaceName.trim(), groups: [], isDefault: false },
            ]);
            setNewWorkspaceName("");
            setAddingWorkspace(false);
        }
    };

    // Add new group under specific workspace
    const handleAddGroup = (index: number) => {
        const newName = newGroupNames[index]?.trim();
        if (newName && workspaces[index].groups.length < 5) {
            const updated = [...workspaces];
            updated[index].groups.push(newName);
            setWorkspaces(updated);

            // Reset input for this workspace
            setNewGroupNames({ ...newGroupNames, [index]: "" });
            setAddingGroupIndex(null);
        }
    };

    return (
        <li>
            {/* Main Save Profile Button */}
            <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`flex items-start gap-3 rounded-xl px-[16px] py-[7px] w-full hover:!bg-[#ff5c350f] transition-all duration-200 ${isProfileOpen
                    ? "text-[#ff5c35] shadow-sm !bg-[#ff5c350f]"
                    : "text-[#334155] hover:text-[#ff5c35]"
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
                    className={`transition-transform duration-300 ${isProfileOpen ? "rotate-180" : "rotate-0"
                        }`}
                    size={22}
                />
            </button>

            {/* Submenu */}
            {isProfileOpen && (
                <ul className="pl-8 mt-1 space-y-3">
                    {workspaces.map((ws, idx) => (
                        <li key={idx}>
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <span className="mt-1 flex w-[20px] justify-center">
                                        <i className="fa-solid fa-briefcase text-sm"></i>
                                    </span>
                                    <div className="flex flex-col flex-1 text-left">
                                        <span className="font-medium text-sm">{ws.name}</span>
                                        <span className="text-xs text-[#6b7280]">Manage you Groups</span>
                                    </div>
                                </div>

                                {/* Add Group button if under 5 groups */}
                                {ws.groups.length < 5 && (
                                    <button
                                        onClick={() => {
                                            setAddingGroupIndex(idx); // Start adding group for this workspace
                                            setExpandedWorkspace(idx); // Automatically expand this workspace
                                        }}
                                        className="text-[#ff5c35] text-sm border px-2 rounded"
                                    >
                                        +
                                    </button>
                                )}

                                {/* Expand/collapse button */}
                                <button
                                    onClick={() =>
                                        setExpandedWorkspace(
                                            expandedWorkspace === idx ? null : idx
                                        )
                                    }
                                    className="ml-2 text-gray-400"
                                >
                                    <MdKeyboardArrowDown
                                        className={`transition-transform duration-300 ${expandedWorkspace === idx ? "rotate-180" : "rotate-0"
                                            }`}
                                        size={18}
                                    />
                                </button>
                            </div>

                            {/* Groups */}
                            {expandedWorkspace === idx && (
                                <ul className="pl-4 space-y-1">
                                    {ws.groups.map((group, gIdx) => (
                                        <li key={gIdx}>
                                            <Link
                                                to={`/workspace/${ws.name
                                                    .toLowerCase()
                                                    .replace(/\s+/g, "-")}/group/${group
                                                        .toLowerCase()
                                                        .replace(/\s+/g, "-")}`}
                                                className={`flex items-start gap-2 rounded-xl px-1 py-1 transition-all duration-200 ${location.pathname ===
                                                    `/workspace/${ws.name
                                                        .toLowerCase()
                                                        .replace(/\s+/g, "-")}/group/${group
                                                            .toLowerCase()
                                                            .replace(/\s+/g, "-")}`
                                                    ? "text-[#ff5c35] shadow-sm !bg-[#ff5c350f]"
                                                    : "text-[#334155] hover:text-[#ff5c35]"
                                                    }`}
                                            >
                                                <span className="mt-[6px] flex w-[10px] justify-center">
                                                    <i className="fas fa-circle text-[6px]"></i>
                                                </span>
                                                <span className="font-medium text-sm">{group}</span>
                                            </Link>
                                        </li>
                                    ))}

                                    {/* Inline add group */}
                                    {addingGroupIndex === idx && ws.groups.length < 5 && (
                                        <li className="flex items-center gap-2 mt-1">
                                            <input
                                                type="text"
                                                value={newGroupNames[idx] || ""}
                                                onChange={(e) =>
                                                    setNewGroupNames({
                                                        ...newGroupNames,
                                                        [idx]: e.target.value,
                                                    })
                                                }
                                                placeholder="New group"
                                                className=" block w-full rounded-md border-[#d1d5db] shadow-sm focus:ring-[#ff5c35] focus:border-[#ff5c35] py-0.5 px-1"
                                            />
                                            <button
                                                onClick={() => handleAddGroup(idx)}
                                                className="text-[#ff5c35] text-sm border px-2 rounded"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setAddingGroupIndex(null);
                                                    setNewGroupNames({ ...newGroupNames, [idx]: "" });
                                                }}
                                                className="text-gray-500 text-sm"
                                            >
                                                ✖
                                            </button>
                                        </li>
                                    )}
                                </ul>
                            )}
                        </li>
                    ))}

                    {/* Add workspace */}
                    {workspaces.length < 5 && (
                        <li>
                            {!addingWorkspace ? (
                                <button
                                    onClick={() => { setAddingWorkspace(true) }}
                                    className="text-[#ff5c35] text-sm border px-2 rounded "
                                >
                                    + Workspace
                                </button>
                            ) : (
                                <div className="flex items-center gap-2 mt-1">
                                    <input
                                        type="text"
                                        value={newWorkspaceName}
                                        onChange={(e) => setNewWorkspaceName(e.target.value)}
                                        placeholder="New workspace"
                                        className=" block w-full rounded-md border-[#d1d5db] shadow-sm focus:ring-[#ff5c35] focus:border-[#ff5c35] py-0.5 px-1"
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