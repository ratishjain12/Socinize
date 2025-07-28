"use client";

export default function FooterGlow() {
  return (
    <footer className="relative z-10 w-full overflow-hidden pt-8 pb-8 bg-gray-950">
      <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-8 rounded-2xl px-6 py-10 bg-gray-900/30 border border-gray-700/40">
        <div className="flex flex-col items-center text-center">
          <a href="#" className="mb-4 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-2xl font-extrabold text-white shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </span>
            <span className="text-red-400 text-xl font-semibold tracking-tight">
              Socinize
            </span>
          </a>
          <p className="text-gray-400 mb-6 max-w-md text-sm">
            The all-in-one social media management platform for creators and
            businesses.
          </p>
          <div className="flex gap-6 text-gray-400">
            <a href="#features" className="hover:text-white transition">
              Features
            </a>
            <a href="#" className="hover:text-white transition">
              Pricing
            </a>
            <a href="#" className="hover:text-white transition">
              Contact
            </a>
          </div>
        </div>
      </div>
      <div className="text-gray-400 relative z-10 mt-8 text-center text-xs">
        <span>&copy; 2025 Socinize. All rights reserved.</span>
      </div>
    </footer>
  );
}
