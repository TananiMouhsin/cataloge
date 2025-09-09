import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Package, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react';
import Button from '../../components/admin/UI/Button';
import Card from '../../components/admin/UI/Card';
import Modal from '../../components/admin/UI/Modal';
import Table from '../../components/admin/UI/Table';
import ProductForm from '../../components/admin/Forms/ProductForm';
import { AdminProduct } from '../../types';
import { fetchProducts, fetchCategories, fetchBrands, createProduct, updateProduct, deleteProduct } from '../../lib/api';
import type { ApiProduct, ApiCategory, ApiBrand } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

const Products: React.FC = () => {
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [brands, setBrands] = useState<ApiBrand[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ApiProduct | undefined>();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const [prods, cats, brs] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
        fetchBrands(),
      ]);
      setProducts(prods);
      setCategories(cats);
      setBrands(brs);
    })();
  }, []);

  // Calculate statistics
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + (p.prix * p.stock), 0);
  const lowStockProducts = products.filter(p => p.stock < 10).length;
  const avgPrice = totalProducts > 0 ? totalValue / totalProducts : 0;

  const handleCreate = async (product: Omit<AdminProduct, 'id_produit' | 'date_creation'>) => {
    setErrorMsg(null);
    try {
      const created = await createProduct({
        nom: product.nom,
        description: product.description,
        prix: product.prix,
        stock: product.stock,
        id_categorie: product.id_categorie,
        id_marque: product.id_marque,
        qr_code_path: (product as any).qr_code_path,
      });
      setProducts(prev => [...prev, created]);
      setIsModalOpen(false);
    } catch (err: any) {
      setErrorMsg('Création refusée. Connectez-vous en tant qu\'admin.');
    }
  };

  const handleEdit = (product: ApiProduct) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleUpdate = async (product: Omit<AdminProduct, 'id_produit' | 'date_creation'>) => {
    setErrorMsg(null);
    if (editingProduct) {
      try {
        const updated = await updateProduct(editingProduct.id_produit, {
          nom: product.nom,
          description: product.description,
          prix: product.prix,
          stock: product.stock,
          id_categorie: product.id_categorie,
          id_marque: product.id_marque,
          qr_code_path: (product as any).qr_code_path,
        });
        setProducts(prev => prev.map(p => p.id_produit === updated.id_produit ? updated : p));
        setEditingProduct(undefined);
        setIsModalOpen(false);
      } catch (err: any) {
        setErrorMsg('Mise à jour refusée. Connectez-vous en tant qu\'admin.');
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await deleteProduct(id);
        setProducts(prev => prev.filter(p => p.id_produit !== id));
      } catch (err: any) {
        setErrorMsg('Suppression refusée. Connectez-vous en tant qu\'admin.');
      }
    }
  };

  const columns = [
    { key: 'id_produit', label: 'ID' },
    { key: 'nom', label: 'Nom' },
    { key: 'prix', label: 'Prix', render: (value: number) => `$${value.toFixed(2)}` },
    { key: 'stock', label: 'Stock' },
    {
      key: 'id_categorie',
      label: 'Catégorie',
      render: (value: number) => categories.find(c => c.id_categorie === value)?.nom || 'Unknown'
    },
    {
      key: 'id_marque',
      label: 'Marque',
      render: (value: number) => brands.find(b => b.id_marque === value)?.nom || 'Unknown'
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: any, row: AdminProduct) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(row)}
          >
            <Edit size={16} />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDelete(row.id_produit)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header with enhanced styling */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Produits</h1>
            <p className="text-accent mt-1">Gérez votre catalogue de produits</p>
          </div>
          <Button 
            onClick={() => isAdmin ? setIsModalOpen(true) : setErrorMsg('Action réservée aux administrateurs')}
            className="bg-blue-600 text-white hover:bg-blue-700 border border-blue-600 transition-all duration-200 shadow-md hover:shadow-lg"
            disabled={!isAdmin}
            title={!isAdmin ? 'Réservé aux administrateurs' : undefined}
          >
            <Plus size={16} className="mr-2" />
            Ajouter produit
          </Button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 rounded border border-red-300 bg-red-50 text-red-700">{errorMsg}</div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 border-l-4 border-l-primary">
          <div className="flex items-center">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Produits</p>
              <p className="text-2xl font-semibold text-gray-900">{totalProducts}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-secondary">
          <div className="flex items-center">
            <div className="p-3 bg-secondary/10 rounded-lg">
              <DollarSign className="w-6 h-6 text-secondary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Valeur Totale</p>
              <p className="text-2xl font-semibold text-gray-900">${totalValue.toFixed(2)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-accent">
          <div className="flex items-center">
            <div className="p-3 bg-accent/10 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-accent" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Stock Faible</p>
              <p className="text-2xl font-semibold text-gray-900">{lowStockProducts}</p>
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
              <p className="text-2xl font-semibold text-gray-900">${avgPrice.toFixed(2)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Products Table */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Liste des Produits</h3>
          <p className="text-sm text-gray-600 mt-1">Gérez tous vos produits en un seul endroit</p>
        </div>
        <Table columns={columns} data={products as unknown as AdminProduct[]} />
      </Card>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(undefined);
        }}
        title={editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
        size="lg"
      >
        <ProductForm
          product={editingProduct as unknown as AdminProduct}
          categories={categories as unknown as any}
          brands={brands as unknown as any}
          onSubmit={editingProduct ? handleUpdate : handleCreate}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingProduct(undefined);
          }}
        />
      </Modal>
    </div>
  );
};

export default Products;
