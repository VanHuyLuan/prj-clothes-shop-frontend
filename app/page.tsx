import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/sections/hero-section";
import { CategorySection } from "@/components/sections/category-section";
import { FeaturedProductsSection } from "@/components/sections/featured-products-section";
import { NewsletterSection } from "@/components/sections/newsletter-section";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <CategorySection />
        <FeaturedProductsSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
}
