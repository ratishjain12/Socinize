import { ContainerScroll, CardSticky } from "@/components/ui/card-stack";

const MAIN_BG = "#0A0A0B";
const GLASS_CARD_CLASSES =
  "backdrop-blur-2xl bg-white/20 border border-white/30 shadow-2xl ring-1 ring-white/20 rounded-2xl p-10 mb-10";
const ACCENT_GRADIENT =
  "bg-gradient-to-b from-[#6a85dd] to-[#1e3799] bg-clip-text text-transparent";

const FEATURES = [
  {
    id: "process-1",
    title: "The Calendar Wizard",
    description:
      "Drag your tweet onto our color-coded calendar and watch it auto-align with peak scrolling times—no moreDid I post?” panic, just perfect timing.",
  },
  {
    id: "process-2",
    title: "Cross-Platform Conductor",
    description:
      "Write once and dispatch everywhere: this tool adapts your tweet for Instagram, LinkedIn, and beyond, trimming characters and porting hashtags so you don't have to.",
  },
  {
    id: "process-3",
    title: "Draft Sanctuary",
    description:
      "Stash your 3 AM brilliance in a tagged drawer, then marinate ideas until you’re ready—because great tweets, like fine wine, get better with age.",
  },
  {
    id: "process-4",
    title: "The Rescue Ranger",
    description:
      "One-click “oops” fix reschedules any post and reshuffles the queue neatly—so even when life goes sideways, your feed stays flawless.",
  },
];

const Process = () => {
  return (
    <div
      className="container min-h-svh place-content-center min-w-screen py-10 px-10"
      style={{ background: MAIN_BG }}
    >
      <div className="grid md:grid-cols-2 md:gap-8 xl:gap-12">
        <div className="left-0 top-0 md:sticky md:h-svh md:py-12">
          <h5 className="text-xs text-start uppercase tracking-wide text-white/60">
            our process
          </h5>
          <h2 className="mb-6 mt-4 text-4xl text-start font-bold tracking-tight text-white">
            Planning your{" "}
            <span className={ACCENT_GRADIENT}>project development</span> journey
          </h2>
          <p className="max-w-prose text-lg text-start text-white/80">
            Our journey begins with a deep dive into your vision. In the
            Discovery phase, we engage in meaningful conversations to grasp your
            brand identity, goals, and the essence you want to convey. This
            phase sets the stage for all that follows.
          </p>
        </div>
        <ContainerScroll className="min-h-[400vh] space-y-8 py-12">
          {FEATURES.map((phase, index) => (
            <CardSticky
              key={phase.id}
              index={index + 2}
              className={`${GLASS_CARD_CLASSES} text-white`}
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="my-6 text-2xl font-bold tracking-tighter text-white">
                  {phase.title}
                </h2>
                <h3 className={`text-2xl font-bold ${ACCENT_GRADIENT}`}>
                  {String(index + 1).padStart(2, "0")}
                </h3>
              </div>
              <p className="text-white/90 text-base font-light">
                {phase.description}
              </p>
            </CardSticky>
          ))}
        </ContainerScroll>
      </div>
    </div>
  );
};

export default function FeaturesSection() {
  return (
    <section id="features">
      <Process />
    </section>
  );
}
