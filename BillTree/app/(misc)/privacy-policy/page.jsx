import Footer from "@/components/Footer"
import Hero from "@/components/Hero"
import Navbar from "@/components/Navbar"
import PrivacyPolicy from "@/components/PrivacyPolicy";

const page = () => { 
  return (
    <div className="bg-gray-50 font-sans min-h-screen">
        <Navbar />
        <Hero title="Privacy Policy" description="privacy policy" />
        <PrivacyPolicy />
        <Footer />
    </div>
  );
}

export default page