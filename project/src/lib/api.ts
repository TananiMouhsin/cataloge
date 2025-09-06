const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export type ApiProduct = {
  id_produit: string;
  nom: string;
  description?: string;
  prix: number;
  stock: number;
  id_categorie: number;
  id_marque: number;
  qr_code_path?: string;
  categorie: ApiCategory;
  marque: ApiBrand;
};

export type ApiCategory = { id_categorie: number; nom: string };
export type ApiBrand = { id_marque: number; nom: string };

export async function fetchProducts(): Promise<ApiProduct[]> {
  const res = await fetch(`${API_URL}/products`);
  if (!res.ok) throw new Error('Failed to load products');
  return res.json();
}

export async function fetchCategories(): Promise<ApiCategory[]> {
  const res = await fetch(`${API_URL}/categories`);
  if (!res.ok) throw new Error('Failed to load categories');
  return res.json();
}

export async function fetchBrands(): Promise<ApiBrand[]> {
  const res = await fetch(`${API_URL}/brands`);
  if (!res.ok) throw new Error('Failed to load brands');
  return res.json();
}


