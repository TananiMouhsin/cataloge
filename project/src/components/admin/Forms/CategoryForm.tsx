import React, { useState } from 'react';
import Button from '../UI/Button';
import { AdminCategory } from '../../../types';

interface CategoryFormProps {
  category?: AdminCategory;
  onSubmit: (category: Omit<AdminCategory, 'id_categorie'>) => void;
  onCancel: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSubmit, onCancel }) => {
  const [nom, setNom] = useState(category?.nom || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ nom });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
          Nom de la catégorie
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
          {category ? 'Modifier' : 'Créer'}
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;
