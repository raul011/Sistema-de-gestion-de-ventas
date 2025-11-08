import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import api from "../../api/axios";
import { toast } from "react-toastify";

const AddCompra = () => {
    const { cartItems, removeFromCart } = useCart();
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [proveedores, setProveedores] = useState([]);
    const [selectedProveedor, setSelectedProveedor] = useState("");

    const subtotal = useMemo(() => {
        return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    }, [cartItems]);

    // Cargar proveedores desde API
    useEffect(() => {
        const fetchProveedores = async () => {
            try {
                const res = await api.get("/proveedores/ver/"); // Ajusta la ruta según tu backend
                setProveedores(res.data.results);
            } catch (err) {
                console.error("Error cargando proveedores:", err);
            }
        };
        fetchProveedores();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedProveedor) {
            setError("Debes seleccionar un proveedor");
            return;
        }

        try {
            const detalles = cartItems.map((item) => ({
                producto_id: item.id,
                cantidad: item.quantity,
                precio_unitario: item.price,
            }));
            console.log({ proveedor:  Number(selectedProveedor), detalles });
            await api.post("/compras/crear/", { proveedor: selectedProveedor, detalles });
            toast.success("Compra creada correctamente");
            cartItems.forEach((item) => removeFromCart(item.id));
            navigate("/dashboard/compras/ver");
        } catch (err) {
            console.error(err);
            setError("Ocurrió un error al crear la compra");
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
                <h1 className="text-3xl font-bold text-gray-900 text-center">Confirmar Compra</h1>

                {/* Selección de proveedor */}
                <div className="space-y-2">
                    <label className="block font-medium text-gray-700">Provedor</label>
                    <select
                        value={selectedProveedor}
                        onChange={(e) => setSelectedProveedor(e.target.value)}
                        className="w-full p-3 border rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Selecciona un proveedor</option>
                        {Array.isArray(proveedores) && proveedores.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.nombre}
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
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
                >
                    Finalizar Compra
                </button>
            </div>
        </div>
    );
};

export default AddCompra;
