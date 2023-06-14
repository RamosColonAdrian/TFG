// Pagina que se renderiza cuando se quiere agregar una zona
import axios from "axios";
import { User, Zone } from "../../shared/Interfaces/Interfaces";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useRedirectBasedOnAuthentication from "../../hooks/useRedirectBasedOnAuthentication";
import { authContext } from "../../contexts/authContext/authContext";

type Props = {};

const AddZone = (props: Props) => {
  const { userInfo } = useContext(authContext);
  const [users, setUsers] = useState<User[]>([]);
  const [zone, setZone] = useState<Zone>(null!);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const navigate = useNavigate();

  // Redirecciona a la página de usuarios si no se está autenticado
  useRedirectBasedOnAuthentication("authenticated");

  // Obtiene los usuarios de la API de las zonas
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/user`
        );
        setUsers(response.data);
      } catch (error) {
        toast.error("Error fetching users");
      }
    };
    fetchUsers();
  }, []);

  // Obtiene un usuario por su id
  function getUser(id: string) {
    const user = users.find((user) => user.id === id);
    return user?.name;
  }

  // Funcion que se ejecuta cuando se hace submit en el formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSelectedUser("");
    // Restablecer la opción seleccionada en el desplegable
    const selectElement = document.getElementById("user") as HTMLSelectElement;
    selectElement.selectedIndex = 0;

    // Si no se selecciona ningún usuario, se crea la zona sin usuarios
    if (selectedUsers.length === 0) {
      await createZone()
        .then(() => {
          toast.success("Zone created successfully");
          navigate("/zones");
        })
        .catch((error) => {
          toast.error("Error creating zone");
        });
    } else {
      // Si se selecciona al menos un usuario, se crea la zona con los usuarios seleccionados
      createUserToZone()
        .then(() => {
          toast.success("Zone created successfully");
          navigate("/zones");
        })
        .catch((error) => {
          toast.error("Error creating zone");
        });
    }
  };

  // Funcion que crea una zona sin usuarios
  async function createZone() {
    await axios.post(`${import.meta.env.VITE_BASE_URL}/zone`, zone);
  }

  // Funcion que crea una zona con usuarios
  async function createUserToZone() {
    await axios.post(`${import.meta.env.VITE_BASE_URL}/zone/with-users`, {
      zone,
      selectedUsers,
      allowedBy: userInfo.id,
    });
  }

  // Funcion que se ejecuta cuando se selecciona un usuario en el select de usuarios disponibles para eliminarlo de la lista de usuarios seleccionados
  function handlerDeleteUser(userId: string) {
    setSelectedUsers(selectedUsers.filter((user) => user !== userId));
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-16">
      <h1 className="text-2xl font-bold text-gray-900 mb-9">New Zone</h1>

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
              onChange={(e) => setZone({ ...zone, location: e.target.value })}
            />
          </div>
          <div className="col-span-2">
            <label
              htmlFor="description"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Description
            </label>
            <textarea
              id="description"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
              onChange={(e) =>
                setZone({ ...zone, description: e.target.value })
              }
              maxLength={80}
            />
          </div>
          <div className="col-span-2">
            <label
              htmlFor="user"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              User
            </label>
            <select
              id="user"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
              value={selectedUser}
              onChange={(e) => {
                const selectedUserId = e.target.value;
                if (selectedUserId !== "") {
                  if (!selectedUsers.includes(selectedUserId)) {
                    setSelectedUsers([...selectedUsers, selectedUserId]);
                    setSelectedUser(""); // Restablecer la opción seleccionada
                  } else {
                    toast.warning("User already selected");
                  }
                }
              }}
            >
              <option value="">Select User</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            {selectedUsers.map((user) => {
              if (user !== "") {
                return (
                  <div key={user}>
                    <p className="mb-2 text-gray-600">
                      &emsp;&emsp;- {getUser(user)}{" "}
                      <span
                        onClick={() => handlerDeleteUser(user)}
                        className="text-lg cursor-pointer font-bold"
                      >
                        x
                      </span>{" "}
                    </p>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
        <button
          className="px-4 py-1 text-white font-light tracking-wider bg-gray-600 hover:bg-gray-800 rounded"
          type="submit"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default AddZone;
