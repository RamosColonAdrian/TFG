import React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { User } from "../../shared/Interfaces/Interfaces";
import axios from "axios";
import { toast } from 'react-toastify'
import { useDropzone } from 'react-dropzone';

type Props = {};

const UserDetail = (props: Props) => {
  const [user, setUser] = useState<User>();
  const [file, setFile] = useState<File>();
  const [departments, setDepartments] = useState<any[]>([]);
  const [zones, setZones] = useState<any[]>([]);
  const [selectedZone, setSelectedZone] = useState<string>();
  const [allowedZones, setAllowedZones] = useState<any[]>([]);
  const { userId } = useParams();


  const handleDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  };

const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: handleDrop });



  useEffect(() => {
    axios
      .get(`http://localhost:8007/users/${userId}`)
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [userId]);

  useEffect(() => {
    axios
      .get("http://localhost:8007/departments")
      .then((response) => {
        setDepartments(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8007/zones")
      .then((response) => {
        setZones(response.data);
        if (response.data.length > 0) setSelectedZone(response.data[0].id);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:8007/allowed-zones/${userId}`)
      .then((response) => {
        setAllowedZones(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);


  function addUserToZone(zoneId: string, userId: string) {
    if (allowedZones.find((zone) => zone.id === zoneId)) {
      toast.error("User already in zone");
      return;
    }
  
    axios
      .post(`http://localhost:8007/add-user-to-zone`, { zoneId, userId })
      .then((response) => {
        setAllowedZones([...allowedZones, response.data]);
        toast.success("Zone added successfully");
      })
      .catch((error) => {
        console.log(error);
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
    };

    await axios
      .put(`http://localhost:8007/users/${userId}`, userExclude)
      .then((response) => {
        toast.success("User updated successfully");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubmitImg = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("img", file as Blob);
    formData.append("id", userId as string);


    await axios
      .put(`http://localhost:8007/user-photo/${userId}`, formData)
      .then((response) => {
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeleteZone = async (zoneId: string) => {
    await axios
      .delete(`http://localhost:8007/user-to-zone/${zoneId}`)
      .then((response) => {
        setAllowedZones(allowedZones.filter((zone) => zone.id !== zoneId));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    //TODO: arreglar que se abra dos veces el explorador de archivos
    <div className="max-w-4xl mx-auto bg-white p-16">
      <h1 className="text-2xl font-bold text-gray-900 mb-9">User Details</h1>

      <form onSubmit={handleSubmitImg} className="flex justify-center items-center mb-10">
        <div className="flex flex-col items-center">
          <label
            {...getRootProps()}
            className={`dropzone mt-4 ${isDragActive ? 'active' : ''}`}
          >
            <div className="relative">
              {file ? (
                <img
                  className="h-40 w-40 rounded-full object-cover object-center cursor-pointer"
                  src={URL.createObjectURL(file)}
                  alt="Selected"
                />
              ) : (
                <img
                  className="h-40 w-40 rounded-full object-cover object-center cursor-pointer"
                  src={user.picture}
                  alt="Profile"
                />
              )}
              <input {...getInputProps()} accept="image/*" className="sr-only" />
              {file ? null : (
                <p className="cursor-pointer absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-yellow-500">
                  Haz clic aquí o arrastra y suelta una imagen
                </p>
              )}
            </div>
          </label>

          {file && (
            <button
              type="submit"
              className="mt-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
            >
              Send Image
            </button>
          )}
        </div>
      </form>
     

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
            <div className='flex items-center justify-between mb-2'>
              <select
                id="zone"
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-2/4 p-2.5"
                onChange={(e) => setSelectedZone(e.target.value)}
              >
                <option value="" className="text-gray-400 italic">~ Select Zone ~</option>
                {zones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name}
                  </option>
                ))}
              </select>

              <button
                className="group rounded h-10 w-32 bg-blue-400 text-base text-white relative overflow-hidden mr-5"
                onClick={() =>
                  addUserToZone(selectedZone as string, userId as string)
                }
              >
                Add User
                <div className="absolute duration-300 inset-0 w-full h-full transition-all scale-0 group-hover:scale-100 group-hover:bg-white/30 rounded-xl"></div>
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
      {
        allowedZones.length !== 0 ? (
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
                  <tr className="border-b border-gray-200 bg-gray-50 hover:bg-gray-100">
                    <td className="py-3 px-6 text-center">
                      {zone.name}
                    </td>
                    <td className="py-3 px-6 text-center">
                      {zone.description}
                    </td>
                    <td className="py-3 px-6 text-center">
                      {zone.location}
                    </td>

                    <td className="py-3 px-6 text-center">
                      <div className="w-6 mr-2 transform hover:text-purple-500 hover:scale-110 text-center"
                        onClick={() => handleDeleteZone(zone.id) }
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
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
        )
      }
    </div>
  );
};

export default UserDetail;