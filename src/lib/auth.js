// Auth module using API routes with HttpOnly cookies

export const auth = {
  user: null,

  async login(userName, password) {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // After successful login, fetch user data
        const userResponse = await fetch("/api/auth/me");
        if (userResponse.ok) {
          const userData = await userResponse.json();
          this.user = userData;
          // Dispatch auth change event to update auth-dependent components
          window.dispatchEvent(new CustomEvent("auth:change"));
          return { success: true, user: this.user };
        }
      }

      return {
        success: false,
        message: data.error || "Invalid credentials. Please try again.",
      };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "An error occurred during login" };
    }
  },

  async logout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      this.user = null;
      localStorage.removeItem("leonshop_cart");
      sessionStorage.clear();

      // Dispatch auth change event to update auth-dependent components
      window.dispatchEvent(new CustomEvent("auth:change"));
      // Dispatch cart change event to update cart count
      window.dispatchEvent(new CustomEvent("cart:change"));
    }
  },

  async getCurrentUser() {
    // Return cached user if available
    if (this.user) {
      return this.user;
    }

    // Return null if running on server (no fetch available)
    if (typeof window === "undefined") {
      return null;
    }

    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const userData = await response.json();
        this.user = userData;
        return this.user;
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
    }

    return null;
  },

  isAuthenticated() {
    return !!this.user;
  },

  isAdmin() {
    return this.user?.role === "admin";
  },

  isCustomer() {
    return this.user?.role === "customer";
  },
};
