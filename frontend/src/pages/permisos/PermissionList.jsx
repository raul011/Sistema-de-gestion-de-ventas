import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const PermissionList = () => {
    const [permissions, setPermissions] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const res = await api.get('/roles/permissions/ver/');
                setPermissions(res.data);
            } catch (err) {
                console.error('Error al obtener permisos:', err);
            }
        };
        fetchPermissions();
    }, []);
    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4 text-gray-800">Lista de Permisos</h1>

            <table className="min-w-full border border-gray-300 rounded-lg shadow">
                <thead className="bg-gray-800 text-white">
                    <tr>
                        <th className="border px-4 py-2 text-left">Nombre</th>
                        <th className="border px-4 py-2 text-left">Código</th>
                        <th className="border px-4 py-2 text-center">Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {permissions.map((perm) => (
                        <tr
                            key={perm.id}
                            className="hover:bg-gray-600 transition-colors duration-150"
                        >
                            <td className="border px-4 py-2">{perm.name}</td>
                            <td className="border px-4 py-2">{perm.codename}</td>
                            <td className="border px-4 py-2 text-center space-x-2">
                                <button
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                                    onClick={() => navigate(`/dashboard/permissions/edit/${perm.id}`)}
                                >
                                    Editar
                                </button>
                                <button
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                                    onClick={() => console.log('Eliminar', perm.id)}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

};

export default PermissionList;
