import React, { useEffect, useState } from 'react';
import { ShoppingBag, Users, Clock, TrendingUp, Package, DollarSign, AlertTriangle } from 'lucide-react';
import Card from '../../components/admin/UI/Card';
import Table from '../../components/admin/UI/Table';
import { AdminCart, AdminProduct } from '../../types';
import { fetchProducts, getCart, ApiProduct } from '../../lib/api';

const Carts: React.FC = () => {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [rows, setRows] = useState<AdminCart[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErrorMsg(null);
      try {
        const [prods, cart] = await Promise.all([fetchProducts(), getCart()]);
        setProducts(prods);
        const mappedProducts = (cart.items || []).map((it: { id_produit: number; quantite: number }) => {
          const p = prods.find(pp => pp.id_produit === it.id_produit);
          const adminProd: AdminProduct = {
            id_produit: p?.id_produit || it.id_produit,
            nom: p?.nom || `Produit ${it.id_produit}`,
            description: p?.description || '',
            prix: p?.prix || 0,
            stock: p?.stock || 0,
            qr_code_path: p?.qr_code_path,
            date_creation: new Date().toISOString(),
            reste: p?.stock || 0,
            id_categorie: p?.id_categorie || 0,
            id_marque: p?.id_marque || 0,
          };
          return { product: adminProd, quantity: it.quantite };
        });
        const row: AdminCart = {
          id_panier: cart.id_panier,
          date_creation: new Date().toISOString(),
          products: mappedProducts,
        } as any;
        setRows(row.id_panier ? [row] : []);
      } catch (e: any) {
        if (e?.message?.includes('Failed to load cart')) {
          setErrorMsg("Impossible de charger le panier. Assurez-vous d'être connecté.");
        } else {
          setErrorMsg("Une erreur est survenue lors du chargement du panier.");
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalCarts = rows.length;
  const totalItems = rows.reduce((sum, cart) => sum + cart.products.reduce((cartSum, item) => cartSum + item.quantity, 0), 0);
  const totalValue = rows.reduce((sum, cart) => sum + cart.products.reduce((cartSum, item) => cartSum + (item.product.prix * item.quantity), 0), 0);
  const avgCartValue = totalCarts > 0 ? totalValue / totalCarts : 0;

  const columns = [
    { key: 'id_panier', label: 'ID Panier' },
    { 
      key: 'date_creation', 
      label: 'Date de création',
      render: (value: string) => new Date(value).toLocaleDateString('fr-FR', {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
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
      render: (value: any, row: AdminCart) => row.products.reduce((sum, item) => sum + item.quantity, 0)
    },
    {
      key: 'total_value',
      label: 'Valeur Totale',
      render: (value: any, row: AdminCart) => {
        const total = row.products.reduce((sum, item) => sum + (item.product.prix * item.quantity), 0);
        return `$${total.toFixed(2)}`;
      }
    },
    {
      key: 'status',
      label: 'Statut',
      render: () => (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Actif</span>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-secondary to-accent rounded-lg p-6 text-white">
        <div className="flex items-center">
          <div className="p-3 bg-white bg-opacity-20 rounded-lg mr-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Paniers</h1>
            <p className="text-primary/90 mt-1">Panier de l'utilisateur connecté</p>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-lg border border-red-200 bg-red-50 text-red-700 flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {loading ? (
        <Card className="p-6 text-gray-600">Chargement...</Card>
      ) : rows.length === 0 ? (
        <Card className="p-6">
          <div className="text-center text-gray-600">
            Aucun article dans le panier de l'utilisateur connecté.
            <div className="mt-2 text-sm">Ajoutez des produits au panier depuis le catalogue pour les voir ici.</div>
          </div>
        </Card>
      ) : (
        <>
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
          <Card className="overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Liste des Paniers</h3>
              <p className="text-sm text-gray-600 mt-1">Panier actuel (utilisateur connecté)</p>
            </div>
            <Table columns={columns} data={rows} />
          </Card>
        </>
      )}
    </div>
  );
};

export default Carts;
