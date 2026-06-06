"use client";

export default function AddProductModal({
  showAddModal,
  setShowAddModal,
  newProduct,
  setNewProduct,
  categories,
  formatPriceDisplay,
  handlePriceInputChange,
  handleAddProduct,
}) {
  if (!showAddModal) return null;

  return (
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
              Price * (USD)
            </label>
            <input
              key="add-price"
              type="text"
              inputMode="decimal"
              placeholder="Enter price (e.g., 1299.99)"
              value={formatPriceDisplay(newProduct.price, "en-US")}
              onChange={(e) => {
                const rawValue = handlePriceInputChange(e.target.value);
                setNewProduct({
                  ...newProduct,
                  price: rawValue,
                });
              }}
              onBlur={(e) => {
                const rawValue = handlePriceInputChange(e.target.value);
                setNewProduct({
                  ...newProduct,
                  price: rawValue,
                });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
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
  );
}
