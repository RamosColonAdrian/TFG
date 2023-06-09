import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { User, Zone } from "../../shared/Interfaces/Interfaces";
import { Link, useParams } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "react-toastify";
import DeleteModal from "../../shared/components/DeleteModal/DeleteModal";
import { BsExclamationTriangle } from "react-icons/bs";
import useRedirectBasedOnAuthentication from "../../hooks/useRedirectBasedOnAuthentication";
import { authContext } from "../../contexts/authContext/authContext";

type Props = {};

const ZoneDetails = (props: Props) => {
  const { zoneId } = useParams();
  const [zone, setZone] = useState<Zone>();
  const [isMaxLengthReached, setIsMaxLengthReached] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDeleteId, setUserToDeleteId] = useState("");
  const { userInfo } = useContext(authContext);

  useRedirectBasedOnAuthentication("authenticated");

  const openDeleteModal = (userId: string) => {
    setIsDeleteModalOpen(true);
    setUserToDeleteId(userId);
  };

  useEffect(() => {
    const fetchZone = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/zone/${zoneId}`
        );
        setZone(response.data);
      } catch (error) {
        toast.error("Zone not found");
      }
    };
    fetchZone();
  }, [zoneId]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/user`
        );
        setUsers(response.data);
      } catch (error) {
        toast.error("Users not found");
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (userToZoneId: string) => {
    try {
      await axios
        .delete(`${import.meta.env.VITE_BASE_URL}/user-to-zone/${userToZoneId}`)
        .then(() => {
          toast.success("User removed from zone");
          zone?.UserToZone.some((userToZone, index) => {
            if (userToZone.id === userToZoneId) {
              zone.UserToZone.splice(index, 1);
              setZone({ ...zone });
              return true;
            }
            return false;
          });
        });
    } catch (error) {
      toast.error("User not removed from zone");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const zoneExlude = {
      id: zone?.id,
      name: zone?.name,
      description: zone?.description,
      location: zone?.location,
    };

    try {
      await axios
        .put(`${import.meta.env.VITE_BASE_URL}/zone/${zoneId}`, zoneExlude)
        .then(() => {
          toast.success("Zone updated successfully");
        });
    } catch (error) {
      toast.error("Zone not updated");
    }
  };

  function addUsersToZone(userId: string) {
    if (zone?.UserToZone.some((userToZone) => userToZone.User.id === userId)) {
      toast.error("User already added to the zone");
      return;
    }
    const zoneId = zone?.id;
    axios
      .post(`${import.meta.env.VITE_BASE_URL}/user-to-zone`, {
        zoneId,
        userId,
        allowedById: userInfo.id,
      })
      .then((response) => {
        setZone(response.data);
        toast.success("User added to the zone");
      })
      .catch((error) => {
        toast.error("Error adding user to zone");
      });
  }

  function getUserById(userId: string) {
    const user = users.find((user) => user.id === userId);
    return user?.name;
  }

  if (!zone) return null;

  return (
    <div className="max-w-4xl mx-auto  bg-white p-16">
      <h1 className="text-2xl font-bold text-gray-900 mb-9">Zone Details</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 mb-6 lg:grid-cols-2 w-full">
          <div>
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              Zone Name
            </label>
            <input
              type="text"
              id="name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              value={zone.name}
              onChange={(e) => setZone({ ...zone, name: e.target.value })}
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              value={zone.location}
              onChange={(e) => setZone({ ...zone, location: e.target.value })}
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              Description
            </label>
            <textarea
              id="description"
              className={`bg-gray-50 border ${isMaxLengthReached
                  ? "border-yellow-500 bg-yellow-50 "
                  : "border-gray-300"
                } text-gray-900 text-sm rounded-lg  block w-full p-2.5`}
              value={zone.description}
              onChange={(e) => {
                const value = e.target.value;
                setZone({ ...zone, description: value });
                setIsMaxLengthReached(value.length >= 80);
              }}
              maxLength={80}
            />

            {isMaxLengthReached && (
              <div className="flex items-center mt-2">
                <BsExclamationTriangle className="text-red-500 mr-1" />
                <p className="text-red-500 text-xs">Exceeded character limit</p>
              </div>
            )}
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
            if (selectedUser) {
              addUsersToZone(selectedUser);
            }
          }}
        >
          Add User
          <div className="absolute duration-300 inset-0 w-full h-full transition-all scale-0 group-hover:scale-100 group-hover:bg-white/30 rounded"></div>
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

      <h1 className="text-2xl font-bold text-gray-900">Allowed Users</h1>
      {zone.UserToZone.length !== 0 ? (
        <div className="bg-white shadow-md rounded my-6">
          <table className="min-w-max w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-center">Name</th>
                <th className="py-3 px-6 text-center">Allowed by</th>
                <th className="py-3 px-6 text-center">Date</th>
                <th className="py-3 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {zone.UserToZone.map((userToZone) => (
                <tr
                  key={userToZone.id}
                  className="border-b border-gray-200 bg-gray-50 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left">
                    {userToZone.User.name}
                  </td>

                  <td className="py-3 px-6 text-center">
                    {getUserById(userToZone.allowedBy)}
                  </td>
                  <td className="py-3 px-6 text-center">
                    <p>
                      Create at:{" "}
                      {format(new Date(userToZone.createdAt), "dd/MM/yyyy")}
                    </p>
                    <p>
                      Last Update:{" "}
                      {format(new Date(userToZone.updatedAt), "dd/MM/yyyy")}
                    </p>
                  </td>

                  <td className="py-3 px-6 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <div
                        onClick={() => openDeleteModal(userToZone.id)}
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
                        to={`/user/${userToZone.User.id}`}
                        className="w-4 mr-2 transform hover:text-orange-500 hover:scale-110"
                      >
                          <div className="w-4 mr-2 transform hover:text-orange-500 hover:scale-110">
                            <div className="w-4 transform hover:text-orange-500 hover:scale-110">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </div>
                            <div className="w-4 transform hover:text-orange-500 hover:scale-110">
                            
                            </div>

                          </div>
                      </Link>
                      <DeleteModal
                        isOpen={isDeleteModalOpen}
                        onRequestClose={() => setIsDeleteModalOpen(false)}
                        onDelete={() => {
                          handleDelete(userToZone.id);
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
          <p className="text-gray-600 text-sm font-light">No users allowed</p>
        </div>
      )}
      <Link
        to={`/video/${zone.id}`}
        className="text-red-600 mt-10 flex flex-row items-center justify-center gap-3 bg-red-300 w-60 h-10 rounded hover:bg-opacity-80"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
        Start recording access
      </Link>

    </div>
  );
};

export default ZoneDetails;
