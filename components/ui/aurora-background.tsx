"use client";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <main>
      <div
        className={cn(
          "transition-bg relative flex min-h-screen flex-col items-center justify-center bg-[#0f0f10] text-white",
          className
        )}
        {...props}
      >
        <div
          className="absolute inset-0 overflow-hidden"
          style={
            {
              /* -------------- EXACT ACETERNITY VARIABLES --------------- */
              // "--aurora":
              //   "repeating-linear-gradient(100deg, rgba(56,189,248,0.35) 10%, rgba(168,85,247,0.35) 15%, rgba(59,130,246,0.35) 20%, rgba(236,72,153,0.3) 25%, rgba(56,189,248,0.35) 30%)",

              "--aurora":
              "repeating-linear-gradient(100deg, rgba(30, 58, 138, 0.45) 5%, rgba(37, 99, 235, 0.45) 12%, rgba(59,130,246,0.40) 18%,rgba(56,189,248,0.35) 24%, rgba(147,51,234,0.35) 30%, rgba(30, 58, 138, 0.45) 36%)",


              "--dark-gradient":
                "repeating-linear-gradient(100deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,1) 7%, transparent 10%, transparent 12%, rgba(0,0,0,1) 16%)",

              "--white-gradient":
                "repeating-linear-gradient(100deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.35) 7%, transparent 10%, transparent 12%, rgba(255,255,255,0.35) 16%)",

              "--transparent": "transparent",
            } as React.CSSProperties
          }
        >
          <div
            className={cn(
              `
              pointer-events-none absolute -inset-[10px]
              [background-image:var(--white-gradient),var(--aurora)]
              [background-size:300%,_200%]
              [background-position:50%_50%,50%_50%]
              opacity-60 blur-[10px] filter will-change-transform
              after:animate-aurora after:absolute after:inset-0
              after:[background-image:var(--white-gradient),var(--aurora)]
              after:[background-size:250%,_120%]
              after:[background-attachment:fixed]
              after:mix-blend-difference after:content-[""]
              
              /* Dark mode exact match */
              dark:[background-image:var(--dark-gradient),var(--aurora)]
              dark:invert-0
              after:dark:[background-image:var(--dark-gradient),var(--aurora)]
              `,

              showRadialGradient &&
                `[mask-image:radial-gradient(ellipse_at_80%_0%, black_20%, var(--transparent)_75%)]`
            )}
          ></div>
        </div>

        {children}
      </div>
    </main>
  );
};
