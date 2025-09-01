import React, { useState } from 'react';
import Button from '../UI/Button';
import { AdminBrand } from '../../../types';

interface BrandFormProps {
  brand?: AdminBrand;
  onSubmit: (brand: Omit<AdminBrand, 'id_marque'>) => void;
  onCancel: () => void;
}

const BrandForm: React.FC<BrandFormProps> = ({ brand, onSubmit, onCancel }) => {
  const [nom, setNom] = useState(brand?.nom || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ nom });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
          Nom de la marque
        </label>
        <input
          type="text"
          id="nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>
      
      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          {brand ? 'Modifier' : 'Créer'}
        </Button>
      </div>
    </form>
  );
};

export default BrandForm;
