import { useEffect, useState } from "react";
import { useAuth } from '../context/AuthContext';
import api from "../api/axios"; // Ajusta según tu configuración

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalVentas: 0,
        totalClientes: 0,
        totalProveedores: 0,
        ventasMes: 0
    });
    const [ultimasVentas, setUltimasVentas] = useState([]);
    useEffect(() => {
        console.log("✅ Entró al componente Dashboard.jsx");

        const fetchDashboardData = async () => {
            try {
                const ventasRes = await api.get("/ventas/");

                const clientesRes = await api.get("/users/");
                console.log("✅ Clientes:", clientesRes.data);
                const proveedoresRes = await api.get("/proveedores/ver/");

                const ventas = ventasRes.data.results || [];
                const clientes = clientesRes.data.results || [];
                const proveedores = proveedoresRes.data.results || [];
                // Filtrar solo clientes según "role"
                const clientesActivos = clientes.filter(c => c.role?.toLowerCase() === "Cliente");
                console.log('clienteeeeeees', clientesActivos.length);
                // Calcular ventas del mes
                const mesActual = new Date().getMonth();
                const ventasMes = ventas
                    .filter(v => new Date(v.fecha).getMonth() === mesActual)
                    .reduce((acc, v) => acc + v.total, 0);

                setStats({
                    totalVentas: ventas.length,
                    totalClientes: clientesActivos.length,
                    totalProveedores: proveedores.length,
                    ventasMes
                });

                // Últimas 5 ventas
                const ultimas = ventas
                    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
                    .slice(0, 5);

                setUltimasVentas(ultimas);

            } catch (err) {
                console.error("Error cargando datos del dashboard:", err);
            }
        };

        fetchDashboardData();
    }, []);


    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">
                Bienvenido, {user?.nombre || 'Usuario'}!
            </h1>

            {/* Tarjetas de KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-purple-500 text-white p-4 rounded shadow">
                    <p className="text-sm">Total Ventas</p>
                    <p className="text-2xl font-bold">{stats.totalVentas}</p>
                </div>
                <div className="bg-blue-500 text-white p-4 rounded shadow">
                    <p className="text-sm">Clientes</p>
                    <p className="text-2xl font-bold">{stats.totalClientes}</p>
                </div>
                <div className="bg-green-500 text-white p-4 rounded shadow">
                    <p className="text-sm">Proveedores</p>
                    <p className="text-2xl font-bold">{stats.totalProveedores}</p>
                </div>
                <div className="bg-yellow-500 text-white p-4 rounded shadow">
                    <p className="text-sm">Ventas este mes</p>
                    <p className="text-2xl font-bold">${stats.ventasMes}</p>
                </div>
            </div>

            {/* Últimas ventas */}
            <div>
                <h2 className="text-xl font-bold mb-2 text-gray-800">Últimas ventas</h2>
                <ul className="bg-white shadow rounded p-4 space-y-2 text-gray-800">
                    {ultimasVentas.length === 0 && <li>No hay ventas recientes</li>}
                    {ultimasVentas.map(v => (
                        <li key={v.id} className="border-b py-2 flex justify-between">
                            <span>Venta #{v.id} - {v.cliente_username}</span>
                            <span>${v.total}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;
