import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { waitlistService } from "../../services/waitlistService";
import { supabase } from "../../supabase/client";

type AvatarProps = {
  imageSrc: string;
  delay: number;
};

const Avatar: React.FC<AvatarProps> = ({ imageSrc, delay }) => {
  return (
    <div
      className="relative h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 rounded-full overflow-hidden border-2 border-gray-700 shadow-lg animate-fadeIn"
      style={{ animationDelay: `${delay}ms` }}
    >
      <img
        src={imageSrc}
        alt="User avatar"
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
    </div>
  );
};

const TrustElements: React.FC<{
  waitlistCount: number | null;
  isLoading: boolean;
}> = ({ waitlistCount, isLoading }) => {
  const avatars = [
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  ];

  const formatCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className="inline-flex items-center space-x-3 bg-gray-900/60 backdrop-blur-sm rounded-full py-2 px-3 sm:py-2 sm:px-4 text-xs sm:text-sm">
      <div className="flex -space-x-2 sm:-space-x-3">
        {avatars.map((avatar, index) => (
          <Avatar key={index} imageSrc={avatar} delay={index * 200} />
        ))}
      </div>
      <p
        className="text-white animate-fadeIn whitespace-nowrap font-space"
        style={{ animationDelay: "800ms" }}
      >
        {isLoading ? (
          <span className="text-white font-semibold">Loading...</span>
        ) : (
          <>
            <span className="text-white font-semibold">
              {formatCount(waitlistCount || 0)}
            </span>{" "}
            currently on the waitlist
          </>
        )}
      </p>
    </div>
  );
};

const WaitlistForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setMessage({
        type: "error",
        text: "Please enter a valid email address.",
      });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const result = await waitlistService.addToWaitlist(email);

      if (result.success) {
        setIsSubmitted(true);
        setEmail("");
      } else {
        setMessage({
          type: "error",
          text: result.error || "Something went wrong. Please try again.",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative z-10 w-full">
      {!isSubmitted ? (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Your Email"
            className="flex-1 px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-gray-900/60 border border-gray-700 focus:border-white outline-none text-white text-sm sm:text-base shadow-[0_0_15px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-300 font-space"
            required
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-all duration-300 transform hover:scale-105 whitespace-nowrap text-sm sm:text-base font-space ${
              isSubmitting
                ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                : "bg-white hover:bg-gray-100 text-black"
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="h-4 w-4 sm:h-5 sm:w-5 border-2 border-gray-300 border-t-black rounded-full animate-spin mr-2"></div>
                Joining...
              </div>
            ) : (
              "Join The Waitlist"
            )}
          </button>
        </form>
      ) : (
        <div className="bg-green-500/20 border border-green-500/30 text-green-300 rounded-full px-6 sm:px-8 py-3 sm:py-4 text-center animate-fadeIn text-sm sm:text-base font-space">
          Thanks! You're now on the waitlist. We'll notify you when we launch.
        </div>
      )}

      {message && (
        <div
          className={`mt-4 p-3 rounded-lg text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
};

const GradientBars: React.FC = () => {
  const [numBars] = useState(15);

  const calculateHeight = (index: number, total: number) => {
    const position = index / (total - 1);
    const maxHeight = 100;
    const minHeight = 30;

    const center = 0.5;
    const distanceFromCenter = Math.abs(position - center);
    const heightPercentage = Math.pow(distanceFromCenter * 2, 1.2);

    return minHeight + (maxHeight - minHeight) * heightPercentage;
  };

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div
        className="flex h-full"
        style={{
          width: "100%",
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
          WebkitFontSmoothing: "antialiased",
        }}
      >
        {Array.from({ length: numBars }).map((_, index) => {
          const height = calculateHeight(index, numBars);
          return (
            <div
              key={index}
              style={{
                flex: "1 0 calc(100% / 15)",
                maxWidth: "calc(100% / 15)",
                height: "100%",
                background:
                  "linear-gradient(to top, rgb(30, 55, 153), transparent)",
                transform: `scaleY(${height / 100})`,
                transformOrigin: "bottom",
                transition: "transform 0.5s ease-in-out",
                animation: "pulseBar 2s ease-in-out infinite alternate",
                animationDelay: `${index * 0.1}s`,
                outline: "1px solid rgba(0, 0, 0, 0)",
                boxSizing: "border-box",
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 py-4 px-6 md:px-12 transition-all duration-300 ${
        isScrolled
          ? "bg-white/10 backdrop-blur-md border-b border-white/20 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-white font-bold text-xl tracking-tighter font-space">
              Socinize
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-gray-300 hover:text-white transition-colors duration-300 font-space"
            >
              Features
            </a>
            <a
              href="#hero"
              className="bg-white hover:bg-gray-100 text-black px-5 py-2 rounded-full transition-all duration-300 transform hover:scale-105 font-space"
            >
              Join The Waitlist
            </a>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div
            className={`md:hidden mt-4 rounded-lg p-4 animate-fadeIn ${
              isScrolled
                ? "bg-white/10 backdrop-blur-md border border-white/20"
                : "bg-gray-900 bg-opacity-95 backdrop-blur-sm"
            }`}
          >
            <div className="flex flex-col space-y-4">
              <a
                href="#features"
                className="text-gray-300 hover:text-white transition-colors duration-300 py-2 font-space"
              >
                Features
              </a>
              <button className="bg-white hover:bg-gray-100 text-black px-5 py-2 rounded-full transition-all duration-300 w-full font-space">
                Join The Waitlist
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default function HeroSection() {
  const [waitlistCount, setWaitlistCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWaitlistCount = async () => {
    try {
      const count = await waitlistService.getWaitlistCount();
      setWaitlistCount(count);
    } catch (err) {
      console.error("Failed to fetch waitlist count:", err);
      setWaitlistCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWaitlistCount();
    const channel = supabase.channel("waitlist-realtime");
    channel
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "waitlist",
        },
        () => {
          fetchWaitlistCount();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center px-6 sm:px-8 md:px-12 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gray-950"></div>
      <GradientBars />
      <Navbar />

      <div className="relative z-10 text-center w-full max-w-4xl mx-auto flex flex-col items-center justify-center min-h-screen py-8 sm:py-16">
        <div className="mb-6 sm:mb-8">
          <TrustElements waitlistCount={waitlistCount} isLoading={isLoading} />
        </div>

        <h1 className="w-full text-white leading-tight tracking-tight mb-6 sm:mb-8 animate-fadeIn px-4">
          <span className="block font-inter font-medium text-[clamp(1.5rem,6vw,3.75rem)] whitespace-nowrap">
            Manage All Your Social Media,
          </span>
          <span className="block font-instrument italic text-[clamp(1.5rem,6vw,3.75rem)] whitespace-nowrap">
            From One Place.
          </span>
        </h1>

        <div className="mb-6 sm:mb-10 px-4">
          <p className="text-[clamp(1rem,3vw,1.5rem)] text-gray-400 leading-relaxed animate-fadeIn animation-delay-200 font-space">
            Be the first to know when we launch.
          </p>
          <p className="text-[clamp(1rem,3vw,1.5rem)] text-gray-400 leading-relaxed animate-fadeIn animation-delay-300 font-space">
            Join the waitlist and get exclusive early access.
          </p>
        </div>

        <div className="w-full max-w-2xl mb-6 sm:mb-8 px-4">
          <WaitlistForm />
        </div>
      </div>
    </section>
  );
}
