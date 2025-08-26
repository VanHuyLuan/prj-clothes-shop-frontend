import { Header } from "@/components/client/layout/header";
import { Footer } from "@/components/client/layout/footer";
import { HeroSection } from "@/components/client/sections/hero-section";
import { CategorySection } from "@/components/client/sections/category-section";
import { FeaturedProductsSection } from "@/components/client/sections/featured-products-section";
import { NewsletterSection } from "@/components/client/sections/newsletter-section";

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
