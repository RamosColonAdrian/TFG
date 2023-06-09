import { useState, useEffect } from "react";
import axios from "axios";
import { Department, User, Zone } from "../../shared/Interfaces/Interfaces";
import { Link, useParams } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "react-toastify";
import DeleteModal from "../../shared/components/DeleteModal/DeleteModal";
import useRedirectBasedOnAuthentication from "../../hooks/useRedirectBasedOnAuthentication";

type Props = {};

const DepartamentDetails = (props: Props) => {
  const { departId } = useParams();
  const [depart, setDepart] = useState<Department>();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDeleteId, setUserToDeleteId] = useState("");

  useRedirectBasedOnAuthentication("authenticated");

  const openDeleteModal = (userId: string) => {
    setIsDeleteModalOpen(true);
    setUserToDeleteId(userId);
  };

  useEffect(() => {
    const fetchZone = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/department/${departId}`
        );
        setDepart(response.data);
      } catch (error) {
        toast.error("Error fetching department");
      }
    };
    fetchZone();
  }, [departId]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/user`
        );
        setUsers(response.data);
      } catch (error) {
        toast.error("Error fetching department");
      }
    };
    fetchUsers();
  }, []);

  const handleDeleteUser = (userID: string) => {
    try {
      axios
        .put(`${import.meta.env.VITE_BASE_URL}/user/${userID}`, {
          departmentId: null,
        })
        .then(() => {
          toast.success("User deleted successfully");

          if (!depart) return;

          setDepart({
            ...depart,
            User: depart?.User?.filter((user) => user.id !== userID),
          });
        })
        .catch((error) => {
          toast.error("Error deleting user");
        });
    } catch (error) {
      toast.error("Error deleting user");
    }

    setIsDeleteModalOpen(false);
  };

  function addNewUser(depart: Department) {
    if (selectedUser) {
      if (depart.User.find((user) => user.id === selectedUser)) {
        toast.error("User already added to this department");
      } else {
        setDepart({
          ...depart,
          User: [
            ...depart.User,
            users.find((user) => user.id === selectedUser)!,
          ],
        });
        axios.put(`${import.meta.env.VITE_BASE_URL}/user/${selectedUser}`, {
          departmentId: depart.id,
        });
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!depart) return;

    const department = {
      id: depart.id,
      name: depart.name,
      description: depart.description,
      createdAt: depart.createdAt,
      updatedAt: depart.updatedAt,
    };

    try {
      await axios
        .put(`${import.meta.env.VITE_BASE_URL}/department/${depart.id}`, {
          department,
        })
        .then(() => {
          toast.success("Department updated successfully");
        });
    } catch (error) {
      toast.error("Error updating department");
    }
  };

  if (!depart) return null;

  return (
    <div className="max-w-4xl mx-auto  bg-white p-16">
      <h1 className="text-2xl font-bold text-gray-900 mb-9">
        Department Details
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 mb-6 lg:grid-cols-2 w-full">
          <div>
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              Department Name
            </label>
            <input
              type="text"
              id="name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              value={depart.name}
              onChange={(e) => setDepart({ ...depart, name: e.target.value })}
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              Description
            </label>
            <input
              type="text"
              id="location"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              value={depart.description}
              onChange={(e) =>
                setDepart({ ...depart, description: e.target.value })
              }
            />
          </div>
        </div>
        <button
          className="px-4 py-1 text-white font-light tracking-wider bg-gray-600 hover:bg-gray-800 rounded"
          type="submit"
        >
          Save
        </button>
      </form>

      <div className="mt-4 border-b border-gray-300 my-6"></div>
      <div className="flex items-center justify-between mb-10">
        <button
          className="group rounded h-10 w-32 bg-orange-500 text-base text-white relative overflow-hidden mr-5"
          onClick={() => {
            addNewUser(depart);
          }}
        >
          Add User
          <div className="absolute duration-300 inset-0 w-full h-full transition-all scale-0 group-hover:scale-100 group-hover:bg-white/30 rounded-xl"></div>
        </button>

        <select
          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-2/4 p-2.5"
          onChange={(e) => {
            setSelectedUser(e.target.value);
          }}
        >
          <option value="" className="text-gray-400 italic">
            ~ Select User ~
          </option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      <h1 className="text-2xl font-bold text-gray-900">Users</h1>
      {
        //todo: eliminar y añadir usuarios a un departamento
        depart.User.length !== 0 ? (
          <div className="bg-white shadow-md rounded my-6">
            <table className="min-w-max w-full table-auto">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">User</th>
                  <th className="py-3 px-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {depart.User.map((user) => (
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
                      <div className="text-sm">
                        <div className="font-medium text-gray-700">
                          {user.name} {user.surname}
                        </div>
                        <div className="text-gray-400">{user.email}</div>
                      </div>
                    </th>
                    <td className="py-3 px-6 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        {" "}
                        {/* Agregada la clase "justify-center" */}
                        <div
                          onClick={() => openDeleteModal(user.id)}
                          className="w-4 mr-2 transform hover:text-orange-500 hover:scale-110"
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
                        <Link
                          to={`/user/${user.id}`}
                          className="w-4 mr-2 transform hover:text-orange-500 hover:scale-110"
                        >
                          <div className="w-4 transform hover:text-orange-500 hover:scale-110">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </div>
                        </Link>
                        <DeleteModal
                          isOpen={isDeleteModalOpen}
                          onRequestClose={() => setIsDeleteModalOpen(false)}
                          onDelete={() => {
                            handleDeleteUser(user.id);
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 text-sm font-light">No users</p>
          </div>
        )
      }
    </div>
  );
};

export default DepartamentDetails;
