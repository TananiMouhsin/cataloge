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