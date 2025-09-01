import React from 'react';
import { ShoppingCart, Clock, CheckCircle, XCircle, TrendingUp, DollarSign } from 'lucide-react';
import Card from '../../components/admin/UI/Card';
import Table from '../../components/admin/UI/Table';
import { AdminOrder } from '../../types';
import { mockOrders, mockProducts } from '../../data/adminData';

const Orders: React.FC = () => {
  // Calculate statistics
  const totalOrders = mockOrders.length;
  const completedOrders = mockOrders.filter(o => o.statut === 'Completed').length;
  const pendingOrders = mockOrders.filter(o => o.statut === 'Pending').length;
  const totalRevenue = mockOrders.reduce((sum, o) => sum + o.prix_total, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const columns = [
    { key: 'id_commande', label: 'ID' },
    { key: 'quantite', label: 'Quantité' },
    { 
      key: 'prix_total', 
      label: 'Prix total', 
      render: (value: number) => `$${value.toFixed(2)}` 
    },
    { 
      key: 'date_creation', 
      label: 'Date de création',
      render: (value: string) => new Date(value).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    { 
      key: 'statut', 
      label: 'Statut',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'Completed' ? 'bg-green-100 text-green-800' :
          value === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {value === 'Completed' ? 'Terminée' :
           value === 'Pending' ? 'En attente' : 'Annulée'}
        </span>
      )
    },
    {
      key: 'produits',
      label: 'Produits',
      render: (value: any, row: AdminOrder) => (
        <div className="space-y-1">
          {row.produits.map((item, index) => {
            const product = mockProducts.find(p => p.id_produit === item.id_produit);
            return (
              <div key={index} className="text-sm">
                {product?.nom || 'Produit inconnu'} x{item.quantite}
              </div>
            );
          })}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header with enhanced styling */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-6 text-white">
        <div className="flex items-center">
          <div className="p-3 bg-white bg-opacity-20 rounded-lg mr-4">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Commandes</h1>
            <p className="text-accent mt-1">Suivez et gérez les commandes de vos clients</p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 border-l-4 border-l-primary">
          <div className="flex items-center">
            <div className="p-3 bg-primary/10 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Commandes</p>
              <p className="text-2xl font-semibold text-gray-900">{totalOrders}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-secondary">
          <div className="flex items-center">
            <div className="p-3 bg-secondary/10 rounded-lg">
              <CheckCircle className="w-6 h-6 text-secondary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Terminées</p>
              <p className="text-2xl font-semibold text-gray-900">{completedOrders}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-accent">
          <div className="flex items-center">
            <div className="p-3 bg-accent/10 rounded-lg">
              <Clock className="w-6 h-6 text-accent" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En Attente</p>
              <p className="text-2xl font-semibold text-gray-900">{pendingOrders}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-primary">
          <div className="flex items-center">
            <div className="p-3 bg-primary/10 rounded-lg">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Prix Moyen</p>
              <p className="text-2xl font-semibold text-gray-900">${avgOrderValue.toFixed(2)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Revenue Summary */}
      <Card className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-primary">Revenus Totaux</h3>
            <p className="text-sm text-secondary">Tous les temps</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-primary">${totalRevenue.toFixed(2)}</p>
            <p className="text-sm text-secondary">{totalOrders} commandes</p>
          </div>
        </div>
      </Card>

      {/* Orders Table */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Liste des Commandes</h3>
          <p className="text-sm text-gray-600 mt-1">Détails de toutes vos commandes</p>
        </div>
        <Table columns={columns} data={mockOrders} />
      </Card>
    </div>
  );
};

export default Orders;
