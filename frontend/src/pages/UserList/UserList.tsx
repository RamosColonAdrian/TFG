import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiInfo } from 'react-icons/fi';
import { RiDeleteBinLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { User } from '../../shared/Interfaces/Interfaces';
import Modal from 'react-modal';


const UserList: React.FC = () => {
    const [loadedUsers, setLoadedUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

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


    Modal.setAppElement("#root");


    if (isLoading) {
        return <div>Loading...</div>;
    }

    const handleDeleteUser = () => {
        //todo delete user from db and from state cascade
        setSelectedUserId(null);
    };

    return (
        <div className="overflow-x-auto">
            
            <div className="min-w-screen min-h-screen flex items-center justify-center bg-gray-100 font-sans overflow-hidden">
                <div className="w-full lg:w-5/6">
                    <div className="bg-white shadow-md rounded my-6">
                        <table className="min-w-max w-full table-auto">
                            <thead>
                                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                    <th className="py-3 px-6 pl-24 text-left">Name</th>
                                    <th className="py-3 px-6 text-center">Departament</th>
                                    <th className="py-3 px-6 text-center">Role</th>
                                    <th className="py-3 px-6 text-center">Action</th>

                                </tr>
                            </thead>
                            <tbody className="text-gray-600 text-sm font-light">
                                {loadedUsers.map((user) => (
                                    <tr className="border-b border-gray-200 bg-gray-50 hover:bg-gray-100">
                                        <th className="flex gap-3 px-6 py-4 font-normal text-gray-900">
                                            <div className="relative h-10 w-10">
                                                <img
                                                    className="h-full w-full rounded-full object-cover object-center"
                                                    src={user.picture}

                                                />
                                                <span className="absolute right-0 bottom-0 h-2 w-2 rounded-full bg-green-400 ring ring-white"></span>
                                            </div>
                                            <div className="text-sm">
                                                <div className="font-medium text-gray-700">{user.name} {user.surname}</div>
                                                <div className="text-gray-400">{user.email}</div>
                                            </div>
                                        </th>
                                        <td className="py-3 px-6 text-center">
                                            {user.Department?.name ? (
                                                user.Department.name
                                            ) : (
                                                <span
                                                    className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-600"
                                                >
                                                    <span className="h-1.5 w-1.5 rounded-full bg-red-600"></span>
                                                    Without department
                                                </span>

                                            )}
                                        </td>
                                        <td className="py-3 px-6 text-center">
                                            {user.role ? (
                                                user.role
                                            ) : (
                                                <span
                                                    className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-600"
                                                >
                                                    <span className="h-1.5 w-1.5 rounded-full bg-red-600"></span>
                                                    Without role
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center text-sm font-medium">
                                            <div className='flex items-center justify-center space-x-2'> {/* Agregada la clase "justify-center" */}
                                                <Link to={`/user/${user.id}`} className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
                                                    <div className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                        </svg>
                                                    </div>
                                                </Link>

                                                <div
                                                    onClick={() => setSelectedUserId(user.id)}
                                                    className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </div>

                                                <Modal
                                                    isOpen={selectedUserId === user.id}
                                                    onRequestClose={() => setSelectedUserId(null)}
                                                    contentLabel="Confirm Delete"
                                                    className="fixed inset-0 flex items-center justify-center z-50"
                                                    overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
                                                >
                                                    <div className="bg-white p-6 rounded shadow">
                                                        <h1 className="text-xl font-bold mb-4">Confirm Delete</h1>
                                                        <p className="text-gray-600 mb-6">Are you sure you want to delete the user?</p>
                                                        <button
                                                            onClick={handleDeleteUser}
                                                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mr-2"
                                                        >
                                                            Delete
                                                        </button>
                                                        <button
                                                            onClick={() => setSelectedUserId(null)}
                                                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </Modal>
                                            </div>

                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default UserList;