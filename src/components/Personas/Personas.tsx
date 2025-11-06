import { LuUser } from "react-icons/lu";
import { useEffect, useState } from "react";
import { FaUser, FaIdCard, FaEdit } from "react-icons/fa";
import PersonasFormModal from "./PersonasFormModal";
import { apiService } from "../../common/config/apiService";
import Swal from "sweetalert2";
import Loader from "../Loader/Loader";
import { GrOrganization } from "react-icons/gr";
import { GoOrganization } from "react-icons/go";
import { ImCheckboxChecked, ImCheckboxUnchecked } from "react-icons/im";
import { BsShieldCheck } from "react-icons/bs";

const Personas = () => {
  const [personasData, setPersonasData] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  // const [updatingId, setUpdatingId] = useState<number | null>(null);
  useEffect(() => {
    fetchPersonas();
  }, []);

  const fetchPersonas = async () => {
    setLoading(true);
    try {
      await apiService.commonAPIRequest(
        apiService.EndPoint.getAllpersonas,
        apiService.Method.get,
        undefined,
        {},
        (response: any) => {
          if (response?.status === 200 && response.data.data) {
            setPersonasData(response.data.data || []);
          }
        }
      );
    } catch (err) {
      console.error("Error fetching personas:", err);
      Swal.fire({
        title: "Error!",
        text: "An unexpected error occurred while fetching personas.",
        icon: "error",
        confirmButtonColor: "#ff5c35",
      });
    } finally {
      setLoading(false);
    }
  };

  // Set as default function with confirmation
  const handleSetDefault = (personaId: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to set this persona as your default?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff5c35",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, set as default!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        // setUpdatingId(personaId);
        const payload = {
          isdefault: true
        };

        try {
          const endpoint = apiService.EndPoint.updatepersonas.replace(':id', personaId.toString());

          await apiService.commonAPIRequest(
            endpoint,
            apiService.Method.patch,
            undefined,
            payload,
            (response: any) => {
              if (response?.status === 200 && response?.data?.success) {
                Swal.fire({
                  title: "Success!",
                  text: "Default persona updated successfully.",
                  icon: "success",
                  confirmButtonColor: "#ff5c35",
                });
                fetchPersonas();
              } else {
                Swal.fire({
                  title: "Error!",
                  text: response?.data?.message || "Failed to set default.",
                  icon: "error",
                  confirmButtonColor: "#ff5c35",
                });
              }
            }
          );
        } catch (err) {
          console.error("Error setting default:", err);
          Swal.fire({
            title: "Error!",
            text: "Something went wrong.",
            icon: "error",
            confirmButtonColor: "#ff5c35",
          });
        }
      }
    });
  };


  //  Delete persona
  const handleDelete = async (personaId: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff5c35",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const endpoint = apiService.EndPoint.deletepersonas.replace(':id', personaId.toString());

          await apiService.commonAPIRequest(
            endpoint,
            apiService.Method.delete,
            undefined,
            {},
            (response: any) => {
              if (response?.status === 200 && response?.data?.success) {
                Swal.fire({
                  title: "Deleted!",
                  text: "Persona deleted successfully.",
                  icon: "success",
                  confirmButtonColor: "#ff5c35",
                });
                fetchPersonas();
              } else {
                Swal.fire("Error", "Failed to delete persona.", "error");
              }
            }
          );
        } catch (err) {
          Swal.fire("Error", "Something went wrong.", "error");
        }
      }
    });
  };

  const handleEditClick = (persona: any) => {
    setSelectedPersona(persona);
    setIsModalOpen(true);
  };

  return (
    <div className="c-padding-r py-[24px] relative pl-[320px] pr-[24px]">
      {/* Header */}
      <div className="flex items-center justify-between bg-white z-10 mb-4 g-box p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#ff5c35] rounded-2xl flex items-center justify-center">
            <LuUser className="w-6 h-6 text-white" />
          </div>

          <div className="flex flex-col">
            <div className="text-2xl font-bold text-slate-900">My Personas</div>
            <div className="text-sm text-[#717c8c]">
              Define your communication styles for consistent AI-powered interactions
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-slate-600">
                {personasData.length} profiles saved
              </span>
            </div>
          </div>
        </div>

        {/* Add Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 border px-4 py-2 text-sm font-medium rounded-lg border-[#ff5c35] text-white bg-[#ff5c35] hover:text-[#ff5c35] hover:bg-white transition"
        >
          <i className="fa-solid fa-globe"></i>
          <span>+ Add new Personas</span>
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="text-center py-12">
          <Loader />
        </div>
      ) : personasData.length === 0 ? (
        <div className="flex items-center justify-center w-[100%] max-h-[100vh] h-[75vh]">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#ff5c350f] rounded-full flex items-center justify-center mx-auto mb-4">
              <LuUser className="w-8 h-8 text-[#ff5c35]" />
            </div>
            <p className="font-medium text-[#64748b] !text-xl mb-2">
              No personas available yet
            </p>
            <div className="!text-base text-[#94a3b8]">
              Fill out the form and click "Add new Personas" to get started
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {personasData.map((persona: any, index: any) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-xl p-6 flex flex-col gap-4 hover:shadow-lg transition"
            >
              {/* Header */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="bg-[#ff5c350f] p-2 rounded-lg">
                    <FaUser className="text-[#ff5c35]" />
                  </div>
                  <div className="font-semibold text-base">
                    {persona?.personas_name || "Untitled Persona"}
                  </div>

                  {/* Default Toggle */}
                  <div className="flex">
                    <span
                      className="cursor-pointer transition"
                      onClick={() => !persona.isdefault && handleSetDefault(persona.id)}
                    >
                      {persona.isdefault ? (
                        <div className="flex items-center gap-2">
                          <ImCheckboxChecked className="text-green" />
                          {/* <div className="text-xs flex font-semibold gap-1.5">
                            This is your default persona
                          </div>  */}
                          <div className="border rounded-full p-1 font-bold bg-[#ff5c350f] border-[#ff5c350f] text-[#ff5c35]">
                            <div className="flex gap-2">
                              <span className="mt-[2px] ps-1"><BsShieldCheck /></span>
                              <span className="pe-2">Default</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <ImCheckboxUnchecked className="text-[#ff5c35]" />
                      )}
                    </span>
                  </div>
                </div>
                {/* --- Actions (Default + Delete) ---  */}
                <div className="flex items-center gap-3 text-base text-[#ff5c35]">
                  {/* edit  */}
                  <span
                    className="cursor-pointer transition"
                    onClick={() => handleEditClick(persona)}
                  >
                    <FaEdit className="text-[#ff5c35]" />
                  </span>
                  {/* Delete */}
                  <span
                    className="cursor-pointer transition"
                    onClick={() => handleDelete(persona.id)}
                  >
                    <i className="fa-solid fa-trash text-[#ff5c35]"></i>
                  </span>
                </div>
              </div>

              {/* Subtitle */}
              <div className="text-sm ">
                <div className="flex items-center gap-2">
                  <span className="text-[#6b7280]"> {persona?.personas_bio || "No description available"}</span>
                </div>
              </div>

              {/* Attributes */}
              <div className="flex flex-col gap-2 text-sm mt-auto">
                <div className="flex items-center gap-2">
                  <FaIdCard className="text-[#ff5c35]" />
                  <span className="font-medium">Job Title:</span>
                  <span className="px-2 py-0.5 rounded-full text-[13px] text-[#6b7280]">
                    {persona?.jobTitle || "—"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <GoOrganization className="text-[#ff5c35]" />
                  <span className="font-medium">Company:</span>
                  <span className="px-2 py-0.5 rounded-full text-[13px] text-[#6b7280]">
                    {persona?.company || "—"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <GrOrganization className="text-[#ff5c35]" />
                  <span className="font-medium">Industry:</span>
                  <span className="px-2 py-0.5 rounded-full text-[13px] text-[#6b7280]">
                    {persona?.industry || "—"}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <PersonasFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPersona(null);
        }}
        onSuccess={fetchPersonas}
        selectedPersona={selectedPersona}
      />
    </div>
  );
};

export default Personas;
