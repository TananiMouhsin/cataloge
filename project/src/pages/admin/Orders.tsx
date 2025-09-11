import React, { useEffect, useState } from 'react';
import { ShoppingCart, Clock, CheckCircle, XCircle, TrendingUp, DollarSign, Eye, Package, User } from 'lucide-react';
import Card from '../../components/admin/UI/Card';
import Table from '../../components/admin/UI/Table';
import ProductImage from '../../components/ProductImage';
import { fetchOrders, updateOrderStatus, fetchProducts, fetchOrdersDebugSample } from '../../lib/api';

type UIOrderRow = {
  id_commande: number;
  id_users: number;
  id_produit?: number;
  nom_produit?: string;
  quantite: number;
  prix_unitaire: number;
  date_commande?: string;
  statut: 'Pending' | 'Completed' | 'Canceled';
  image_produit?: string;
  categorie?: string;
  marque?: string;
};

const Orders: React.FC = () => {
  const [rows, setRows] = useState<UIOrderRow[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const [ordersData, productsData] = await Promise.all([
        fetchOrders(),
        fetchProducts()
      ]);
      
      setProducts(productsData);
      
      const mapped: UIOrderRow[] = ordersData.map((r: any) => {
        const product = productsData.find(p => p.id_produit === r.id_produit);
        return {
          id_commande: r.id_commande,
          id_users: r.id_users,
          id_produit: r.id_produit,
          nom_produit: r.nom_produit || product?.nom || 'Produit inconnu',
          quantite: r.quantite,
          prix_unitaire: r.prix_unitaire,
          date_commande: r.date_commande,
          statut: (r.statut || 'Pending') as UIOrderRow['statut'],
          image_produit: product?.qr_code_path || '',
          categorie: product?.categorie?.nom || 'Inconnu',
          marque: product?.marque?.nom || 'Inconnu',
        };
      });
      setRows(mapped);
      if (mapped.length === 0) {
        try {
          const sample = await fetchOrdersDebugSample();
          console.log('Debug orders sample:', sample);
        } catch {}
      }
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
    { key: 'id_commande', label: 'Commande', render: (v: number) => `#${v}` },
    { 
      key: 'image_produit', 
      label: 'Produit', 
      render: (image: string, row: UIOrderRow) => (
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
            <ProductImage
              productId={row.id_produit || 0}
              productName={row.nom_produit || ''}
              images={image ? [image] : []}
              size="small"
              category={row.categorie || ''}
            />
          </div>
          <div>
            <p className="font-medium text-gray-900">{row.nom_produit}</p>
            <p className="text-sm text-gray-500">{row.marque} • {row.categorie}</p>
          </div>
        </div>
      )
    },
    { key: 'id_users', label: 'Client', render: (v: number) => (
      <div className="flex items-center space-x-2">
        <User className="w-4 h-4 text-gray-400" />
        <span>#{v}</span>
      </div>
    )},
    { key: 'quantite', label: 'Quantité', render: (v: number) => (
      <div className="flex items-center space-x-2">
        <Package className="w-4 h-4 text-gray-400" />
        <span className="font-medium">{v}</span>
      </div>
    )},
    { key: 'prix_unitaire', label: 'Prix Unitaire', render: (v: number) => (
      <span className="font-semibold text-green-600">€{v.toFixed(2)}</span>
    )},
    { key: 'date_commande', label: 'Date', render: (v?: string) => v ? (
      <div className="text-sm">
        <div>{new Date(v).toLocaleDateString('fr-FR')}</div>
        <div className="text-gray-500">{new Date(v).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
      </div>
    ) : '-' },
    { key: 'statut', label: 'Statut', render: (value: any, row: UIOrderRow) => (
      <select
        value={row.statut}
        onChange={async (e) => {
          const s = e.target.value as UIOrderRow['statut'];
          const prev = row.statut;
          setRows(prevRows => prevRows.map(r => r.id_commande === row.id_commande ? { ...r, statut: s } : r));
          try {
            await updateOrderStatus(row.id_commande, s.toLowerCase() as any);
            setMessage('Statut mis à jour avec succès');
            setTimeout(() => setMessage(null), 3000);
          } catch (err) {
            setRows(prevRows => prevRows.map(r => r.id_commande === row.id_commande ? { ...r, statut: prev } : r));
            setMessage("Échec de mise à jour du statut");
            setTimeout(() => setMessage(null), 3000);
          }
        }}
        className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
          row.statut === 'Completed' ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200' :
          row.statut === 'Pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200' :
          'bg-red-100 text-red-800 border-red-200 hover:bg-red-200'
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
        <Card className={`p-4 ${
          message.includes('succès') ? 'bg-green-50 border-green-200 text-green-800' :
          message.includes('Échec') ? 'bg-red-50 border-red-200 text-red-800' :
          'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          <div className="flex items-center space-x-2">
            {message.includes('succès') ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : message.includes('Échec') ? (
              <XCircle className="w-5 h-5 text-red-600" />
            ) : (
              <Clock className="w-5 h-5 text-blue-600" />
            )}
            <span className="font-medium">{message}</span>
          </div>
        </Card>
      )}

      {loading && (
        <Card className="p-8 text-center">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="text-gray-600">Chargement des commandes...</span>
          </div>
        </Card>
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

      {!loading && (
        <Card className="overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Liste des Commandes</h3>
                <p className="text-sm text-gray-600 mt-1">Modifiez le statut avec le menu déroulant</p>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Eye className="w-4 h-4" />
                <span>{rows.length} commande{rows.length > 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
          {rows.length > 0 ? (
            <Table columns={columns} data={rows} />
          ) : (
            <div className="p-8 text-center text-gray-500">
              <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">Aucune commande trouvée</p>
              <p className="text-sm">Les commandes apparaîtront ici une fois créées</p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default Orders;
