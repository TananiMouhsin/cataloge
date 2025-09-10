import React, { useEffect, useState } from 'react';
import { ShoppingCart, Clock, CheckCircle, XCircle, TrendingUp, DollarSign } from 'lucide-react';
import Card from '../../components/admin/UI/Card';
import Table from '../../components/admin/UI/Table';
import { fetchOrders, updateOrderStatus } from '../../lib/api';

type UIOrderRow = {
  id_commande: number;
  id_users: number;
  nom_produit?: string;
  quantite: number;
  prix_unitaire: number;
  date_commande?: string;
  statut: 'Pending' | 'Completed' | 'Canceled';
};

const Orders: React.FC = () => {
  const [rows, setRows] = useState<UIOrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const data = await fetchOrders();
      const mapped: UIOrderRow[] = data.map((r: any) => ({
        id_commande: r.id_commande,
        id_users: r.id_users,
        nom_produit: r.nom_produit,
        quantite: r.quantite,
        prix_unitaire: r.prix_unitaire,
        date_commande: r.date_commande,
        statut: (r.statut || 'Pending') as UIOrderRow['statut'],
      }));
      setRows(mapped);
    } catch (e: any) {
      setMessage("Impossible de charger les commandes (admin requis).");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const totalOrders = rows.length;
  const completedOrders = rows.filter(o => o.statut === 'Completed').length;
  const pendingOrders = rows.filter(o => o.statut === 'Pending').length;
  const totalRevenue = rows.reduce((sum, r) => sum + r.prix_unitaire * r.quantite, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const columns = [
    { key: 'id_commande', label: 'ID' },
    { key: 'id_users', label: 'Client' },
    { key: 'nom_produit', label: 'Produit' },
    { key: 'quantite', label: 'Quantité' },
    { key: 'prix_unitaire', label: 'Prix Unitaire', render: (v: number) => `€${v.toFixed(2)}` },
    { key: 'date_commande', label: 'Date', render: (v?: string) => v ? new Date(v).toLocaleDateString('fr-FR') : '-' },
    { key: 'statut', label: 'Statut', render: (value: any, row: UIOrderRow) => (
      <select
        value={row.statut}
        onChange={async (e) => {
          const s = e.target.value as UIOrderRow['statut'];
          const prev = row.statut;
          setRows(prevRows => prevRows.map(r => r.id_commande === row.id_commande ? { ...r, statut: s } : r));
          try {
            await updateOrderStatus(row.id_commande, s.toLowerCase() as any);
            setMessage('Statut mis à jour');
          } catch (err) {
            setRows(prevRows => prevRows.map(r => r.id_commande === row.id_commande ? { ...r, statut: prev } : r));
            setMessage("Échec de mise à jour du statut");
          }
        }}
        className={`px-2 py-1 rounded text-sm border ${
          row.statut === 'Completed' ? 'bg-green-100 text-green-800 border-green-200' :
          row.statut === 'Pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
          'bg-red-100 text-red-800 border-red-200'
        }`}
      >
        <option value="Pending">En attente</option>
        <option value="Completed">Terminée</option>
        <option value="Canceled">Annulée</option>
      </select>
    ) },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg mr-4">
              <ShoppingCart className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Commandes</h1>
              <p className="text-accent mt-1">Visualiser et gérer les commandes clients</p>
            </div>
          </div>
          {/* Bouton supprimé */}
        </div>
      </div>

      {message && (
        <Card className="p-4">{message}</Card>
      )}

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
              <p className="text-2xl font-semibold text-gray-900">€{avgOrderValue.toFixed(2)}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Liste des Commandes</h3>
          <p className="text-sm text-gray-600 mt-1">Modifiez le statut avec le menu</p>
        </div>
        <Table columns={columns} data={rows} />
      </Card>
    </div>
  );
};

export default Orders;
