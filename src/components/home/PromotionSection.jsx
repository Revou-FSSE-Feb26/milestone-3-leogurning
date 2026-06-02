import Image from "next/image";

export default function PromotionSection() {
  const promotions = [
    {
      id: 1,
      title: "Summer Sale",
      description: "Up to 50% off on all summer collection",
      image:
        "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=800",
      startDate: "June 1, 2026",
      endDate: "June 30, 2026",
    },
    {
      id: 2,
      title: "Electronics Week",
      description: "Special discounts on all electronic devices",
      image:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
      startDate: "June 5, 2026",
      endDate: "June 12, 2026",
    },
    {
      id: 3,
      title: "Fashion Festival",
      description: "Trending styles at unbeatable prices",
      image:
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800",
      startDate: "June 10, 2026",
      endDate: "June 25, 2026",
    },
    {
      id: 4,
      title: "Home & Living",
      description: "Refresh your space with our new collection",
      image:
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",
      startDate: "June 15, 2026",
      endDate: "June 30, 2026",
    },
  ];

  return (
    <section className="py-12 bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-secondary mb-4">
            Current Promotions
          </h1>
          <p className="text-accent">
            Don't miss out on our latest deals and discounts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {promotions.map((promotion) => (
            <div
              key={promotion.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative h-48 md:h-auto overflow-hidden">
                  {/* <img
                    src={promotion.image}
                    alt={promotion.title}
                    className="w-full h-full object-cover"
                  /> */}
                  <Image
                    src={promotion.image}
                    alt={promotion.title}
                    fill
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="text-sm font-medium opacity-90">
                      {promotion.startDate} - {promotion.endDate}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-secondary mb-2">
                    {promotion.title}
                  </h3>
                  <p className="text-accent mb-4">{promotion.description}</p>
                  <a
                    href="/products"
                    className="text-primary font-medium hover:text-primary-dark transition-colors inline-flex items-center gap-1"
                  >
                    Shop Promotion →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
