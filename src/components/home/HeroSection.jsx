import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative bg-light py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-secondary leading-tight">
              Discover Amazing <br />
              <span className="text-primary">Products</span> For You
            </h1>
            <p className="text-lg text-secondary max-w-md">
              Shop our curated collection of premium products at unbeatable
              prices. Quality guaranteed with fast shipping.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/products"
                className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
              >
                Shop Now
              </Link>
              <Link
                href="/promotions"
                className="px-8 py-3 bg-white border-2 border-primary text-blue rounded-lg hover:bg-primary hover:text-white transition-colors font-medium"
              >
                View Promotions
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-primary rounded-2xl transform rotate-3 opacity-20"></div>
            <div className="relative bg-linear-to-br from-primary to-light rounded-2xl p-8">
              <div className="text-center">
                <div className="text-6xl font-bold text-white mb-2">25%</div>
                <div className="text-white text-lg mb-4">OFF</div>
                <div className="text-secondary font-medium">
                  On all products
                </div>
                <div className="mt-6 text-secondary text-sm">
                  Valid until June 30, 2026
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
