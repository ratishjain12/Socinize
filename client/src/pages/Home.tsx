import { useState } from "react";

export const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-indigo-50 to-purple-50">
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-sky-200/50 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo Section */}
            <div className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-tr from-emerald-400 via-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-2xl group-hover:shadow-cyan-400/25 transition-all duration-300 group-hover:scale-105">
                  <span className="text-white font-bold text-xl tracking-tight">
                    S
                  </span>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-tr from-emerald-400 via-cyan-400 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              </div>
              <span className="text-3xl font-black bg-gradient-to-r from-gray-800 via-blue-600 to-cyan-600 bg-clip-text text-transparent tracking-tight">
                Socinize
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {["Features", "Pricing", "About", "Contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="relative px-6 py-3 text-gray-700 hover:text-gray-900 font-medium transition-all duration-300 group"
                >
                  <span className="relative z-10">{item}</span>
                  <div className="absolute inset-0 bg-cyan-100/50 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100"></div>
                  <div className="absolute bottom-1 left-1/2 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-8 transition-all duration-300 transform -translate-x-1/2"></div>
                </a>
              ))}

              <div className="ml-6">
                <button className="relative px-8 py-3 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-600 text-white font-semibold rounded-2xl overflow-hidden group shadow-lg hover:shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105">
                  <span className="relative z-10">Get Started</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="relative w-12 h-12 bg-gray-100/80 rounded-xl flex items-center justify-center transition-all duration-300 hover:bg-gray-200/80 group"
              >
                <div className="flex flex-col justify-center items-center w-6 h-6">
                  <span
                    className={`bg-gray-700 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
                      isMenuOpen
                        ? "rotate-45 translate-y-1"
                        : "-translate-y-0.5"
                    }`}
                  ></span>
                  <span
                    className={`bg-gray-700 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${
                      isMenuOpen ? "opacity-0" : "opacity-100"
                    }`}
                  ></span>
                  <span
                    className={`bg-gray-700 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
                      isMenuOpen
                        ? "-rotate-45 -translate-y-1"
                        : "translate-y-0.5"
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
            <div className="py-6 space-y-1 bg-white/60 rounded-2xl mt-4 mb-4 backdrop-blur-xl border border-gray-200/50">
              {["Features", "Pricing", "About", "Contact"].map(
                (item, index) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="block px-6 py-4 text-gray-700 hover:text-gray-900 font-medium hover:bg-gray-100/60 transition-all duration-300 rounded-xl mx-2"
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    {item}
                  </a>
                )
              )}
              <div className="px-6 py-4">
                <button className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Demo Content */}
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-black text-gray-800 mb-8 leading-tight">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
              Socinize
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Experience the future of social connectivity with our revolutionary
            platform that brings people together like never before.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-semibold rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
              Learn More
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-gray-300 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105">
              Watch Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
