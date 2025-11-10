import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from "lucide-react";
import { toast } from "react-toastify";
import { useCart } from "../../context/CartContext"; // Contexto del carrito

// Subcomponente cuando el carrito está vacío
const EmptyCart = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
    <ShoppingBag size={64} className="text-gray-400 mb-4" />
    <h2 className="text-2xl font-bold mb-2">Tu carrito está vacío</h2>
    <p className="text-gray-500 mb-4">Agrega productos desde la tienda</p>
    <Link
      to="/dashboard/products"
      className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
    >
      Ir a la tienda
    </Link>
  </div>
);

// Subcomponente para cada producto en el carrito
const CartItem = ({ item, handleIncrease, handleDecrease, handleRemove }) => (
  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 bg-blue-600 rounded shadow mb-4">
    {/* Imagen y nombre */}
    <div className="md:col-span-6 flex items-center gap-4">
      <Link to={`/dashboard/product/${item.id}`} className="w-20 h-20 flex-shrink-0">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
      </Link>
      <div className="flex flex-col">
        <Link to={`/dashboard/product/${item.id}`} className="font-medium text-gray-800 hover:text-purple-600">
          {item.name}
        </Link>
        <button
          onClick={() => handleRemove(item.id)}
          className="text-red-500 text-sm mt-1 md:hidden"
        >
          <Trash2 size={14} /> Eliminar
        </button>
      </div>
    </div>

    {/* Precio */}
    <span>${(item.price * item.cantidad).toFixed(2)}</span>

    {/* Cantidad */}
    <div className="md:col-span-2 flex justify-center items-center gap-2">
      <button onClick={() => handleDecrease(item.id)} className="px-2 py-1 bg-black-700 rounded">-</button>
      <span>{item.quantity}</span>
      <button onClick={() => handleIncrease(item.id)} className="px-2 py-1 bg-black-700 rounded">+</button>
    </div>

    {/* Subtotal */}
    <div className="md:col-span-2 flex justify-center items-center gap-2">
      <span>${(item.price * item.quantity).toFixed(2)}</span>
      <button onClick={() => handleRemove(item.id)} className="text-red-500 hidden md:block">
        <Trash2 size={16} />
      </button>
    </div>
  </div>
);

// Componente resumen de pedido
const OrderSummary = ({ subtotal, totalItems }) => {
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  return (
    <div className="bg-black p-6 rounded shadow sticky top-4">
      <h2 className="text-xl font-bold mb-4">Resumen del pedido</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal ({totalItems} {totalItems === 1 ? "producto" : "productos"})</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Envío</span>
          <span>{shipping === 0 ? "Gratis" : `$${shipping.toFixed(2)}`}</span>
        </div>
        <div className="border-t mt-2 pt-2 flex justify-between font-bold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
      <Link
        to="/checkout"
        className="mt-4 block w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 text-center"
      >
        Proceder al pago
      </Link>
    </div>
  );
};

const CartPage = () => {
  const { cartItems, increaseQuantity, decreaseQuantity, removeFromCart } = useCart();
  const [isUpdating, setIsUpdating] = useState({});
  const navigate = useNavigate(); // <--- inicializa navigate
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cartItems]);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  if (cartItems.length === 0) return <EmptyCart />;

  const handleIncrease = (id) => {
    increaseQuantity(id);
  };

  const handleDecrease = (id) => {
    const item = cartItems.find((p) => p.id === id);
    if (item.quantity === 1) {
      removeFromCart(id);
      toast.info(`${item.name} eliminado del carrito`);
    } else {
      decreaseQuantity(id);
    }
  };

  const handleRemove = (id) => {
    const item = cartItems.find((p) => p.id === id);
    removeFromCart(id);
    toast.info(`${item.name} eliminado del carrito`);
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl  font-bold mb-6 text-red-500">Tu carrito ({totalItems} {totalItems === 1 ? "producto" : "productos"})</h1>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-2/3">
          {cartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              handleIncrease={handleIncrease}
              handleDecrease={handleDecrease}
              handleRemove={handleRemove}
            />
          ))}
          <div className="flex justify-between mt-4">
            <Link
              to="/products"
              className="text-purple-600 hover:text-purple-800 flex items-center gap-2"
            >
              <ArrowLeft size={18} /> Continuar comprando
            </Link>
            <button
              onClick={() => {
                cartItems.forEach(item => removeFromCart(item.id));
                toast.success("Carrito vaciado correctamente");
              }}
              className="text-red-500 hover:text-red-700 flex items-center gap-1"
            >
              <Trash2 size={16} /> Vaciar carrito
            </button>
          </div>
        </div>
        <div className="lg:w-1/3">
          <OrderSummary subtotal={subtotal} totalItems={totalItems} />
        </div>
      </div>
      {/* Botones adicionales */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate("/dashboard/compras/agregar")}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Comprar
            </button>

            <button
              onClick={() => navigate("/dashboard/ventas/agregar")}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Vender
            </button>
          </div>
    </div>
  );
};

export default CartPage;
