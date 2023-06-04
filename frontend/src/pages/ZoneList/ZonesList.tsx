import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Zone } from "../../shared/Interfaces/Interfaces";
import { FaUserSlash } from "react-icons/fa";
import DeleteModal from "../../shared/components/DeleteModal/DeleteModal";
import { toast } from "react-toastify";
import useRedirectBasedOnAuthentication from "../../hooks/useRedirectBasedOnAuthentication";

const ZonesList: React.FC = () => {
  const [zonas, setZonas] = useState<Zone[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteZoneId, setDeleteZoneId] = useState<string>("");

  useRedirectBasedOnAuthentication("authenticated");

  useEffect(() => {
    const fetchZonas = async () => {
      try {
        const response = await axios.get("http://localhost:8007/zone?withUsers=true"); // Ruta del endpoint para obtener las zonas con usuarios asignados
        setZonas(response.data);
      } catch (error) {
        toast.error("Error fetching zones");
      }
    };

    fetchZonas();
  }, []);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8007/zone/${deleteZoneId}`);
      setZonas((prevZonas) =>
        prevZonas.filter((zona) => zona.id !== deleteZoneId)
      );
      setDeleteModalOpen(false);
      toast.success("Zone deleted successfully");
    } catch (error) {
      toast.error("Error deleting zone");
    }
  };

  return (
    <div>
      <div className="">
        <div className="min-w-screen min-h-screen flex items-center justify-center bg-gray-100 font-sans overflow-hidden">
          <div className="w-full lg:w-5/6">
            <Link to={"/zone/add"}>
              <div className="flex justify-end">
                <button className="group rounded h-9 w-36 bg-blue-500 font-bold text-base text-white relative overflow-hidden">
                  Add Zone
                  <div className="absolute duration-300 inset-0 w-full h-full transition-all scale-0 group-hover:scale-100 group-hover:bg-white/30 rounded"></div>
                </button>
              </div>
            </Link>
            <div className="bg-white shadow-md rounded my-6">
              <table className="min-w-max w-full table-auto">
                <thead>
                  <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-center">Zone</th>
                    <th className="py-3 px-6 text-center">Location</th>
                    <th className="py-3 px-6 text-center">Description</th>
                    <th className="py-3 px-6 text-center">Users</th>
                    <th className="py-3 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                  {zonas.map((zona) => (
                    <tr
                      key={zona.id}
                      className="border-b border-gray-200 bg-gray-50 hover:bg-gray-100"
                    >
                      <td className="py-3 px-6 text-center">
                        <div className="flex items-center">
                          <div className="mr-2">
                            <img
                              className="w-6 h-6"
                              src="https://cdn-icons-png.flaticon.com/512/2536/2536611.png"
                            />
                          </div>
                          <span className="font-medium">{zona.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-6 text-center">
                        <span className="font-medium">{zona.location}</span>
                      </td>
                      <td className="py-3 px-6 text-center">
                        <span className="font-medium">{zona.description}</span>
                      </td>
                      <td className="py-3 px-6 text-center">
                        {zona.UserToZone.length === 0 ? (
                          <div className="flex items-center justify-center">
                            <FaUserSlash />
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            {zona.UserToZone.map((userToZone, index) => (
                              <div
                                key={userToZone.id}
                                className={`relative ${
                                  index !== 0 ? "-left-1" : ""
                                }`}
                              >
                                <Link
                                  to={`/user/${userToZone.User.id}`}
                                  className=" text-gray-700 hover:text-indigo-900"
                                >
                                  <img
                                    src={userToZone.User.picture}
                                    alt={`User ${index}`}
                                    className="w-6 h-6 rounded-full border-gray-200 border transform hover:scale-125"
                                  />
                                </Link>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-6 text-center">
                        <div className="flex item-center justify-center">
                          <Link
                            to={`/zone/${zona.id}`}
                            className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110"
                          >
                            <div className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                />
                              </svg>
                            </div>
                          </Link>
                          <div
                            className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110"
                            onClick={() => {
                              setDeleteModalOpen(true);
                              setDeleteZoneId(zona.id);
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <DeleteModal
          isOpen={deleteModalOpen}
          onRequestClose={() => setDeleteModalOpen(false)}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default ZonesList;
