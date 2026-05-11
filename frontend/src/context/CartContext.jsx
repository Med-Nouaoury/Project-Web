import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'lg_cart';

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.find((i) => i.id === action.item.id);
      if (existing) {
        return state.map((i) =>
          i.id === action.item.id
            ? { ...i, qty: Math.min(i.qty + (action.qty || 1), i.stock) }
            : i
        );
      }
      return [...state, { ...action.item, qty: action.qty || 1 }];
    }
    case 'REMOVE':
      return state.filter((i) => i.id !== action.id);
    case 'SET_QTY':
      return state
        .map((i) =>
          i.id === action.id ? { ...i, qty: Math.max(1, Math.min(action.qty, i.stock)) } : i
        )
        .filter((i) => i.qty > 0);
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [], loadCart);

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (item, qty = 1) => dispatch({ type: 'ADD', item, qty });
  const removeItem = (id) => dispatch({ type: 'REMOVE', id });
  const setQty = (id, qty) => dispatch({ type: 'SET_QTY', id, qty });
  const clearCart = () => dispatch({ type: 'CLEAR' });

  const totalItems = items.reduce((s, i) => s + i.qty, 0);
  const totalPrice = items.reduce((s, i) => s + i.qty * parseFloat(i.prix || 0), 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, setQty, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
}
