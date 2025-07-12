import Footer from "@/components/Footer";
import BlobGradient from "@/components/Gradients/GradientBackground";
import Section1 from "@/components/LandingPage/Section1";
import Section2 from "@/components/LandingPage/Section2";
import Section3 from "@/components/LandingPage/Section3";
import Section4 from "@/components/LandingPage/Section4";
import { AnimatePresence } from "framer-motion";

export default async function Home() {

  return (
    <div className="overflow-x-hidden flex-col justify-center items-center w-full min-h-full scroll-smooth scroll-snap-y-mandatory">
      <AnimatePresence mode="wait">
        <BlobGradient className="absolute inset-0 -z-50 h-[970px] md:h-[900px] -bottom-50" />
        <Section1 />
        <Section2 />
        <Section3 />
        <Section4 />
        <Footer />
      </AnimatePresence>
    </div>
  );
}
