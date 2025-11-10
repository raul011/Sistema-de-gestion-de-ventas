import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const totalItems = cartItems.reduce((total, item) => total + item.cantidad, 0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // NavBar para clientes o visitantes
  const ClientNav = () => (
    <>
      <Link to="/products" className="hover:text-purple-400">Productos</Link>
      <Link to="/categories" className="hover:text-purple-400">Categorías</Link>
      <Link to="/cart" className="relative hover:text-purple-400">
        <ShoppingCart size={22} />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-purple-500 text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </Link>
    </>
  );

  // NavBar para Admin o Empleado
  const AdminNav = ({ totalItems }) => (
    <>
      <Link to="/dashboard" className="hover:text-purple-400">Dashboard</Link>

      <Link to="/dashboard/pages/carrito" className="relative hover:text-purple-400 ml-4">
        <ShoppingCart size={22} />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-purple-500 text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </Link>
    </>
  );

  const rol = user?.role; // obtenemos el rol del usuario (Admin, Empleado, Cliente)

  return (
    <nav className="bg-gray-900 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">Smart-Car</Link>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {/* Mostrar ClientNav para visitantes o clientes */}
          {(!isAuthenticated || rol === 'Cliente') && <ClientNav />}

          {/* Mostrar AdminNav para Admin o Empleado */}
          {isAuthenticated && (rol === 'Admin' || rol === 'Empleado') && <AdminNav />}

          {/* Información de usuario / login */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-3">
              <span className="flex items-center gap-1">
                <User size={18} /> {user?.username}
              </span>
              <button onClick={handleLogout} className="hover:text-red-400 flex items-center gap-1">
                <LogOut size={18} /> Cerrar
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/login" className="hover:text-purple-400">Login</Link>
              <Link to="/register" className="bg-purple-500 px-3 py-1 rounded hover:bg-purple-600">Register</Link>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? 'Cerrar' : 'Menu'}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 p-4 flex flex-col space-y-2">
          {(!isAuthenticated || rol === 'Cliente') && <ClientNav />}
          {isAuthenticated && (rol === 'Admin' || rol === 'Empleado') && <AdminNav />}

          {isAuthenticated ? (
            <>
              <span>Hola, {user?.username}</span>
              <button onClick={handleLogout} className="text-red-400">Cerrar sesión</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
