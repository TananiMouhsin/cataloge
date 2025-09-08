const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export type ApiProduct = {
  id_produit: number;
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

// Auth helper
function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Admin Products CRUD
export async function createProduct(payload: Omit<ApiProduct, 'id_produit' | 'categorie' | 'marque'>): Promise<ApiProduct> {
  const res = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create product');
  return res.json();
}

export async function updateProduct(id_produit: number, payload: Partial<Omit<ApiProduct, 'id_produit' | 'categorie' | 'marque'>>): Promise<ApiProduct> {
  const res = await fetch(`${API_URL}/products/${id_produit}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update product');
  return res.json();
}

export async function deleteProduct(id_produit: number): Promise<void> {
  const res = await fetch(`${API_URL}/products/${id_produit}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error('Failed to delete product');
}

// Admin Categories CRUD
export async function createCategory(payload: Omit<ApiCategory, 'id_categorie'>): Promise<ApiCategory> {
  const res = await fetch(`${API_URL}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create category');
  return res.json();
}

export async function updateCategory(id_categorie: number, payload: Partial<ApiCategory>): Promise<ApiCategory> {
  const res = await fetch(`${API_URL}/categories/${id_categorie}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update category');
  return res.json();
}

export async function deleteCategory(id_categorie: number): Promise<void> {
  const res = await fetch(`${API_URL}/categories/${id_categorie}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error('Failed to delete category');
}

// Admin Brands CRUD
export async function createBrand(payload: Omit<ApiBrand, 'id_marque'>): Promise<ApiBrand> {
  const res = await fetch(`${API_URL}/brands`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create brand');
  return res.json();
}

export async function updateBrand(id_marque: number, payload: Partial<ApiBrand>): Promise<ApiBrand> {
  const res = await fetch(`${API_URL}/brands/${id_marque}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update brand');
  return res.json();
}

export async function deleteBrand(id_marque: number): Promise<void> {
  const res = await fetch(`${API_URL}/brands/${id_marque}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error('Failed to delete brand');
}

// Cart and Orders
export async function getCart() {
  const res = await fetch(`${API_URL}/cart`, { headers: { ...authHeaders() } });
  if (!res.ok) throw new Error('Failed to load cart');
  return res.json();
}

export async function addToCart(id_produit: number, quantite = 1) {
  const res = await fetch(`${API_URL}/cart/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ id_produit, quantite }),
  });
  if (!res.ok) throw new Error('Failed to add to cart');
  return res.json();
}

