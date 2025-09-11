import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { CartItem, Product } from '../types';
import { useAuth } from './AuthContext';
import { 
  addToCart as apiAddToCart, 
  getCart as apiGetCart, 
  clearCart as apiClearCart,
  getSpecificCart,
  addToSpecificCart,
  clearSpecificCart,
  createOrderFromCart,
  getUserCarts,
  createNewCart as apiCreateNewCart,
  deleteCart as apiDeleteCart,
  fetchProducts
} from '../lib/api';

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  isOpen: boolean;
  currentCartId: number | null;
  allCarts: any[];
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }
  | { type: 'SET_CURRENT_CART'; payload: number | null }
  | { type: 'LOAD_ALL_CARTS'; payload: any[] }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.product.id === action.payload.id);
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.product.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return calculateTotals({ ...state, items: updatedItems });
      } else {
        const newItems = [...state.items, { product: action.payload, quantity: 1 }];
        return calculateTotals({ ...state, items: newItems });
      }
    }
    
    case 'REMOVE_ITEM': {
      const filteredItems = state.items.filter(item => item.product.id !== action.payload);
      return calculateTotals({ ...state, items: filteredItems });
    }
    
    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item =>
        item.product.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0);
      return calculateTotals({ ...state, items: updatedItems });
    }
    
    case 'CLEAR_CART':
      return { ...state, items: [], total: 0, itemCount: 0 };
    
    case 'LOAD_CART':
      return calculateTotals({ ...state, items: action.payload });
    
    case 'SET_CURRENT_CART':
      return { ...state, currentCartId: action.payload };
    
    case 'LOAD_ALL_CARTS':
      return { ...state, allCarts: action.payload };
    
    case 'OPEN_CART':
      return { ...state, isOpen: true };
    
    case 'CLOSE_CART':
      return { ...state, isOpen: false };
    
    default:
      return state;
  }
};

const calculateTotals = (state: CartState): CartState => {
  const total = state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  return { ...state, total, itemCount };
};

// Helper function to convert cart items with product details
const convertCartItems = async (cartItems: { id_produit: number; quantite: number }[]): Promise<CartItem[]> => {
  try {
    const products = await fetchProducts();
    return cartItems.map((it) => {
      const product = products.find(p => p.id_produit === it.id_produit);
      return {
        product: product ? {
          id: product.id_produit,
          name: product.nom,
          brand: product.marque.nom,
          category: product.categorie.nom,
          price: product.prix,
          images: product.qr_code_path ? [product.qr_code_path] : [], // Use real image or empty for fallback
          description: product.description || '',
          specifications: {},
          stock: product.stock,
          isNew: false,
          rating: 0,
          reviews: [],
        } : {
          id: it.id_produit,
          name: `Produit #${it.id_produit}`,
          brand: 'Inconnu',
          category: 'Inconnu',
          price: 0,
          images: [], // Empty for fallback
          description: '',
          specifications: {},
          stock: 0,
          isNew: false,
          rating: 0,
          reviews: [],
        },
        quantity: it.quantite,
      };
    });
  } catch (error) {
    console.error('Error fetching products for cart:', error);
    // Fallback to basic product info
    return cartItems.map((it) => ({
      product: {
        id: it.id_produit,
        name: `Produit #${it.id_produit}`,
        brand: 'Inconnu',
        category: 'Inconnu',
        price: 0,
        images: [], // Empty for fallback
        description: '',
        specifications: {},
        stock: 0,
        isNew: false,
        rating: 0,
        reviews: [],
      },
      quantity: it.quantite,
    }));
  }
};

