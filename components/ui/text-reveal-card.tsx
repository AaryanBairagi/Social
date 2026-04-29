"use client";

import React, { memo, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Variant = "received" | "sent";

type TextRevealCardProps = {
  text: string;
  revealText: string;
  className?: string;
  variant?: Variant;
};

export const TextRevealCard = ({
  text,
  revealText,
  className,
  variant = "received",
}: TextRevealCardProps) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [left, setLeft] = useState(0);
  const [width, setWidth] = useState(1);
  const [progress, setProgress] = useState(0);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const updateMetrics = () => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      setLeft(rect.left);
      setWidth(rect.width || 1);
    };

    updateMetrics();
    window.addEventListener("resize", updateMetrics);
    return () => window.removeEventListener("resize", updateMetrics);
  }, []);

  const handleMove = (clientX: number) => {
    const next = ((clientX - left) / width) * 100;
    setProgress(Math.max(0, Math.min(100, next)));
  };

  const bubbleStyles =
    variant === "sent"
      ? "bg-cyan-500 text-white border border-cyan-500 shadow-[0_10px_24px_rgba(6,182,212,0.16)]"
      : "bg-white text-slate-700 border border-slate-200 shadow-[0_10px_24px_rgba(15,23,42,0.06)]";

  const revealStyles =
    variant === "sent" ? "bg-cyan-500 text-white" : "bg-white text-slate-800";

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => {
        setHovering(false);
        setProgress(0);
      }}
      onMouseMove={(e) => handleMove(e.clientX)}
      className={cn("relative inline-block w-fit max-w-full", className)}
    >
      <div className={cn("relative overflow-hidden rounded-2xl", bubbleStyles)}>
        <motion.div
          animate={{
            opacity: hovering ? 1 : 0,
            clipPath: `inset(0 ${100 - progress}% 0 0)`,
          }}
          transition={{ duration: hovering ? 0.05 : 0.25 }}
          className={cn(
            "absolute inset-0 z-20 flex items-center px-4 py-3",
            revealStyles
          )}
        >
          <span className="text-sm font-medium leading-snug whitespace-pre-wrap">
            {revealText}
          </span>
        </motion.div>

        <div className="relative z-10 flex items-center gap-2 px-4 py-3">
          <span className="text-sm font-medium leading-snug tracking-wide opacity-75 whitespace-pre-wrap">
            {text}
          </span>

          <div className="ml-auto flex items-center gap-1.5 shrink-0">
            <MemoizedPulseDot colorClass={variant === "sent" ? "bg-white/70" : "bg-slate-400/70"} />
            <MemoizedPulseDot
              colorClass={variant === "sent" ? "bg-white/70" : "bg-slate-400/70"}
              delay={0.18}
            />
            <MemoizedPulseDot
              colorClass={variant === "sent" ? "bg-white/70" : "bg-slate-400/70"}
              delay={0.36}
            />
          </div>
        </div>

        <motion.div
          animate={{
            left: `${progress}%`,
            opacity: hovering ? 1 : 0,
          }}
          transition={{ duration: hovering ? 0.05 : 0.25 }}
          className="absolute top-0 z-30 h-full w-[2px] bg-cyan-200/80 shadow-[0_0_20px_rgba(34,211,238,0.45)]"
        />
      </div>
    </div>
  );
};

const PulseDot = ({
  colorClass,
  delay = 0,
}: {
  colorClass: string;
  delay?: number;
}) => (
  <motion.span
    aria-hidden="true"
    animate={{ opacity: [0.25, 1, 0.25], y: [0, -1, 0] }}
    transition={{ duration: 1.8, repeat: Infinity, delay }}
    className={cn("h-1.5 w-1.5 rounded-full", colorClass)}
  />
);

const MemoizedPulseDot = memo(PulseDot);