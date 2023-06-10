import axios from "axios";
import { Department, User, Zone } from "../../shared/Interfaces/Interfaces";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useRedirectBasedOnAuthentication from "../../hooks/useRedirectBasedOnAuthentication";
import { useNavigate } from "react-router-dom";

type Props = {};

const AddDepartment = (props: Props) => {
  const [users, setUsers] = useState<User[]>([]);
  const [department, setDepartment] = useState<Department>(null!);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const navigate = useNavigate();
  useRedirectBasedOnAuthentication("authenticated");

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

  function getUser(id: string) {
    const user = users.find((user) => user.id === id);
    return user?.name;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/department`, {
        department,
        selectedUsers,
      });
      toast.success("Department added successfully");
    } catch (error) {
      toast.error("Error adding department");
    }

    navigate("/departments");
  };

  function handlerDeleteUser(userId: string) {
    setSelectedUsers(selectedUsers.filter((user) => user !== userId));
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-16">
      <h1 className="text-2xl font-bold text-gray-900 mb-9">New Department</h1>

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
              onChange={(e) =>
                setDepartment({ ...department, name: e.target.value })
              }
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
              onChange={(e) =>
                setDepartment({ ...department, description: e.target.value })
              }
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
              onChange={(e) => {
                const selectedUserId = e.target.value;
                if (!selectedUsers.includes(selectedUserId)) {
                  setSelectedUsers([...selectedUsers, selectedUserId]);
                } else {
                  toast.warning("User already selected");
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
            {selectedUsers.map((user) => (
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
            ))}
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

export default AddDepartment;
