import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
//import ProductsPage from './pages/ProductsPage';
//import ProductDetail from './pages/ProductDetail';
//import CategoriesPage from './components/CategoriesPage';
import Checkout from './pages/Checkout';
import CheckoutSuccess from './pages/CheckoutSuccess';
import Cart from './components/Cart';
import Orders from './pages/Orders';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import PublicRoute from './routes/PublicRoute';

import RolesView from './pages/roles/RolesView';
import EditRoleView from './pages/roles/EditRoleView';
import UsersView from './pages/usuarios/UsersView';
import UserAdd from './pages/usuarios/UserAdd';
import UserEdit from './pages/usuarios/UserEdit';
import PermissionList from './pages/permisos/PermissionList';
import ProveedoresView from './pages/proveedores/ProveedoresView';
import PermissionEdit from './pages/permisos/PermissionEdit';
import ProveedorAdd from './pages/proveedores/ProveedorAdd';
import ComprasView from './pages/compras/ComprasView';
import CompraAdd from './pages/compras/CompraAdd';
import CompraEdit from './pages/compras/CompraEdit';
import CompraDetail from './pages/compras/CompraDetail';
import ProductsPage from './pages/productos/ProductsPage';
import ProductDetail from './pages/productos/ProductDetail';
import ProductAdd from './pages/productos/ProductAdd';
import ProductEdit from './pages/productos/ProductEdit';
import CategoriesPage from './pages/categorias/CategoriesPage';
import CategoryAdd from './pages/categorias/CategoryAdd';
import CartPage from './pages/carrito/CartPage';
import CategoryProductsPage from './pages/categorias/CategoryProductsPage';
//import CategoryEdit from './pages/categorias/CategoryEdit';
import VentasView from './pages/ventas/VentasView';
import VentaDetail from './pages/ventas/VentaDetail';
import AddVenta from './pages/ventas/AddVenta';
import AddCompra from "./pages/compras/AddCompra";
//import AddVenta from "./pages/ventas/AddVenta";
import AddPermission from './pages/permisos/AddPermission';
import ReportesPage from './pages/reportes/ReportesPage';
import ReporteGenerar from './pages/reportes/ReporteGenerar';
import ReporteList from './pages/reportes/ReporteList';
import ComandoVozForm from './pages/reportes/ComandoVozForm';

// <Route path="categories/edit/:id" element={<CategoryEdit />} />

import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import AddRoleView from './pages/roles/AddRoleView';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe("pk_test_51Rr2tML8ccCTVK8L6OPnA6cckVYWdmha7rK26Jb8Z8UntW6dsYvcDxY88PR9nPiBOkZLJ8naIBIvZfdg2gsfMmm1004xhsQvv1");

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        {/* Página principal */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />

          <Route path="roles/ver" element={<RolesView />} />
          <Route path="roles/add" element={<AddRoleView />} />
          <Route path="roles/edit/:id" element={<EditRoleView />} />

          {/* Usuarios */}
          <Route path="users/ver" element={<UsersView />} />
          <Route path="users/add" element={<UserAdd />} />
          <Route path="users/edit/:id" element={<UserEdit />} />

          <Route path="permissions/ver" element={<PermissionList />} />
          <Route path="permissions/edit/:id" element={<PermissionEdit />} />
          <Route path="permissions/add" element={<AddPermission />} />

          <Route path="ventas/ver" element={<VentasView />} />
          <Route path="ventas/detalle/:id" element={<VentaDetail />} />
          <Route path="ventas/agregar" element={<AddVenta />} />

          {/* Proveedores */}
          <Route path="proveedores/ver" element={<ProveedoresView />} />
          <Route path="proveedores/add" element={<ProveedorAdd />} />

          {/* Productos */}
          <Route path="products" element={<ProductsPage />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="products/add" element={<ProductAdd />} />
          <Route path="products/edit/:id" element={<ProductEdit />} />

          <Route path="categories" element={<CategoriesPage />} />
          <Route path="categories/add" element={<CategoryAdd />} />


          {/* Compras */}
          <Route path="compras/ver" element={<ComprasView />} />
          <Route path="compras/add/:id" element={<CompraAdd />} />
          <Route path="compras/edit/:id" element={<CompraEdit />} />
          <Route path="compras/:id" element={<CompraDetail />} /> {/* opcional para detalle */}
          <Route path="compras/agregar" element={<AddCompra />} />

          {/* Carrito */}
          <Route path="pages/carrito" element={<CartPage />} />
          {/*<Route path="pages/carrito/checkout" element={<Checkout />} />*/}

          {/* === Reportes === */}
          <Route path="reportes" element={<ReportesPage />} />         {/* Página principal de reportes */}
          <Route path="reportes/generar" element={<ReporteGenerar />} />   {/* Generar reporte */}
          <Route path="reportes/listar" element={<ReporteList />} />        {/* Listar reportes */}
          <Route path="reportes/voz" element={<ComandoVozForm />} />       {/* Comandos de voz */}

        </Route>


        <Route path="/products/category/:id" element={<CategoryProductsPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/category/:id" element={<ProductsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route

        
          path="/checkout"
          element={
            <Elements stripe={stripePromise}>
              <Checkout />
            </Elements>
          }
        />
        <Route path="/checkout-success" element={<CheckoutSuccess />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/compras/add/:id" element={<CompraAdd />} />
        {/* Auth */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
