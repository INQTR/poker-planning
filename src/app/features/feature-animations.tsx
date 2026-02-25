"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";

export function RealtimeVotingAnimation() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    const play = async () => {
      while (isMounted) {
        setHovered(null);
        setSelected(null);
        await new Promise((r) => setTimeout(r, 1000));
        if (!isMounted) break;

        setHovered(2); // Card '5'
        await new Promise((r) => setTimeout(r, 400));
        if (!isMounted) break;

        setSelected(2);
        await new Promise((r) => setTimeout(r, 2500));
      }
    };
    play();
    return () => {
      isMounted = false;
    };
  }, []);

  const cards = [1, 3, 5, 8];

  return (
    <div className="absolute inset-0 flex items-end justify-center pr-0 pb-4 sm:pb-16 pointer-events-none">
      <div className="absolute right-1/4 bottom-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="flex gap-4 sm:gap-8 z-10 translate-y-2 sm:translate-y-4 opacity-90">
        {cards.map((c, i) => (
          <div
            key={c}
            className={`w-16 h-24 sm:w-28 sm:h-40 rounded-2xl flex items-center justify-center font-bold text-2xl sm:text-5xl transition-all duration-300
              ${
                selected === i
                  ? "bg-primary text-primary-foreground -translate-y-8 shadow-2xl scale-110"
                  : hovered === i
                  ? "bg-white dark:bg-zinc-800 text-primary -translate-y-4 shadow-xl border border-primary/30"
                  : "bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-zinc-700 shadow-md"
              }
            `}
          >
            {c}
          </div>
        ))}
      </div>
    </div>
  );
}

