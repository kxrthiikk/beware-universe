import { useCallback, useState } from "react";
import Layout from "./components/Layout";
import IntroLoader from "./components/IntroLoader";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CreativeUniverse from "./components/CreativeUniverse";
import Portfolio from "./components/Portfolio";
import Studio from "./components/Studio";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

export default function App() {
  const [introReady, setIntroReady] = useState(false);

  const handleIntroComplete = useCallback(() => {
    setIntroReady(true);
  }, []);

  return (
    <Layout>
      <IntroLoader onComplete={handleIntroComplete} />
      <Navbar introReady={introReady} />
      <main>
        <Hero introReady={introReady} />
        <CreativeUniverse />
        <Portfolio />
        <Studio />
        <CTA />
      </main>
      <Footer />
    </Layout>
  );
}
