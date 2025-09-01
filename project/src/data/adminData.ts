import { AdminCategory, AdminBrand, AdminProduct, AdminOrder, AdminCart, DashboardStats } from '../types';

export const mockCategories: AdminCategory[] = [
  { id_categorie: 1, nom: 'Électronique' },
  { id_categorie: 2, nom: 'Vêtements' },
  { id_categorie: 3, nom: 'Livres' },
  { id_categorie: 4, nom: 'Sport' },
  { id_categorie: 5, nom: 'Maison' },
];

export const mockBrands: AdminBrand[] = [
  { id_marque: 1, nom: 'Apple' },
  { id_marque: 2, nom: 'Samsung' },
  { id_marque: 3, nom: 'Nike' },
  { id_marque: 4, nom: 'Adidas' },
  { id_marque: 5, nom: 'Sony' },
];

export const mockProducts: AdminProduct[] = [
  {
    id_produit: 1,
    nom: 'iPhone 15 Pro',
    description: 'Le dernier smartphone Apple avec des fonctionnalités avancées',
    prix: 999.99,
    stock: 50,
    reste: 45,
    date_creation: '2024-01-15',
    id_categorie: 1,
    id_marque: 1,
  },
  {
    id_produit: 2,
    nom: 'Samsung Galaxy S24',
    description: 'Smartphone Android haut de gamme',
    prix: 899.99,
    stock: 30,
    reste: 25,
    date_creation: '2024-01-10',
    id_categorie: 1,
    id_marque: 2,
  },
  {
    id_produit: 3,
    nom: 'Nike Air Max',
    description: 'Chaussures de sport confortables',
    prix: 129.99,
    stock: 100,
    reste: 80,
    date_creation: '2024-01-05',
    id_categorie: 4,
    id_marque: 3,
  },
];

export const mockOrders: AdminOrder[] = [
  {
    id_commande: 1,
    quantite: 2,
    prix: 999.99,
    prix_total: 1999.98,
    date_creation: '2024-01-20',
    statut: 'Completed',
    produits: [
      { id_produit: 1, quantite: 2 }
    ],
  },
  {
    id_commande: 2,
    quantite: 1,
    prix: 899.99,
    prix_total: 899.99,
    date_creation: '2024-01-19',
    statut: 'Pending',
    produits: [
      { id_produit: 2, quantite: 1 }
    ],
  },
];

export const mockCarts: AdminCart[] = [
  {
    id_panier: 1,
    date_creation: '2024-01-21',
    products: [
      { product: mockProducts[2], quantity: 1 }
    ],
  },
  {
    id_panier: 2,
    date_creation: '2024-01-20',
    products: [
      { product: mockProducts[0], quantity: 1 },
      { product: mockProducts[1], quantity: 1 }
    ],
  },
];

export const mockDashboardStats: DashboardStats = {
  totalCategories: mockCategories.length,
  totalBrands: mockBrands.length,
  totalProducts: mockProducts.length,
  totalUsers: 150,
  totalOrders: mockOrders.length,
  totalRevenue: 2899.97,
};
