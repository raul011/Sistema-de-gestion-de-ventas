import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // contexto que contiene el usuario
import axios from '../api/axios';

//esta funcion se ejecuta automaticamente cuando se ejecuta este componente

const DashboardSidebar = () => {
  const { user } = useAuth();
  const [userPermissions, setUserPermissions] = useState([]);

  useEffect(() => {
    const fetchPermissions = async () => {
      if (!user) return;
      try {
        const res = await axios.get('/roles/user-permissions/'); // ruta al endpoint
        setUserPermissions(res.data.permissions);
        // 👇 Agrega esto para ver qué se guardó exactamente
        console.log('Contenido de userPermissions:', res.data.permissions);
      } catch (err) {
        console.error('Error al obtener permisos:', err);
      }
    };
    fetchPermissions();
  }, [user]);
  // Helper: comprobar si el usuario tiene un permiso concreto
  const hasPermission = (perm) => userPermissions.includes(perm);
  console.log("🔐 Rol del usuario:", user?.role);
  // Estados para desplegar submenús
  const [usuariosOpen, setUsuariosOpen] = useState(false);
  const [rolesOpen, setRolesOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [permisosOpen, setPermisosOpen] = useState(false);
  const [proveedoresOpen, setProveedoresOpen] = useState(false);
  const [comprasOpen, setComprasOpen] = useState(false);
  const [ventasOpen, setVentasOpen] = useState(false);
  const [productosOpen, setProductosOpen] = useState(false);
  const [categoriasOpen, setCategoriasOpen] = useState(false);
  const [reportesOpen, setReportesOpen] = useState(false);

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

        {/* === Usuarios === */}
        {(hasPermission('Ver usuarios') ||
          hasPermission('Agregar usuarios') ||
          hasPermission('delete_user')) && (
            <div>
              <button
                onClick={() => setUsuariosOpen(!usuariosOpen)}
                className="w-full text-left py-2 px-4 rounded hover:bg-gray-700 flex justify-between items-center transition-colors"
              >
                Usuarios
                <span
                  className={`transform transition-transform ${usuariosOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                >
                  &#9660;
                </span>
              </button>
              {usuariosOpen && (
                <div className="ml-4 mt-1 space-y-1">
                  {hasPermission('Agregar usuarios') && (
                    <Link
                      to="/dashboard/users/add"
                      className="block py-1 px-2 rounded hover:bg-gray-700"
                    >
                      Agregar
                    </Link>
                  )}
                  {hasPermission('delete_user') && (
                    <Link
                      to="/dashboard/users/delete"
                      className="block py-1 px-2 rounded hover:bg-gray-700"
                    >
                      Eliminar
                    </Link>
                  )}
                  {hasPermission('Ver usuarios') && (
                    <Link
                      to="/dashboard/users/ver"
                      className="block py-1 px-2 rounded hover:bg-gray-700"
                    >
                      Ver
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}

        {/* === Roles === */}
        {(hasPermission('Ver roles') ||
          hasPermission('Agregar roles') ||
          hasPermission('delete_role')) && (
            <div>
              <button
                onClick={() => setRolesOpen(!rolesOpen)}
                className="w-full text-left py-2 px-4 rounded hover:bg-gray-700 flex justify-between items-center transition-colors"
              >
                Roles
                <span
                  className={`transform transition-transform ${rolesOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                >
                  &#9660;
                </span>
              </button>
              {rolesOpen && (
                <div className="ml-4 mt-1 space-y-1">
                  {hasPermission('Agregar roles') && (
                    <Link
                      to="/dashboard/roles/add"
                      className="block py-1 px-2 rounded hover:bg-gray-700"
                    >
                      Agregar
                    </Link>
                  )}
                  {hasPermission('delete_role') && (
                    <Link
                      to="/dashboard/roles/delete"
                      className="block py-1 px-2 rounded hover:bg-gray-700"
                    >
                      Eliminar
                    </Link>
                  )}
                  {hasPermission('Ver roles') && (
                    <Link
                      to="/dashboard/roles/ver"
                      className="block py-1 px-2 rounded hover:bg-gray-700"
                    >
                      Ver
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}

        {/* === Permisos === */}
        {(hasPermission('Ver permisos') ||
          hasPermission('Agregar permisos') ||
          hasPermission('delete_permission')) && (
            <div>
              <button
                onClick={() => setPermisosOpen(!permisosOpen)}
                className="w-full text-left py-2 px-4 rounded hover:bg-gray-700 flex justify-between items-center transition-colors"
              >
                Permisos
                <span
                  className={`transform transition-transform ${permisosOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                >
                  &#9660;
                </span>
              </button>
              {permisosOpen && (
                <div className="ml-4 mt-1 space-y-1">
                  {hasPermission('Ver permisos') && (
                    <Link
                      to="/dashboard/permissions/ver"
                      className="block py-1 px-2 rounded hover:bg-gray-700"
                    >
                      Ver
                    </Link>
                  )}
                  {hasPermission('Agregar permisos') && (
                    <Link
                      to="/dashboard/permissions/add"
                      className="block py-1 px-2 rounded hover:bg-gray-700"
                    >
                      Agregar
                    </Link>
                  )}
                  {hasPermission('delete_permission') && (
                    <Link
                      to="/dashboard/permissions/delete"
                      className="block py-1 px-2 rounded hover:bg-gray-700"
                    >
                      Eliminar
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}

        {/* === Proveedores === */}
        {(hasPermission('Ver proveedores') ||
          hasPermission('Agregar proveedores') ||
          hasPermission('delete_supplier')) && (
            <div>
              <button
                onClick={() => setProveedoresOpen(!proveedoresOpen)}
                className="w-full text-left py-2 px-4 rounded hover:bg-gray-700 flex justify-between items-center transition-colors"
              >
                Proveedores
                <span
                  className={`transform transition-transform ${proveedoresOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                >
                  &#9660;
                </span>
              </button>
              {proveedoresOpen && (
                <div className="ml-4 mt-1 space-y-1">
                  {hasPermission('Ver proveedores') && (
                    <Link
                      to="/dashboard/proveedores/ver"
                      className="block py-1 px-2 rounded hover:bg-gray-700"
                    >
                      Ver
                    </Link>
                  )}
                  {hasPermission('Agregar proveedores') && (
                    <Link
                      to="/dashboard/proveedores/add"
                      className="block py-1 px-2 rounded hover:bg-gray-700"
                    >
                      Agregar
                    </Link>
                  )}
                  {hasPermission('delete_supplier') && (
                    <Link
                      to="/dashboard/proveedores/delete"
                      className="block py-1 px-2 rounded hover:bg-gray-700"
                    >
                      Eliminar
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}

        {/* === Productos === */}
        {(hasPermission('Ver productos') || hasPermission('Agregar productos')) && (
          <div>
            <button
              onClick={() => setProductosOpen(!productosOpen)}
              className="w-full text-left py-2 px-4 rounded hover:bg-gray-700 flex justify-between items-center transition-colors"
            >
              Productos
              <span
                className={`transform transition-transform ${productosOpen ? 'rotate-180' : 'rotate-0'
                  }`}
              >
                &#9660;
              </span>
            </button>
            {productosOpen && (
              <div className="ml-4 mt-1 space-y-1">
                {hasPermission('Ver productos') && (
                  <Link
                    to="/dashboard/products"
                    className="block py-1 px-2 rounded hover:bg-gray-700"
                  >
                    Ver
                  </Link>
                )}
                {hasPermission('Agregar productos') && (
                  <Link
                    to="/dashboard/products/add"
                    className="block py-1 px-2 rounded hover:bg-gray-700"
                  >
                    Agregar
                  </Link>
                )}
              </div>
            )}
          </div>
        )}

        {/* === Categorías === */}
        {(hasPermission('Ver categorías') || hasPermission('Agregar categorías')) && (
          <div>
            <button
              onClick={() => setCategoriasOpen(!categoriasOpen)}
              className="w-full text-left py-2 px-4 rounded hover:bg-gray-700 flex justify-between items-center transition-colors"
            >
              Categorías
              <span
                className={`transform transition-transform ${categoriasOpen ? 'rotate-180' : 'rotate-0'
                  }`}
              >
                &#9660;
              </span>
            </button>
            {categoriasOpen && (
              <div className="ml-4 mt-1 space-y-1">
                {hasPermission('Ver categorías') && (
                  <Link
                    to="/dashboard/categories"
                    className="block py-1 px-2 rounded hover:bg-gray-700"
                  >
                    Ver
                  </Link>
                )}
                {hasPermission('Agregar categorías') && (
                  <Link
                    to="/dashboard/categories/add"
                    className="block py-1 px-2 rounded hover:bg-gray-700"
                  >
                    Agregar
                  </Link>
                )}
              </div>
            )}
          </div>
        )}

        {/* === Ventas === */}
        {(hasPermission('Ver ventas') || hasPermission('Agregar ventas')) && (
          <div>
            <button
              onClick={() => setVentasOpen(!ventasOpen)}
              className="w-full text-left py-2 px-4 rounded hover:bg-gray-700 flex justify-between items-center transition-colors"
            >
              Ventas
              <span
                className={`transform transition-transform ${ventasOpen ? 'rotate-180' : 'rotate-0'
                  }`}
              >
                &#9660;
              </span>
            </button>
            {ventasOpen && (
              <div className="ml-4 mt-1 space-y-1">
                {hasPermission('Ver ventas') && (
                  <Link
                    to="/dashboard/ventas/ver"
                    className="block py-1 px-2 rounded hover:bg-gray-700"
                  >
                    Ver
                  </Link>
                )}
                {hasPermission('Agregar ventas') && (
                  <Link
                    to="/dashboard/products"
                    className="block py-1 px-2 rounded hover:bg-gray-700"
                  >
                    Agregar
                  </Link>
                )}
              </div>
            )}
          </div>
        )}

        {/* === Compras === */}
        {['Ver compras', 'Agregar compras'].some(hasPermission) && (
          <div>
            <button
              onClick={() => setComprasOpen(!comprasOpen)}
              className="w-full text-left py-2 px-4 rounded hover:bg-gray-700 flex justify-between items-center transition-colors"
            >
              Compras
              <span
                className={`transform transition-transform ${comprasOpen ? 'rotate-180' : 'rotate-0'}`}
              >
                &#9660;
              </span>
            </button>
            {comprasOpen && (
              <div className="ml-4 mt-1 space-y-1">
                {hasPermission('Ver compras') && (
                  <Link
                    to="/dashboard/compras/ver"
                    className="block py-1 px-2 rounded hover:bg-gray-700"
                  >
                    Ver
                  </Link>
                )}
                {hasPermission('Agregar compras') && (
                  <Link
                    to="/dashboard/products"
                    className="block py-1 px-2 rounded hover:bg-gray-700"
                  >
                    Agregar
                  </Link>
                )}
              </div>
            )}
          </div>
        )}

        {/* === Reportes === */}
        {(hasPermission('Ver reportes') || hasPermission('Generar reportes') || hasPermission('Comandos de voz')) && (
          <div>
            <button
              onClick={() => setReportesOpen(!reportesOpen)}
              className="w-full text-left py-2 px-4 rounded hover:bg-gray-700 flex justify-between items-center transition-colors"
            >
              Reportes
              <span
                className={`transform transition-transform ${reportesOpen ? 'rotate-180' : 'rotate-0'}`}
              >
                &#9660;
              </span>
            </button>

            {reportesOpen && (
              <div className="ml-4 mt-1 space-y-1">
                {hasPermission('Generar reportes') && (
                  <Link
                    to="/dashboard/reportes/generar"
                    className="block py-1 px-2 rounded hover:bg-gray-700"
                  >
                    Generar
                  </Link>
                )}
                {hasPermission('Ver reportes') && (
                  <Link
                    to="/dashboard/reportes/listar"
                    className="block py-1 px-2 rounded hover:bg-gray-700"
                  >
                    Listar
                  </Link>
                )}
                {hasPermission('Comandos de voz') && (
                  <Link
                    to="/dashboard/reportes/voz"
                    className="block py-1 px-2 rounded hover:bg-gray-700"
                  >
                    Comandos de voz
                  </Link>
                )}
              </div>
            )}
          </div>
        )}



        {/* === Carrito === */}
        {(hasPermission('Ver carrito') || hasPermission('checkout_cart')) && (
          <div>
            <button
              onClick={() => setCartOpen(!cartOpen)}
              className="w-full text-left py-2 px-4 rounded hover:bg-gray-700 flex justify-between items-center transition-colors"
            >
              Carrito
              <span
                className={`transform transition-transform ${cartOpen ? 'rotate-180' : 'rotate-0'
                  }`}
              >
                &#9660;
              </span>
            </button>
            {cartOpen && (
              <div className="ml-4 mt-1 space-y-1">
                {hasPermission('Ver carrito') && (
                  <Link
                    to="/dashboard/pages/carrito"
                    className="block py-1 px-2 rounded hover:bg-gray-700"
                  >
                    Ver carrito
                  </Link>
                )}
                {hasPermission('checkout_cart') && (
                  <Link
                    to="/dashboard/pages/carrito/checkout"
                    className="block py-1 px-2 rounded hover:bg-gray-700"
                  >
                    Proceder al pago
                  </Link>
                )}
              </div>
            )}
          </div>
        )}
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
