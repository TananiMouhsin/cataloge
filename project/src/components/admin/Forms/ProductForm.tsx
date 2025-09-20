import React, { useState } from 'react';
import Button from '../UI/Button';
import ImageUpload from '../../ImageUpload';
import { AdminProduct, AdminCategory, AdminBrand } from '../../../types';

interface ProductFormProps {
  product?: AdminProduct;
  categories: AdminCategory[];
  brands: AdminBrand[];
  onSubmit: (product: Omit<AdminProduct, 'id_produit' | 'date_creation'>) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ 
  product, 
  categories, 
  brands, 
  onSubmit, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    nom: product?.nom || '',
    description: product?.description || '',
    prix: product?.prix || 0,
    stock: product?.stock || 0,
    reste: product?.reste || 0,
    id_categorie: product?.id_categorie || categories[0]?.id_categorie || 1,
    id_marque: product?.id_marque || brands[0]?.id_marque || 1,
    qr_code_path: product?.qr_code_path || '',
  });
  const [uploadedImage, setUploadedImage] = useState<string | undefined>(
    product?.qr_code_path ? product.qr_code_path : undefined
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Use uploaded image filename if available, otherwise use the URL
    const finalData = {
      ...formData,
      qr_code_path: uploadedImage || formData.qr_code_path
    };
    onSubmit(finalData as any);
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (filename: string) => {
    setUploadedImage(filename);
    setFormData(prev => ({ ...prev, qr_code_path: filename }));
  };

  const handleImageRemove = () => {
    setUploadedImage(undefined);
    setFormData(prev => ({ ...prev, qr_code_path: '' }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
            Nom du produit
          </label>
          <input
            type="text"
            id="nom"
            value={formData.nom}
            onChange={(e) => handleChange('nom', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label htmlFor="prix" className="block text-sm font-medium text-gray-700 mb-1">
            Prix
          </label>
          <input
            type="number"
            id="prix"
            value={formData.prix}
            onChange={(e) => handleChange('prix', parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            step="0.01"
            min="0"
            required
          />
        </div>

        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
            Stock
          </label>
          <input
            type="number"
            id="stock"
            value={formData.stock}
            onChange={(e) => handleChange('stock', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
            required
          />
        </div>

        <div>
          <label htmlFor="reste" className="block text-sm font-medium text-gray-700 mb-1">
            Reste
          </label>
          <input
            type="number"
            id="reste"
            value={formData.reste}
            onChange={(e) => handleChange('reste', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
            required
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Catégorie
          </label>
          <select
            id="category"
            value={formData.id_categorie}
            onChange={(e) => handleChange('id_categorie', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            {categories.map(category => (
              <option key={category.id_categorie} value={category.id_categorie}>
                {category.nom}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
            Marque
          </label>
          <select
            id="brand"
            value={formData.id_marque}
            onChange={(e) => handleChange('id_marque', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            {brands.map(brand => (
              <option key={brand.id_marque} value={brand.id_marque}>
                {brand.nom}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image du produit
        </label>
        <ImageUpload
          onImageUpload={handleImageUpload}
          onImageRemove={handleImageRemove}
          currentImage={uploadedImage}
          className="mb-4"
        />
      </div>
      
      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          {product ? 'Modifier' : 'Créer'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
