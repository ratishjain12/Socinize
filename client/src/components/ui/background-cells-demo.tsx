"use client";

import { BackgroundCells } from "./background-ripple-effect";

export const BackgroundCellsDemo = () => {
  return (
    <BackgroundCells className="bg-slate-950">
      <h1 className="md:text-2xl lg:text-7xl font-medium text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-100 to-neutral-400 pointer-events-none">
        Background cell animation <br />
        with framer motion
      </h1>
    </BackgroundCells>
  );
};
