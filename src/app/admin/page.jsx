"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/auth";
import {
  fetchProductsPaginated,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchCategoriesEscuela,
} from "@/lib/api";
import { Edit, Trash2, Search, X } from "lucide-react";
import Image from "next/image";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    image: "",
    categoryId: 1,
  });
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const router = useRouter();

  // Format price as IDR
  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Format price for display (with dots as thousand separator)
  const formatPriceDisplay = (price) => {
    if (!price) return "";
    const num = parseFloat(price);
    if (isNaN(num)) return "";
    return num.toLocaleString("id-ID");
  };

  // Parse formatted price back to number
  const parsePrice = (formattedPrice) => {
    if (!formattedPrice) return "";
    // Remove dots (thousand separators) and convert to number
    return formattedPrice.replace(/\./g, "");
  };

  // Load products from Escuela JS API
  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchProductsPaginated({ limit: 100 });
      setProducts(data);
      setAllProducts(data);
    } catch (error) {
      console.error("Error loading products:", error);
      // Fallback to localStorage if API fails
      try {
        const stored = localStorage.getItem("leonshop_products");
        if (stored) {
          const storedData = JSON.parse(stored);
          setProducts(storedData);
          setAllProducts(storedData);
        }
      } catch (localError) {
        console.error("Error loading from localStorage:", localError);
      }
    } finally {
      setLoading(false);
    }
  };

  // Load categories from Escuela JS API
  const loadCategories = async () => {
    try {
      const data = await fetchCategoriesEscuela();
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
      // Fallback categories - matching Escuela JS API IDs
      setCategories([
        { id: 1, name: "Clothes" },
        { id: 2, name: "Electronics" },
        { id: 3, name: "Furniture" },
        { id: 4, name: "Shoes" },
        { id: 5, name: "Miscellaneous" },
      ]);
    }
  };

  useEffect(() => {
    if (!auth.isAdmin()) {
      router.push("/login");
      return;
    }

    // Load products and categories
    loadProducts();
    loadCategories();
  }, [router]);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Filter products based on search term
  const filteredProducts = products.filter((product) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      product.title?.toLowerCase().includes(searchTermLower) ||
      product.description?.toLowerCase().includes(searchTermLower) ||
      product.category?.toLowerCase().includes(searchTermLower)
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage,
  );

  const handleAddProduct = async () => {
    if (!newProduct.title || !newProduct.price) {
      showNotification("Please fill in all required fields", "error");
      return;
    }

    try {
      const productData = {
        title: newProduct.title,
        price: parseFloat(newProduct.price),
        description: newProduct.description,
        categoryId: newProduct.categoryId,
        image: newProduct.image || "https://placehold.co/600x400",
      };

      const createdProduct = await createProduct(productData);

      // Update local state
      const updatedProducts = [...products, createdProduct];
      setProducts(updatedProducts);
      setAllProducts(updatedProducts);

      // Save to localStorage as backup
      try {
        localStorage.setItem(
          "leonshop_products",
          JSON.stringify(updatedProducts),
        );
      } catch (localError) {
        console.error("Error saving to localStorage:", localError);
      }

      setShowAddModal(false);
      setNewProduct({
        title: "",
        price: "",
        description: "",
        category: "",
        image: "",
        categoryId: 1,
      });
      showNotification("Product added successfully!");
    } catch (error) {
      console.error("Error adding product:", error);
      showNotification("Failed to add product", "error");
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    // Reset form to empty state first, then populate with product data
    setNewProduct({
      title: "",
      price: "",
      description: "",
      category: "",
      image: "",
      categoryId: 1,
    });
    // Small delay to ensure form resets before populating
    setTimeout(() => {
      setNewProduct({
        title: product.title,
        price: product.price,
        description: product.description,
        category: product.category || "",
        image: product.image || "",
        categoryId: product.categoryId || 1,
      });
    }, 0);
    setShowEditModal(true);
  };

  const handleViewProduct = (product) => {
    setViewingProduct(product);
    setShowViewModal(true);
  };

  const handleUpdateProduct = async () => {
    if (!newProduct.title || !newProduct.price) {
      showNotification("Please fill in all required fields", "error");
      return;
    }

    try {
      const productData = {
        title: newProduct.title,
        price: parseFloat(newProduct.price),
        description: newProduct.description,
        categoryId: newProduct.categoryId,
        image: newProduct.image || "https://placehold.co/600x400",
      };

      await updateProduct(editingProduct.id, productData);

      // Update local state
      const updatedProducts = products.map((p) =>
        p.id === editingProduct.id
          ? {
              ...p,
              title: newProduct.title,
              price: parseFloat(newProduct.price),
              description: newProduct.description,
              category: newProduct.category,
              image: newProduct.image,
              categoryId: newProduct.categoryId,
            }
          : p,
      );
      setProducts(updatedProducts);
      setAllProducts(updatedProducts);

      // Save to localStorage as backup
      try {
        localStorage.setItem(
          "leonshop_products",
          JSON.stringify(updatedProducts),
        );
      } catch (localError) {
        console.error("Error saving to localStorage:", localError);
      }

      setShowEditModal(false);
      setEditingProduct(null);
      setNewProduct({
        title: "",
        price: "",
        description: "",
        category: "",
        image: "",
        categoryId: 1,
      });
      showNotification("Product updated successfully!");
    } catch (error) {
      console.error("Error updating product:", error);
      showNotification("Failed to update product", "error");
    }
  };

  const handleDeleteProduct = (id) => {
    setProductToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDeleteProduct = async () => {
    if (productToDelete) {
      try {
        await deleteProduct(productToDelete);

        // Update local state
        const updatedProducts = products.filter(
          (p) => p.id !== productToDelete,
        );
        setProducts(updatedProducts);
        setAllProducts(updatedProducts);

        // Save to localStorage as backup
        try {
          localStorage.setItem(
            "leonshop_products",
            JSON.stringify(updatedProducts),
          );
        } catch (localError) {
          console.error("Error saving to localStorage:", localError);
        }

        showNotification("Product deleted successfully!");
      } catch (error) {
        console.error("Error deleting product:", error);
        showNotification("Failed to delete product", "error");
        return;
      }

      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-secondary font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light">
      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium ${
            notification.type === "error"
              ? "bg-red-500"
              : notification.type === "info"
                ? "bg-blue-500"
                : "bg-green-500"
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary">Admin Dashboard</h1>
          <p className="text-accent">Manage products</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-accent text-sm">Total Products</div>
            <div className="text-3xl font-bold text-secondary mt-2">
              {products.length}
            </div>
          </div>
        </div>

        {/* Add Product Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
          >
            + Add New Product
          </button>
        </div>

        {/* Search Box */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-accent" />
            <input
              type="text"
              placeholder="Search products by name, description, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          {searchTerm && (
            <p className="text-sm text-accent mt-2">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          )}
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-secondary">Products</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-light">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedProducts.map((product, index) => (
                  <tr key={product.id} className="hover:bg-light">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                      {(currentPage - 1) * productsPerPage + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-10 h-10 rounded overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.title}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleViewProduct(product)}
                        className="text-left text-sm text-primary hover:text-primary-dark font-medium hover:underline"
                      >
                        {product.title}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-accent">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="text-accent hover:text-primary mr-4"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-accent">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-primary text-white hover:bg-primary-dark"
                  }`}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        currentPage === page
                          ? "bg-primary text-white"
                          : "bg-white text-secondary hover:bg-light"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-primary text-white hover:bg-primary-dark"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div
          key="add-modal"
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <div className="bg-white p-6 rounded-xl max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-secondary mb-4">
              Add New Product
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Title *
                </label>
                <input
                  key="add-title"
                  type="text"
                  value={newProduct.title}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="Product title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Price *
                </label>
                <input
                  key="add-price"
                  type="text"
                  inputMode="numeric"
                  value={formatPriceDisplay(newProduct.price)}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      price: parsePrice(e.target.value),
                    })
                  }
                  onBlur={(e) =>
                    setNewProduct({
                      ...newProduct,
                      price: parsePrice(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Description
                </label>
                <textarea
                  key="add-description"
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="Product description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Category
                </label>
                <select
                  key="add-category"
                  value={newProduct.categoryId || 1}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      categoryId: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Image URL
                </label>
                <input
                  key="add-image"
                  type="text"
                  value={newProduct.image}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, image: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2 bg-gray-200 text-secondary rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                className="flex-1 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && (
        <div
          key="edit-modal"
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <div className="bg-white p-6 rounded-xl max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-secondary mb-4">
              Edit Product
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Title *
                </label>
                <input
                  key="edit-title"
                  type="text"
                  value={newProduct.title}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="Product title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Price *
                </label>
                <input
                  key="edit-price"
                  type="text"
                  inputMode="numeric"
                  value={formatPriceDisplay(newProduct.price)}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      price: parsePrice(e.target.value),
                    })
                  }
                  onBlur={(e) =>
                    setNewProduct({
                      ...newProduct,
                      price: parsePrice(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Description
                </label>
                <textarea
                  key="edit-description"
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="Product description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Category
                </label>
                <select
                  key="edit-category"
                  value={newProduct.categoryId || 1}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      categoryId: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Image URL
                </label>
                <input
                  key="edit-image"
                  type="text"
                  value={newProduct.image}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, image: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 py-2 bg-gray-200 text-secondary rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateProduct}
                className="flex-1 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Update Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-secondary mb-2">
              Confirm Deletion
            </h2>
            <p className="text-accent mb-6">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={cancelDelete}
                className="flex-1 py-2 bg-gray-200 text-secondary rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteProduct}
                className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Product Modal */}
      {showViewModal && viewingProduct && (
        <div
          key="view-modal"
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <div className="bg-white p-6 rounded-xl max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-secondary">
                Product Details
              </h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-accent hover:text-primary"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Product Image */}
              <div className="md:w-1/3">
                <label className="block text-sm font-medium text-secondary mb-2">
                  Image
                </label>
                <div>
                  <img
                    src={viewingProduct.image}
                    alt={viewingProduct.title}
                    width={400}
                    height={300}
                    className="w-full h-48 md:h-64 object-cover rounded-lg"
                  />
                </div>
              </div>

              {/* Product Details */}
              <div className="md:w-2/3 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">
                    Product ID
                  </label>
                  <p className="text-accent">#{viewingProduct.id}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">
                    Title
                  </label>
                  <p className="text-secondary font-medium">
                    {viewingProduct.title}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">
                    Price
                  </label>
                  <p className="text-primary font-medium">
                    {formatPrice(viewingProduct.price)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">
                    Category
                  </label>
                  <p className="text-accent">{viewingProduct.category}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">
                    Description
                  </label>
                  <p className="text-secondary">{viewingProduct.description}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">
                    Rating
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-primary">
                      {"★".repeat(Math.round(viewingProduct.rating?.rate || 0))}
                    </span>
                    <span className="text-accent">
                      ({viewingProduct.rating?.count || 0} reviews)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
