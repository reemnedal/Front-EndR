import {
  HeroSection,
  CategoriesSection,
  FeaturedProductsSection,
  CommunitySection,
  // NewsletterSection,
  TestimonialsSection,
  AboutUsSection,
} from "../pages/Home/about";
import NavigationBar from "../components/Layout/Navbar";
const HomePage = () => {
  return (
    <div className="font-cairo">
      <NavigationBar />
      <HeroSection />
      <CategoriesSection />
      <AboutUsSection />
      <FeaturedProductsSection />
      <CommunitySection />
      {/* <NewsletterSection /> */}
      <TestimonialsSection />
    </div>
  );
};

export default HomePage;