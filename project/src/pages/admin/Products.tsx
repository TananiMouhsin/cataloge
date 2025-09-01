import React, { useState } from 'react';
import { Plus, Edit, Trash2, Package, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react';
import Button from '../../components/admin/UI/Button';
import Card from '../../components/admin/UI/Card';
import Modal from '../../components/admin/UI/Modal';
import Table from '../../components/admin/UI/Table';
import ProductForm from '../../components/admin/Forms/ProductForm';
import { AdminProduct } from '../../types';
import { mockProducts, mockCategories, mockBrands } from '../../data/adminData';

const Products: React.FC = () => {
  const [products, setProducts] = useState<AdminProduct[]>(mockProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | undefined>();

  // Calculate statistics
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + (p.prix * p.stock), 0);
  const lowStockProducts = products.filter(p => p.stock < 10).length;
  const avgPrice = totalProducts > 0 ? totalValue / totalProducts : 0;

  const handleCreate = (product: Omit<AdminProduct, 'id_produit' | 'date_creation'>) => {
    const newProduct: AdminProduct = {
      ...product,
      id_produit: Math.max(...products.map(p => p.id_produit)) + 1,
      date_creation: new Date().toISOString().split('T')[0],
    };
    setProducts([...products, newProduct]);
    setIsModalOpen(false);
  };

  const handleEdit = (product: AdminProduct) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleUpdate = (product: Omit<AdminProduct, 'id_produit' | 'date_creation'>) => {
    if (editingProduct) {
      setProducts(products.map(p => 
        p.id_produit === editingProduct.id_produit 
          ? { ...product, id_produit: editingProduct.id_produit, date_creation: editingProduct.date_creation }
          : p
      ));
      setEditingProduct(undefined);
      setIsModalOpen(false);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      setProducts(products.filter(p => p.id_produit !== id));
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
      render: (value: number) => mockCategories.find(c => c.id_categorie === value)?.nom || 'Unknown'
    },
    { 
      key: 'id_marque', 
      label: 'Marque', 
      render: (value: number) => mockBrands.find(b => b.id_marque === value)?.nom || 'Unknown'
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
            onClick={() => setIsModalOpen(true)}
            className="bg-white text-black hover:bg-primary hover:text-white border border-primary transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Plus size={16} className="mr-2" />
            Nouveau produit
          </Button>
        </div>
      </div>

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
        <Table columns={columns} data={products} />
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
          product={editingProduct}
          categories={mockCategories}
          brands={mockBrands}
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
