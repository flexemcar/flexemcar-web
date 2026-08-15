import Header from "@/app/components/Header";
import Hero from "@/app/components/Hero";
import Marquee from "@/app/components/Marquee";
import ReelsSection from "@/app/components/ReelsSection";
import StockSection from "@/app/components/StockSection";
import StatsSection from "@/app/components/StatsSection";
import AdvantagesSection from "@/app/components/AdvantagesSection";
import CtaBanner from "@/app/components/CtaBanner";
import TestimonialsSection from "@/app/components/TestimonialsSection";
import MapSection from "@/app/components/MapSection";
import Footer from "@/app/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <Header />
      <main className="flex-1">
        <Hero />
        <Marquee />
        <ReelsSection />
        <StockSection />
        <StatsSection />
        <AdvantagesSection />
        <CtaBanner
          eyebrow="Flexemcar"
          title="Tu viaje comienza aquí"
          subtitle="Furgonetas y camiones de ocasión revisados, garantizados y listos para trabajar desde el primer día."
          buttonText="Descubre el stock"
          buttonHref="#stock"
          rounded
        />
        <TestimonialsSection />
        <CtaBanner
          id="vende-tu-furgoneta"
          title="¿Quieres vender tu furgoneta?"
          buttonText="Pide tu tasación gratis"
          buttonHref="#"
        />
        <MapSection />
      </main>
      <Footer />
    </div>
  );
}