interface CartContextType extends CartState {
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  switchToCart: (cartId: number) => Promise<void>;
  createNewCart: () => Promise<void>;
  deleteCart: (cartId: number) => Promise<void>;
  createOrderFromCurrentCart: () => Promise<void>;
  loadAllCarts: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    // Graceful fallback to avoid crashes if provider hasn't mounted yet (e.g., during HMR)
    return {
      items: [],
      total: 0,
      itemCount: 0,
      isOpen: false,
      currentCartId: null,
      allCarts: [],
      addItem: () => {},
      removeItem: () => {},
      updateQuantity: () => {},
      clearCart: () => {},
      openCart: () => {},
      closeCart: () => {},
      switchToCart: async () => {},
      createNewCart: async () => {},
      deleteCart: async () => {},
      createOrderFromCurrentCart: async () => {},
      loadAllCarts: async () => {},
    } as CartContextType;
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { 
    items: [], 
    total: 0, 
    itemCount: 0, 
    isOpen: false,
    currentCartId: null,
    allCarts: []
  });
  const { user } = useAuth();

  useEffect(() => {
    const load = async () => {
      const userId = user?.id;
      if (!userId) {
        dispatch({ type: 'LOAD_CART', payload: [] });
        dispatch({ type: 'LOAD_ALL_CARTS', payload: [] });
        return;
      }
      try {
        // Load all carts for the user
        const allCarts = await getUserCarts();
        dispatch({ type: 'LOAD_ALL_CARTS', payload: allCarts });
        
        // Set the most recent cart as current
        if (allCarts.length > 0) {
          const mostRecentCart = allCarts[0]; // Assuming they're sorted by date desc
          dispatch({ type: 'SET_CURRENT_CART', payload: mostRecentCart.id_panier });
          
          // Load the current cart items
          const currentCart = await getSpecificCart(mostRecentCart.id_panier);
          const items = await convertCartItems(currentCart.items || []);
          dispatch({ type: 'LOAD_CART', payload: items });
        } else {
          dispatch({ type: 'LOAD_CART', payload: [] });
        }
      } catch (e) {
        console.error('Error loading carts:', e);
        dispatch({ type: 'LOAD_CART', payload: [] });
        dispatch({ type: 'LOAD_ALL_CARTS', payload: [] });
      }
    };
    load();
  }, [user?.id]);

  useEffect(() => {
    const userId = user?.id;
    if (!userId) return;
    const key = `cart:${userId}`;
    localStorage.setItem(key, JSON.stringify(state.items));
  }, [state.items, user?.id]);

  const addItem = async (product: Product) => {
    // Update UI immediately
    dispatch({ type: 'ADD_ITEM', payload: product });
    // Persist to backend if logged in
    if (user?.id && state.currentCartId) {
      try {
        await addToSpecificCart(state.currentCartId, product.id, 1);
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    } else if (user?.id) {
      // Fallback to general add to cart if no current cart
      try {
        await apiAddToCart(product.id, 1);
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    }
  };

  const removeItem = (productId: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
  };

  const clearCart = async () => {
    dispatch({ type: 'CLEAR_CART' });
    if (user?.id && state.currentCartId) {
      try {
        await clearSpecificCart(state.currentCartId);
        // Reload all carts
        await loadAllCarts();
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    } else if (user?.id) {
      try {
        await apiClearCart();
        // Reload cart from server to ensure sync
        const serverCart = await apiGetCart();
        const items = await convertCartItems(serverCart.items || []);
        dispatch({ type: 'LOAD_CART', payload: items });
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    }
  };

  const openCart = () => {
    dispatch({ type: 'OPEN_CART' });
  };

  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' });
  };

  const switchToCart = async (cartId: number) => {
    try {
      console.log('Switching to cart:', cartId);
      console.log('User ID:', user?.id);
      console.log('Auth token:', localStorage.getItem('token'));
      
      const cart = await getSpecificCart(cartId);
      console.log('Cart data received:', cart);
      
      const items = await convertCartItems(cart.items || []);
      console.log('Converted items:', items);
      
      dispatch({ type: 'SET_CURRENT_CART', payload: cartId });
      dispatch({ type: 'LOAD_CART', payload: items });
      
      console.log('Successfully switched to cart:', cartId);
    } catch (error) {
      console.error('Error switching to cart:', error);
      console.error('Error details:', error.message);
      throw error; // Re-throw to let the UI handle it
    }
  };

  const createNewCart = async () => {
    try {
      const newCart = await apiCreateNewCart();
      dispatch({ type: 'SET_CURRENT_CART', payload: newCart.id_panier });
      dispatch({ type: 'LOAD_CART', payload: [] });
      await loadAllCarts();
    } catch (error) {
      console.error('Error creating new cart:', error);
    }
  };

  const deleteCart = async (cartId: number) => {
    try {
      await apiDeleteCart(cartId);
      await loadAllCarts();
      // If we deleted the current cart, switch to the most recent one
      if (state.currentCartId === cartId) {
        if (state.allCarts.length > 1) {
          const remainingCarts = state.allCarts.filter(cart => cart.id_panier !== cartId);
          if (remainingCarts.length > 0) {
            await switchToCart(remainingCarts[0].id_panier);
          } else {
            dispatch({ type: 'SET_CURRENT_CART', payload: null });
            dispatch({ type: 'LOAD_CART', payload: [] });
          }
        } else {
          dispatch({ type: 'SET_CURRENT_CART', payload: null });
          dispatch({ type: 'LOAD_CART', payload: [] });
        }
      }
    } catch (error) {
      console.error('Error deleting cart:', error);
    }
  };

  const createOrderFromCurrentCart = async () => {
    if (!state.currentCartId) return;
    try {
      await createOrderFromCart(state.currentCartId);
      await loadAllCarts();
      // Switch to the most recent cart or create a new one
      if (state.allCarts.length > 1) {
        const remainingCarts = state.allCarts.filter(cart => cart.id_panier !== state.currentCartId);
        if (remainingCarts.length > 0) {
          await switchToCart(remainingCarts[0].id_panier);
        } else {
          await createNewCart();
        }
      } else {
        await createNewCart();
      }
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const loadAllCarts = async () => {
    try {
      const allCarts = await getUserCarts();
      dispatch({ type: 'LOAD_ALL_CARTS', payload: allCarts });
    } catch (error) {
      console.error('Error loading all carts:', error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
        switchToCart,
        createNewCart,
        deleteCart,
        createOrderFromCurrentCart,
        loadAllCarts,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};