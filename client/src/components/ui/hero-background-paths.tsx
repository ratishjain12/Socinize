"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.3 + i * 0.02,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="w-full h-full" viewBox="0 0 696 316" fill="none">
        <title>Hero Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="var(--socinize-text-secondary)"
            strokeWidth={path.width}
            strokeOpacity={0.05 + path.id * 0.01}
            initial={{ pathLength: 0.3, opacity: 0.3 }}
            animate={{
              pathLength: 1,
              opacity: [0.1, 0.3, 0.1],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 40 + Math.random() * 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

interface HeroBackgroundPathsProps {
  title?: string;
  subtitle?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

export function HeroBackgroundPaths({
  title = "Welcome to Socinize",
  subtitle = "Experience the future of social connectivity with our revolutionary platform that brings people together like never before.",
  primaryButtonText = "Learn More",
  secondaryButtonText = "Watch Demo",
  onPrimaryClick,
  onSecondaryClick,
}: HeroBackgroundPathsProps) {
  const words = title.split(" ");

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
      style={{ background: "var(--socinize-background-slate)" }}
    >
      <div className="absolute inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black mb-8 tracking-tighter font-clash leading-[1.1] py-4 [color:var(--socinize-text-primary)]">
            {title}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-xl max-w-2xl mx-auto leading-relaxed font-clash mb-12 [color:var(--socinize-text-secondary)]"
          >
            {subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <button
              onClick={onPrimaryClick}
              className="px-8 py-4 font-semibold rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 shadow-lg font-clash [color:var(--socinize-text-primary)]"
              style={{ background: "var(--socinize-primary-teal)" }}
            >
              {primaryButtonText}
            </button>
            <button
              onClick={onSecondaryClick}
              className="px-8 py-4 bg-transparent font-semibold rounded-2xl hover:bg-neutral-800/50 transition-all duration-300 transform hover:scale-105 font-clash [color:var(--socinize-text-muted)]"
              style={{ border: "2px solid var(--socinize-ui-border)" }}
            >
              {secondaryButtonText}
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
