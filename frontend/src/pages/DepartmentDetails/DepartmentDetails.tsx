import { useState, useEffect, } from 'react'
import axios from 'axios'
import { Department, User, Zone } from '../../shared/Interfaces/Interfaces'
import { Link, useParams } from 'react-router-dom'
import { format } from 'date-fns'
import { toast } from 'react-toastify'

type Props = {}

const DepartamentDetails = (props: Props) => {
    const { departId } = useParams();
    const [depart, setDepart] = useState<Department>();

    useEffect(() => {
        const fetchZone = async () => {
            try {
                const response = await axios.get(`http://localhost:8007/department/${departId}`);
                setDepart(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchZone();
    }, [departId]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        
    };


    if (!depart) return null;
    

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
                            value={depart.name}
                            onChange={(e) => setDepart({ ...depart, name: e.target.value })}
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
                            value={depart.description}
                            onChange={(e) => setDepart({ ...depart, description: e.target.value })}
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




    )
}

export default DepartamentDetails;