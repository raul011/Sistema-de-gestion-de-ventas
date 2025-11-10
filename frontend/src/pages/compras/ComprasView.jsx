import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Link } from 'react-router-dom';

const ComprasView = () => {
    const [compras, setCompras] = useState([]);
    const [busqueda, setBusqueda] = useState(""); // 🔍 estado del input de búsqueda
    const [filtradas, setFiltradas] = useState([]); // compras filtradas

    useEffect(() => {
        const fetchCompras = async () => {
            try {
                const res = await api.get('/compras/');
                console.log('📦 Datos de compras:', res.data);
                setCompras(res.data);
                setFiltradas(res.data); // inicializa la lista filtrada
            } catch (err) {
                console.error('❌ Error al cargar compras:', err);
            }
        };
        fetchCompras();
    }, []);

    // 🔍 Filtrar compras al escribir
    useEffect(() => {
        const resultado = compras.filter(c =>
            c.proveedor_nombre?.toLowerCase().includes(busqueda.toLowerCase())
        );
        setFiltradas(resultado);
    }, [busqueda, compras]);

    return (
        <div className="p-6 min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Compras</h1>

            {/* 🔍 Buscador */}
            <div className="mb-6 flex items-center justify-between">
                <input
                    type="text"
                    placeholder="Buscar por proveedor..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="px-4 py-2 w-1/3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-gray-800 placeholder-gray-500"
                />

                <Link
                    to="/dashboard/products"
                    className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                    Agregar Compra
                </Link>
            </div>

            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provedor</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filtradas.map(c => (
                            <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{c.proveedor_nombre}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-green-600 font-semibold">${c.total}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{c.fecha}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Link
                                        to={`/dashboard/compras/${c.id}`}
                                        className="text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        Ver
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {filtradas.length === 0 && (
                            <tr>
                                <td colSpan="4" className="text-center py-4 text-gray-500">
                                    No se encontraron compras.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ComprasView;
