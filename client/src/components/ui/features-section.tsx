import { cn } from "../../lib/utils";
import { motion } from "framer-motion";
import {
  Lightbulb,
  User,
  type LucideIcon,
  Calendar,
  Share2,
  BarChart3,
  Zap,
} from "lucide-react";

type FeatureItem = {
  icon: LucideIcon;
  title: string;
  description: string;
  position?: "left" | "right";
  cornerStyle?: string;
};

// Create feature data arrays for left and right columns
const leftFeatures: FeatureItem[] = [
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description:
      "Auto-align content with peak engagement times for maximum reach.",
    position: "left",
    cornerStyle: "sm:translate-x-4 sm:rounded-br-[2px]",
  },
  {
    icon: Share2,
    title: "Cross-Platform Magic",
    description:
      "Write once, post everywhere. Adapts content for all platforms automatically.",
    position: "left",
    cornerStyle: "sm:-translate-x-4 sm:rounded-br-[2px]",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Track performance across all platforms with real-time insights.",
    position: "left",
    cornerStyle: "sm:translate-x-4 sm:rounded-tr-[2px]",
  },
];

const rightFeatures: FeatureItem[] = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Connect accounts and start posting in minutes with intuitive interface.",
    position: "right",
    cornerStyle: "sm:-translate-x-4 sm:rounded-bl-[2px]",
  },
  {
    icon: User,
    title: "Team Collaboration",
    description:
      "Invite team members and collaborate seamlessly on social strategy.",
    position: "right",
    cornerStyle: "sm:translate-x-4 sm:rounded-bl-[2px]",
  },
  {
    icon: Lightbulb,
    title: "AI-Powered Insights",
    description:
      "Get intelligent suggestions for optimal posting times and content.",
    position: "right",
    cornerStyle: "sm:-translate-x-4 sm:rounded-tl-[2px]",
  },
];

// Feature card component with animations
const FeatureCard = ({
  feature,
  index,
}: {
  feature: FeatureItem;
  index: number;
}) => {
  const Icon = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        type: "spring",
        stiffness: 50,
      }}
      viewport={{ once: true }}
    >
      <div
        className={cn(
          "relative rounded-xl sm:rounded-2xl px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 md:pt-6 pb-3 sm:pb-4 md:pb-6 text-xs sm:text-sm",
          "bg-gray-900/60 backdrop-blur-sm border border-gray-700 shadow-xl sm:shadow-2xl",
          "hover:bg-gray-900/80 transition-all duration-300 hover:scale-[1.02]",
          feature.cornerStyle
        )}
      >
        <motion.div
          className="text-white mb-2 sm:mb-3 text-lg sm:text-xl md:text-2xl lg:text-[2rem]"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.2 }}
        >
          <Icon />
        </motion.div>
        <h2 className="text-white mb-2 sm:mb-2.5 text-base sm:text-lg md:text-xl lg:text-2xl font-space leading-tight">
          {feature.title}
        </h2>
        <p className="text-gray-400 text-xs sm:text-sm md:text-base text-pretty font-space leading-relaxed">
          {feature.description}
        </p>
        {/* Decorative elements */}
        <span className="from-red-500/0 via-red-500 to-red-500/0 absolute -bottom-px left-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r opacity-60"></span>
        <span className="absolute inset-0 bg-[radial-gradient(30%_5%_at_50%_100%,rgba(220,38,38,0.15)_0%,transparent_100%)] opacity-60"></span>
      </div>
    </motion.div>
  );
};

export default function FeaturesSection() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center px-4 sm:px-6 md:px-8 lg:px-12 overflow-hidden"
      id="features"
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950"></div>

      {/* Moving orbs - traveling across the section */}
      <div className="absolute top-1/6 left-1/6 w-80 h-80 bg-red-500/15 rounded-full blur-3xl animate-float-1"></div>
      <div className="absolute bottom-1/3 right-1/5 w-[28rem] h-[28rem] bg-red-500/8 rounded-full blur-3xl animate-float-2"></div>
      <div className="absolute top-2/3 left-1/3 w-96 h-96 bg-red-500/12 rounded-full blur-3xl animate-float-3"></div>
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-red-500/10 rounded-full blur-3xl animate-float-4"></div>
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-red-500/6 rounded-full blur-3xl animate-float-5"></div>

      {/* Bottom gradients only */}
      <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-tr from-red-500/6 via-transparent to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-red-500/8 via-transparent to-transparent"></div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(220, 38, 38, 0.3) 1px, transparent 0)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-gray-950"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center justify-center min-h-screen py-6">
        <div className="mx-4 sm:mx-6 lg:mx-8 max-w-[1120px] pt-2 pb-4 sm:pb-6 md:pb-8 min-[1150px]:mx-auto">
          <div className="flex flex-col-reverse gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 md:grid md:grid-cols-3">
            <div className="flex flex-col gap-4 sm:gap-6 md:gap-8">
              {leftFeatures.map((feature, index) => (
                <FeatureCard
                  key={`left-feature-${index}`}
                  feature={feature}
                  index={index}
                />
              ))}
            </div>

            <motion.div
              className="order-[1] mb-4 sm:mb-6 self-center md:order-[0] md:mb-0"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-gray-900/60 backdrop-blur-sm text-white border border-gray-700 relative mx-auto mb-3 sm:mb-4 md:mb-4.5 w-fit rounded-full rounded-bl-[2px] px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm shadow-2xl">
                <span className="relative z-1 flex items-center gap-1 sm:gap-2 font-space">
                  Features
                </span>
                <span className="from-red-500/0 via-red-500 to-red-500/0 absolute -bottom-px left-1/2 h-px w-2/5 -translate-x-1/2 bg-gradient-to-r"></span>
                <span className="absolute inset-0 bg-[radial-gradient(30%_40%_at_50%_100%,rgba(220,38,38,0.25)_0%,transparent_100%)]"></span>
              </div>
              <motion.h2
                className="from-red-500/10 via-white/85 to-white/50 bg-gradient-to-tl bg-clip-text text-center text-2xl tracking-tighter text-balance text-transparent sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-inter font-medium leading-tight"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                All in one social media management
              </motion.h2>
            </motion.div>

            {/* Right column */}
            <div className="flex flex-col gap-4 sm:gap-6 md:gap-8">
              {rightFeatures.map((feature, index) => (
                <FeatureCard
                  key={`right-feature-${index}`}
                  feature={feature}
                  index={index + 3}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
