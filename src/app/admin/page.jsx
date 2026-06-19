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
import AddProductModal from "@/components/admin/AddProductModal";
import EditProductModal from "@/components/admin/EditProductModal";
import DeleteConfirmationModal from "@/components/admin/DeleteConfirmationModal";
import ViewProductModal from "@/components/admin/ViewProductModal";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
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
  const [currentUser, setCurrentUser] = useState(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isUpdatingProduct, setIsUpdatingProduct] = useState(false);
  const [isDeletingProduct, setIsDeletingProduct] = useState(false);
  const router = useRouter();

  // Format price based on input
  const formatPrice = (price, region, curr) => {
    return new Intl.NumberFormat(region, {
      style: "currency",
      currency: curr,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Format price for display (based on input) - adds thousand separators
  const formatPriceDisplay = (price, region) => {
    if (!price && price !== 0) return "";
    const num = parseFloat(price);
    if (isNaN(num)) return "";
    // Format with thousand separators for display
    return num.toLocaleString(region);
  };

  // Handle price input change - stores raw number
  const handlePriceInputChange = (value) => {
    // Remove any non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, "");
    return numericValue;
  };

  // Load products from Escuela JS API
  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchProductsPaginated({ limit: 100 });
      setProducts(data);
    } catch (error) {
      console.error("Error loading products:", error);
      showNotification("Failed to fetch data, please try again", "error");
      // Fallback to localStorage if API fails
      try {
        const stored = localStorage.getItem("leonshop_products");
        if (stored) {
          const storedData = JSON.parse(stored);
          setProducts(storedData);
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
      showNotification("Failed to fetch categories, please try again", "error");
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
    const checkAuth = async () => {
      const user = await auth.getCurrentUser();
      setCurrentUser(user);

      // Redirect to login if not authenticated
      if (!user) {
        router.push("/login?redirect=/admin");
        return;
      }

      // Redirect to unauthorized if not admin
      if (user.role !== "admin") {
        router.push("/unauthorized");
        return;
      }

      // Load products and categories only after auth check passes
      loadProducts();
      loadCategories();
    };

    checkAuth();
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

  // Sort products by created date (newest first)
  // Use creationAt if available (from API), otherwise use updatedAt or fallback to id
  const sortedProducts = filteredProducts.sort((a, b) => {
    const dateA = new Date(a.creationAt || a.updatedAt || a.id).getTime();
    const dateB = new Date(b.creationAt || b.updatedAt || b.id).getTime();
    return dateB - dateA; // Descending order (newest first)
  });

  // Reset page to 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = sortedProducts.slice(
    startIndex,
    startIndex + productsPerPage,
  );

  const handleAddProduct = async () => {
    if (!newProduct.title || !newProduct.price) {
      showNotification("Please fill in all required fields", "error");
      return;
    }

    setIsAddingProduct(true);
    try {
      const productData = {
        title: newProduct.title,
        price: parseFloat(newProduct.price),
        description: newProduct.description,
        categoryId: newProduct.categoryId,
        image: newProduct.image,
      };

      const createdProduct = await createProduct(productData);

      // Update local state
      const updatedProducts = [...products, createdProduct];
      setProducts(updatedProducts);

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
    } finally {
      setIsAddingProduct(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    // Set product to be editted
    setNewProduct({
      title: product.title,
      price: product.price,
      description: product.description,
      category: product.category || "",
      image: product.image || "",
      categoryId: product.categoryId || 1,
    });

    setShowEditModal(true);
  };

  // Cancel edit mode and reset form inputs
  const cancelEdit = () => {
    setEditingProduct(null);
    setNewProduct({
      title: "",
      price: "",
      description: "",
      category: "",
      image: "",
      categoryId: 1,
    });
    setShowEditModal(false);
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

    setIsUpdatingProduct(true);
    try {
      const productData = {
        title: newProduct.title,
        price: parseFloat(newProduct.price),
        description: newProduct.description,
        categoryId: newProduct.categoryId,
        image: newProduct.image || "https://placehold.co/600x400",
      };

      await updateProduct(editingProduct.id, productData);

      // Get category name from categoryId
      const categoryName =
        categories.find((c) => c.id === newProduct.categoryId)?.name ||
        newProduct.category;

      // Update local state
      const updatedProducts = products.map((p) =>
        p.id === editingProduct.id
          ? {
            ...p,
            title: newProduct.title,
            price: parseFloat(newProduct.price),
            description: newProduct.description,
            category: categoryName,
            categoryId: newProduct.categoryId,
            image: newProduct.image,
          }
          : p,
      );
      setProducts(updatedProducts);

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
    } finally {
      setIsUpdatingProduct(false);
    }
  };

  const handleDeleteProduct = (id) => {
    setProductToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDeleteProduct = async () => {
    if (productToDelete) {
      setIsDeletingProduct(true);
      try {
        await deleteProduct(productToDelete);

        // Update local state
        const updatedProducts = products.filter(
          (p) => p.id !== productToDelete,
        );
        setProducts(updatedProducts);

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
        setShowDeleteModal(false);
        setProductToDelete(null);
      } catch (error) {
        console.error("Error deleting product:", error);
        showNotification("Failed to delete product", "error");
      } finally {
        setIsDeletingProduct(false);
      }
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
          className={`fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium ${notification.type === "error"
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
                      {formatPrice(product.price, "en-US", "USD")}
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
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${currentPage === 1
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
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${currentPage === page
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
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${currentPage === totalPages
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
      <AddProductModal
        showAddModal={showAddModal}
        setShowAddModal={setShowAddModal}
        newProduct={newProduct}
        setNewProduct={setNewProduct}
        categories={categories}
        formatPriceDisplay={formatPriceDisplay}
        handlePriceInputChange={handlePriceInputChange}
        handleAddProduct={handleAddProduct}
        isSubmitting={isAddingProduct}
      />

      {/* Edit Product Modal */}
      <EditProductModal
        showEditModal={showEditModal}
        newProduct={newProduct}
        setNewProduct={setNewProduct}
        categories={categories}
        formatPriceDisplay={formatPriceDisplay}
        handlePriceInputChange={handlePriceInputChange}
        handleUpdateProduct={handleUpdateProduct}
        cancelUpdateProduct={cancelEdit}
        isSubmitting={isUpdatingProduct}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        showDeleteModal={showDeleteModal}
        cancelDelete={cancelDelete}
        confirmDeleteProduct={confirmDeleteProduct}
        isSubmitting={isDeletingProduct}
      />

      {/* View Product Modal */}
      <ViewProductModal
        showViewModal={showViewModal}
        setShowViewModal={setShowViewModal}
        viewingProduct={viewingProduct}
        formatPrice={formatPrice}
      />
    </div>
  );
}
