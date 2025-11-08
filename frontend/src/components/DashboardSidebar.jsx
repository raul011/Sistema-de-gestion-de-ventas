import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // asegúrate de importar tu contexto
import { useState } from 'react';

const DashboardSidebar = () => {
  const { user } = useAuth(); // obtenemos el usuario y su rol
  // Estado para submenús

  // Estado para submenús
  const [usuariosOpen, setUsuariosOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false); // 👈 Este es el que falta
  const [rolesOpen, setRolesOpen] = useState(false);
  const [permisosOpen, setPermisosOpen] = useState(false);
  const [proveedoresOpen, setProveedoresOpen] = useState(false);
  const [comprasOpen, setComprasOpen] = useState(false);
  const [productosOpen, setProductosOpen] = useState(false);
  const [categoriasOpen, setCategoriasOpen] = useState(false);
  const [ventasOpen, setVentasOpen] = useState(false);

  return (
    <aside className="w-64 bg-gray-800 text-gray-100 flex flex-col h-screen">
      <div className="p-6 text-xl font-bold border-b border-gray-700">
        Mi Panel
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <Link
          to="/dashboard"
          className="block py-2 px-4 rounded hover:bg-gray-700 transition-colors"
        >
          Inicio
        </Link>

        {/* Solo Admin */}
        {user?.role === 'Admin' && (
          <>
            {/* Usuarios */}
            <div>
              <button
                onClick={() => setUsuariosOpen(!usuariosOpen)}
                className="w-full text-left py-2 px-4 rounded hover:bg-gray-700 flex justify-between items-center transition-colors"
              >
                Usuarios
                <span className={`transform transition-transform ${usuariosOpen ? 'rotate-180' : 'rotate-0'}`}>&#9660;</span>
              </button>
              {usuariosOpen && (
                <div className="ml-4 mt-1 space-y-1">
                  <Link to="/dashboard/users/add" className="block py-1 px-2 rounded hover:bg-gray-700">
                    Agregar
                  </Link>
                  <Link to="/dashboard/users/delete" className="block py-1 px-2 rounded hover:bg-gray-700">
                    Eliminar
                  </Link>
                  <Link to="/dashboard/users/ver" className="block py-1 px-2 rounded hover:bg-gray-700">
                    Ver
                  </Link>
                </div>
              )}
            </div>

            {/* Roles */}
            <div>
              <button
                onClick={() => setRolesOpen(!rolesOpen)}
                className="w-full text-left py-2 px-4 rounded hover:bg-gray-700 flex justify-between items-center transition-colors"
              >
                Roles
                <span className={`transform transition-transform ${rolesOpen ? 'rotate-180' : 'rotate-0'}`}>&#9660;</span>
              </button>
              {rolesOpen && (
                <div className="ml-4 mt-1 space-y-1">
                  <Link to="/dashboard/roles/add" className="block py-1 px-2 rounded hover:bg-gray-700">
                    Agregar
                  </Link>

                  <Link to="/dashboard/roles/delete" className="block py-1 px-2 rounded hover:bg-gray-700">
                    Eliminar
                  </Link>
                  <Link to="/dashboard/roles/ver" className="block py-1 px-2 rounded hover:bg-gray-700">
                    Ver
                  </Link>
                </div>
              )}
            </div>

            {/* Carrito */}
            <div>
              <button
                onClick={() => setCartOpen(!cartOpen)}
                className="w-full text-left py-2 px-4 rounded hover:bg-gray-700 flex justify-between items-center transition-colors"
              >
                Carrito
                <span className={`transform transition-transform ${cartOpen ? 'rotate-180' : 'rotate-0'}`}>&#9660;</span>
              </button>

              {cartOpen && (
                <div className="ml-4 mt-1 space-y-1">
                  <Link
                    to="/dashboard/pages/carrito"
                    className="block py-1 px-2 rounded hover:bg-gray-700"
                  >
                    Ver carrito
                  </Link>

                  <Link
                    to="/dashboard/pages/carrito/checkout"
                    className="block py-1 px-2 rounded hover:bg-gray-700"
                  >
                    Proceder al pago
                  </Link>
                </div>
              )}
            </div>

            {/* Permisos */}
            <div>
              <button
                onClick={() => setPermisosOpen(!permisosOpen)}
                className="w-full text-left py-2 px-4 rounded hover:bg-gray-700 flex justify-between items-center transition-colors"
              >
                Permisos
                <span className={`transform transition-transform ${permisosOpen ? 'rotate-180' : 'rotate-0'}`}>&#9660;</span>
              </button>
              {permisosOpen && (
                <div className="ml-4 mt-1 space-y-1">
                  <Link to="/dashboard/permissions/ver" className="block py-1 px-2 rounded hover:bg-gray-700">
                    Ver
                  </Link>
                  <Link to="/dashboard/permissions/add" className="block py-1 px-2 rounded hover:bg-gray-700">
                    Agregar
                  </Link>
                  <Link to="/dashboard/permissions/delete" className="block py-1 px-2 rounded hover:bg-gray-700">
                    Eliminar
                  </Link>
                </div>
              )}
            </div>

            {/* Proveedores */}
            <div>
              <button
                onClick={() => setProveedoresOpen(!proveedoresOpen)}
                className="w-full text-left py-2 px-4 rounded hover:bg-gray-700 flex justify-between items-center transition-colors"
              >
                Proveedores
                <span className={`transform transition-transform ${proveedoresOpen ? 'rotate-180' : 'rotate-0'}`}>&#9660;</span>
              </button>
              {proveedoresOpen && (
                <div className="ml-4 mt-1 space-y-1">
                  <Link to="/dashboard/proveedores/ver" className="block py-1 px-2 rounded hover:bg-gray-700">
                    Ver
                  </Link>
                  <Link to="/dashboard/proveedores/add" className="block py-1 px-2 rounded hover:bg-gray-700">
                    Agregar
                  </Link>
                  <Link to="/dashboard/proveedores/delete" className="block py-1 px-2 rounded hover:bg-gray-700">
                    Eliminar
                  </Link>

                </div>
              )}
            </div>

            {/* Compras */}
            <div>
              <button
                onClick={() => setComprasOpen(!comprasOpen)}
                className="w-full text-left py-2 px-4 rounded hover:bg-gray-700 flex justify-between items-center transition-colors"
              >
                Compras
                <span className={`transform transition-transform ${comprasOpen ? 'rotate-180' : 'rotate-0'}`}>&#9660;</span>
              </button>
              {comprasOpen && (
                <div className="ml-4 mt-1 space-y-1">
                  <Link
                    to="/dashboard/compras/ver"
                    className="block py-1 px-2 rounded hover:bg-gray-700"
                  >
                    Ver
                  </Link>
                  <Link
                    to="/dashboard/products"
                    className="block py-1 px-2 rounded hover:bg-gray-700"
                  >
                    Agregar
                  </Link>
                  {/* Editar no se pone aquí porque requiere un ID */}
                  {/* Detalle tampoco se pone aquí porque depende de la compra seleccionada */}
                </div>
              )}
            </div>
            {/* Botón Ventas */}
            <button
              onClick={() => setVentasOpen(!ventasOpen)}
              className="w-full text-left px-4 py-2 rounded hover:bg-gray-700 flex justify-between items-center"
            >
              Ventas
              <span className={`transform transition-transform ${ventasOpen ? 'rotate-180' : 'rotate-0'}`}>&#9660;</span>
            </button>

            {/* Submenú Ventas */}
            {ventasOpen && (
              <div className="ml-4 mt-1 space-y-1">
                <Link
                  to="/dashboard/ventas/ver"
                  className="block py-1 px-2 rounded hover:bg-gray-700"
                >
                  Ver
                </Link>
                <Link
                  to="/dashboard/products"
                  className="block py-1 px-2 rounded hover:bg-gray-700"
                >
                  Agregar
                </Link>
                {/* Editar o Detalle no se pone aquí porque requiere un ID */}
              </div>
            )}

            {/* Productos */}
            <div>
              <button
                onClick={() => setProductosOpen(!productosOpen)}
                className="w-full text-left py-2 px-4 rounded hover:bg-gray-700 flex justify-between items-center transition-colors"
              >
                Productos
                <span className={`transform transition-transform ${productosOpen ? 'rotate-180' : 'rotate-0'}`}>&#9660;</span>
              </button>
              {productosOpen && (
                <div className="ml-4 mt-1 space-y-1">
                  <Link
                    to="/dashboard/products"
                    className="block py-1 px-2 rounded hover:bg-gray-700"
                  >
                    Ver
                  </Link>
                  <Link
                    to="/dashboard/products/add"
                    className="block py-1 px-2 rounded hover:bg-gray-700"
                  >
                    Agregar
                  </Link>
                  {/* Editar y Detalle no se ponen aquí porque requieren un ID */}
                </div>
              )}
            </div>

            {/* Categorías */}
            <div>
              <button
                onClick={() => setCategoriasOpen(!categoriasOpen)}
                className="w-full text-left py-2 px-4 rounded hover:bg-gray-700 flex justify-between items-center transition-colors"
              >
                Categorías
                <span className={`transform transition-transform ${categoriasOpen ? 'rotate-180' : 'rotate-0'}`}>&#9660;</span>
              </button>
              {categoriasOpen && (
                <div className="ml-4 mt-1 space-y-1">
                  <Link
                    to="/dashboard/categories"
                    className="block py-1 px-2 rounded hover:bg-gray-700"
                  >
                    Ver
                  </Link>
                  <Link
                    to="/dashboard/categories/add"
                    className="block py-1 px-2 rounded hover:bg-gray-700"
                  >
                    Agregar
                  </Link>
                  {/* Editar y Detalle no se ponen aquí porque requieren un ID */}
                </div>
              )}
            </div>



          </>
        )}
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
