import { useState } from "react";
import { Logo } from "./ui/logo";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0F111A]/85 backdrop-blur-xl border-b border-sky-200/50 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <div className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-tr from-[#00C6A2] to-[#007CF0] rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
            </div>
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {["Features", "Pricing", "About", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="relative px-6 py-3 text-[#C1C8D6] hover:text-white font-medium transition-all duration-300 group font-clash"
              >
                <span className="relative z-10">{item}</span>
                <div className="absolute inset-0 bg-[#007CF0]/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100"></div>
                <div className="absolute bottom-1 left-1/2 w-0 h-0.5 bg-[#007CF0] group-hover:w-8 transition-all duration-300 transform -translate-x-1/2"></div>
              </a>
            ))}

            <div className="ml-6">
              <button className="relative px-8 py-3 bg-gradient-to-b from-[#6a85dd] to-[#1e3799] text-white font-semibold rounded-2xl overflow-hidden group shadow-lg hover:shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105 font-clash">
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#00C6A2] to-[#007CF0] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative w-12 h-12 bg-[#C1C8D6]/20 rounded-xl flex items-center justify-center transition-all duration-300 hover:bg-[#C1C8D6]/30 group"
            >
              <div className="flex flex-col justify-center items-center w-6 h-6">
                <span
                  className={`bg-[#C1C8D6] block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
                    isMenuOpen ? "rotate-45 translate-y-1" : "-translate-y-0.5"
                  }`}
                ></span>
                <span
                  className={`bg-[#C1C8D6] block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${
                    isMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                ></span>
                <span
                  className={`bg-[#C1C8D6] block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
                    isMenuOpen ? "-rotate-45 -translate-y-1" : "translate-y-0.5"
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-500 ease-in-out ${
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          } overflow-hidden`}
        >
          <div className="py-6 space-y-1 bg-[#0F111A]/90 rounded-2xl mt-4 mb-4 backdrop-blur-xl border border-[#C1C8D6]/20">
            {["Features", "Pricing", "About", "Contact"].map((item, index) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="block px-6 py-4 text-[#C1C8D6] hover:text-white font-medium hover:bg-[#007CF0]/10 transition-all duration-300 rounded-xl mx-2 font-clash"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {item}
              </a>
            ))}
            <div className="px-6 py-4">
              <button className="w-full px-6 py-3 bg-gradient-to-r from-[#00C6A2] to-[#007CF0] text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-clash">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
