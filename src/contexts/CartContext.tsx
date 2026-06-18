"use client";

import { createContext, useContext, useReducer, ReactNode, useEffect, useMemo } from "react";
import { Product, CartItem } from "@/types";

// Cart storage key
const CART_KEY = "leonshop_cart";

// ==========================================
// List every possible way the cart state can change
// ADD_ITEM, REMOVE_ITEM, UPDATE_QUANTITY, CLEAR_CART
// ==========================================
type CartAction =
  | { type: "ADD_ITEM"; payload: Product }
  | { type: "REMOVE_ITEM"; payload: { id: number } }
  | { type: "UPDATE_QUANTITY"; payload: { id: number; quantity: number } }
  | { type: "CLEAR_CART" };

// ==========================================
// Cart Reducer
// ==========================================
function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  let newState: CartItem[];

  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.find((item) => item.id === action.payload.id);
      if (existing) {
        // Item already in cart — bump the quantity
        newState = state.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      } else {
        // New item — add with quantity 1
        newState = [...state, { ...action.payload, quantity: 1 }];
      }
      break;
    }
    case "REMOVE_ITEM":
      newState = state.filter((item) => item.id !== action.payload.id);
      break;
    case "UPDATE_QUANTITY":
      newState = state.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item,
      );
      break;
    case "CLEAR_CART":
      newState = [];
      break;
    default:
      newState = state;
  }

  return newState;
}

// ==========================================
// implement CartProvider with useReducer, derive computed values,
// and export useCart() hook with null safety guard
// 3-part pattern — context → provider → hook
// ==========================================
interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  total: number;
  addItem: (product: Product) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

// Helper function to load cart from localStorage
function loadCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading cart from localStorage:", error);
    return [];
  }
}

// Helper function to save cart to localStorage
function saveCartToStorage(items: CartItem[]): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  // Load initial state from localStorage
  const [items, dispatch] = useReducer(cartReducer, [], () => loadCartFromStorage());

  // Save to localStorage whenever items change
  useEffect(() => {
    saveCartToStorage(items);
  }, [items]);

  // Derive computed values from state — no need to store these separately
  const itemCount = useMemo(() => 
    items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );
  
  const total = useMemo(() => 
    items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  // Create convenience functions
  const addItem = (product: Product) => {
    dispatch({ type: "ADD_ITEM", payload: product });
  };

  const removeItem = (id: number) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id } });
  };

  const updateQuantity = (id: number, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const contextValue: CartContextValue = {
    items,
    itemCount,
    total,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside a <CartProvider>");
  }
  return context;
}

