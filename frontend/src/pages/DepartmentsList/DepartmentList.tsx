// Pagina que renderiza la lista de departamentos
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Department } from "../../shared/Interfaces/Interfaces";
import { FaUserSlash } from "react-icons/fa";
import useRedirectBasedOnAuthentication from "../../hooks/useRedirectBasedOnAuthentication";
import { toast } from "react-toastify";
import DeleteModal from "../../shared/components/DeleteModal/DeleteModal";

const DepartamentList: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteZoneId, setDeleteZoneId] = useState<string>("");

  // Redirecciona a la página de usuarios si no se está autenticado
  useRedirectBasedOnAuthentication("authenticated");

  // Obtiene los departamentos de la API
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/department?withUsers=true`)
      .then((response) => {
        setDepartments(response.data);
      });
  }, []);

  // Función que se ejecuta cuando se hace click en el botón de eliminar departamento
  const handleDelete = async () => {
    try {
      // Se realiza la petición al backend para eliminar el departamento de la base de datos
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/department/${deleteZoneId}`
      );
      // Se actualiza el estado de los departamentos
      setDepartments((prevDepartments) =>
        prevDepartments.filter((depart) => depart.id !== deleteZoneId)
      );
      // Se cierra el modal
      setDeleteModalOpen(false);
      toast.success("Department deleted successfully");
    } catch (error) {
      toast.error("Error deleting department");
    }
  };

  return (
    <div>
      <div className="">
        <div className="min-w-screen min-h-screen flex items-center justify-center bg-gray-100 font-sans overflow-hidden">
          <div className="w-full lg:w-5/6">
            <Link to={"/department/add"}>
              <div className="flex justify-end">
                <button className="group rounded h-9 w-36 bg-orange-500  font-bold text-base text-white relative overflow-hidden">
                  Add Department
                  <div className="absolute duration-300 inset-0 w-full h-full transition-all scale-0 group-hover:scale-100 group-hover:bg-white/30 rounded"></div>
                </button>
              </div>
            </Link>
            <div className="bg-white shadow-md rounded my-6">
              <table className="min-w-max w-full table-auto">
                <thead>
                  <tr className="bg-orange-400 bg-opacity-70 text-gray-700 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-center">Department</th>
                    <th className="py-3 px-6 text-center">Description</th>
                    <th className="py-3 px-6 text-center">Users</th>
                    <th className="py-3 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                  {departments.map((depart) => (
                    <tr
                      key={depart.id}
                      className="border-b border-gray-200 bg-gray-50 hover:bg-gray-100 text-center"
                    >
                      <td className="py-3 px-6 text-center">
                        <div className="flex items-center">
                          <div className="mr-2">
                            <img
                              className="w-6 h-6"
                              src="https://cdn-icons-png.flaticon.com/512/1570/1570970.png"
                            />
                          </div>
                          <span className="font-medium">{depart.name}</span>
                        </div>
                      </td>

                      <td className="py-3 px-6 text-center">
                        <span className="font-medium">
                          {depart.description}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-center">
                        {depart.User.length === 0 ? (
                          <div className="flex items-center justify-center">
                            <FaUserSlash />
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            {depart.User.map((user, index) => (
                              <div
                                key={user.id}
                                className={`relative ${
                                  index !== 0 ? "-left-1" : ""
                                }`}
                              >
                                <Link
                                  to={`/user/${user.id}`}
                                  className=" text-gray-700 hover:text-indigo-900"
                                >
                                  <img
                                    src={user.picture}
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
                            to={`/department/${depart.id}`}
                            className="w-4 mr-2 transform hover:text-orange-500 hover:scale-110"
                          >
                            <div className="w-4 mr-2 transform hover:text-orange-500 hover:scale-110">
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
                          
                          <div className="w-4 mr-2 transform hover:text-orange-500 hover:scale-110" onClick={()=>{
                            setDeleteModalOpen(true);
                            setDeleteZoneId(depart.id);
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

export default DepartamentList;
