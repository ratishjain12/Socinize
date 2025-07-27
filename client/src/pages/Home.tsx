import { HeroBackgroundPaths } from "@/components/ui/hero-background-paths";
import { Navbar } from "@/components/Navbar";
import FeaturesSection from "@/components/ui/features-section";

export const Home = () => {
  const handleLearnMore = () => {
    // Handle Learn More button click
    console.log("Learn More clicked");
  };

  const handleWatchDemo = () => {
    // Handle Watch Demo button click
    console.log("Watch Demo clicked");
  };

  return (
    <div className="min-h-screen bg-brand-bg">
      <Navbar />
      <main className="pt-24 md:pt-32">
        <HeroBackgroundPaths
          title="Welcome to Socinize"
          subtitle="Experience the future of social connectivity with our revolutionary platform that brings people together like never before."
          primaryButtonText="Learn More"
          secondaryButtonText="Watch Demo"
          onPrimaryClick={handleLearnMore}
          onSecondaryClick={handleWatchDemo}
        />
        <FeaturesSection />
      </main>
    </div>
  );
};
