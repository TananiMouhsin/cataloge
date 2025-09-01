import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalogue from './pages/Catalogue';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Login from './pages/Login';

// Admin components
import AdminLayout from './components/admin/Layout/Layout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminCategoriesAndBrands from './pages/admin/CategoriesAndBrands';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import AdminCarts from './pages/admin/Carts';

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isAdminPage = location.pathname.startsWith('/admin');

  // Don't show navbar and footer for admin pages
  if (isAdminPage) {
    return (
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="categories-brands" element={<AdminCategoriesAndBrands />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="carts" element={<AdminCarts />} />
        </Route>
      </Routes>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/produit/:id" element={<Product />} />
          <Route path="/panier" element={<Cart />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
      {!isLoginPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppContent />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;