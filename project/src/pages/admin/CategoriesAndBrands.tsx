import React, { useState } from 'react';
import { Plus, Edit, Trash2, Tags, Building, Package } from 'lucide-react';
import Button from '../../components/admin/UI/Button';
import Card from '../../components/admin/UI/Card';
import Modal from '../../components/admin/UI/Modal';
import Table from '../../components/admin/UI/Table';
import CategoryForm from '../../components/admin/Forms/CategoryForm';
import BrandForm from '../../components/admin/Forms/BrandForm';
import { AdminCategory, AdminBrand } from '../../types';
import { mockCategories, mockBrands, mockProducts } from '../../data/adminData';

const CategoriesAndBrands: React.FC = () => {
  const [categories, setCategories] = useState<AdminCategory[]>(mockCategories);
  const [brands, setBrands] = useState<AdminBrand[]>(mockBrands);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | undefined>();
  const [editingBrand, setEditingBrand] = useState<AdminBrand | undefined>();
  const [activeTab, setActiveTab] = useState<'categories' | 'brands'>('categories');

  // Category handlers
  const handleCreateCategory = (category: Omit<AdminCategory, 'id_categorie'>) => {
    const newCategory: AdminCategory = {
      ...category,
      id_categorie: Math.max(...categories.map(c => c.id_categorie)) + 1,
    };
    setCategories([...categories, newCategory]);
    setIsCategoryModalOpen(false);
  };

  const handleEditCategory = (category: AdminCategory) => {
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleUpdateCategory = (category: Omit<AdminCategory, 'id_categorie'>) => {
    if (editingCategory) {
      setCategories(categories.map(c => 
        c.id_categorie === editingCategory.id_categorie 
          ? { ...category, id_categorie: editingCategory.id_categorie }
          : c
      ));
      setEditingCategory(undefined);
      setIsCategoryModalOpen(false);
    }
  };

  const handleDeleteCategory = (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      setCategories(categories.filter(c => c.id_categorie !== id));
    }
  };

  // Brand handlers
  const handleCreateBrand = (brand: Omit<AdminBrand, 'id_marque'>) => {
    const newBrand: AdminBrand = {
      ...brand,
      id_marque: Math.max(...brands.map(b => b.id_marque)) + 1,
    };
    setBrands([...brands, newBrand]);
    setIsBrandModalOpen(false);
  };

  const handleEditBrand = (brand: AdminBrand) => {
    setEditingBrand(brand);
    setIsBrandModalOpen(true);
  };

  const handleUpdateBrand = (brand: Omit<AdminBrand, 'id_marque'>) => {
    if (editingBrand) {
      setBrands(brands.map(b => 
        b.id_marque === editingBrand.id_marque 
          ? { ...brand, id_marque: editingBrand.id_marque }
          : b
      ));
      setEditingBrand(undefined);
      setIsBrandModalOpen(false);
    }
  };

  const handleDeleteBrand = (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette marque ?')) {
      setBrands(brands.filter(b => b.id_marque !== id));
    }
  };

  // Table columns
  const categoryColumns = [
    { key: 'id_categorie', label: 'ID' },
    { key: 'nom', label: 'Nom' },
    { key: 'productCount', label: 'Produits', render: () => Math.floor(Math.random() * 20) + 1 },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: any, row: AdminCategory) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEditCategory(row)}
          >
            <Edit size={16} />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDeleteCategory(row.id_categorie)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  const brandColumns = [
    { key: 'id_marque', label: 'ID' },
    { key: 'nom', label: 'Nom' },
    { key: 'productCount', label: 'Produits', render: () => Math.floor(Math.random() * 15) + 1 },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: any, row: AdminBrand) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEditBrand(row)}
          >
            <Edit size={16} />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDeleteBrand(row.id_marque)}
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
        <div className="flex items-center">
          <div className="p-3 bg-white bg-opacity-20 rounded-lg mr-4">
            <Tags className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Catégories & Marques</h1>
            <p className="text-accent mt-1">Gérez vos catégories et marques de produits</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-l-4 border-l-primary">
          <div className="flex items-center">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Tags className="w-6 h-6 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Catégories</p>
              <p className="text-2xl font-semibold text-gray-900">{mockCategories.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-secondary">
          <div className="flex items-center">
            <div className="p-3 bg-secondary/10 rounded-lg">
              <Building className="w-6 h-6 text-secondary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Marques</p>
              <p className="text-2xl font-semibold text-gray-900">{mockBrands.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-accent">
          <div className="flex items-center">
            <div className="p-3 bg-accent/10 rounded-lg">
              <Package className="w-6 h-6 text-accent" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Produits Associés</p>
              <p className="text-2xl font-semibold text-gray-900">{mockProducts.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('categories')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'categories'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-primary hover:border-primary/30'
            }`}
          >
            <Tags className="inline w-4 h-4 mr-2" />
            Catégories ({categories.length})
          </button>
          <button
            onClick={() => setActiveTab('brands')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'brands'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-primary hover:border-primary/30'
            }`}
          >
            <Building className="inline w-4 h-4 mr-2" />
            Marques ({brands.length})
          </button>
        </nav>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'categories' ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Gestion des catégories</h2>
            <Button onClick={() => setIsCategoryModalOpen(true)} className="bg-primary hover:bg-secondary text-white transition-all duration-200 shadow-md hover:shadow-lg">
              <Plus size={16} className="mr-2" />
              Nouvelle catégorie
            </Button>
          </div>
          <Card>
            <Table columns={categoryColumns} data={categories} />
          </Card>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Gestion des marques</h2>
            <Button onClick={() => setIsBrandModalOpen(true)} className="bg-primary hover:bg-secondary text-white transition-all duration-200 shadow-md hover:shadow-lg">
              <Plus size={16} className="mr-2" />
              Nouvelle marque
            </Button>
          </div>
          <Card>
            <Table columns={brandColumns} data={brands} />
          </Card>
        </div>
      )}

      {/* Category Modal */}
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => {
          setIsCategoryModalOpen(false);
          setEditingCategory(undefined);
        }}
        title={editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
      >
        <CategoryForm
          category={editingCategory}
          onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}
          onCancel={() => {
            setIsCategoryModalOpen(false);
            setEditingCategory(undefined);
          }}
        />
      </Modal>

      {/* Brand Modal */}
      <Modal
        isOpen={isBrandModalOpen}
        onClose={() => {
          setIsBrandModalOpen(false);
          setEditingBrand(undefined);
        }}
        title={editingBrand ? 'Modifier la marque' : 'Nouvelle marque'}
      >
        <BrandForm
          brand={editingBrand}
          onSubmit={editingBrand ? handleUpdateBrand : handleCreateBrand}
          onCancel={() => {
            setIsBrandModalOpen(false);
            setEditingBrand(undefined);
          }}
        />
      </Modal>
    </div>
  );
};

export default CategoriesAndBrands;
