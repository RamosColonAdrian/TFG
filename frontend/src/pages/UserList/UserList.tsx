import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiInfo } from 'react-icons/fi';
import './UserList.css';

interface User {
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
}

const UserList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        axios
            .get('http://localhost:8007/users')
            .then((response) => {
                setUsers(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const handleInfoClick = (userId: string) => {
        const user = users.find((user) => user.id === userId);
        if (user) {
            setSelectedUser(user);
            setShowPopup(true);
        }
    };

    const handleModalClose = () => {
        setShowPopup(false);
        setSelectedUser(null);
    };

    return (
        <div className="user-list-container">
            <h1 className="user-list-title">Lista de usuarios</h1>
            <table className="user-list-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>DNI</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th>Información</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.dni}</td>
                            <td>{user.name}</td>
                            <td>{user.surname}</td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                            <td>
                                <button
                                    className="user-list-info-button"
                                    id={`info-${user.id}`}
                                    onClick={() => handleInfoClick(user.id)}
                                >
                                    <FiInfo className="user-list-info-icon" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {selectedUser && (
                <div className="user-info-overlay">
                    <div className="user-info-modal">
                        <h2 className="user-info-modal-title">Información del usuario</h2>
                        <div className="user-info-modal-row">
                            <span className="user-info-modal-label">ID:</span>
                            <span className="user-info-modal-value">{selectedUser.id}</span>
                        </div>
                        <div className="user-info-modal-row">
                            <span className="user-info-modal-label">DNI:</span>
                            <span className="user-info-modal-value">{selectedUser.dni}</span>
                        </div>
                        <div className="user-info-modal-row">
                            <span className="user-info-modal-label">Nombre:</span>
                            <span className="user-info-modal-value">{selectedUser.name}</span>
                        </div>
                        <div className="user-info-modal-row">
                            <span className="user-info-modal-label">Email:</span>
                            <span className="user-info-modal-value">{selectedUser.email}</span>
                        </div>
                        <div className="user-info-modal-row">
                            <span className="user-info-modal-label">Apellido:</span>
                            <span className="user-info-modal-value">{selectedUser.surname}</span>
                        </div>
                        <div className="user-info-modal-row">
                            <span className="user-info-modal-label">Fecha de nacimiento:</span>
                            <span className="user-info-modal-value">{selectedUser.birthDate}</span>
                        </div>
                        <div className="user-info-modal-row">
                            <span className="user-info-modal-label">Fecha de registro:</span>
                            <span className="user-info-modal-value">{selectedUser.registerDate}</span>
                        </div>

                        <button className="close-popup" onClick={handleModalClose}>
                            X
                        </button>
                    </div>
                </div>

            )}
        </div>


    );
};

export default UserList;