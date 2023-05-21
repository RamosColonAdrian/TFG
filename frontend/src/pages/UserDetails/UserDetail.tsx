import React from "react";
import { json, useLinkClickHandler, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { User } from "../UserList/UserList";
import axios from "axios";
type Props = {};

const UserDetail = (props: Props) => {
  const [user, setUser] = useState<User>();
  const [file, setFile] = useState<File>();
  const [departments, setDepartments] = useState<any[]>([]);
  const { userId } = useParams();


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
      .get('http://localhost:8007/departments')
      .then((response) => {
        setDepartments(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

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

    await axios.put(`http://localhost:8007/users/${userId}`, userExclude)
      .then((response) => {
        console.log(response.data);
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
      
    await axios.put(`http://localhost:8007/user-photo/${userId}`, formData)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      }
      );
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-16">
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
          <div >
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

          <div >
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
              onChange={(e) => setUser({ ...user, departmentId: e.target.value })}
            >
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>

          </div>
        </div>
        
        <button
          type="submit"
          className="mb-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          Submit
        </button>
      </form>


      <div className="flex items-center justify-center p-12">
        <div className="mx-auto w-full max-w-[550px] bg-white">
          <form
            className="w-ful"
            onSubmit={handleSubmitImg}
          >
            <div className="mb-6 pt-4 cursor-pointer">
              <label className="mb-5 block text-xl font-semibold text-[#07074D]">
                Upload File
              </label>

              <div className="mb-8 w-full" >
                <input type="file" name="file" id="file" className="sr-only" onChange={e => setFile(
                  e.target.files?.[0]
                  )} />
                <label
                  htmlFor="file"
                  className="relative flex min-h-[200px] items-center justify-center rounded-md border border-dashed border-[#e0e0e0] p-12 text-center "
                >
                  <div>
                    <span className="mb-2 block text-xl font-semibold text-[#07074D]">
                      Drop files here
                    </span>
                    <span className="mb-2 block text-base font-medium text-[#6B7280]">
                      Or
                    </span>
                    <span
                      className="inline-flex rounded border border-[#e0e0e0] py-2 px-7 text-base font-medium text-[#07074D]"
                    >
                      Browse
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <button
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
              >
                Send File
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>



  );
};

export default UserDetail;
