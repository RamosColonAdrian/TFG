import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AccessLog } from '../../shared/Interfaces/Interfaces';
import useRedirectBasedOnAuthentication from '../../hooks/useRedirectBasedOnAuthentication';

const AccessLogList: React.FC = () => {
    const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    useRedirectBasedOnAuthentication("authenticated");


    const handleSort = (column: string) => {
        if (column === sortBy) {
            // Si ya se está ordenando por la misma columna, cambia la dirección
            setSortDirection((prevDirection) => (prevDirection === 'asc' ? 'desc' : 'asc'));
        } else {
            // Si se está ordenando por una columna diferente, establece la nueva columna y la dirección ascendente por defecto
            setSortBy(column);
            setSortDirection('asc');
        }
    };

    useEffect(() => {
        fetchAccessLogs();
    }, [searchTerm, sortBy, sortDirection]); // Agrega sortBy y sortDirection como dependencias

    const fetchAccessLogs = async () => {
        try {
            const response = await axios.get('http://localhost:8007/access-logs', {
                params: {
                    username: searchTerm,
                    sortBy: sortBy || undefined, // Asegúrate de pasar undefined si sortBy es falsy
                    sortDirection: sortDirection || undefined, // Asegúrate de pasar undefined si sortDirection es falsy
                },
            });
            setAccessLogs(response.data);
        } catch (error) {
            console.log('Error fetching access logs');
        }
    };

    const getAccessCellStyle = (access: boolean) => {
        return access ? 'bg-green-200' : 'bg-red-200';
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleString(); // Formatea la fecha utilizando toLocaleString()
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Access Logs</h2>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by user name"
                className="border p-2 mr-2"
            />

            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        <th className="p-2 border">
                            User
                        </th>
                        <th className="p-2 border">
                            Zone
                        </th>
                        <th className="p-2 border">Access</th>
                        <th className="p-2 border" onClick={() => handleSort('createdAt')}>
                            Created At {sortBy === 'createdAt' && <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>}
                        </th>
                        <th className="p-2 border" onClick={() => handleSort('updatedAt')}>
                            Updated At {sortBy === 'updatedAt' && <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {accessLogs.map((log) => (
                        <tr key={log.id}>
                            <td className="p-2 border">{log.User.name}</td>
                            <td className="p-2 border">{log.Zone.name}</td>
                            <td className={`p-2 border ${getAccessCellStyle(log.access)}`}>{log.access ? 'Granted' : 'Denied'}</td>
                            <td className="p-2 border">{formatDate(log.createdAt)}</td>
                            <td className="p-2 border">{formatDate(log.updatedAt)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AccessLogList;