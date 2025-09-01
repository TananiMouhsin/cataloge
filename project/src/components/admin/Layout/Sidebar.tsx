import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Tags,
  Building,
  ShoppingCart,
  ShoppingBag,
  BarChart3,
  Menu,
  X,
  Home,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/categories-brands', icon: Tags, label: 'Catégories & Marques' },
    { to: '/admin/products', icon: Package, label: 'Produits' },
    { to: '/admin/orders', icon: ShoppingCart, label: 'Commandes' },
    { to: '/admin/carts', icon: ShoppingBag, label: 'Paniers' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:flex-shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800 ml-3">Admin Panel</h1>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Back to main site link */}
        <div className="px-6 py-4 border-b border-gray-200">
          <Link
            to="/"
            className="flex items-center text-sm font-medium text-primary hover:text-secondary transition-colors"
          >
            <Home size={16} className="mr-2" />
            Retour au site
          </Link>
        </div>

        <nav className="mt-6">
          <div className="px-3">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 mb-1 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
                onClick={() => window.innerWidth < 1024 && onClose()}
              >
                <item.icon size={20} className="mr-3" />
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
