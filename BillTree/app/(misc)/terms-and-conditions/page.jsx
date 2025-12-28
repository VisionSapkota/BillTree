import Footer from "@/components/Footer"
import Hero from "@/components/Hero"
import Navbar from "@/components/Navbar"
import TermsConditions from "@/components/TermsConditions";

const page = () => { 
  return (
    <div className="bg-gray-50 font-sans min-h-screen">
        <Navbar />
        <Hero title="Terms & conditions" description="terms and conditions" />
        <TermsConditions />
        <Footer />
    </div>
  );
}

export default page