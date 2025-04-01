import Head from 'next/head';
import { Navbar } from './component/navbar';
import { HeroSection } from './component/herosection';
import { ContentSection } from './component/contentsection';
import { Footer } from './component/footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>Digi Krishi</title>
        <meta name="description" content="Empowering farmers with digital tools" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <HeroSection />
      <ContentSection />
      <Footer />
    </div>
  );
}


