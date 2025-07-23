import { HeroBackgroundPaths } from "@/components/ui/hero-background-paths";
import { Navbar } from "@/components/Navbar";

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
    <div className="min-h-screen">
      <Navbar />
      <HeroBackgroundPaths
        title="Welcome to Socinize"
        subtitle="Experience the future of social connectivity with our revolutionary platform that brings people together like never before."
        primaryButtonText="Learn More"
        secondaryButtonText="Watch Demo"
        onPrimaryClick={handleLearnMore}
        onSecondaryClick={handleWatchDemo}
      />
    </div>
  );
};
