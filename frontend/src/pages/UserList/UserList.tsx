import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiInfo } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { User } from "../../shared/Interfaces/Interfaces";
import Modal from "react-modal";
import DeleteModal from "../../shared/components/DeleteModal/DeleteModal";
import useRedirectBasedOnAuthentication from "../../hooks/useRedirectBasedOnAuthentication";
import { toast } from "react-toastify";

//TODO: BORRADO EN CASCADA DE USUARIOS, ERROR AL BORRAR UN USUARIO QUE ESTA ASIGNADO A UNA ZONA

const UserList: React.FC = () => {
  const [loadedUsers, setLoadedUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useRedirectBasedOnAuthentication("authenticated");

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("http://localhost:8007/user?withDepartments=true")
      .then((response) => {
        setLoadedUsers(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        toast.error("Error loading users");
        setIsLoading(false);
      });
  }, []);

  Modal.setAppElement("#root");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleDeleteUser = () => {
    const deleteUser = async () => {
      try {
        await axios.delete(`http://localhost:8007/user/${selectedUserId}`);
        setLoadedUsers((prevUsers) =>
          prevUsers.filter((user) => user.id !== selectedUserId)
        );
      } catch (error) {
        toast.error("Error deleting user");
      }
    };
    deleteUser();
    setSelectedUserId(null);
  };

  return (
    <div className="min-w-screen min-h-screen flex items-center justify-center bg-gray-100 font-sans overflow-hidden">
      <div className="w-full lg:w-5/6">
        <div className="bg-white shadow-md rounded my-6">
          <table className="min-w-max w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-center ">Phone</th>
                <th className="py-3 px-6 text-center">Departament</th>
                <th className="py-3 px-6 text-center">Role</th>
                <th className="py-3 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {loadedUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-200 bg-gray-50 hover:bg-gray-100"
                >
                  <th className="flex gap-3 px-6 py-4 font-normal text-gray-900">
                    <div className="relative h-10 w-10">
                      <img
                        className="h-full w-full rounded-full object-cover object-center"
                        src={user.picture}
                      />
                      <span className="absolute right-0 bottom-0 h-2 w-2 rounded-full bg-green-400 ring ring-white"></span>
                    </div>
                    <div className="text-sm text-left">
                      <div className="font-medium text-gray-700">
                        {user.name} {user.surname}
                      </div>
                      <div className="text-start text-gray-400">{user.email}</div>
                    </div>
                  </th>
                  <td className="py-3 px-6 text-center">
                    {user.phone ? (
                      <div className="font-medium text-gray-700">
                        {user.phone}
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-600">
                        
                        Without phone
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-6 text-center">
                    {user.Department?.name ? (
                      <div className="font-medium text-gray-700">
                        {user.Department.name}
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-600">
                        Without department
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-6 text-center">
                    {user.role ? (
                      <div className="font-medium text-gray-700">
                        {user.role}
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-600">
                        Without role
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-medium">
                    <div className="flex items-center justify-center space-x-2">
                      {" "}
                      {/* Agregada la clase "justify-center" */}
                      <Link
                        to={`/user/${user.id}`}
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
                        onClick={() => setSelectedUserId(user.id)}
                        className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110"
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
                      <DeleteModal
                        isOpen={Boolean(selectedUserId)}
                        onRequestClose={() => setSelectedUserId(null)}
                        onDelete={handleDeleteUser}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>

  );
};

export default UserList;
