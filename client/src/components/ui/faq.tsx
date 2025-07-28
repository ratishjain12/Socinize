import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { PlusIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";

const items = [
  {
    id: "1",
    title: "What is Socinize?",
    content:
      "Socinize is an all-in-one social media management platform designed for creators and businesses. It helps you schedule posts, analyze performance, and grow your audience across all major social media platforms from a single dashboard.",
  },
  {
    id: "2",
    title: "How much does Socinize cost?",
    content:
      "We're currently in beta and offering early access to our waitlist members. Pricing will be announced soon, but we're committed to providing affordable plans for creators of all sizes. Join our waitlist to get exclusive early access and special pricing.",
  },
  {
    id: "3",
    title: "Which social media platforms does Socinize support?",
    content:
      "Socinize supports all major social media platforms including Instagram, Twitter, Facebook, LinkedIn, TikTok, and YouTube. We're constantly adding new platforms based on user feedback.",
  },
  {
    id: "4",
    title: "Can I schedule posts in advance?",
    content:
      "Absolutely! Socinize allows you to schedule posts days, weeks, or even months in advance. You can also set up recurring posts and use our AI-powered content suggestions to maintain a consistent posting schedule.",
  },

  {
    id: "5",
    title: "Is my data secure with Socinize?",
    content:
      "Yes, we take data security seriously. All your data is encrypted, and we follow industry best practices for data protection. We never share your personal information with third parties without your explicit consent.",
  },
];

const fadeInAnimationVariants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.05 * index,
      duration: 0.4,
    },
  }),
};

export default function FaqSection() {
  return (
    <section className="py-12 md:py-16 bg-gray-950">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-10 text-center">
          <motion.h2
            className="mb-4 text-3xl font-bold tracking-tight md:text-4xl text-white"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Frequently Asked{" "}
            <span className="from-red-500 bg-gradient-to-r to-red-400 bg-clip-text text-transparent">
              Questions
            </span>
          </motion.h2>
          <motion.p
            className="text-gray-400 mx-auto max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Everything you need to know about Socinize and how it can help you
            manage your social media presence more effectively.
          </motion.p>
        </div>

        <motion.div
          className="relative mx-auto max-w-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Decorative gradient */}
          <div className="bg-red-500/10 absolute -top-4 -left-4 -z-10 h-72 w-72 rounded-full blur-3xl" />
          <div className="bg-red-500/10 absolute -right-4 -bottom-4 -z-10 h-72 w-72 rounded-full blur-3xl" />

          <Accordion
            type="single"
            collapsible
            className="border-gray-700/40 bg-gray-900/30 w-full rounded-xl border p-2 backdrop-blur-sm"
            defaultValue="1"
          >
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                custom={index}
                variants={fadeInAnimationVariants}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                <AccordionItem
                  value={item.id}
                  className={cn(
                    "bg-gray-900/50 my-1 overflow-hidden rounded-lg border-none px-2 shadow-sm transition-all",
                    "data-[state=open]:bg-gray-900/80 data-[state=open]:shadow-md"
                  )}
                >
                  <AccordionPrimitive.Header className="flex">
                    <AccordionPrimitive.Trigger
                      className={cn(
                        "group flex flex-1 items-center justify-between gap-4 py-4 text-left text-base font-medium text-white",
                        "hover:text-red-400 transition-all duration-300 outline-none",
                        "focus-visible:ring-red-500/50 focus-visible:ring-2",
                        "data-[state=open]:text-red-400"
                      )}
                    >
                      {item.title}
                      <PlusIcon
                        size={18}
                        className={cn(
                          "text-red-400/70 shrink-0 transition-transform duration-300 ease-out",
                          "group-data-[state=open]:rotate-45"
                        )}
                        aria-hidden="true"
                      />
                    </AccordionPrimitive.Trigger>
                  </AccordionPrimitive.Header>
                  <AccordionContent
                    className={cn(
                      "text-gray-400 overflow-hidden pt-0 pb-4",
                      "data-[state=open]:animate-accordion-down",
                      "data-[state=closed]:animate-accordion-up"
                    )}
                  >
                    <div className="border-gray-700/30 border-t pt-3 text-start">
                      {item.content}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
