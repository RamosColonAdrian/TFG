import { useState, useEffect, } from 'react'
import axios from 'axios'
import { User, Zone } from '../../shared/Interfaces/Interfaces'
import { Link, useParams } from 'react-router-dom'
import { format } from 'date-fns'
import { toast } from 'react-toastify'

type Props = {}

const ZoneDetails = (props: Props) => {
    const { zoneId } = useParams();
    const [zone, setZone] = useState<Zone>();
    const [isMaxLengthReached, setIsMaxLengthReached] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    

    useEffect(() => {
        const fetchZone = async () => {
            try {
                const response = await axios.get(`http://localhost:8007/zones/${zoneId}`);
                setZone(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchZone();
    }, [zoneId]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:8007/users');
                setUsers(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchUsers();
    }, []);




    const handleDelete = async (id: string) => {
        try {
            const response = await axios.delete(`http://localhost:8007/user-to-zone/${id}`);
            console.log(response);
        } catch (error) {
            console.error(error);
        }
    };



    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const zoneExlude = {
            id: zone?.id,
            name: zone?.name,
            description: zone?.description,
            location: zone?.location,
        }

        try {
            const response = await axios.put(`http://localhost:8007/zones/${zoneId}`, zoneExlude);
            console.log(response);
        } catch (error) {
            console.error(error);
        }
    };

    


    if (!zone) return null;

    return (
        <div className="max-w-4xl mx-auto bg-white p-16">
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
                            className={`bg-gray-50 border ${isMaxLengthReached ? 'border-yellow-500 bg-yellow-50 ' : 'border-gray-300'
                                } text-gray-900 text-sm rounded-lg  block w-full p-2.5`}
                            value={zone.description}
                            onChange={(e) => {
                                const value = e.target.value;
                                setZone({ ...zone, description: value });
                                setIsMaxLengthReached(value.length >= 80);
                            }}
                            maxLength={80}
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
            <div className='flex items-center justify-between mb-10'>
                <button
                    className="group rounded h-10 w-32 bg-blue-400 text-base text-white relative overflow-hidden mr-5"
                    //todo add user to zone
                >
                    Add User
                    <div className="absolute duration-300 inset-0 w-full h-full transition-all scale-0 group-hover:scale-100 group-hover:bg-white/30 rounded-xl"></div>
                </button>

                <select className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-2/4 p-2.5"
                    //TODO: add user to zone
                    onChange={(e) => {
                        const selectedUserId = e.target.value;
                        if (!selectedUsers.includes(selectedUserId)) {
                            setSelectedUsers([...selectedUsers, selectedUserId]);
                        } else {
                            toast.warning('User already selected');
                        }
                    }}
                >
                    <option value="">Select User</option>
                    {
                        users.map((user) => (
                            <option key={user.id} value={user.id}>{user.name}</option>
                        ))
                            
                    }

                </select>
                        

            </div>

           
           
                   

            <h1 className="text-2xl font-bold text-gray-900">Allowed Users</h1>


            {
                zone.UserToZone.length !== 0 ? (
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
                                    <tr className="border-b border-gray-200 bg-gray-50 hover:bg-gray-100">
                                        <td className="py-3 px-6 text-left">
                                            {userToZone.User.name}
                                        </td>
                                        <td className="py-3 px-6 text-center">
                                            {userToZone.User.id}
                                        </td>
                                        <td className="py-3 px-6 text-center">
                                            <p>Create at: {format(new Date(userToZone.createdAt), 'dd/MM/yyyy')}</p>
                                            <p>Last Update: {format(new Date(userToZone.updatedAt), 'dd/MM/yyyy')}</p>
                                        </td>

                                        <td className="py-3 px-6 text-center">
                                            <div className="w-6 mr-2 transform hover:text-purple-500 hover:scale-110 text-center"
                                                onClick={() => { handleDelete(userToZone.id) }}
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




    )
}

export default ZoneDetails;