export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  images: string[];
  description: string;
  specifications: Record<string, string>;
  stock: number;
  isNew: boolean;
  rating: number;
  reviews: Review[];
}

export interface Review {
  id: number;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  count: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface ContactForm {
  name: string;
  email: string;
  message: string;
}

export interface AuthForm {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  confirmPassword?: string;
}

// Admin-specific types
export interface AdminCategory {
  id_categorie: number;
  nom: string;
}

export interface AdminBrand {
  id_marque: number;
  nom: string;
}

export interface AdminProduct {
  id_produit: number;
  nom: string;
  description: string;
  prix: number;
  stock: number;
  qr_code_path?: string;
  date_creation: string;
  reste: number;
  id_categorie: number;
  id_marque: number;
}

export interface AdminOrder {
  id_commande: number;
  quantite: number;
  prix: number;
  prix_total: number;
  date_creation: string;
  statut: 'Pending' | 'Completed' | 'Canceled';
  produits: {
    id_produit: number;
    quantite: number;
  }[];
}

export interface AdminCart {
  id_panier: number;
  date_creation: string;
  products: {
    product: AdminProduct;
    quantity: number;
  }[];
}

export interface DashboardStats {
  totalCategories: number;
  totalBrands: number;
  totalProducts: number;
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
}