export function AnalyticsAnimation() {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const play = async () => {
      while (isMounted) {
        setRevealed(false);
        await new Promise((r) => setTimeout(r, 1000));
        if (!isMounted) break;

        setRevealed(true);
        await new Promise((r) => setTimeout(r, 3500));
      }
    };
    play();
    return () => {
      isMounted = false;
    };
  }, []);

  const bars = [
    { height: "h-6", target: "h-12", value: "3" },
    { height: "h-6", target: "h-24", value: "5", active: true },
    { height: "h-6", target: "h-16", value: "8" },
    { height: "h-6", target: "h-8", value: "13" },
  ];

  return (
    <div className="absolute inset-0 flex items-end justify-center pr-0 pb-4 sm:pb-10 pointer-events-none">
      <div className="absolute right-1/4 bottom-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl"></div>
      <div className="flex items-end gap-8 sm:gap-16 z-10 opacity-90 translate-y-4 w-full px-12 sm:px-24 justify-center">
        {bars.map((bar, i) => (
          <div key={i} className="flex flex-col items-center gap-3">
            <div className="w-12 sm:w-20 bg-white dark:bg-zinc-800 rounded-t-xl border-t border-x border-gray-200 dark:border-zinc-700 flex flex-col justify-end overflow-hidden shadow-sm">
              <div
                className={`w-full transition-all duration-1000 ease-out ${
                  revealed ? bar.target : bar.height
                } ${
                  bar.active
                    ? "bg-emerald-500"
                    : "bg-gray-200 dark:bg-zinc-700"
                }`}
              ></div>
            </div>
            <span className="text-sm font-bold text-gray-500">{bar.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TimerAnimation() {
  const [time, setTime] = useState(60);

  useEffect(() => {
    let isMounted = true;
    let interval: NodeJS.Timeout;
    
    const play = async () => {
      setTime(60);
      interval = setInterval(() => {
        if (!isMounted) return;
        setTime((t) => (t > 0 ? t - 1 : 60));
      }, 50); // Fast countdown for effect
    };
    
    play();
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="absolute inset-0 flex items-end justify-center pb-4 sm:pb-8 pointer-events-none">
       <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-48 h-48 bg-fuchsia-500/5 rounded-full blur-3xl"></div>
       <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-fuchsia-100 dark:border-fuchsia-900/30 flex items-center justify-center relative z-10 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm shadow-md translate-y-2">
         <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
           <circle
             cx="50"
             cy="50"
             r="46"
             fill="none"
             stroke="currentColor"
             strokeWidth="8"
             className="text-fuchsia-500 transition-all duration-75"
             strokeDasharray="289"
             strokeDashoffset={289 - (time / 60) * 289}
           />
         </svg>
         <span className="text-xl sm:text-2xl font-bold font-mono text-fuchsia-600 dark:text-fuchsia-400">
           00:{time.toString().padStart(2, '0')}
         </span>
       </div>
    </div>
  );
}

export function CanvasAnimation() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let isMounted = true;
    const play = async () => {
      while (isMounted) {
        setPos({ x: 0, y: 0 });
        await new Promise((r) => setTimeout(r, 1000));
        if (!isMounted) break;

        setPos({ x: -20, y: -30 });
        await new Promise((r) => setTimeout(r, 800));
        if (!isMounted) break;

        setPos({ x: -40, y: -10 });
        await new Promise((r) => setTimeout(r, 1500));
      }
    };
    play();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="absolute inset-0 flex items-end justify-center sm:justify-end pr-0 sm:pr-8 pb-4 sm:pb-8 pointer-events-none">
      <div className="absolute right-0 bottom-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl"></div>
      <div 
        className="w-32 h-20 bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-cyan-200 dark:border-cyan-900/50 flex flex-col justify-between p-3 transition-transform duration-700 ease-in-out z-10"
        style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
      >
        <div className="h-2 w-12 bg-cyan-100 dark:bg-cyan-900/50 rounded"></div>
        <div className="flex justify-between items-end">
          <div className="w-6 h-6 rounded-full bg-cyan-500 text-[10px] text-white flex items-center justify-center font-bold">5</div>
          <div className="w-4 h-4 rounded-full bg-gray-200 dark:bg-zinc-700"></div>
        </div>
      </div>
      
      {/* Background dots grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>
    </div>
  );
}

export function ScalesAnimation() {
  const [scaleIdx, setScaleIdx] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const play = async () => {
      while (isMounted) {
        await new Promise((r) => setTimeout(r, 2000));
        if (!isMounted) break;
        setScaleIdx((prev) => (prev + 1) % 3);
      }
    };
    play();
    return () => {
      isMounted = false;
    };
  }, []);

  const scales = [
    ["1", "2", "3", "5", "8"],
    ["XS", "S", "M", "L", "XL"],
    ["1", "2", "4", "8", "16"],
  ];

  return (
    <div className="absolute inset-0 flex items-center justify-center sm:items-end sm:justify-end pr-0 sm:pr-8 pb-0 sm:pb-8 pointer-events-none">
      <div className="absolute right-0 bottom-0 w-48 h-48 bg-orange-500/5 rounded-full blur-3xl"></div>
      <div className="flex gap-2 z-10 opacity-90">
        {scales[scaleIdx].map((val, i) => (
          <div
            key={i + val} // Key changes to force animation
            className="w-10 h-14 bg-white dark:bg-zinc-800 rounded-lg flex items-center justify-center font-bold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-zinc-700 shadow-sm animate-in zoom-in fade-in duration-300"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            {val}
          </div>
        ))}
      </div>
    </div>
  );
}

export function PlayerManagementAnimation() {
  const [avatars, setAvatars] = useState<number[]>([]);

  useEffect(() => {
    let isMounted = true;
    const play = async () => {
      while (isMounted) {
        setAvatars([]);
        await new Promise((r) => setTimeout(r, 1000));
        if (!isMounted) break;

        setAvatars([1]);
        await new Promise((r) => setTimeout(r, 500));
        if (!isMounted) break;

        setAvatars([1, 2]);
        await new Promise((r) => setTimeout(r, 700));
        if (!isMounted) break;

        setAvatars([1, 2, 3]);
        await new Promise((r) => setTimeout(r, 2500));
      }
    };
    play();
    return () => {
      isMounted = false;
    };
  }, []);

  const colors = [
    "bg-indigo-500 text-indigo-50",
    "bg-violet-500 text-violet-50",
    "bg-purple-500 text-purple-50",
  ];
  const initials = ["JD", "AB", "RW"];

  return (
    <div className="absolute inset-0 flex items-end justify-center sm:justify-end pr-0 sm:pr-10 pb-4 sm:pb-8 pointer-events-none overflow-hidden">
       <div className="absolute right-0 bottom-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl"></div>
       <div className="flex -space-x-4 z-10">
        {avatars.map((a, i) => (
          <div
            key={a}
            className={`w-14 h-14 rounded-full ${colors[i]} border-4 border-white dark:border-zinc-900 flex items-center justify-center shadow-lg animate-in fade-in zoom-in slide-in-from-right-4 duration-300`}
            style={{ zIndex: 10 - a }}
          >
            <span className="text-sm font-bold">{initials[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function IssuesAnimation() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const play = async () => {
      while (isMounted) {
        await new Promise((r) => setTimeout(r, 1500));
        if (!isMounted) break;
        setActive((prev) => (prev + 1) % 3);
      }
    };
    play();
    return () => {
      isMounted = false;
    };
  }, []);

  const issues = ["PROJ-123", "PROJ-124", "PROJ-125"];

  return (
    <div className="absolute inset-0 flex items-end justify-center sm:justify-end pr-0 sm:pr-8 pb-4 sm:pb-8 pointer-events-none">
      <div className="absolute right-0 bottom-0 w-48 h-48 bg-sky-500/5 rounded-full blur-3xl"></div>
      <div className="flex flex-col gap-2 z-10 w-48">
        {issues.map((issue, i) => (
          <div
            key={issue}
            className={`h-10 rounded-lg flex items-center px-3 gap-3 transition-all duration-500 border shadow-sm
              ${
                active === i
                  ? "bg-white dark:bg-zinc-800 border-sky-200 dark:border-sky-900/50 scale-105"
                  : "bg-white/60 dark:bg-zinc-800/60 border-gray-100 dark:border-zinc-800/50 scale-100 opacity-60"
              }
            `}
          >
            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${active === i ? "border-sky-500 bg-sky-500 text-white" : "border-gray-300 dark:border-zinc-600"}`}>
              {active === i && <Check className="w-3 h-3" />}
            </div>
            <div className="h-2 w-16 bg-gray-200 dark:bg-zinc-700 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AutoCompleteAnimation() {
  const [count, setCount] = useState(3);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const play = async () => {
      while (isMounted) {
        setCount(3);
        setRevealed(false);
        await new Promise((r) => setTimeout(r, 1000));
        if (!isMounted) break;

        setCount(2);
        await new Promise((r) => setTimeout(r, 1000));
        if (!isMounted) break;

        setCount(1);
        await new Promise((r) => setTimeout(r, 1000));
        if (!isMounted) break;

        setRevealed(true);
        await new Promise((r) => setTimeout(r, 2500));
      }
    };
    play();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="absolute inset-0 flex items-end justify-center sm:justify-end pr-0 sm:pr-8 pb-4 sm:pb-8 pointer-events-none">
      <div className="absolute right-0 bottom-0 w-48 h-48 bg-rose-500/5 rounded-full blur-3xl"></div>
      <div className="flex flex-col items-center gap-4 z-10">
        {!revealed ? (
          <div className="w-16 h-16 rounded-full bg-white dark:bg-zinc-800 border-4 border-rose-100 dark:border-rose-900/30 flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
            <span className="text-3xl font-bold text-rose-500">{count}</span>
          </div>
        ) : (
          <div className="flex gap-2 animate-in slide-in-from-bottom-4 fade-in duration-500">
            {[5, 5, 8].map((v, i) => (
              <div key={i} className="w-10 h-14 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg flex items-center justify-center font-bold text-lg text-gray-900 dark:text-white shadow-md">
                {v}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
