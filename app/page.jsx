import LandingPopup from '@/components/LandingPopup';
import HeroSection from '../components/HeroSection';
import StatsSection from '../components/StatsSection';
import Review from '../components/ReviewSection';
import GoodSection from '../components/GoodSection';
import WrongSection from '../components/WrongSection';
import WrongSection2 from '../components/WrongSection2';
import Footer from '@/components/Footer';
import CanSection from '../components/CanSection';
import LastSection from '../components/LastSection';
import QnaSection from '@/components/QnaSection';

export default async function Home() {
  return (
    <div>
      <LandingPopup />
      <HeroSection />
      <WrongSection />  
      <WrongSection2 />
      <CanSection />
      <StatsSection />
      <GoodSection />
      <Review/>
      <LastSection/>
      <QnaSection/>
      <Footer/>
    </div>
  );
}
