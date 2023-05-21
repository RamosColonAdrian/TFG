import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiInfo } from 'react-icons/fi';
import { Link } from 'react-router-dom';


export interface Department {
    id: string;
    name: string;
    description: string;
    updatedAt: string;
    createdAt: string;
}


export interface User {
    id: string;
    dni?: string;
    name?: string;
    surname?: string;
    birthDate?: string;
    registerDate?: string;
    address?: string;
    email: string;
    hashedPassword: string;
    phone?: string;
    relativeName?: string;
    relativePhone?: string;
    role?: string;
    type?: string;
    picture?: string;
    departmentId?: string;
    Department?: Department;
}

const UserList: React.FC = () => {
    const [loadedUsers, setLoadedUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        axios
            .get('http://localhost:8007/users')
            .then((response) => {
                setLoadedUsers(response.data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setIsLoading(false);
            });
    }, []);


    function getImg(userId: string) {
        axios
            .get(`http://localhost:8007/user-photo/${userId}`)
            .then((response) => {
                console.log(response.data);
                return response.data;
            })
            .catch((error) => {
                console.log(error);
            });
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    console.log(getImg("f815228b-b761-47a1-a9ca-0893fa805014"));

    return (
        <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
            <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-4 font-medium text-gray-900">Name</th>
                        <th scope="col" className="px-6 py-4 font-medium text-gray-900">Departament</th>
                        <th scope="col" className="px-6 py-4 font-medium text-gray-900">Action</th>

                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 border-t border-gray-100 ">
                    {loadedUsers.map((user) => (
                            <tr className="hover:bg-gray-50">
                                <th className="flex gap-3 px-6 py-4 font-normal text-gray-900">
                                    <div className="relative h-10 w-10">
                                        <img
                                            className="h-full w-full rounded-full object-cover object-center"
                                            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                            alt=""
                                        />
                                        <span className="absolute right-0 bottom-0 h-2 w-2 rounded-full bg-green-400 ring ring-white"></span>
                                    </div>
                                    <div className="text-sm">
                                        <div className="font-medium text-gray-700">{user.name}</div>
                                        <div className="text-gray-400">{user.email}</div>
                                    </div>
                                </th>
                                <td className="px-6 py-4">
                                    <span
                                        className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600"
                                    >
                                        <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
                                        {user.Department?.name || "Without department"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right text-sm font-medium">
                                <Link to={`/user/${user.id}`} className=" text-gray-700 hover:text-indigo-900">
                                        <FiInfo />
                                    </Link>
                                </td>
                            </tr>
                    ))}

                </tbody>
            </table>
        </div>
    );
};

export default UserList;