import ProductDetail from "@/components/product/ProductDetail";

export default async function ProductPage({ params }) {
  const { id } = await params;
  return (
    <div className="pt-24 pb-12 min-h-screen bg-light">
      <ProductDetail id={id} />
    </div>
  );
}
