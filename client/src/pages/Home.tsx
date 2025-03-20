import CtaSection from "@/components/Home/CtaSection";
import FaqSection from "@/components/Home/FaqSection";
import FeaturesSection from "@/components/Home/FeaturesSection";
import HeroSection from "@/components/Home/HeroSection";
import HowItWorksSection from "@/components/Home/HowItWorksSection";
import TestimonialsSection from "@/components/Home/TestimonialsSection";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";


const Home = () => {
  
  return (
    <div>
      <Navbar />
      <HeroSection/>
      <FeaturesSection/>
      <HowItWorksSection/>
      <TestimonialsSection/>
      <FaqSection/>
      <CtaSection/>
      <Footer />
    </div>
  );
};

export default Home;
