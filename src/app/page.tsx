import HeroSection from "@/components/home/HeroSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";

export default function Home() {
  return (
    <div className="space-y-12">
      <HeroSection />
      <FeaturedProducts />
    </div>
  );
}
