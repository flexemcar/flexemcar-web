import Header from "@/app/components/Header";
import Hero from "@/app/components/Hero";
import Marquee from "@/app/components/Marquee";
import ReelsSection from "@/app/components/ReelsSection";
import StockSection from "@/app/components/StockSection";
import UpcomingDeliveriesSection from "@/app/components/UpcomingDeliveriesSection";
import StatsSection from "@/app/components/StatsSection";
import CtaBanner from "@/app/components/CtaBanner";
import TasacionForm from "@/app/components/TasacionForm";
import TestimonialsSection from "@/app/components/TestimonialsSection";
import MapSection from "@/app/components/MapSection";
import Footer from "@/app/components/Footer";
import WelcomeVideoModal from "@/app/components/WelcomeVideoModal";
import { getReels } from "@/app/lib/getReels";

// Fotos de fondo del banner "Tu viaje comienza aquí" (public/promo). El banner
// enseña solo una franja de cada foto vertical: objectPosition la centra en el
// morro (faros, parrilla y marca) de cada vehículo.
const promoImages = [
  { src: "/promo/promo-1.jpg", objectPosition: "50% 80%" },
  { src: "/promo/promo-2.jpg", objectPosition: "50% 67%" },
  { src: "/promo/promo-3.jpg", objectPosition: "50% 71%" },
  { src: "/promo/promo-4.jpg", objectPosition: "50% 66%" },
];

export default async function Home() {
  const reels = await getReels();

  return (
    <div className="flex flex-col flex-1">
      <Header />
      <main className="flex-1">
        <Hero />
        <Marquee />
        <ReelsSection reels={reels} />
        <WelcomeVideoModal />
        <StockSection />
        <UpcomingDeliveriesSection />
        <StatsSection />
        <CtaBanner
          eyebrow="Flexemcar"
          title="Tu viaje comienza aquí"
          subtitle="Furgonetas y camiones de ocasión revisados, garantizados y listos para trabajar desde el primer día."
          buttonText="Descubre el stock"
          buttonHref="#stock"
          rounded
          images={promoImages}
        />
        <TestimonialsSection />
        <CtaBanner
          id="vende-tu-furgoneta"
          title="¿Quieres vender tu furgoneta?"
          buttonText="Pide tu tasación gratis"
          action={<TasacionForm buttonText="Pide tu tasación gratis" />}
        />
        <MapSection />
      </main>
      <Footer />
    </div>
  );
}
