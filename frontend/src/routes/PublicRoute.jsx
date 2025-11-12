import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Navigate to="/products" /> : children;
};

export default PublicRoute;
// // import App from './App';
// // import { AuthProvider } from './context/AuthContext';
// // import { CartProvider } from './context/CartContext';
// // import './index.css';
//