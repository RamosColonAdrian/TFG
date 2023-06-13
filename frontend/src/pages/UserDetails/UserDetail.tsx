// Pagina que renderiza los detalles de un usuario 
import React from "react";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { User } from "../../shared/Interfaces/Interfaces";
import axios from "axios";
import { toast } from "react-toastify";
import useRedirectBasedOnAuthentication from "../../hooks/useRedirectBasedOnAuthentication";
import { authContext } from "../../contexts/authContext/authContext";
import { FileUploader } from "react-drag-drop-files";
import DeleteModal from "../../shared/components/DeleteModal/DeleteModal";

type Props = {};

const UserDetail = (props: Props) => {
  const [user, setUser] = useState<User>();
  const [file, setFile] = useState<File>();
  const [departments, setDepartments] = useState<any[]>([]);
  const [zones, setZones] = useState<any[]>([]);
  const [selectedZone, setSelectedZone] = useState<string>();
  const [allowedZones, setAllowedZones] = useState<any[]>([]);
  const { userId } = useParams();
  const { userInfo } = useContext(authContext);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [zoneToDeleteId, setZoneToDeleteId] = useState<string>();
  
  // Redirecciona a la página de usuarios si no se está autenticado
  useRedirectBasedOnAuthentication("authenticated");

  // Funcion que se encarga de controlar el modal de confirmacion de eliminacion de zona
  const openDeleteModal = (zoneId: string) => {
    setIsDeleteModalOpen(true);
    setZoneToDeleteId(zoneId);
  };

  // Funcion que controla los cambios en el input de la foto de perfil
  const handleChange = (file: File) => {
    setFile(file);

    // Crea un formData con la imagen y el id del usuario
    const formData = new FormData();
    formData.append("img", file as Blob);
    formData.append("id", userId as string);

    // Hace un put a la API para actualizar la foto de perfil
    toast.promise(
      axios.put(
        `${import.meta.env.VITE_BASE_URL}/user/photo/${userId}`,
        formData
      ),
      {
        pending: "Uploading photo...",
        success: "Photo updated",
        error: "Error updating photo",
      }
    );
  };


  // Efecto que se ejecuta cuando se monta el componente y cuando cambia el id del usuario para obtener los datos del usuario
  useEffect(() => {
    // Obtiene el usuario por su id
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/user/${userId}`)
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        toast.error("User not found");
      });
  }, [userId]);

  // Efecto que se ejecuta cuando se monta el componente para obtener los departamentos 
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/department`)
      .then((response) => {
        setDepartments(response.data);
      })
      .catch((error) => {
        toast.error("Error loading departments");
      });
  }, []);

  // Efecto que se ejecuta cuando se monta el componente para obtener las zonas 
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/zone`)
      .then((response) => {
        setZones(response.data);
        if (response.data.length > 0) setSelectedZone(response.data[0].id);
      })
      .catch((error) => {
        toast.error("Error loading zones");
      });
  }, []);

  // Efecto que se ejecuta cuando se monta el componente para obtener las zonas permitidas del usuario 
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/user-to-zone/${userId}`)
      .then((response) => {
        setAllowedZones(response.data);
      })
      .catch((error) => {
        toast.error("Error loading allowed zones");
      });
  }, []);

  // Funcion que se encarga de añaadir una zona al usuario 
  function addUserToZone(zoneId: string, userId: string) {
    if (allowedZones.find((zone) => zone.id === zoneId)) {
      toast.error("User already in zone");
      return;
    }

    // Hace un post a la API para añadir la zona al usuario 
    axios
      .post(`${import.meta.env.VITE_BASE_URL}/user-to-zone`, {
        zoneId,
        userId,
        allowedById: userInfo.id,
      })
      .then((response) => {
        // Añade la zona a la lista de zonas permitidas
        setAllowedZones([...allowedZones, response.data]);
        toast.success("Zone added successfully");
      })
      .catch((error) => {
        toast.error("Error adding zone");
      });
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const userExclude = {
      name: user.name,
      surname: user.surname,
      address: user.address,
      birthDate: user.birthDate,
      dni: user.dni,
      email: user.email,
      phone: user.phone,
      departmentId: user.departmentId,
      role: user.role,
    };

    await axios
      .put(`${import.meta.env.VITE_BASE_URL}/user/${userId}`, userExclude)
      .then((response) => {
        toast.success("User updated successfully");
      })
      .catch((error) => {
        toast.error("Error updating user");
      });
  };

  const handleDeleteZone = async () => {
    await axios
      .delete(`${import.meta.env.VITE_BASE_URL}/user-to-zone/${zoneToDeleteId}`)
      .then((response) => {
        setAllowedZones(
          allowedZones.filter(
            (zone) => zone.UserToZone[0].id !== zoneToDeleteId
          )
        );
        toast.success("Zone deleted successfully");
        setIsDeleteModalOpen(false);
      })
      .catch((error) => {
        toast.error("Error deleting zone");
      });
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-16">
      <h1 className="text-2xl font-bold text-gray-900 mb-9">User Details</h1>
      <div className="flex flex-col items-center mb-7">
        <img
          className="w-56 mb-3 rounded-full h-56 object-cover"
          src={file ? URL.createObjectURL(file) : user.picture}
          alt="Profile Image"
        />
        <FileUploader
          label=""
          multiple={false}
          handleChange={handleChange}
          maxFileCount={1}
          name="file"
          types={["JPG", "PNG"]}
        />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 mb-6 lg:grid-cols-2 w-full">
          <div>
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            />
          </div>
          <div>
            <label
              htmlFor="surname"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              Surname
            </label>
            <input
              type="text"
              id="surname"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
              value={user.surname}
              onChange={(e) => setUser({ ...user, surname: e.target.value })}
            />
          </div>
          <div>
            <label
              htmlFor="Address"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              Address
            </label>
            <input
              type="text"
              id="Address"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
              value={user.address}
              onChange={(e) => setUser({ ...user, address: e.target.value })}
            />
          </div>
          <div>
            <label
              htmlFor="birthDate"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              Birth Date
            </label>
            <input
              type="date"
              id="birthDate"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
              value={user.birthDate}
              onChange={(e) => setUser({ ...user, birthDate: e.target.value })}
            />
          </div>
          <div>
            <label
              htmlFor="dni"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              DNI
            </label>
            <input
              type="text"
              id="dni"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
              value={user.dni}
              onChange={(e) => setUser({ ...user, dni: e.target.value })}
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              Phone
            </label>
            <input
              type="phone"
              id="phone"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
              value={user.phone}
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
            />
          </div>

          <div>
            <label
              htmlFor="role"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              Role
            </label>
            <input
              type="text"
              id="role"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
              value={user.role}
              onChange={(e) => setUser({ ...user, role: e.target.value })}
            />
          </div>

          <div>
            <label
              htmlFor="department"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              Department
            </label>
            <select
              id="department"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
              value={user.departmentId}
              onChange={(e) =>
                setUser({ ...user, departmentId: e.target.value })
              }
            >
              <option value="" className="text-gray-400 italic">
                ~ Select Department ~
              </option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="zone"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              Zone
            </label>
            <div className="flex items-center justify-between mb-2">
              <select
                id="zone"
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-2/4 p-2.5"
                onChange={(e) => setSelectedZone(e.target.value)}
              >
                <option value="" className="text-gray-400 italic">
                  ~ Select Zone ~
                </option>
                {zones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="group rounded h-10 w-32 bg-orange-500 text-base text-white relative overflow-hidden mr-5"
                onClick={() =>
                  addUserToZone(selectedZone as string, userId as string)
                }
              >
                Add Zone
                <div className="absolute duration-300 inset-0 w-full h-full transition-all scale-0 group-hover:scale-100 group-hover:bg-white/30 rounded"></div>
              </button>
            </div>
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
      <h1 className="text-2xl font-bold text-gray-900">Allowed Zones</h1>
      {allowedZones.length !== 0 ? (
        <div className="bg-white shadow-md rounded my-6">
          <table className="min-w-max w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-center">Zone</th>
                <th className="py-3 px-6 text-center">Description</th>
                <th className="py-3 px-6 text-center">Location</th>
                <th className="py-3 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {allowedZones.map((zone) => (
                <tr
                  key={zone.id}
                  className="border-b border-gray-200 bg-gray-50 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-center">{zone.name}</td>
                  <td className="py-3 px-6 text-center">{zone.description}</td>
                  <td className="py-3 px-6 text-center">{zone.location}</td>

                  <td className="py-3 px-6 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <div
                        onClick={() => openDeleteModal(zone.UserToZone[0].id)}
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
                        to={`/zone/${zone.id}`}
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
                          handleDeleteZone();
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
    </div>
  );
};

export default UserDetail;
