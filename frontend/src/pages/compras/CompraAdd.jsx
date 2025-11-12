import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

const CompraAdd = () => {
  const { id } = useParams(); // obtenemos el id del producto desde la URL
  const navigate = useNavigate();

  const [proveedores, setProveedores] = useState([]);
  const [producto, setProducto] = useState(null);
  const [proveedor, setProveedor] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [precio, setPrecio] = useState(0);

  // Cargar producto y proveedores
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Traer datos del producto con su id
        const resProd = await api.get(`/products/${id}/`);
        setProducto(resProd.data);
        setPrecio(resProd.data.price); // precio actual como valor inicial

        // Traer proveedores
        const resProv = await api.get("/proveedores/ver/");
        setProveedores(resProv.data.results || []);
      } catch (err) {
        console.error("Error al cargar los datos:", err);
      }
    };
    fetchData();
  }, [id]);

  const guardarCompra = async () => {
    if (!proveedor || !producto || cantidad <= 0 || precio <= 0) {
      alert("Debe completar todos los campos correctamente.");
      return;
    }

    const data = {
      proveedor: proveedor,
      total: cantidad * precio,
      detalles: [
        {
          producto_id: producto.id,
          cantidad: cantidad,
          precio_unitario: precio,
        },
      ],
    };

    try {
      console.log("Datos enviados:", data);
      await api.post("/compras/crear/cliente", data);
      alert("Compra registrada con éxito!");
      navigate("/dashboard/compras");
    } catch (err) {
      console.error("Error al guardar la compra:", err);
      alert("Error al registrar la compra.");
    }
  };

  if (!producto) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-300">
        Cargando producto...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-8">
      <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
        <h1 className="text-2xl font-bold mb-6 text-center text-white">
          Registrar Compra del Producto
        </h1>

        {/* Mostrar producto seleccionado */}
        <div className="flex items-center gap-6 mb-6">
          <img
            src={producto.image}
            alt={producto.name}
            className="w-40 h-40 object-cover rounded-lg border border-gray-700"
          />
          <div>
            <h2 className="text-xl font-semibold">{producto.name}</h2>
            <p className="text-gray-400">{producto.description}</p>
            <p className="text-green-400 mt-2 font-semibold">
              Precio actual: ${producto.price}
            </p>
            <p className="text-gray-400">
              Stock actual: {producto.stock} unidades
            </p>
          </div>
        </div>

        {/* Selección de proveedor */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold">Proveedor:</label>
          <select
            value={proveedor}
            onChange={(e) => setProveedor(e.target.value)}
            className="w-full p-2 bg-gray-700 rounded text-gray-100 border border-gray-600"
          >
            <option value="">Seleccione un proveedor</option>
            {proveedores.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Cantidad y nuevo precio */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block mb-2 font-semibold">Cantidad:</label>
            <input
              type="number"
              min="1"
              value={cantidad}
              onChange={(e) => setCantidad(parseInt(e.target.value))}
              className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-gray-100"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">Nuevo Precio:</label>
            <input
              type="number"
              min="0"
              value={precio}
              onChange={(e) => setPrecio(parseFloat(e.target.value))}
              className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-gray-100"
            />
          </div>
        </div>

        {/* Total */}
        <div className="text-right text-lg font-semibold text-white mb-6">
          Total:{" "}
          <span className="text-green-400">
            ${(cantidad * precio).toFixed(2)}
          </span>
        </div>

        {/* Botón guardar */}
        <div className="flex justify-end">
          <button
            onClick={guardarCompra}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition"
          >
            Guardar Compra
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompraAdd;
