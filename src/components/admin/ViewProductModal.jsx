"use client";

import { X } from "lucide-react";
import Image from "next/image";

export default function ViewProductModal({
  showViewModal,
  setShowViewModal,
  viewingProduct,
  formatPrice,
}) {
  if (!showViewModal || !viewingProduct) return null;

  return (
    <div
      key="view-modal"
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div className="bg-white p-6 rounded-xl max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-secondary">Product Details</h2>
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
              <Image
                src={viewingProduct.image}
                alt={viewingProduct.title}
                width={400}
                height={300}
                unoptimized
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
                {formatPrice(viewingProduct.price, "en-US", "USD")}
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
  );
}
