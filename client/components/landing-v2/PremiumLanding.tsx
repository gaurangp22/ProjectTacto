import "./landing.css";
import HeroSection from "./HeroSection";
import StorySection from "./StorySection";
import SolutionSection from "./SolutionSection";
import HowItWorksSection from "./HowItWorksSection";
import ImpactSection from "./ImpactSection";
import CTASection from "./CTASection";
import NavBar from "./NavBar";

export default function PremiumLanding() {
    return (
        <div className="tacto-v2 t-grain">
            <NavBar />
            <HeroSection />
            <StorySection />
            <SolutionSection />
            <HowItWorksSection />
            <ImpactSection />
            <CTASection />
        </div>
    );
}
