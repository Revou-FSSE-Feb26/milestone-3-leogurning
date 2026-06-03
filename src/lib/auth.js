import { authenticateUser } from "./api";

// Auth storage key
const AUTH_KEY = "leonshop_auth";

export const auth = {
  user: null,

  async login(email, password) {
    try {
      const result = await authenticateUser(email, password);

      if (result.success) {
        this.user = result.user;
        localStorage.setItem(AUTH_KEY, JSON.stringify(this.user));
        // Dispatch auth change event to update auth-dependent components
        window.dispatchEvent(new CustomEvent("auth:change"));
        return { success: true, user: this.user };
      }

      return { success: false, message: result.message };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "An error occurred during login" };
    }
  },

  logout() {
    this.user = null;
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem("leonshop_cart");
    sessionStorage.clear();

    // Dispatch auth change event to update auth-dependent components
    window.dispatchEvent(new CustomEvent("auth:change"));
    // Dispatch cart change event to update cart count
    window.dispatchEvent(new CustomEvent("cart:change"));
  },

  getCurrentUser() {
    // Return null if running on server (no localStorage available)
    if (typeof window === "undefined") {
      return null;
    }

    if (!this.user) {
      const stored = localStorage.getItem(AUTH_KEY);
      if (stored) {
        this.user = JSON.parse(stored);
      }
    }
    return this.user;
  },

  isAuthenticated() {
    return !!this.getCurrentUser();
  },

  isAdmin() {
    const user = this.getCurrentUser();
    return user?.role === "admin";
  },

  isCustomer() {
    const user = this.getCurrentUser();
    return user?.role === "customer";
  },
};
