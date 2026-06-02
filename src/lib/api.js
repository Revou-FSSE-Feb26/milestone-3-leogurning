// Platzi Fake Store API base URL
const API_URL = "https://fakestoreapi.com";

// Escuela JS API base URL for admin operations
const ESCUELA_API_URL = "https://api.escuelajs.co/api/v1/products";

// Exchange rate: 1 USD = 15,000 IDR (fixed rate for simplicity)
const USD_TO_IDR_RATE = 15000;

// Convert USD to IDR
const convertToIDR = (usdPrice) => {
  return Math.round(usdPrice * USD_TO_IDR_RATE);
};

export async function fetchProducts() {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    const data = await response.json();

    // Map API data to our format and convert price to IDR
    return data.map((product) => ({
      id: product.id,
      title: product.title,
      price: convertToIDR(product.price),
      description: product.description,
      category: product.category,
      image: product.image,
      rating: {
        rate: product.rating?.rate || 0,
        count: product.rating?.count || 0,
      },
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
    // Return mock data as fallback
    return [
      {
        id: 1,
        title: "Premium Wireless Headphones",
        price: 1299000,
        description: "High-quality wireless headphones",
        category: "Electronics",
        image: "https://placehold.co/400x400/303841/ffffff?text=Headphones",
        rating: { rate: 4.5, count: 120 },
      },
      {
        id: 2,
        title: "Smart Fitness Watch",
        price: 899000,
        description: "Track your fitness goals",
        category: "Electronics",
        image: "https://placehold.co/400x400/303841/ffffff?text=Smart+Watch",
        rating: { rate: 4.2, count: 85 },
      },
      {
        id: 3,
        title: "Organic Cotton T-Shirt",
        price: 299000,
        description: "Comfortable organic cotton t-shirt",
        category: "Fashion",
        image: "https://placehold.co/400x400/76abae/ffffff?text=T-Shirt",
        rating: { rate: 4.8, count: 200 },
      },
      {
        id: 4,
        title: "Modern Desk Lamp",
        price: 499000,
        description: "Adjustable LED desk lamp",
        category: "Home & Living",
        image: "https://placehold.co/400x400/76abae/ffffff?text=Desk+Lamp",
        rating: { rate: 4.3, count: 95 },
      },
    ];
  }
}

export async function fetchProductById(id) {
  try {
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }
    const data = await response.json();

    return {
      id: data.id,
      title: data.title,
      price: convertToIDR(data.price),
      description: data.description,
      category: data.category,
      image: data.image,
      rating: {
        rate: data.rating?.rate || 0,
        count: data.rating?.count || 0,
      },
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function fetchCategories() {
  try {
    const response = await fetch(`${API_URL}/products/categories`);
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    // Return mock categories as fallback
    return ["Electronics", "Fashion", "Home & Living", "Accessories"];
  }
}

export async function fetchUsers() {
  // Return mock user data for now
  return [
    {
      id: 1,
      email: "admin@leonshop.com",
      password: "admin123",
      name: "Admin User",
      role: "admin",
      createdAt: "2024-01-01T00:00:00.000Z",
    },
    {
      id: 2,
      email: "customer@leonshop.com",
      password: "customer123",
      name: "Customer User",
      role: "customer",
      createdAt: "2024-01-01T00:00:00.000Z",
    },
  ];
}

export async function authenticateUser(email, password) {
  // Check if user exists with matching credentials
  const mockUsers = await fetchUsers();
  const mockUser = mockUsers.find(
    (u) => u.email === email && u.password === password,
  );

  if (mockUser) {
    return { success: true, user: mockUser };
  }

  // Check if it's an admin email (admin@leonshop.com)
  if (email === "admin@leonshop.com" && password) {
    // Create admin user if doesn't exist
    const adminUser = {
      id: 1,
      email: "admin@leonshop.com",
      password: password,
      name: "Admin User",
      role: "admin",
      createdAt: new Date().toISOString(),
    };
    return { success: true, user: adminUser };
  }

  // Create new customer user if doesn't exist
  const newUser = {
    id: Date.now(),
    email,
    name: email.split("@")[0],
    password,
    role: "customer",
    createdAt: new Date().toISOString(),
  };

  return { success: true, user: newUser };
}

// Escuela JS API functions for admin operations
export async function fetchProductsPaginated({ offset = 0, limit = 10 } = {}) {
  try {
    const response = await fetch(
      `${ESCUELA_API_URL}?offset=${offset}&limit=${limit}`,
    );
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    const data = await response.json();

    return data.map((product) => ({
      id: product.id,
      title: product.title || product.name,
      price: convertToIDR(product.price),
      description: product.description || "",
      category: product.category?.name || product.category || "General",
      image: product.images?.[0] || product.image || "https://placehold.co/400",
      rating: {
        rate: product.rating?.rate || 0,
        count: product.rating?.count || 0,
      },
    }));
  } catch (error) {
    console.error("Error fetching products with pagination:", error);
    return [];
  }
}

export async function createProduct(productData) {
  try {
    const response = await fetch(ESCUELA_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: productData.title,
        price: productData.price,
        description: productData.description,
        categoryId: productData.categoryId || 1,
        images: productData.images || [
          productData.image || "https://placehold.co/600x400",
        ],
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create product");
    }

    const data = await response.json();
    // Map Escuela JS response to our expected format and convert price to IDR
    return {
      id: data.id,
      title: data.title || data.name,
      price: convertToIDR(data.price),
      description: data.description || "",
      category: data.category?.name || data.category || "General",
      image: data.images?.[0] || data.image || "https://placehold.co/400",
      rating: {
        rate: data.rating?.rate || 0,
        count: data.rating?.count || 0,
      },
    };
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
}

export async function updateProduct(id, productData) {
  try {
    // Fetch the existing product to get its slug, categoryId, and images
    let existingProduct = null;
    try {
      const existingResponse = await fetch(`${ESCUELA_API_URL}/${id}`);
      if (existingResponse.ok) {
        existingProduct = await existingResponse.json();
      }
    } catch (err) {
      console.log("Could not fetch existing product for update:", err);
    }

    const requestBody = {
      title: productData.title,
      price: productData.price,
      description: productData.description,
      slug:
        existingProduct?.slug ||
        productData.title?.toLowerCase().replace(/\s+/g, "-"),
      categoryId: productData.categoryId || existingProduct?.category?.id || 1,
      images:
        productData.images ||
        (existingProduct?.images && existingProduct.images.length > 0
          ? existingProduct.images
          : [productData.image || "https://placehold.co/600x400"]),
    };

    const response = await fetch(`${ESCUELA_API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to update product: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    // Map Escuela JS response to our expected format and convert price to IDR
    return {
      id: data.id,
      title: data.title || data.name,
      price: convertToIDR(data.price),
      description: data.description || "",
      category: data.category?.name || data.category || "General",
      image: data.images?.[0] || data.image || "https://placehold.co/400",
      rating: {
        rate: data.rating?.rate || 0,
        count: data.rating?.count || 0,
      },
    };
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
}

export async function deleteProduct(id) {
  try {
    const response = await fetch(`${ESCUELA_API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete product");
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
}

export async function fetchRelatedProducts(id) {
  try {
    const response = await fetch(`${API_URL}/products/${id}/related`);
    if (!response.ok) {
      // Fallback for Platzi API which may not support related endpoint
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
}

export async function fetchCategoriesEscuela() {
  try {
    const response = await fetch("https://api.escuelajs.co/api/v1/categories");
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [
      { id: 1, name: "Electronics" },
      { id: 2, name: "Fashion" },
      { id: 3, name: "Home & Living" },
      { id: 4, name: "Accessories" },
    ];
  }
}
