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

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

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