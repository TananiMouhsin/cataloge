import React from 'react';
import { ShoppingBag, Users, Clock, TrendingUp, Package, DollarSign } from 'lucide-react';
import Card from '../../components/admin/UI/Card';
import Table from '../../components/admin/UI/Table';
import { AdminCart } from '../../types';
import { mockCarts, mockProducts } from '../../data/adminData';

const Carts: React.FC = () => {
  // Calculate statistics
  const totalCarts = mockCarts.length;
  const totalItems = mockCarts.reduce((sum, cart) => 
    sum + cart.products.reduce((cartSum, item) => cartSum + item.quantity, 0), 0
  );
  const totalValue = mockCarts.reduce((sum, cart) => 
    sum + cart.products.reduce((cartSum, item) => 
      cartSum + (item.product.prix * item.quantity), 0
    ), 0
  );
  const avgCartValue = totalCarts > 0 ? totalValue / totalCarts : 0;

  const columns = [
    { key: 'id_panier', label: 'ID Panier' },
    { 
      key: 'date_creation', 
      label: 'Date de création',
      render: (value: string) => new Date(value).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    {
      key: 'products',
      label: 'Produits',
      render: (value: any, row: AdminCart) => (
        <div className="space-y-1">
          {row.products.map((item, index) => (
            <div key={index} className="text-sm flex items-center space-x-2">
              <Package className="w-4 h-4 text-gray-400" />
              <span>{item.product.nom} x{item.quantity}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: 'total_items',
      label: 'Total Items',
      render: (value: any, row: AdminCart) => 
        row.products.reduce((sum, item) => sum + item.quantity, 0)
    },
    {
      key: 'total_value',
      label: 'Valeur Totale',
      render: (value: any, row: AdminCart) => {
        const total = row.products.reduce((sum, item) => 
          sum + (item.product.prix * item.quantity), 0
        );
        return `$${total.toFixed(2)}`;
      }
    },
    {
      key: 'status',
      label: 'Statut',
      render: () => (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
          Actif
        </span>
      )
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header with enhanced styling */}
      <div className="bg-gradient-to-r from-secondary to-accent rounded-lg p-6 text-white">
        <div className="flex items-center">
          <div className="p-3 bg-white bg-opacity-20 rounded-lg mr-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Paniers</h1>
            <p className="text-primary/90 mt-1">Surveillez l'activité des paniers de vos clients</p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 border-l-4 border-l-secondary">
          <div className="flex items-center">
            <div className="p-3 bg-secondary/10 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-secondary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Paniers Actifs</p>
              <p className="text-2xl font-semibold text-gray-900">{totalCarts}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-primary">
          <div className="flex items-center">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-semibold text-gray-900">{totalItems}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-accent">
          <div className="flex items-center">
            <div className="p-3 bg-accent/10 rounded-lg">
              <DollarSign className="w-6 h-6 text-accent" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Valeur Totale</p>
              <p className="text-2xl font-semibold text-gray-900">${totalValue.toFixed(2)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-secondary">
          <div className="flex items-center">
            <div className="p-3 bg-secondary/10 rounded-lg">
              <TrendingUp className="w-6 h-6 text-secondary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Valeur Moyenne</p>
              <p className="text-2xl font-semibold text-gray-900">${avgCartValue.toFixed(2)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Activity Summary */}
      <Card className="p-6 bg-gradient-to-r from-secondary/5 to-accent/5 border border-secondary/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-secondary">Activité des Paniers</h3>
            <p className="text-sm text-accent">Aperçu de l'engagement client</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-secondary">{totalItems}</p>
            <p className="text-sm text-accent">items dans {totalCarts} paniers</p>
          </div>
        </div>
      </Card>

      {/* Carts Table */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Liste des Paniers</h3>
          <p className="text-sm text-gray-600 mt-1">Détails de tous les paniers actifs</p>
        </div>
        <Table columns={columns} data={mockCarts} />
      </Card>
    </div>
  );
};

export default Carts;
