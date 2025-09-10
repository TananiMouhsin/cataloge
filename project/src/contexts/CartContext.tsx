import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { CartItem, Product } from '../types';
import { useAuth } from './AuthContext';
import { addToCart as apiAddToCart, getCart as apiGetCart, clearCart as apiClearCart } from '../lib/api';

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }
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

interface CartContextType extends CartState {
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { 
    items: [], 
    total: 0, 
    itemCount: 0, 
    isOpen: false 
  });
  const { user } = useAuth();

  useEffect(() => {
    const load = async () => {
      const userId = user?.id;
      if (!userId) {
        dispatch({ type: 'LOAD_CART', payload: [] });
        return;
      }
      try {
        // Prefer loading cart from server so admin can see it
        const serverCart = await apiGetCart();
        const items: CartItem[] = (serverCart.items || []).map((it: { id_produit: number; quantite: number }) => ({
          product: {
            id: it.id_produit,
            name: '',
            brand: '',
            category: '',
            price: 0,
            images: [],
            description: '',
            specifications: {},
            stock: 0,
            isNew: false,
            rating: 0,
            reviews: [],
          },
          quantity: it.quantite,
        }));
        dispatch({ type: 'LOAD_CART', payload: items });
      } catch (e) {
        // Fallback to local storage if server unavailable
        const key = `cart:${userId}`;
        const savedCart = localStorage.getItem(key);
        if (savedCart) {
          try {
            const cartItems = JSON.parse(savedCart);
            dispatch({ type: 'LOAD_CART', payload: cartItems });
          } catch (error) {
            console.error('Error loading cart from localStorage:', error);
            dispatch({ type: 'LOAD_CART', payload: [] });
          }
        } else {
          dispatch({ type: 'LOAD_CART', payload: [] });
        }
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

  const addItem = (product: Product) => {
    // Update UI immediately
    dispatch({ type: 'ADD_ITEM', payload: product });
    // Persist to backend if logged in
    if (user?.id) {
      apiAddToCart(product.id, 1).catch(() => {
        // Ignore errors to keep UI responsive; could add toast
      });
    }
  };

  const removeItem = (productId: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    if (user?.id) {
      apiClearCart().catch(() => {});
    }
  };

  const openCart = () => {
    dispatch({ type: 'OPEN_CART' });
  };

  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' });
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};