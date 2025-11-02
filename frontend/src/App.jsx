import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductsPage from './pages/ProductsPage';
import ProductDetail from './pages/ProductDetail';
import CategoriesPage from './components/CategoriesPage';
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
import PermissionEdit from './pages/permisos/PermissionEdit';
import ProveedoresView from './pages/proveedores/ProveedoresView';
import ProveedorAdd from './pages/proveedores/ProveedorAdd';

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
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="roles/ver" element={<RolesView />} />
          <Route path="roles/add" element={<AddRoleView />} />
          <Route path="roles/edit/:id" element={<EditRoleView />} />
          <Route path="users/ver" element={<UsersView />} />
          <Route path="users/add" element={<UserAdd />} />
          <Route path="users/edit/:id" element={<UserEdit />} />
          <Route path="permissions/ver" element={<PermissionList />} />
         <Route path="permissions/edit/:id" element={<PermissionEdit />} />
         <Route path="proveedores/ver" element={<ProveedoresView />} />
         <Route path="proveedores/add" element={<ProveedorAdd />} />
        </Route>

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
