// Cart storage key
const CART_KEY = "leonshop_cart";

export const addToCart = (product) => {
  const cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
  const existingProduct = cart.find((item) => item.id === product.id);

  if (existingProduct) {
    existingProduct.quantity += product.quantity || 1;
  } else {
    cart.push({ ...product, quantity: product.quantity || 1 });
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));

  // Dispatch custom event to notify cart changes
  window.dispatchEvent(new CustomEvent("cart:change"));

  return cart;
};

export const getCart = () => {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
};

export const removeFromCart = (productId) => {
  const cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
  const updatedCart = cart.filter((item) => item.id !== productId);
  localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));

  // Dispatch custom event to notify cart changes
  window.dispatchEvent(new CustomEvent("cart:change"));

  return updatedCart;
};

export const updateCartQuantity = (productId, quantity) => {
  const cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
  const productIndex = cart.findIndex((item) => item.id === productId);

  if (productIndex >= 0) {
    cart[productIndex].quantity = quantity;
    localStorage.setItem(CART_KEY, JSON.stringify(cart));

    // Dispatch custom event to notify cart changes
    window.dispatchEvent(new CustomEvent("cart:change"));
  }

  return cart;
};

export const clearCart = () => {
  localStorage.removeItem(CART_KEY);

  // Dispatch custom event to notify cart changes
  window.dispatchEvent(new CustomEvent("cart:change"));

  return [];
};
