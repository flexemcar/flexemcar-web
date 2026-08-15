import Header from "@/app/components/Header";
import Hero from "@/app/components/Hero";
import Marquee from "@/app/components/Marquee";
import ReelsSection from "@/app/components/ReelsSection";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <Header />
      <main className="flex-1">
        <Hero />
        <Marquee />
        <ReelsSection />
      </main>
    </div>
  );
}
