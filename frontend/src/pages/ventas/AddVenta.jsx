import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import api from "../../api/axios";
import { toast } from "react-toastify";

const AddVenta = () => {
    const { cartItems, removeFromCart } = useCart();
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [clientes, setClientes] = useState([]);
    const [selectedCliente, setSelectedCliente] = useState("");

    // Calcular subtotal
    const subtotal = useMemo(() => {
        return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    }, [cartItems]);

    // Cargar clientes (usuarios con rol = Cliente)
    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const res = await api.get("/users/"); // Ajusta según tu backend

                console.log("📦 Datos recibidos de /users/:", res.data);

                // Filtramos solo los que tienen rol "Cliente"
                const usuarios = Array.isArray(res.data) ? res.data : res.data.results || [];
                console.log("🧾 Lista de usuarios normalizada:", usuarios);

                const clientesFiltrados = usuarios.filter(
                    (user) => user.role === "Cliente" || user.tipo_usuario === "Cliente"
                );

                console.log("✅ Clientes filtrados:", clientesFiltrados);

                setClientes(clientesFiltrados);
            } catch (err) {
                console.error("❌ Error cargando clientes:", err);
            }
        };

        fetchClientes();
    }, []);

    // Enviar venta al backend
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedCliente) {
            setError("Debes seleccionar un cliente");
            return;
        }

        try {
            const detalles = cartItems.map((item) => ({
                producto_id: item.id,
                cantidad: item.quantity,
                precio_unitario: item.price,
            }));

            const data = {
                cliente: Number(selectedCliente),
                detalles,
            };

            console.log("📦 Enviando venta:", data);

            await api.post("/ventas/", data); // Ajusta la ruta según tu backend

            toast.success("✅ Venta registrada correctamente");
            cartItems.forEach((item) => removeFromCart(item.id));
            navigate("/dashboard/ventas/ver");
        } catch (err) {
            console.error(err);
            setError("Ocurrió un error al registrar la venta");
        }
    };

    if (cartItems.length === 0)
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-8 bg-white rounded-xl shadow-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Tu carrito está vacío</h2>
                    <p className="text-gray-500">Agrega productos desde la tienda para continuar.</p>
                </div>
            </div>
        );

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10 px-4">
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 space-y-6">
                <h1 className="text-3xl font-bold text-gray-900 text-center">Confirmar Venta</h1>

                {/* Selección de cliente */}
                <div className="space-y-2">
                    <label className="block font-medium text-gray-700">Cliente</label>
                    <select
                        value={selectedCliente}
                        onChange={(e) => setSelectedCliente(e.target.value)}
                        className="w-full p-3 border rounded-lg bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="" className="text-gray-700">Selecciona un cliente</option>
                        {Array.isArray(clientes) &&
                            clientes.map((c) => (
                                <option key={c.id} value={c.id} className="text-gray-900">
                                    {c.username} 
                                </option>
                            ))}
                    </select>
                </div>

                {/* Lista de productos */}
                <div className="space-y-4">
                    {cartItems.map((item) => (
                        <div
                            key={item.id}
                            className="flex justify-between items-center p-4 border rounded-lg bg-gray-50"
                        >
                            <div>
                                <p className="font-medium text-gray-800">{item.name}</p>
                                <p className="text-gray-500 text-sm">Cantidad: {item.quantity}</p>
                            </div>
                            <div className="text-gray-800 font-semibold">
                                ${(item.price * item.quantity).toFixed(2)}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Subtotal */}
                <div className="flex justify-between items-center text-lg font-bold text-gray-900 border-t pt-4">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>

                {error && <p className="text-red-600 font-medium text-center">{error}</p>}

                <button
                    onClick={handleSubmit}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
                >
                    Finalizar Venta
                </button>
            </div>
        </div>
    );
};

export default AddVenta;
