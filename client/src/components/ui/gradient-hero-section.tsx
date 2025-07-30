"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { waitlistService } from "../../services/waitlistService";
import { supabase } from "../../supabase/client";

export default function HeroSection() {
  const [waitlistCount, setWaitlistCount] = useState<number>(0);
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

  const fetchWaitlistCount = async () => {
    try {
      const count = await waitlistService.getWaitlistCount();
      setWaitlistCount(count);
    } catch (err) {
      console.error("Failed to fetch waitlist count:", err);
      setWaitlistCount(0);
    }
  };

  useEffect(() => {
    fetchWaitlistCount();

    // Subscribe to real-time updates
    const channel = supabase
      .channel("waitlist-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "waitlist",
        },
        () => {
          fetchWaitlistCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="bg-gray-950 relative w-full overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 z-0">
        <div className="from-red-500/20 via-gray-950 to-gray-950 absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]"></div>
        <div className="bg-red-500/5 absolute top-0 left-1/2 -z-10 h-[1000px] w-[1000px] -translate-x-1/2 rounded-full blur-3xl"></div>
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:16px_16px] opacity-15"></div>

      <div className="relative z-10 container mx-auto px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-5xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-6 flex justify-center"
          >
            <div className="border-gray-700 bg-gray-900/80 inline-flex items-center rounded-full border px-3 py-2 text-xs sm:text-sm backdrop-blur-sm">
              <span className="bg-red-500 mr-2 rounded-full px-2 py-0.5 text-xs font-semibold text-white">
                New
              </span>
              <span className="text-gray-400">
                Join {waitlistCount.toLocaleString()}+ creators already waiting
              </span>
              <ChevronRight className="text-gray-400 ml-1 h-3 w-3 sm:h-4 sm:w-4" />
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="from-red-500/10 via-white/85 to-white/50 bg-gradient-to-tl bg-clip-text text-center text-2xl tracking-tighter text-balance text-transparent sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl"
          >
            Manage All Your Social Media,
            <br />
            <span className="italic">From One Place.</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-400 mx-auto mt-6 max-w-2xl text-center text-sm sm:text-base md:text-lg"
          >
            Schedule posts, analyze performance, and grow your audience. The
            all-in-one social media platform for creators.
          </motion.p>

          {/* Email Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex justify-center"
          >
            {!isSubmitted ? (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 w-full max-w-lg"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-4 h-12 rounded-full bg-gray-900/60 border border-gray-700 focus:border-red-500 outline-none text-white text-xs sm:text-sm backdrop-blur-sm transition-all duration-300"
                  required
                  disabled={isSubmitting}
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="group bg-red-500 text-white hover:shadow-red-500/30 relative overflow-hidden rounded-full px-6 h-12 shadow-lg transition-all duration-300 flex-shrink-0 text-xs sm:text-sm"
                >
                  <span className="relative z-10 flex items-center">
                    {isSubmitting ? "Joining..." : "Join Waitlist"}
                    {!isSubmitting && (
                      <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    )}
                  </span>
                  <span className="from-red-500 via-red-500/90 to-red-500/80 absolute inset-0 z-0 bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                </Button>
              </form>
            ) : (
              <div className="bg-green-500/20 border border-green-500/30 text-green-300 rounded-full px-6 py-3 text-center animate-fadeIn max-w-xl w-full">
                Thanks! You're now on the waitlist. We'll notify you when we
                launch.
              </div>
            )}

            {message && (
              <div
                className={`mt-4 p-3 rounded-lg text-sm max-w-lg w-full ${
                  message.type === "success"
                    ? "bg-green-500/20 text-green-300 border border-green-500/30"
                    : "bg-red-500/20 text-red-300 border border-red-500/30"
                }`}
              >
                {message.text}
              </div>
            )}
          </motion.div>

          {/* Feature Image */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.5,
              type: "spring",
              stiffness: 50,
            }}
            className="relative mx-auto mt-16 max-w-4xl"
          >
            <div className="border-gray-700/40 bg-gray-900/50 overflow-hidden rounded-xl border shadow-xl backdrop-blur-sm">
              <div className="border-gray-700/40 bg-gray-800/50 flex h-10 items-center border-b px-4">
                <div className="flex space-x-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
                <div className="bg-gray-900/50 text-gray-400 mx-auto flex items-center rounded-md px-3 py-1 text-xs">
                  socinize.com/dashboard
                </div>
              </div>
              <div className="relative">
                <img
                  src="https://i.postimg.cc/0yk8Vz7t/dashboard.webp"
                  alt="Socinize Dashboard Preview"
                  className="w-full"
                />
                <div className="from-gray-950 absolute inset-0 bg-gradient-to-t to-transparent opacity-0"></div>
              </div>
            </div>

            {/* Floating elements for visual interest */}
            <div className="border-gray-700/40 bg-gray-900/80 absolute -top-6 -right-6 h-12 w-12 rounded-lg border p-3 shadow-lg backdrop-blur-md">
              <div className="bg-red-500/20 h-full w-full rounded-md"></div>
            </div>
            <div className="border-gray-700/40 bg-gray-900/80 absolute -bottom-4 -left-4 h-8 w-8 rounded-full border shadow-lg backdrop-blur-md"></div>
            <div className="border-gray-700/40 bg-gray-900/80 absolute right-12 -bottom-6 h-10 w-10 rounded-lg border p-2 shadow-lg backdrop-blur-md">
              <div className="h-full w-full rounded-md bg-green-500/20"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
