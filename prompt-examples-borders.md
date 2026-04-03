NEW EXAMPLE:

You are given a task to integrate an existing React component in the codebase

The codebase should support:
- shadcn project structure  
- Tailwind CSS
- Typescript

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

Determine the default path for components and styles. 
If default path for components is not /components/ui, provide instructions on why it's important to create this folder
Copy-paste this component to /components/ui folder:
```tsx
dot-pattern-1.tsx
import { useId } from "react";

import { cn } from "@/lib/utils";

interface DotPatternProps {
  width?: any;
  height?: any;
  x?: any;
  y?: any;
  cx?: any;
  cy?: any;
  cr?: any;
  className?: string;
  [key: string]: any;
}
export function DotPattern({
  width = 24,
  height = 24,
  x = 0,
  y = 0,
  cx = 1,
  cy = 0.5,
  cr = 0.5,
  className,
  ...props
}: DotPatternProps) {
  const id = useId();

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full fill-slate-500/50 md:fill-slate-500/70",
        className,
      )}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          patternContentUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <circle id="pattern-circle" cx={cx} cy={cy} r={cr} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
    </svg>
  );
}

export default DotPattern;


demo.tsx
"use client";

import DotPattern from "@/components/ui/dot-pattern-1";

export function Quote() {
  return (
    <>
      <div className="mx-auto mb-10 max-w-7xl px-6 md:mb-20 xl:px-0">
        <div className="relative flex flex-col items-center border border-red-500">
          <DotPattern width={5} height={5} />

          <div className="absolute -left-1.5 -top-1.5 h-3 w-3 bg-red-500 text-white" />
          <div className="absolute -bottom-1.5 -left-1.5 h-3 w-3 bg-red-500 text-white" />
          <div className="absolute -right-1.5 -top-1.5 h-3 w-3 bg-red-500 text-white" />
          <div className="absolute -bottom-1.5 -right-1.5 h-3 w-3 bg-red-500 text-white" />

          <div className="relative z-20 mx-auto max-w-7xl rounded-[40px] py-6 md:p-10 xl:py-20">
            <p className="md:text-md text-xs text-red-500 lg:text-lg xl:text-2xl">
              I believe
            </p>
            <div className="text-2xl tracking-tighter md:text-5xl lg:text-7xl xl:text-8xl">
              <div className="flex gap-1 md:gap-2 lg:gap-3 xl:gap-4">
                <h1 className="font-semibold">"Design should be</h1>
                <p className="font-thin">easy to</p>
              </div>
              <div className="flex gap-1 md:gap-2 lg:gap-3 xl:gap-4">
                <p className="font-thin">understand</p>
                <h1 className="font-semibold">because</h1>
                <p className="font-thin">simple</p>
              </div>
              <div className="flex gap-1 md:gap-2 lg:gap-3 xl:gap-4">
                <p className="font-thin">ideas</p>
                <h1 className="font-semibold">are quicker to</h1>
              </div>
              <h1 className="font-semibold">grasp..."</h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

```

Implementation Guidelines
 1. Analyze the component structure and identify all required dependencies
 2. Review the component's argumens and state
 3. Identify any required context providers or hooks and install them
 4. Questions to Ask
 - What data/props will be passed to this component?
 - Are there any specific state management requirements?
 - Are there any required assets (images, icons, etc.)?
 - What is the expected responsive behavior?
 - What is the best place to use this component in the app?

Steps to integrate
 0. Copy paste all the code above in the correct directories
 1. Install external dependencies
 2. Fill image assets with Unsplash stock images you know exist
 3. Use lucide-react icons for svgs or logos if component requires them

NEW EXAMPLE:

You are given a task to integrate an existing React component in the codebase

The codebase should support:
- shadcn project structure  
- Tailwind CSS
- Typescript

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

Determine the default path for components and styles. 
If default path for components is not /components/ui, provide instructions on why it's important to create this folder
Copy-paste this component to /components/ui folder:
```tsx
animated-glow-card.tsx
import React from 'react';

const CardCanvas = ({ children, className = "" }) => {
  return (
    <div className={`card-canvas ${className}`}>
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter width="3000%" x="-1000%" height="3000%" y="-1000%" id="unopaq">
          <feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 3 0"></feColorMatrix>
        </filter>
      </svg>
      <div className="card-backdrop"></div>
      {children}
    </div>
  );
};

const Card = ({ children, className = "" }) => {
  return (
    <div className={`glow-card ${className}`}>
      <div className="border-element border-left"></div>
      <div className="border-element border-right"></div>
      <div className="border-element border-top"></div>
      <div className="border-element border-bottom"></div>
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};

export { CardCanvas, Card };

demo.tsx
import { Card, CardCanvas } from "@/components/ui/animated-glow-card";
import { XCard } from "@/components/ui/x-gradient-card"

const XCardDummyData = {
    authorName: "EaseMise",
    authorHandle: "easemize",
    authorImage: "https://pbs.twimg.com/profile_images/1854916060807675904/KtBJsyWr_400x400.jpg",
    content: [
        "The Outer container with border and dots its the actual Card",
        "Wrap it around anything to have a cool card like this",
    ],
    isVerified: true,
    timestamp: "Today",
    reply: {
        authorName: "GoodGuy",
        authorHandle: "gdguy",
        authorImage:
            "https://pbs.twimg.com/profile_images/1593304942210478080/TUYae5z7_400x400.jpg",
        content: "Its Easy to Use great to customize",
        isVerified: true,
        timestamp: "10 mintes ago",
    },
};

function XCardDemoDefault() {
    return <XCard {...XCardDummyData} />
}

const DemoOne = () => {
  return (
    <div className="flex w-full h-screen justify-center items-center bg-black">
      <CardCanvas>
        <Card className="w-auto p-6">
          <div className="dark">
            <XCard {...XCardDummyData} />
          </div>
        </Card>
      </CardCanvas>
    </div>
  );
};

export { DemoOne };

```

Copy-paste these files for dependencies:
```tsx
tommyjepsen/animated-hero
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";

function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["amazing", "new", "wonderful", "beautiful", "smart"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">
          <div>
            <Button variant="secondary" size="sm" className="gap-4">
              Read our launch article <MoveRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-4 flex-col">
            <h1 className="text-5xl md:text-7xl max-w-2xl tracking-tighter text-center font-regular">
              <span className="text-spektr-cyan-50">This is something</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold"
                    initial={{ opacity: 0, y: "-100" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center">
              Managing a small business today is already tough. Avoid further
              complications by ditching outdated, tedious trade methods. Our
              goal is to streamline SMB trade, making it easier and faster than
              ever.
            </p>
          </div>
          <div className="flex flex-row gap-3">
            <Button size="lg" className="gap-4" variant="outline">
              Jump on a call <PhoneCall className="w-4 h-4" />
            </Button>
            <Button size="lg" className="gap-4">
              Sign up here <MoveRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero };

```
```tsx
shadcn/button
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }

```
```tsx
kokonutd/x-gradient-card
import { VerifiedIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ReplyProps {
    authorName: string;
    authorHandle: string;
    authorImage: string;
    content: string;
    isVerified?: boolean;
    timestamp: string;
}

interface XCardProps {
    link: string;
    authorName: string;
    authorHandle: string;
    authorImage: string;
    content: string[];
    isVerified?: boolean;
    timestamp: string;
    reply?: ReplyProps;
}

function XCard({
    link = "https://x.com/dorian_baffier/status/1880291036410572934",
    authorName = "Dorian",
    authorHandle = "dorian_baffier",
    authorImage = "https://pbs.twimg.com/profile_images/1854916060807675904/KtBJsyWr_400x400.jpg",
    content = [
        "All components from KokonutUI can now be open in @v0 🎉",
        "1. Click on 'Open in V0'",
        "2. Customize with prompts",
        "3. Deploy to your app",
    ],
    isVerified = true,
    timestamp = "Jan 18, 2025",
    reply = {
        authorName: "shadcn",
        authorHandle: "shadcn",
        authorImage:
            "https://pbs.twimg.com/profile_images/1593304942210478080/TUYae5z7_400x400.jpg",
        content: "Awesome.",
        isVerified: true,
        timestamp: "Jan 18",
    },
}: XCardProps) {
    return (
        <Link
            href={link}
            target="_blank"
        >
            <div
                className={cn(
                    "w-full min-w-[400px] md:min-w-[500px] max-w-xl p-1.5 rounded-2xl relative isolate overflow-hidden",
                    "bg-white/5 dark:bg-black/90",
                    "bg-gradient-to-br from-black/5 to-black/[0.02] dark:from-white/5 dark:to-white/[0.02]",
                    "backdrop-blur-xl backdrop-saturate-[180%]",
                    "border border-black/10 dark:border-white/10",
                    "shadow-[0_8px_16px_rgb(0_0_0_/_0.15)] dark:shadow-[0_8px_16px_rgb(0_0_0_/_0.25)]",
                    "will-change-transform translate-z-0"
                )}
            >
                <div
                    className={cn(
                        "w-full p-5 rounded-xl relative",
                        "bg-gradient-to-br from-black/[0.05] to-transparent dark:from-white/[0.08] dark:to-transparent",
                        "backdrop-blur-md backdrop-saturate-150",
                        "border border-black/[0.05] dark:border-white/[0.08]",
                        "text-black/90 dark:text-white",
                        "shadow-sm",
                        "will-change-transform translate-z-0",
                        "before:absolute before:inset-0 before:bg-gradient-to-br before:from-black/[0.02] before:to-black/[0.01] dark:before:from-white/[0.03] dark:before:to-white/[0.01] before:opacity-0 before:transition-opacity before:pointer-events-none",
                        "hover:before:opacity-100"
                    )}
                >
                    <div className="flex gap-3">
                        <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full overflow-hidden">
                                <img
                                    src={authorImage}
                                    alt={authorName}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        </div>

                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-1">
                                        <span className="font-semibold text-black dark:text-white/90 hover:underline cursor-pointer">
                                            {authorName}
                                        </span>
                                        {isVerified && (
                                            <VerifiedIcon className="h-4 w-4 text-blue-400" />
                                        )}
                                    </div>
                                    <span className="text-black dark:text-white/60 text-sm">
                                        @{authorHandle}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    className="h-8 w-8 text-black dark:text-white/80 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-lg p-1 flex items-center justify-center"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="1200"
                                        height="1227"
                                        fill="none"
                                        viewBox="0 0 1200 1227"
                                        className="w-4 h-4"
                                    >
                                        <title>X</title>
                                        <path
                                            fill="currentColor"
                                            d="M714.163 519.284 1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.137 519.284h.026ZM569.165 687.828l-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.854v-.026Z"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-2">
                        {content.map((item, index) => (
                            <p
                                key={index}
                                className="text-black dark:text-white/90 text-base"
                            >
                                {item}
                            </p>
                        ))}
                        <span className="text-black dark:text-white/50 text-sm mt-2 block">
                            {timestamp}
                        </span>
                    </div>

                    {reply && (
                        <div className="mt-4 pt-4 border-t border-black/[0.08] dark:border-white/[0.08]">
                            <div className="flex gap-3">
                                <div className="flex-shrink-0">
                                    <div className="h-10 w-10 rounded-full overflow-hidden">
                                        <img
                                            src={reply.authorImage}
                                            alt={reply.authorName}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-1">
                                        <span className="font-semibold text-black dark:text-white/90 hover:underline cursor-pointer">
                                            {reply.authorName}
                                        </span>
                                        {reply.isVerified && (
                                            <VerifiedIcon className="h-4 w-4 text-blue-400" />
                                        )}
                                        <span className="text-black dark:text-white/60 text-sm">
                                            @{reply.authorHandle}
                                        </span>
                                        <span className="text-black dark:text-white/60 text-sm">
                                            ·
                                        </span>
                                        <span className="text-black dark:text-white/60 text-sm">
                                            {reply.timestamp}
                                        </span>
                                    </div>
                                    <p className="text-black dark:text-white/80 text-sm mt-1">
                                        {reply.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}


export { XCard }
```

Install NPM dependencies:
```bash
lucide-react, framer-motion, @radix-ui/react-slot, class-variance-authority
```

Implementation Guidelines
 1. Analyze the component structure and identify all required dependencies
 2. Review the component's argumens and state
 3. Identify any required context providers or hooks and install them
 4. Questions to Ask
 - What data/props will be passed to this component?
 - Are there any specific state management requirements?
 - Are there any required assets (images, icons, etc.)?
 - What is the expected responsive behavior?
 - What is the best place to use this component in the app?

Steps to integrate
 0. Copy paste all the code above in the correct directories
 1. Install external dependencies
 2. Fill image assets with Unsplash stock images you know exist
 3. Use lucide-react icons for svgs or logos if component requires them

NEW EXAMPLE:

You are given a task to integrate an existing React component in the codebase

The codebase should support:
- shadcn project structure  
- Tailwind CSS
- Typescript

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

Determine the default path for components and styles. 
If default path for components is not /components/ui, provide instructions on why it's important to create this folder
Copy-paste this component to /components/ui folder:
```tsx
bauhaus-card.tsx
"use client";
import React, { useEffect, useRef } from "react";
import { ChronicleButton } from "./chronicle-button";

const BAUHAUS_CARD_STYLES = `
.bauhaus-card {
  position: relative;
  z-index: 555;
  max-width: 20rem;
  min-height: 20rem;
  width: 90%;
  display: grid;
  place-content: center;
  place-items: center;
  text-align: center;
  box-shadow: 1px 12px 25px rgb(0,0,0/78%);
  border-radius: var(--card-radius, 20px);
  border: var(--card-border-width, 2px) solid transparent;
  --rotation: 4.2rad;
  background-image:
    linear-gradient(var(--card-bg, #151419), var(--card-bg, #151419)),
    linear-gradient(calc(var(--rotation,4.2rad)), var(--card-accent, #156ef6) 0, var(--card-bg, #151419) 30%, transparent 80%);
  background-origin: border-box;
  background-clip: padding-box, border-box;
  color: var(--card-text-main, #f0f0f1);
}
.bauhaus-card::before {
  position: absolute;
  content: "";
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 2.25rem;
  z-index: -1;
  border: 0.155rem solid transparent;
  -webkit-mask-composite: destination-out;
  mask-composite: exclude;
}
.bauhaus-card-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8em 0.5em 0em 1.5em;
}
.bauhaus-button-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 14px;
  padding-top: 7px;
  padding-bottom: 7px;
}
.bauhaus-date {
  color: var(--card-text-top, #bfc7d5);
}
.bauhaus-size6 {
  width: 2.5rem;
  cursor: pointer;
}
.bauhaus-card-body {
  position: absolute;
  width: 100%;
  display: block;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 0.7em 1.25em 0.5em 1.5em;
}
.bauhaus-card-body h3 {
  font-size: 1.375rem;
  margin-top: -0.4em;
  margin-bottom: 0.188em;
  font-weight: 600;
  color: var(--card-text-main, #f0f0f1);
}
.bauhaus-card-body p {
  color: var(--card-text-sub, #a0a1b3);
  font-size: 1rem;
  letter-spacing: 0.031rem;
}
.bauhaus-progress {
  margin-top: 0.938rem;
}
.bauhaus-progress-bar {
  position: relative;
  width: 100%;
  background: var(--card-progress-bar-bg, #363636);
  height: 0.313rem;
  display: block;
  border-radius: 3.125rem;
}
.bauhaus-progress-bar > div {
  height: 5px;
  border-radius: 3.125rem;
}
.bauhaus-progress span:first-of-type {
  text-align: left;
  font-weight: 600;
  width: 100%;
  display: block;
  margin-bottom: 0.313rem;
  color: var(--card-text-progress-label, #b4c7e7);
}
.bauhaus-progress span:last-of-type {
  margin-top: 0.313rem;
  text-align: right;
  display: block;
  color: var(--card-text-progress-value, #e7e7f7);
}
.bauhaus-card-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.7em 1.25em 0.5em 1.5em;
  border-bottom-left-radius: 2.25rem;
  border-bottom-right-radius: 2.25rem;
  border-top: 0.063rem solid var(--card-separator, #2F2B2A);
}
`;

function injectBauhausCardStyles() {
  if (typeof window === "undefined") return;
  if (!document.getElementById("bauhaus-card-styles")) {
    const style = document.createElement("style");
    style.id = "bauhaus-card-styles";
    style.innerHTML = BAUHAUS_CARD_STYLES;
    document.head.appendChild(style);
  }
}

const isRTL = (text: string): boolean =>
  /[\u0590-\u05FF\u0600-\u06FF\u0700-\u074F]/.test(text);

export interface BauhausCardProps {
  id: string;
  borderRadius?: string;
  backgroundColor?: string;
  separatorColor?: string;
  accentColor: string;
  borderWidth?: string;
  topInscription: string;
  mainText: string;
  subMainText: string;
  progressBarInscription: string;
  progress: number;
  progressValue: string;
  filledButtonInscription?: string;
  outlinedButtonInscription?: string;
  onFilledButtonClick: (id: string) => void;
  onOutlinedButtonClick: (id: string) => void;
  onMoreOptionsClick: (id: string) => void;
  mirrored?: boolean;
  swapButtons?: boolean;
  ChronicleButtonHoverColor?: string;
  textColorTop?: string;
  textColorMain?: string;
  textColorSub?: string;
  textColorProgressLabel?: string;
  textColorProgressValue?: string;
  progressBarBackground?: string;
  chronicleButtonBg?: string;
  chronicleButtonFg?: string;
  chronicleButtonHoverFg?: string;
}

export const Component: React.FC<BauhausCardProps> = ({
  id,
  borderRadius = "2em",
  backgroundColor = "#151419",
  separatorColor = "#2F2B2A",
  accentColor = "#156ef6",
  borderWidth = "2px",
  topInscription = "Not Set!",
  swapButtons = false,
  mainText = "Not Set!",
  subMainText = "Not Set!",
  progressBarInscription = "Not Set!",
  progress = 0,
  progressValue = "Not Set!",
  filledButtonInscription = "Not Set!",
  outlinedButtonInscription = "Not Set!",
  onFilledButtonClick,
  onOutlinedButtonClick,
  onMoreOptionsClick,
  mirrored = false,
  ChronicleButtonHoverColor = "#156ef6",
  textColorTop = "#bfc7d5",
  textColorMain = "#f0f0f1",
  textColorSub = "#a0a1b3",
  textColorProgressLabel = "#b4c7e7",
  textColorProgressValue = "#e7e7f7",
  progressBarBackground = "#363636",
  chronicleButtonBg = "#151419",
  chronicleButtonFg = "#fff",
  chronicleButtonHoverFg = "#fff",
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    injectBauhausCardStyles();
    const card = cardRef.current;
    const handleMouseMove = (e: MouseEvent) => {
      if (card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const angle = Math.atan2(-x, y);
        card.style.setProperty("--rotation", angle + "rad");
      }
    };
    if (card) {
      card.addEventListener("mousemove", handleMouseMove);
    }
    return () => {
      if (card) {
        card.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  return (
    <div
      className="bauhaus-card"
      ref={cardRef}
      style={{
        '--card-bg': backgroundColor,
        '--card-border': separatorColor,
        '--card-accent': accentColor,
        '--card-radius': borderRadius,
        '--card-border-width': borderWidth,
        '--card-text-top': textColorTop,
        '--card-text-main': textColorMain,
        '--card-text-sub': textColorSub,
        '--card-text-progress-label': textColorProgressLabel,
        '--card-text-progress-value': textColorProgressValue,
        '--card-separator': separatorColor,
        '--card-progress-bar-bg': progressBarBackground,
      } as React.CSSProperties}
    >
      <div
        style={{ transform: mirrored ? 'scaleX(-1)' : 'none' }}
        className="bauhaus-card-header"
      >
        <div
          className="bauhaus-date"
          style={{
            transform: mirrored ? 'scaleX(-1)' : 'none',
            direction: isRTL(topInscription) ? 'rtl' : 'ltr',
          }}
        >
          {topInscription}
        </div>
        <div
          onClick={() => onMoreOptionsClick(id)}
          style={{ cursor: 'pointer' }}
        >
          <svg viewBox="0 0 24 24" fill="var(--card-text-main)" className="bauhaus-size6">
            <path fillRule="evenodd" d="M10.5 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      <div className="bauhaus-card-body">
        <h3 style={{ direction: isRTL(mainText) ? 'rtl' : 'ltr' }}>{mainText}</h3>
        <p style={{ direction: isRTL(subMainText) ? 'rtl' : 'ltr' }}>{subMainText}</p>
        <div className="bauhaus-progress">
          <span style={{
            direction: isRTL(progressBarInscription) ? 'rtl' : 'ltr',
            textAlign: mirrored ? 'right' : 'left'
          }}>
            {progressBarInscription}
          </span>
          <div
            style={{ transform: mirrored ? 'scaleX(-1)' : 'none' }}
            className="bauhaus-progress-bar"
          >
            <div
              style={{
                width: `${(progress / 100) * 100}%`,
                backgroundColor: accentColor
              }}
            />
          </div>
          <span style={{
            direction: isRTL(progressValue) ? 'rtl' : 'ltr',
            textAlign: mirrored ? 'left' : 'right'
          }}>
            {progressValue}
          </span>
        </div>
      </div>
      <div className="bauhaus-card-footer">
        <div className="bauhaus-button-container">
          {swapButtons ? (
            <>
              <ChronicleButton
                text={outlinedButtonInscription}
                outlined={true}
                width="124px"
                onClick={() => onOutlinedButtonClick(id)}
                borderRadius={borderRadius}
                hoverColor={accentColor}
                customBackground={chronicleButtonBg}
                customForeground={chronicleButtonFg}
                hoverForeground={chronicleButtonHoverFg}
              />
              <ChronicleButton
                text={filledButtonInscription}
                width="124px"
                onClick={() => onFilledButtonClick(id)}
                borderRadius={borderRadius}
                hoverColor={accentColor}
                customBackground={chronicleButtonBg}
                customForeground={chronicleButtonFg}
                hoverForeground={chronicleButtonHoverFg}
              />
            </>
          ) : (
            <>
              <ChronicleButton
                text={filledButtonInscription}
                width="124px"
                onClick={() => onFilledButtonClick(id)}
                borderRadius={borderRadius}
                hoverColor={accentColor}
                customBackground={chronicleButtonBg}
                customForeground={chronicleButtonFg}
                hoverForeground={chronicleButtonHoverFg}
              />
              <ChronicleButton
                text={outlinedButtonInscription}
                outlined={true}
                width="124px"
                onClick={() => onOutlinedButtonClick(id)}
                borderRadius={borderRadius}
                hoverColor={accentColor}
                customBackground={chronicleButtonBg}
                customForeground={chronicleButtonFg}
                hoverForeground={chronicleButtonHoverFg}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};


demo.tsx
import { Component } from "./components/ui/bauhaus-card";

const DemoOne = () => (
  <div className="w-full p-8 rounded-lg min-h-[300px] flex flex-wrap gap-6 items-center justify-center relative">
    {/* Card 1 */}
    <Component
      id="1"
      accentColor="#156ef6"
      backgroundColor="var(--bauhaus-card-bg)"
      separatorColor="var(--bauhaus-card-separator)"
      borderRadius="2em"
      borderWidth="2px"
      topInscription="Uploaded on 12/31/2024"
      mainText="Financial Report.zip"
      subMainText="Downloading File..."
      progressBarInscription="Progress:"
      progress={75.98}
      progressValue="75.98%"
      filledButtonInscription="Share"
      outlinedButtonInscription="Bookmark"
      onFilledButtonClick={id => console.log(`Filled button clicked for ID: ${id}`)}
      onOutlinedButtonClick={id => console.log(`Outlined button clicked for ID: ${id}`)}
      onMoreOptionsClick={id => console.log(`More options dots clicked for ID: ${id}`)}
      mirrored={false}
      swapButtons={false}
      textColorTop="var(--bauhaus-card-inscription-top)"
      textColorMain="var(--bauhaus-card-inscription-main)"
      textColorSub="var(--bauhaus-card-inscription-sub)"
      textColorProgressLabel="var(--bauhaus-card-inscription-progress-label)"
      textColorProgressValue="var(--bauhaus-card-inscription-progress-value)"
      progressBarBackground="var(--bauhaus-card-progress-bar-bg)"
      chronicleButtonBg="var(--bauhaus-chronicle-bg)"
      chronicleButtonFg="var(--bauhaus-chronicle-fg)"
      chronicleButtonHoverFg="var(--bauhaus-chronicle-hover-fg)"
    />
    {/* Card 2 */}
    <Component
      id="2"
      accentColor="#24d200"
      backgroundColor="var(--bauhaus-card-bg)"
      separatorColor="var(--bauhaus-card-separator)"
      borderRadius="2em"
      borderWidth="2px"
      topInscription="$4.99"
      mainText="Next.js Basics"
      subMainText="This course doesn't exist!"
      progressBarInscription="Spots left:"
      progress={20}
      progressValue="20/100"
      filledButtonInscription="Enroll"
      outlinedButtonInscription="Bookmark"
      onFilledButtonClick={id => console.log(`Filled button clicked for ID: ${id}`)}
      onOutlinedButtonClick={id => console.log(`Outlined button clicked for ID: ${id}`)}
      onMoreOptionsClick={id => console.log(`More options dots clicked for ID: ${id}`)}
      mirrored={false}
      swapButtons={false}
      textColorTop="var(--bauhaus-card-inscription-top)"
      textColorMain="var(--bauhaus-card-inscription-main)"
      textColorSub="var(--bauhaus-card-inscription-sub)"
      textColorProgressLabel="var(--bauhaus-card-inscription-progress-label)"
      textColorProgressValue="var(--bauhaus-card-inscription-progress-value)"
      progressBarBackground="var(--bauhaus-card-progress-bar-bg)"
      chronicleButtonBg="var(--bauhaus-chronicle-bg)"
      chronicleButtonFg="var(--bauhaus-chronicle-fg)"
      chronicleButtonHoverFg="#151419"
    />
    {/* Card 3 */}
    <Component
      id="3"
      accentColor="#fc6800"
      backgroundColor="var(--bauhaus-card-bg)"
      separatorColor="var(--bauhaus-card-separator)"
      borderRadius="2.25em"
      borderWidth="3px"
      topInscription="1 de julio en Miami"
      mainText="Nombre de la conferencia"
      subMainText="Descripción de la conferencia."
      progressBarInscription="Plazas disponibles:"
      progress={10}
      progressValue="32"
      filledButtonInscription="Inscribirse"
      outlinedButtonInscription="Detalles"
      onFilledButtonClick={id => console.log(`Filled button clicked for ID: ${id}`)}
      onOutlinedButtonClick={id => console.log(`Outlined button clicked for ID: ${id}`)}
      onMoreOptionsClick={id => console.log(`More options dots clicked for ID: ${id}`)}
      mirrored={false}
      swapButtons={false}
      textColorTop="var(--bauhaus-card-inscription-top)"
      textColorMain="var(--bauhaus-card-inscription-main)"
      textColorSub="var(--bauhaus-card-inscription-sub)"
      textColorProgressLabel="var(--bauhaus-card-inscription-progress-label)"
      textColorProgressValue="var(--bauhaus-card-inscription-progress-value)"
      progressBarBackground="var(--bauhaus-card-progress-bar-bg)"
      chronicleButtonBg="var(--bauhaus-chronicle-bg)"
      chronicleButtonFg="var(--bauhaus-chronicle-fg)"
      chronicleButtonHoverFg="var(--bauhaus-chronicle-hover-fg)"
    />
    {/* Card 4 */}
    <Component
      id="4"
      accentColor="#8f10f6"
      backgroundColor="var(--bauhaus-card-bg)"
      separatorColor="var(--bauhaus-card-separator)"
      borderRadius="1em"
      borderWidth="4px"
      topInscription="דאלאס - תל אביב"
      mainText="מגיע בשעה 9:03 לפי"
      subMainText="שם שדה התעופה"
      progressBarInscription="מגיע בעוד:"
      progress={90}
      progressValue="30 דקות"
      filledButtonInscription="שתף"
      outlinedButtonInscription="עוד"
      onFilledButtonClick={id => console.log(`Filled button clicked for ID: ${id}`)}
      onOutlinedButtonClick={id => console.log(`Outlined button clicked for ID: ${id}`)}
      onMoreOptionsClick={id => console.log(`More options dots clicked for ID: ${id}`)}
      mirrored={true}
      swapButtons={true}
      textColorTop="var(--bauhaus-card-inscription-top)"
      textColorMain="var(--bauhaus-card-inscription-main)"
      textColorSub="var(--bauhaus-card-inscription-sub)"
      textColorProgressLabel="var(--bauhaus-card-inscription-progress-label)"
      textColorProgressValue="var(--bauhaus-card-inscription-progress-value)"
      progressBarBackground="var(--bauhaus-card-progress-bar-bg)"
      chronicleButtonBg="var(--bauhaus-chronicle-bg)"
      chronicleButtonFg="var(--bauhaus-chronicle-fg)"
      chronicleButtonHoverFg="var(--bauhaus-chronicle-hover-fg)"
    />
  </div>
);

export { DemoOne };

```

Copy-paste these files for dependencies:
```tsx
maxim.bort.devel/chronicle-button
"use client";
import React from "react";

// Inline CSS as a string
const styles = `
.chronicleButton {
  --chronicle-button-default-hover-color: var(--theme-color);
  --chronicle-button-border-radius: var(--general-rounding, 8px);
  border-radius: var(--chronicle-button-border-radius);
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  line-height: 1;
  padding: 1rem 1.232rem;
  cursor: pointer;
  border: none;
  font-weight: 700;
  background: var(--chronicle-button-background);
  color: var(--chronicle-button-foreground);
  transition: background 0.4s linear, color 0.4s linear;
  will-change: background, color;
  position: relative;
}

.chronicleButton:hover {
  background: var(--chronicle-button-hover-background);
  color: var(--chronicle-button-hover-foreground);
}

.chronicleButton span {
  position: relative;
  display: block;
  perspective: 108px;
}

.chronicleButton span:nth-of-type(2) {
  position: absolute;
}

.chronicleButton em {
  font-style: normal;
  display: inline-block;
  font-size: 1.025rem;
  color: inherit;
  will-change: transform, opacity, color, transition;
  transition: transform 0.55s cubic-bezier(.645,.045,.355,1), opacity 0.35s linear 0.2s, color 0.4s linear;
}

.chronicleButton span:nth-of-type(1) em {
  transform-origin: top;
}
.chronicleButton span:nth-of-type(2) em {
  opacity: 0;
  transform: rotateX(-90deg) scaleX(.9) translate3d(0,10px,0);
  transform-origin: bottom;
}
.chronicleButton:hover span:nth-of-type(1) em {
  opacity: 0;
  transform: rotateX(90deg) scaleX(.9) translate3d(0,-10px,0);
}
.chronicleButton:hover span:nth-of-type(2) em {
  opacity: 1;
  transform: rotateX(0deg) scaleX(1) translateZ(0);
  transition: transform 0.75s cubic-bezier(.645,.045,.355,1), opacity 0.35s linear 0.3s, color 0.4s linear;
}

.chronicleButton.outlined {
  background: transparent;
  border: 2px solid var(--chronicle-button-background);
  padding: calc(1rem - var(--outline-padding-adjustment)) 0;
  color: var(--chronicle-button-background);
  transition: border 0.4s linear, color 0.4s linear, background-color 0.4s linear;
  will-change: border, color;
}

.chronicleButton.outlined:hover {
  background: var(--outlined-button-background-on-hover, transparent);
  border-color: var(--chronicle-button-hover-background);
  color: var(--chronicle-button-hover-background);
}

.chronicleButton.outlined span:nth-of-type(1) em,
.chronicleButton.outlined span:nth-of-type(2) em {
  transition: color 0.4s linear;
}

.chronicleButton.outlined:hover span:nth-of-type(1) em,
.chronicleButton.outlined:hover span:nth-of-type(2) em {
  color: var(--chronicle-button-hover-background);
}
`;

interface ChronicleButtonProps {
  text: string;
  onClick?: () => void;
  hoverColor?: string;
  width?: string;
  outlined?: boolean;
  outlinePaddingAdjustment?: string;
  borderRadius?: string;
  outlinedButtonBackgroundOnHover?: string;
  customBackground?: string;
  customForeground?: string;
  hoverForeground?: string;
}

export const ChronicleButton: React.FC<ChronicleButtonProps> = ({
  text,
  onClick,
  hoverColor = "#a594fd",
  width = "160px",
  outlined = false,
  outlinePaddingAdjustment = "2px",
  borderRadius = "8px",
  outlinedButtonBackgroundOnHover = "transparent",
  customBackground = "#fff",
  customForeground = "#111014",
  hoverForeground = "#111014",
}) => {
  // Inject styles once
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (!document.getElementById("chronicle-button-style")) {
      const style = document.createElement("style");
      style.id = "chronicle-button-style";
      style.innerHTML = styles;
      document.head.appendChild(style);
    }
  }, []);

  const buttonStyle = {
    "--chronicle-button-background": customBackground,
    "--chronicle-button-foreground": customForeground,
    "--chronicle-button-hover-background": hoverColor,
    "--chronicle-button-hover-foreground": hoverForeground,
    "--outline-padding-adjustment": outlinePaddingAdjustment,
    "--chronicle-button-border-radius": borderRadius,
    "--outlined-button-background-on-hover": outlinedButtonBackgroundOnHover,
    width: width,
    borderRadius: borderRadius,
  } as React.CSSProperties;

  return (
    <button
      className={`chronicleButton${outlined ? " outlined" : ""}`}
      onClick={onClick}
      style={buttonStyle}
      type="button"
    >
      <span>
        <em>{text}</em>
      </span>
      <span>
        <em>{text}</em>
      </span>
    </button>
  );
};

```

Extend existing Tailwind 4 index.css with this code (or if project uses Tailwind 3, extend tailwind.config.js or globals.css):
```css
@import "tailwindcss";
@import "tw-animate-css";

:root {
  --bauhaus-card-bg: #f0f4fb;
  --bauhaus-card-separator: #d3dce8;
  --bauhaus-card-accent: #156ef6;
  --bauhaus-card-radius: 2em;
  --bauhaus-card-border-width: 2px;
  --bauhaus-card-inscription-top: #3b4252;
  --bauhaus-card-inscription-main: #111014;
  --bauhaus-card-inscription-sub: #5e6473;
  --bauhaus-card-inscription-progress-label: #454f55;
  --bauhaus-card-inscription-progress-value: #1c2541;
  --bauhaus-card-progress-bar-bg: #e5e7eb;
  --bauhaus-chronicle-bg: #151419;
  --bauhaus-chronicle-fg: #fff;
  --bauhaus-chronicle-hover-fg: #fff;
}

.dark {
  --background: #252533;
  --bauhaus-card-bg: #151419;
  --bauhaus-card-separator: #2F2B2A;
  --bauhaus-card-accent: #156ef6;
  --bauhaus-card-radius: 2em;
  --bauhaus-card-border-width: 2px;
  --bauhaus-card-inscription-top: #bfc7d5;
  --bauhaus-card-inscription-main: #f0f0f1;
  --bauhaus-card-inscription-sub: #a0a1b3;
  --bauhaus-card-inscription-progress-label: #b5b6c4;
  --bauhaus-card-inscription-progress-value: #e7e7f7;
  --bauhaus-card-progress-bar-bg: #363636;
  --bauhaus-chronicle-bg: #fff;
  --bauhaus-chronicle-fg: #151419;
  --bauhaus-chronicle-hover-fg: #fff;
}

```

Implementation Guidelines
 1. Analyze the component structure and identify all required dependencies
 2. Review the component's argumens and state
 3. Identify any required context providers or hooks and install them
 4. Questions to Ask
 - What data/props will be passed to this component?
 - Are there any specific state management requirements?
 - Are there any required assets (images, icons, etc.)?
 - What is the expected responsive behavior?
 - What is the best place to use this component in the app?

Steps to integrate
 0. Copy paste all the code above in the correct directories
 1. Install external dependencies
 2. Fill image assets with Unsplash stock images you know exist
 3. Use lucide-react icons for svgs or logos if component requires them

NEW EXAMPLE:

You are given a task to integrate an existing React component in the codebase

The codebase should support:
- shadcn project structure  
- Tailwind CSS
- Typescript

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

Determine the default path for components and styles. 
If default path for components is not /components/ui, provide instructions on why it's important to create this folder
Copy-paste this component to /components/ui folder:
```tsx
hero.tsx
"use client"
import { useEffect, useRef, useState } from "react"
import { MeshGradient, PulsingBorder } from "@paper-design/shaders-react"
import { motion } from "framer-motion"

export default function ShaderShowcase() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    const handleMouseEnter = () => setIsActive(true)
    const handleMouseLeave = () => setIsActive(false)

    const container = containerRef.current
    if (container) {
      container.addEventListener("mouseenter", handleMouseEnter)
      container.addEventListener("mouseleave", handleMouseLeave)
    }

    return () => {
      if (container) {
        container.removeEventListener("mouseenter", handleMouseEnter)
        container.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [])

  return (
    <div ref={containerRef} className="min-h-screen bg-black relative overflow-hidden">
      <svg className="absolute inset-0 w-0 h-0">
        <defs>
          <filter id="glass-effect" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence baseFrequency="0.005" numOctaves="1" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.3" />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0.02
                      0 1 0 0 0.02
                      0 0 1 0 0.05
                      0 0 0 0.9 0"
              result="tint"
            />
          </filter>
          <filter id="gooey-filter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="gooey"
            />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
          <filter id="logo-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#0891b2" />
          </linearGradient>
          <linearGradient id="hero-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="#06b6d4" />
            <stop offset="70%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
          <filter id="text-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      <MeshGradient
        className="absolute inset-0 w-full h-full"
        colors={["#000000", "#06b6d4", "#0891b2", "#164e63", "#f97316"]}
        speed={0.3}
        backgroundColor="#000000"
      />
      <MeshGradient
        className="absolute inset-0 w-full h-full opacity-60"
        colors={["#000000", "#ffffff", "#06b6d4", "#f97316"]}
        speed={0.2}
        wireframe="true"
        backgroundColor="transparent"
      />

      <header className="relative z-20 flex items-center justify-between p-6">
        <motion.div
          className="flex items-center group cursor-pointer"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <motion.svg
            fill="currentColor"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="size-10 text-white group-hover:drop-shadow-lg transition-all duration-300"
            style={{
              filter: "url(#logo-glow)",
            }}
            whileHover={{
              fill: "url(#logo-gradient)",
              rotate: [0, -2, 2, 0],
              transition: {
                fill: { duration: 0.3 },
                rotate: { duration: 0.6, ease: "easeInOut" },
              },
            }}
          >
            <motion.path
              d="M15 85V15h12l18 35 18-35h12v70h-12V35L45 70h-10L17 35v50H15z"
              initial={{ pathLength: 1 }}
              whileHover={{
                pathLength: [1, 0, 1],
                transition: { duration: 1.2, ease: "easeInOut" },
              }}
            />
          </motion.svg>

          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/60 rounded-full"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                }}
                animate={{
                  y: [-10, -20, -10],
                  x: [0, Math.random() * 20 - 10, 0],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Navigation */}
        <nav className="flex items-center space-x-2">
          <a
            href="#"
            className="text-white/80 hover:text-white text-xs font-light px-3 py-2 rounded-full hover:bg-white/10 transition-all duration-200"
          >
            Features
          </a>
          <a
            href="#"
            className="text-white/80 hover:text-white text-xs font-light px-3 py-2 rounded-full hover:bg-white/10 transition-all duration-200"
          >
            Pricing
          </a>
          <a
            href="#"
            className="text-white/80 hover:text-white text-xs font-light px-3 py-2 rounded-full hover:bg-white/10 transition-all duration-200"
          >
            Docs
          </a>
        </nav>

        {/* Login Button Group with Arrow */}
        <div id="gooey-btn" className="relative flex items-center group" style={{ filter: "url(#gooey-filter)" }}>
          <button className="absolute right-0 px-2.5 py-2 rounded-full bg-white text-black font-normal text-xs transition-all duration-300 hover:bg-white/90 cursor-pointer h-8 flex items-center justify-center -translate-x-10 group-hover:-translate-x-19 z-0">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </button>
          <button className="px-6 py-2 rounded-full bg-white text-black font-normal text-xs transition-all duration-300 hover:bg-white/90 cursor-pointer h-8 flex items-center z-10">
            Login
          </button>
        </div>
      </header>

      <main className="absolute bottom-8 left-8 z-20 max-w-2xl">
        <div className="text-left">
          <motion.div
            className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm mb-6 relative border border-white/10"
            style={{
              filter: "url(#glass-effect)",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="absolute top-0 left-1 right-1 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent rounded-full" />
            <span className="text-white/90 text-sm font-medium relative z-10 tracking-wide">
              ✨ New Paper Shaders Experience
            </span>
          </motion.div>

          <motion.h1
            className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-none tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.span
              className="block font-light text-white/90 text-4xl md:text-5xl lg:text-6xl mb-2 tracking-wider"
              style={{
                background: "linear-gradient(135deg, #ffffff 0%, #06b6d4 30%, #f97316 70%, #ffffff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "url(#text-glow)",
              }}
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            >
              Beautiful
            </motion.span>
            <span className="block font-black text-white drop-shadow-2xl">Shader</span>
            <span className="block font-light text-white/80 italic">Experiences</span>
          </motion.h1>

          <motion.p
            className="text-lg font-light text-white/70 mb-8 leading-relaxed max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            Create stunning visual experiences with our advanced shader technology. Interactive lighting, smooth
            animations, and beautiful effects that respond to your every move.
          </motion.p>

          <motion.div
            className="flex items-center gap-6 flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <motion.button
              className="px-10 py-4 rounded-full bg-transparent border-2 border-white/30 text-white font-medium text-sm transition-all duration-300 hover:bg-white/10 hover:border-cyan-400/50 hover:text-cyan-100 cursor-pointer backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Pricing
            </motion.button>
            <motion.button
              className="px-10 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-orange-500 text-white font-semibold text-sm transition-all duration-300 hover:from-cyan-400 hover:to-orange-400 cursor-pointer shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          </motion.div>
        </div>
      </main>

      <div className="absolute bottom-8 right-8 z-30">
        <div className="relative w-20 h-20 flex items-center justify-center">
          <PulsingBorder
            colors={["#06b6d4", "#0891b2", "#f97316", "#00FF88", "#FFD700", "#FF6B35", "#ffffff"]}
            colorBack="#00000000"
            speed={1.5}
            roundness={1}
            thickness={0.1}
            softness={0.2}
            intensity={5}
            spotsPerColor={5}
            spotSize={0.1}
            pulse={0.1}
            smoke={0.5}
            smokeSize={4}
            scale={0.65}
            rotation={0}
            frame={9161408.251009725}
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
            }}
          />

          {/* Rotating Text Around the Pulsing Border */}
          <motion.svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            animate={{ rotate: 360 }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            style={{ transform: "scale(1.6)" }}
          >
            <defs>
              <path id="circle" d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
            </defs>
            <text className="text-sm fill-white/80 font-medium">
              <textPath href="#circle" startOffset="0%">
                Loxt - Mozzi • 21st.dev is amazing • 21st.dev is amazing • Loxt-MoZzI •
              </textPath>
            </text>
          </motion.svg>
        </div>
      </div>
    </div>
  )
}


demo.tsx
import ShaderShowcase from "@/components/ui/hero";

export default function DemoOne() {
  return (
    <div className="min-h-screen h-full w-full">
    <ShaderShowcase/>
    </div>
  );
}

```

Install NPM dependencies:
```bash
framer-motion, @paper-design/shaders-react
```

Implementation Guidelines
 1. Analyze the component structure and identify all required dependencies
 2. Review the component's argumens and state
 3. Identify any required context providers or hooks and install them
 4. Questions to Ask
 - What data/props will be passed to this component?
 - Are there any specific state management requirements?
 - Are there any required assets (images, icons, etc.)?
 - What is the expected responsive behavior?
 - What is the best place to use this component in the app?

Steps to integrate
 0. Copy paste all the code above in the correct directories
 1. Install external dependencies
 2. Fill image assets with Unsplash stock images you know exist
 3. Use lucide-react icons for svgs or logos if component requires them

NEW EXAMPLE:

You are given a task to integrate an existing React component in the codebase

The codebase should support:
- shadcn project structure  
- Tailwind CSS
- Typescript

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

Determine the default path for components and styles. 
If default path for components is not /components/ui, provide instructions on why it's important to create this folder
Copy-paste this component to /components/ui folder:
```tsx
moving-border.tsx
"use client";
import * as React from 'react';
import {useRef} from 'react';
import gsap from "gsap";
import {useGSAP} from "@gsap/react";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {MotionPathPlugin} from "gsap/MotionPathPlugin";
import {cn} from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin)

export type MovingBorderProps = {
    /** The content to be displayed inside the border. */
    children: React.ReactNode;

    /** Additional CSS classes for the inner content container. */
    className?: string;

    /** Additional CSS classes for the outer wrapper container. */
    outerClassName?: string;

    /** Width of the border in pixels. @default 1 */
    borderWidth?: number;

    /** Width of the gradient effect in pixels. If not specified, defaults to borderWidth * 10. */
    gradientWidth?: number;

    /** Border radius in pixels. Ignored if isCircle is true. @default 15 */
    radius?: number;

    /** Duration of one complete animation cycle in seconds. @default 3 */
    duration?: number;

    /** Array of color values for the gradient. If multiple colors provided, they will be animated in sequence. @default ["#355bd2"] */
    colors?: string[];

    /** Whether to render as a perfect circle with circular path animation. @default false */
    isCircle?: boolean;
};

export function MovingBorder({
                                 children,
                                 className,
                                 outerClassName,
                                 borderWidth = 1,
                                 radius = 15,
                                 gradientWidth,
                                 duration = 3,
                                 colors = ["#355bd2"],
                                 isCircle = false
                             }: MovingBorderProps) {
    const scope = useRef(null);

    // Use a large radius for perfect circle
    const effectiveRadius = isCircle ? 9999 : radius;

    useGSAP(
        () => {
            const root = scope.current as HTMLElement | null;
            if (!root) return;

            const movingGradient = root.querySelector<HTMLElement>(".moving-gradient");
            if (!movingGradient) return;

            let pathTl: gsap.core.Timeline | null = null;
            let colorTl: gsap.core.Timeline | null = null;

            // Function to create/update the path animation
            const updateAnimation = () => {
                // Kill existing timeline if it exists
                if (pathTl) {
                    pathTl.kill();
                }

                // Get current dimensions
                const rect = root.getBoundingClientRect();
                const width = rect.width - borderWidth * 2;
                const height = rect.height - borderWidth * 2;

                let path: { x: number; y: number; }[];

                if (isCircle) {
                    // Create a circular path using 64 coordinate points
                    const centerX = width / 2;
                    const centerY = height / 2;
                    const circleRadius = Math.min(width, height) / 2;
                    const numPoints = 64;

                    path = Array.from({length: numPoints}, (_, i) => {
                        const angle = (i / numPoints) * Math.PI * 2;
                        return {
                            x: centerX + circleRadius * Math.cos(angle),
                            y: centerY + circleRadius * Math.sin(angle)
                        };
                    });
                } else {
                    // Calculate the path points accounting for border radius (rounded rectangle)
                    path = [
                        {x: effectiveRadius, y: 0},
                        {x: width - effectiveRadius, y: 0},
                        {x: width, y: effectiveRadius},
                        {x: width, y: height - effectiveRadius},
                        {x: width - effectiveRadius, y: height},
                        {x: effectiveRadius, y: height},
                        {x: 0, y: height - effectiveRadius},
                        {x: 0, y: effectiveRadius},
                        {x: effectiveRadius, y: 0},
                    ];
                }

                // Create new timeline for path
                pathTl = gsap.timeline({
                    repeat: -1,
                    defaults: {ease: "none", duration: duration}
                });

                pathTl.to(movingGradient, {
                    motionPath: {
                        path: path,
                        fromCurrent: false,
                        curviness: isCircle ? 1 : 1.5,
                    }
                });
            };

            // Function to create color animation
            const setupColorAnimation = () => {
                if (colors.length <= 1) {
                    // Single color - just set it
                    root.style.setProperty('--color', colors[0]);
                    return;
                }

                // Set initial color
                root.style.setProperty('--color', colors[0]);

                // Multiple colors - animate through them
                colorTl = gsap.timeline({
                    repeat: -1,
                    defaults: {ease: "none", duration: duration / colors.length}
                });

                // Animate through all colors and back to first for seamless loop
                colors.forEach((_, index) => {
                    const nextColor = colors[(index + 1) % colors.length];
                    colorTl!.to(root, {'--color': nextColor});
                });
            };

            // Initial setup
            updateAnimation();
            setupColorAnimation();

            // Watch for size changes
            const resizeObserver = new ResizeObserver(() => {
                updateAnimation();
            });

            resizeObserver.observe(root);

            // Cleanup
            return () => {
                if (pathTl) {
                    pathTl.kill();
                }
                if (colorTl) {
                    colorTl.kill();
                }
                resizeObserver.disconnect();
            };
        },
        {scope, dependencies: [borderWidth, effectiveRadius, gradientWidth, duration, colors, isCircle]}
    );

    return (
        // wrapper
        <div ref={scope} className={cn(`wrapper relative overflow-hidden`, outerClassName)}
             style={{
                 ['--color' as any]: colors[0],
                 padding: `${borderWidth}px`,
                 borderRadius: `${effectiveRadius + borderWidth}px`,
             }}>

            {/* moving gradient*/}
            <div className="moving-gradient aspect-square absolute top-0 left-0" style={{width: `${borderWidth}px`}}>
                <div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 aspect-square rounded-full"
                    style={{
                        width: `${gradientWidth || borderWidth * 10}px`,
                        background: `radial-gradient(circle, var(--color) 0%, transparent 70%)`
                    }}>
                </div>
            </div>

            {/*inner*/}
            <div className={cn(`inner relative z-30 bg-white`, className)}
                 style={{
                     borderRadius: `${effectiveRadius}px`,
                 }}>
                {children}
            </div>
        </div>
    );
}

demo.tsx
import { MovingBorder } from "@/components/ui/moving-border";

export default function DemoOne() {
  return (
    <div className="flex justify-center items-center flex-wrap h-screen w-full gap-x-12 gap-y-6 bg-emerald-50">

            <div className="flex flex-col gap-3 justify-center items-center">

                {/* The radius prop should be identical with your rounded value */}
                <MovingBorder radius={10} borderWidth={2} gradientWidth={60} duration={3}
                              colors={["#dce817", "#10f400", "#75ba33"]}>
                    <button
                        className="rounded-[10px] w-[100px] aspect-video bg-emerald-200 flex justify-center items-center transition-all duration-500 hover:bg-emerald-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                             className="icon icon-tabler icons-tabler-outline icon-tabler-mood-sing">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"/>
                            <path d="M9 9h.01"/>
                            <path d="M15 9h.01"/>
                            <path d="M15 15m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/>
                        </svg>
                    </button>
                </MovingBorder>

                <div>Button</div>
            </div>

            <div className="flex flex-col gap-3 justify-center items-center">

                {/* Circle */}
                <MovingBorder isCircle={true}
                              borderWidth={4}
                              gradientWidth={150}
                              duration={4}
                              colors={["#84b5ff", "#dad7f8", "#cb92ff"]}>
                    <div
                        className="w-[200px] aspect-square bg-accent rounded-full overflow-hidden flex justify-center items-center">
                        <img
                            className="object-cover w-full h-full"
                            src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExcGJrZ3NlejZ4ZXlvaDRnbTR1b2VmcG1waGM1Y3hvNGU4aGE0aHcweSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26BkNnO2qmCWTQuac/giphy.gif"
                            alt="A blurry photo of white flowers in a field"/>
                    </div>
                </MovingBorder>

                <div>Avatar</div>
            </div>
        </div>
  )
}

```

Install NPM dependencies:
```bash
gsap, @gsap/react
```

Implementation Guidelines
 1. Analyze the component structure and identify all required dependencies
 2. Review the component's argumens and state
 3. Identify any required context providers or hooks and install them
 4. Questions to Ask
 - What data/props will be passed to this component?
 - Are there any specific state management requirements?
 - Are there any required assets (images, icons, etc.)?
 - What is the expected responsive behavior?
 - What is the best place to use this component in the app?

Steps to integrate
 0. Copy paste all the code above in the correct directories
 1. Install external dependencies
 2. Fill image assets with Unsplash stock images you know exist
 3. Use lucide-react icons for svgs or logos if component requires them


NEW EXAMPLE:

You are given a task to integrate an existing React component in the codebase

The codebase should support:
- shadcn project structure  
- Tailwind CSS
- Typescript

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

Determine the default path for components and styles. 
If default path for components is not /components/ui, provide instructions on why it's important to create this folder
Copy-paste this component to /components/ui folder:
```tsx
breadcrumb.tsx
"use client";

import { cn } from "@/lib/utils";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import * as React from "react";

export function Breadcrumb({
  ...props
}: React.ComponentProps<"nav">): React.ReactElement {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />;
}

export function BreadcrumbList({
  className,
  ...props
}: React.ComponentProps<"ol">): React.ReactElement {
  return (
    <ol
      className={cn(
        "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
        className,
      )}
      data-slot="breadcrumb-list"
      {...props}
    />
  );
}

export function BreadcrumbItem({
  className,
  ...props
}: React.ComponentProps<"li">): React.ReactElement {
  return (
    <li
      className={cn("inline-flex items-center gap-1.5", className)}
      data-slot="breadcrumb-item"
      {...props}
    />
  );
}

export function BreadcrumbLink({
  className,
  ...props
}: React.ComponentProps<"a">): React.ReactElement {
  return (
    <a
      className={cn("transition-colors hover:text-foreground", className)}
      data-slot="breadcrumb-link"
      {...props}
    />
  );
}

export function BreadcrumbPage({
  className,
  ...props
}: React.ComponentProps<"span">): React.ReactElement {
  return (
    <span
      aria-current="page"
      className={cn("font-normal text-foreground", className)}
      data-slot="breadcrumb-page"
      {...props}
    />
  );
}

export function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"li">): React.ReactElement {
  return (
    <li
      aria-hidden="true"
      className={cn("opacity-80 [&>svg]:size-4", className)}
      data-slot="breadcrumb-separator"
      role="presentation"
      {...props}
    >
      {children ?? <ChevronRight />}
    </li>
  );
}

export function BreadcrumbEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">): React.ReactElement {
  return (
    <span
      aria-hidden="true"
      className={className}
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      {...props}
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">More</span>
    </span>
  );
}


demo.tsx
"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/component";
import { Slash } from "lucide-react";

export default function BreadcrumbCustomSeparator() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Slash />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Components</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Slash />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}

```

Install NPM dependencies:
```bash
lucide-react
```

Implementation Guidelines
 1. Analyze the component structure and identify all required dependencies
 2. Review the component's argumens and state
 3. Identify any required context providers or hooks and install them
 4. Questions to Ask
 - What data/props will be passed to this component?
 - Are there any specific state management requirements?
 - Are there any required assets (images, icons, etc.)?
 - What is the expected responsive behavior?
 - What is the best place to use this component in the app?

Steps to integrate
 0. Copy paste all the code above in the correct directories
 1. Install external dependencies
 2. Fill image assets with Unsplash stock images you know exist
 3. Use lucide-react icons for svgs or logos if component requires them


NEW EXAMPLE:

You are given a task to integrate an existing React component in the codebase

The codebase should support:
- shadcn project structure  
- Tailwind CSS
- Typescript

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

Determine the default path for components and styles. 
If default path for components is not /components/ui, provide instructions on why it's important to create this folder
Copy-paste this component to /components/ui folder:
```tsx
accordion.tsx
"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import * as React from "react";

import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "@radix-ui/react-icons";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b border-border", className)}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 text-left font-semibold transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDownIcon
        width={16}
        height={16}
        strokeWidth={2}
        className="shrink-0 opacity-60 transition-transform duration-200"
        aria-hidden="true"
      />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
));

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };


demo.tsx
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import * as AccordionPrimitive from "@radix-ui/react-accordion";

import { Plus } from "lucide-react";

const items = [
  {
    id: "1",
    title: "What makes Origin UI different?",
    content:
      "Origin UI focuses on developer experience and performance. Built with TypeScript, it offers excellent type safety, follows accessibility standards, and provides comprehensive documentation with regular updates.",
  },
  {
    id: "2",
    title: "How can I customize the components?",
    content:
      "Use our CSS variables for global styling, or className and style props for component-specific changes. We support CSS modules, Tailwind, and dark mode out of the box.",
  },
  {
    id: "3",
    title: "Is Origin UI optimized for performance?",
    content:
      "Yes, with tree-shaking, code splitting, and minimal runtime overhead. Most components are under 5KB gzipped.",
  },
  {
    id: "4",
    title: "How accessible are the components?",
    content:
      "All components follow WAI-ARIA standards, featuring proper ARIA attributes, keyboard navigation, and screen reader support. Regular testing ensures compatibility with NVDA, VoiceOver, and JAWS.",
  },
];

function Component() {
  return (
    <div className="space-y-4 max-w-[400px]">
      <h2 className="text-xl font-bold">W/ plus-minus</h2>
      <Accordion type="single" collapsible className="w-full" defaultValue="3">
        {items.map((item) => (
          <AccordionItem value={item.id} key={item.id} className="py-2">
            <AccordionPrimitive.Header className="flex">
              <AccordionPrimitive.Trigger className="flex flex-1 items-center justify-between py-2 text-left text-[15px] font-semibold leading-6 transition-all [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0 [&[data-state=open]>svg]:rotate-180">
                {item.title}
                <Plus
                  size={16}
                  strokeWidth={2}
                  className="shrink-0 opacity-60 transition-transform duration-200"
                  aria-hidden="true"
                />
              </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>
            <AccordionContent className="pb-2 text-muted-foreground">
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

export { Component };

```

Install NPM dependencies:
```bash
@radix-ui/react-icons, @radix-ui/react-accordion
```

Extend existing tailwind.config.js with this code:
```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
}
```

Implementation Guidelines
 1. Analyze the component structure and identify all required dependencies
 2. Review the component's argumens and state
 3. Identify any required context providers or hooks and install them
 4. Questions to Ask
 - What data/props will be passed to this component?
 - Are there any specific state management requirements?
 - Are there any required assets (images, icons, etc.)?
 - What is the expected responsive behavior?
 - What is the best place to use this component in the app?

Steps to integrate
 0. Copy paste all the code above in the correct directories
 1. Install external dependencies
 2. Fill image assets with Unsplash stock images you know exist
 3. Use lucide-react icons for svgs or logos if component requires them


NEW EXAMPLE:

You are given a task to integrate an existing React component in the codebase

The codebase should support:
- shadcn project structure  
- Tailwind CSS
- Typescript

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

Determine the default path for components and styles. 
If default path for components is not /components/ui, provide instructions on why it's important to create this folder
Copy-paste this component to /components/ui folder:
```tsx
badge-1.tsx
import React from "react";
import Link from "next/link";
import clsx from "clsx";

const variants = {
  gray: "bg-gray-700 text-white fill-white",
  "gray-subtle": "bg-gray-200 text-gray-1000 fill-gray-1000",
  blue: "bg-blue-700 text-white fill-white",
  "blue-subtle": "bg-blue-200 text-blue-900 fill-blue-900",
  purple: "bg-purple-700 text-white fill-white",
  "purple-subtle": "bg-purple-200 text-purple-900 fill-purple-900",
  amber: "bg-amber-700 text-black fill-black",
  "amber-subtle": "bg-amber-200 text-amber-900 fill-amber-900",
  red: "bg-red-700 text-white fill-white",
  "red-subtle": "bg-red-200 text-red-900 fill-red-900",
  pink: "bg-pink-700 text-white fill-white",
  "pink-subtle": "bg-pink-300 text-pink-900 fill-pink-900",
  green: "bg-green-700 text-white fill-white",
  "green-subtle": "bg-green-200 text-green-900 fill-green-900",
  teal: "bg-teal-700 text-white fill-white",
  "teal-subtle": "bg-teal-300 text-teal-900 fill-teal-900",
  inverted: "bg-gray-1000 text-gray-100 fill-gray-100",
  trial: "bg-gradient-to-br from-trial-start to-trial-end text-white fill-white",
  turbo: "bg-gradient-to-br from-turbo-start to-turbo-end text-white fill-white",
  pill: "bg-background text-foreground fill-foreground border border-gray-alpha-400"
};

const sizes = {
  sm: "text-[11px] h-5 px-1.5 tracking-[0.2px] gap-[3px]",
  md: "text-[12px] h-6 px-2.5 tracking-normal gap-1",
  lg: "text-[14px] h-8 px-3 tracking-normal gap-1.5"
};

interface BadgeProps {
  children?: React.ReactNode;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  capitalize?: boolean;
  icon?: React.ReactNode;
  as?: typeof Link;
  href?: string;
}

const Content = ({ icon, size, children }: BadgeProps) => (
  <>
    <style>
      {`
          .smIconContainer svg {
              width: 11px;
              height: 11px;
          }
          .mdIconContainer svg {
              width: 14px;
              height: 14px;
          }
          .lgIconContainer svg {
              width: 16px;
              height: 16px;
          }
        `}
    </style>
    {icon && <span className={`${size}IconContainer`}>{icon}</span>}
    {children}
  </>
);

export const Badge = ({ children, variant = "gray", size = "md", capitalize = true, icon, as, href }: BadgeProps) => {
  if (as === Link && href) {
    return (
      <Link
        className={clsx(
          "!no-underline inline-flex justify-center items-center shrink-0 rounded-[9999px] font-sans font-medium whitespace-nowrap tabular-nums",
          capitalize && "capitalize",
          variants[variant],
          sizes[size]
        )}
        href={href}
      >
        <Content icon={icon} size={size} children={children} />
      </Link>
    );
  }

  return (
    <div className={clsx(
      "inline-flex justify-center items-center shrink-0 rounded-[9999px] font-sans font-medium whitespace-nowrap tabular-nums",
      capitalize && "capitalize",
      variants[variant],
      sizes[size]
    )}>
      <Content icon={icon} size={size} children={children} />
    </div>
  );
};

demo.tsx
import { Badge } from "@/components/ui/badge-1";

const Shield = () => (
  <svg
    height="16"
    strokeLinejoin="round"
    viewBox="0 0 16 16"
    width="16"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3.5 4.057V9.52717C3.5 10.9221 4.27429 12.2018 5.50997 12.849L8 14.1533L10.49 12.849C11.7257 12.2018 12.5 10.9221 12.5 9.52717V4.057C12.3094 4.00405 12.1074 3.9513 11.8932 3.89539C11.746 3.85699 11.5932 3.81709 11.4344 3.7746C10.8476 3.61758 10.204 3.43066 9.61101 3.17017C9.02666 2.91351 8.44336 2.56529 8 2.05704C7.55664 2.56529 6.97334 2.91351 6.38899 3.17017C5.79596 3.43066 5.15243 3.61758 4.5656 3.7746C4.40682 3.81709 4.25396 3.85699 4.10684 3.89539C3.89262 3.9513 3.69055 4.00405 3.5 4.057ZM7.25 0C7.25 0.467199 7.10537 0.796772 6.87802 1.06132C6.6357 1.34329 6.26955 1.58432 5.78576 1.79681C5.30375 2.00853 4.75351 2.17155 4.17787 2.32558C4.04421 2.36134 3.90727 2.39707 3.76932 2.43305C3.33687 2.54586 2.89458 2.66124 2.51283 2.78849L2 2.95943V3.5V9.52717C2 11.4801 3.084 13.2716 4.81396 14.1778L7.65199 15.6644L8 15.8467L8.34801 15.6644L11.186 14.1778C12.916 13.2716 14 11.4801 14 9.52717V3.5V2.95943L13.4872 2.78849C13.1054 2.66124 12.6631 2.54586 12.2307 2.43305C12.0927 2.39707 11.9558 2.36134 11.8221 2.32558C11.2465 2.17155 10.6962 2.00853 10.2142 1.79681C9.73045 1.58432 9.3643 1.34329 9.12198 1.06132C8.89463 0.796772 8.75 0.467199 8.75 0H7.25Z"
    />
  </svg>
);

export default function WithIconsDemo() {
  return (
    <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1">
            <Badge icon={<Shield />} variant="gray" size="lg">gray</Badge>
            <Badge icon={<Shield />} variant="gray" size="md">gray</Badge>
            <Badge icon={<Shield />} variant="gray" size="sm">gray</Badge>
            <Badge icon={<Shield />} variant="gray-subtle" size="sm">gray-subtle</Badge>
            <Badge icon={<Shield />} variant="gray-subtle" size="md">gray-subtle</Badge>
            <Badge icon={<Shield />} variant="gray-subtle" size="lg">gray-subtle</Badge>
          </div>
          <div className="flex items-center gap-1">
            <Badge icon={<Shield />} variant="blue" size="lg">blue</Badge>
            <Badge icon={<Shield />} variant="blue" size="md">blue</Badge>
            <Badge icon={<Shield />} variant="blue" size="sm">blue</Badge>
            <Badge icon={<Shield />} variant="blue-subtle" size="sm">blue-subtle</Badge>
            <Badge icon={<Shield />} variant="blue-subtle" size="md">blue-subtle</Badge>
            <Badge icon={<Shield />} variant="blue-subtle" size="lg">blue-subtle</Badge>
          </div>
          <div className="flex items-center gap-1">
            <Badge icon={<Shield />} variant="purple" size="lg">purple</Badge>
            <Badge icon={<Shield />} variant="purple" size="md">purple</Badge>
            <Badge icon={<Shield />} variant="purple" size="sm">purple</Badge>
            <Badge icon={<Shield />} variant="purple-subtle" size="sm">purple-subtle</Badge>
            <Badge icon={<Shield />} variant="purple-subtle" size="md">purple-subtle</Badge>
            <Badge icon={<Shield />} variant="purple-subtle" size="lg">purple-subtle</Badge>
          </div>
          <div className="flex items-center gap-1">
            <Badge icon={<Shield />} variant="amber" size="lg">amber</Badge>
            <Badge icon={<Shield />} variant="amber" size="md">amber</Badge>
            <Badge icon={<Shield />} variant="amber" size="sm">amber</Badge>
            <Badge icon={<Shield />} variant="amber-subtle" size="sm">amber-subtle</Badge>
            <Badge icon={<Shield />} variant="amber-subtle" size="md">amber-subtle</Badge>
            <Badge icon={<Shield />} variant="amber-subtle" size="lg">amber-subtle</Badge>
          </div>
          <div className="flex items-center gap-1">
            <Badge icon={<Shield />} variant="red" size="lg">red</Badge>
            <Badge icon={<Shield />} variant="red" size="md">red</Badge>
            <Badge icon={<Shield />} variant="red" size="sm">red</Badge>
            <Badge icon={<Shield />} variant="red-subtle" size="sm">red-subtle</Badge>
            <Badge icon={<Shield />} variant="red-subtle" size="md">red-subtle</Badge>
            <Badge icon={<Shield />} variant="red-subtle" size="lg">red-subtle</Badge>
          </div>
          <div className="flex items-center gap-1">
            <Badge icon={<Shield />} variant="pink" size="lg">pink</Badge>
            <Badge icon={<Shield />} variant="pink" size="md">pink</Badge>
            <Badge icon={<Shield />} variant="pink" size="sm">pink</Badge>
            <Badge icon={<Shield />} variant="pink-subtle" size="sm">pink-subtle</Badge>
            <Badge icon={<Shield />} variant="pink-subtle" size="md">pink-subtle</Badge>
            <Badge icon={<Shield />} variant="pink-subtle" size="lg">pink-subtle</Badge>
          </div>
          <div className="flex items-center gap-1">
            <Badge icon={<Shield />} variant="green" size="lg">green</Badge>
            <Badge icon={<Shield />} variant="green" size="md">green</Badge>
            <Badge icon={<Shield />} variant="green" size="sm">green</Badge>
            <Badge icon={<Shield />} variant="green-subtle" size="sm">green-subtle</Badge>
            <Badge icon={<Shield />} variant="green-subtle" size="md">green-subtle</Badge>
            <Badge icon={<Shield />} variant="green-subtle" size="lg">green-subtle</Badge>
          </div>
          <div className="flex items-center gap-1">
            <Badge icon={<Shield />} variant="teal" size="lg">teal</Badge>
            <Badge icon={<Shield />} variant="teal" size="md">teal</Badge>
            <Badge icon={<Shield />} variant="teal" size="sm">teal</Badge>
            <Badge icon={<Shield />} variant="teal-subtle" size="sm">teal-subtle</Badge>
            <Badge icon={<Shield />} variant="teal-subtle" size="md">teal-subtle</Badge>
            <Badge icon={<Shield />} variant="teal-subtle" size="lg">teal-subtle</Badge>
          </div>
          <div className="flex items-center gap-1">
            <Badge icon={<Shield />} variant="inverted" size="lg">inverted</Badge>
            <Badge icon={<Shield />} variant="inverted" size="md">inverted</Badge>
            <Badge icon={<Shield />} variant="inverted" size="sm">inverted</Badge>
          </div>
          <div className="flex items-center gap-1">
            <Badge icon={<Shield />} variant="trial" size="lg">trial</Badge>
            <Badge icon={<Shield />} variant="trial" size="md">trial</Badge>
            <Badge icon={<Shield />} variant="trial" size="sm">trial</Badge>
          </div>
          <div className="flex items-center gap-1">
            <Badge icon={<Shield />} variant="turbo" size="lg">turborepo</Badge>
            <Badge icon={<Shield />} variant="turbo" size="md">turborepo</Badge>
            <Badge icon={<Shield />} variant="turbo" size="sm">turborepo</Badge>
          </div>
        </div>
  );
}

```

Install NPM dependencies:
```bash
clsx, next
```

Extend existing Tailwind 4 index.css with this code (or if project uses Tailwind 3, extend tailwind.config.js or globals.css):
```css
@import "tailwindcss";
@import "tw-animate-css";

@theme inline {
  --color-context-card-border: var(--context-card-border);
  --color-blue-200: var(--ds-blue-200);
  --color-blue-700: var(--ds-blue-700);
  --color-blue-900: var(--ds-blue-900);
  --color-red-200: var(--ds-red-200);
  --color-red-700: var(--ds-red-700);
  --color-red-900: var(--ds-red-900);
  --color-amber-200: var(--ds-amber-200);
  --color-amber-700: var(--ds-amber-700);
  --color-amber-900: var(--ds-amber-900);
  --color-green-200: var(--ds-green-200);
  --color-green-700: var(--ds-green-700);
  --color-green-900: var(--ds-green-900);
  --color-teal-300: var(--ds-teal-300);
  --color-teal-700: var(--ds-teal-700);
  --color-teal-900: var(--ds-teal-900);
  --color-purple-200: var(--ds-purple-200);
  --color-purple-700: var(--ds-purple-700);
  --color-purple-900: var(--ds-purple-900);
  --color-pink-300: var(--ds-pink-300);
  --color-pink-700: var(--ds-pink-700);
  --color-pink-900: var(--ds-pink-900);
  --color-gray-100: var(--ds-gray-100);
  --color-gray-200: var(--ds-gray-200);
  --color-gray-700: var(--ds-gray-700);
  --color-gray-1000: var(--ds-gray-1000);
  --color-trial-start: var(--ds-trial-start);
  --color-trial-end: var(--ds-trial-end);
  --color-turbo-start: var(--ds-turbo-start);
  --color-turbo-end: var(--ds-turbo-end);
}

:root {
  --context-card-border: hsla(0, 0%, 92%, 1);
  --ds-blue-200: oklch(96.29% 0.0195 250.59);
  --ds-blue-700: oklch(57.61% 0.2508 258.23);
  --ds-blue-900: oklch(53.18% 0.2399 256.9900584162342);
  --ds-red-200: oklch(95.41% 0.0299 14.252646656611997);
  --ds-red-700: oklch(62.56% 0.2524 23.03);
  --ds-red-900: oklch(54.99% 0.232 25.29);
  --ds-amber-200: oklch(96.81% 0.0495 90.24227879900472);
  --ds-amber-700: oklch(81.87% 0.1969 76.46);
  --ds-amber-900: oklch(52.79% 0.1496 54.65);
  --ds-green-200: oklch(96.92% 0.037 147.15);
  --ds-green-700: oklch(64.58% 0.1746 147.27);
  --ds-green-900: oklch(51.75% 0.1453 147.65);
  --ds-teal-300: oklch(94.92% 0.0478 182.07);
  --ds-teal-700: oklch(64.92% 0.1572 181.95);
  --ds-teal-900: oklch(52.08% 0.1251 182.93);
  --ds-purple-200: oklch(96.73% 0.0228 309.8);
  --ds-purple-700: oklch(55.5% 0.3008 306.12);
  --ds-purple-900: oklch(47.18% 0.2579 304);
  --ds-pink-300: oklch(93.83% 0.0451 356.29);
  --ds-pink-700: oklch(63.52% 0.238 1.01);
  --ds-pink-900: oklch(53.5% 0.2058 2.84);
  --ds-gray-100: hsla(0, 0%, 95%, 1);
  --ds-gray-200: hsla(0, 0%, 92%, 1);
  --ds-gray-700: hsla(0, 0%, 56%, 1);
  --ds-gray-1000: hsla(0, 0%, 9%, 1);
  --ds-trial-start: rgb(0, 112, 243);
  --ds-trial-end: rgb(248, 28, 229);
  --ds-turbo-start: #ff1e56;
  --ds-turbo-end: #0096ff;
}

.dark {
  --context-card-border: hsla(0, 0%, 18%, 1);
  --ds-blue-200: oklch(25.45% 0.0811 255.8);
  --ds-blue-700: oklch(57.61% 0.2321 258.23);
  --ds-blue-900: oklch(71.7% 0.1648 250.79360374054167);
  --ds-red-200: oklch(25.93% 0.0834 19.02);
  --ds-red-700: oklch(62.56% 0.2234 23.03);
  --ds-red-900: oklch(69.96% 0.2136 22.03);
  --ds-amber-200: oklch(24.95% 0.0642 64.78);
  --ds-amber-700: oklch(81.87% 0.1969 76.46);
  --ds-amber-900: oklch(77.21% 0.1991 64.28);
  --ds-green-200: oklch(27.12% 0.0895 150.09);
  --ds-green-700: oklch(64.58% 0.199 147.27);
  --ds-green-900: oklch(73.1% 0.2158 148.29);
  --ds-teal-300: oklch(31.5% 0.0767 180.99);
  --ds-teal-700: oklch(64.92% 0.1403 181.95);
  --ds-teal-900: oklch(74.56% 0.1765 182.8);
  --ds-purple-200: oklch(25.91% 0.0921 314.41);
  --ds-purple-700: oklch(55.5% 0.2186 306.12);
  --ds-purple-900: oklch(69.87% 0.2037 309.51);
  --ds-pink-300: oklch(31.15% 0.1067 355.93);
  --ds-pink-700: oklch(63.52% 0.2346 1.01);
  --ds-pink-900: oklch(69.36% 0.2223 3.91);
  --ds-gray-100: hsla(0, 0%, 10%, 1);
  --ds-gray-200: hsla(0, 0%, 12%, 1);
  --ds-gray-700: hsla(0, 0%, 56%, 1);
  --ds-gray-1000: hsla(0, 0%, 93%, 1);
}

```

Implementation Guidelines
 1. Analyze the component structure and identify all required dependencies
 2. Review the component's argumens and state
 3. Identify any required context providers or hooks and install them
 4. Questions to Ask
 - What data/props will be passed to this component?
 - Are there any specific state management requirements?
 - Are there any required assets (images, icons, etc.)?
 - What is the expected responsive behavior?
 - What is the best place to use this component in the app?

Steps to integrate
 0. Copy paste all the code above in the correct directories
 1. Install external dependencies
 2. Fill image assets with Unsplash stock images you know exist
 3. Use lucide-react icons for svgs or logos if component requires them


NEW EXAMPLE:

You are given a task to integrate an existing React component in the codebase

The codebase should support:
- shadcn project structure  
- Tailwind CSS
- Typescript

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

Determine the default path for components and styles. 
If default path for components is not /components/ui, provide instructions on why it's important to create this folder
Copy-paste this component to /components/ui folder:
```tsx
bento-grid.tsx
"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface BentoGridProps {
  children: React.ReactNode
  className?: string
}

interface BentoCardProps {
  id?: string
  children: React.ReactNode
  className?: string
}

interface BentoTitleProps {
  children?: React.ReactNode
  className?: string
}

interface BentoDescriptionProps {
  children?: React.ReactNode
  className?: string
}

interface BentoContentProps {
  children: React.ReactNode
  className?: string
}

interface BentoFeature {
  id: string
  title?: string
  description?: string
  content: React.ReactNode
  className?: string
}

interface BentoGridWithFeaturesProps {
  features: BentoFeature[]
  className?: string
}

// Main Bento Grid Container
const BentoGrid = ({ children, className }: BentoGridProps) => {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-6 lg:grid-cols-6 gap-0 rounded-3xl border dark:border-neutral-800", className)}>
      {children}
    </div>
  )
}

// Individual Bento Card
const BentoCard = ({ id, children, className }: BentoCardProps) => {
  return (
    <div
      id={id}
      className={cn("relative overflow-hidden p-4 sm:p-8", className)}
    >
      {children}
    </div>
  )
}

// Bento Card Title
const BentoTitle = ({ children, className }: BentoTitleProps) => {
  if (!children) return null
  
  return (
    <h3 className={cn("text-left text-xl tracking-tight text-black md:text-2xl md:leading-snug dark:text-white", className)}>
      {children}
    </h3>
  )
}

// Bento Card Description
const BentoDescription = ({ children, className }: BentoDescriptionProps) => {
  if (!children) return null
  
  return (
    <p className={cn(
      "text-left text-sm md:text-base",
      "font-normal text-neutral-500 dark:text-neutral-300",
      "mx-0 my-2 max-w-sm text-left md:text-sm",
      className
    )}>
      {children}
    </p>
  )
}

// Bento Card Content Wrapper
const BentoContent = ({ children, className }: BentoContentProps) => {
  return (
    <div className={cn("h-full w-full", className)}>
      {children}
    </div>
  )
}

// Complete Bento Grid with Features Array
const BentoGridWithFeatures = ({ features, className }: BentoGridWithFeaturesProps) => {
  return (
    <div className="relative mb-6">
      <BentoGrid className={className}>
        {features.map((feature) => (
          <BentoCard
            key={feature.id}
            id={feature.id}
            className={feature.className}
          >
            <BentoTitle>{feature.title}</BentoTitle>
            <BentoDescription>{feature.description}</BentoDescription>
            <BentoContent>{feature.content}</BentoContent>
          </BentoCard>
        ))}
      </BentoGrid>
    </div>
  )
}

export {
  BentoGrid,
  BentoCard,
  BentoTitle,
  BentoDescription,
  BentoContent,
  BentoGridWithFeatures,
  type BentoFeature,
  type BentoGridProps,
  type BentoCardProps,
}


demo.tsx
"use client"

import Image from "next/image" 
import {
  BentoGridWithFeatures,
  type BentoFeature,
} from "@/components/ui/bento-grid"

const getTimeOfDayGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning!"
  if (hour < 18) return "Good afternoon!"
  return "Good evening!"
}

export default function DemoOne() {
  const timeOfDayGreeting = getTimeOfDayGreeting()

  const features: BentoFeature[] = [
    {
      id: "1",
      title: "Ali Imam",
      description: `${timeOfDayGreeting} I am Ali, an experienced Design Engineer. Learn more about me.`,
      content: <SkeletonAbout />,
      className:
        "col-span-1 md:col-span-3 lg:col-span-2 border-b md:border-r dark:border-neutral-800",
    },
    {
      id: "2",
      title: "UI",
      description:
        "Discover beautifully crafted typefaces for every creative project — from modern displays to.",
      content: <div className="bg-accent mt-6 rounded-xl h-50 w-full" />,
      className:
        "col-span-1 md:col-span-3 lg:col-span-2 border-b lg:border-r dark:border-neutral-800",
    },
    {
      id: "3",
      title: "Agency",
      description:
        "Get agency-level designs without the agency price. A flat monthly rate for all your design needs.",
      content: <div className="bg-accent mt-6 rounded-xl h-50 w-full" />,
      className:
        "col-span-1 md:col-span-6 md:border-b lg:border-r-0 lg:col-span-2 border-b dark:border-neutral-800",
    },
    {
      id: "4",
      title: "",
      description: "",
      content: <div className="bg-accent rounded-xl h-50 w-full" />,
      className:
        "col-span-1 md:col-span-6 lg:col-span-6 border-b lg:border-r-0 dark:border-neutral-800",
    },
    {
      id: "5",
      title: "Graphic",
      description: `Discover the essence of creativity in our exquisite collection of top-tier abstract design assets. View all Graphics.`,
      content: <div className="bg-accent mt-6 rounded-xl h-50 w-full" />,
      className:
        "col-span-1 md:col-span-3 lg:col-span-2 md:border-r dark:border-neutral-800",
    },
    {
      id: "6",
      title: "Fonts",
      description:
        "Discover beautifully crafted typefaces for every creative project — from modern displays to vintage-inspired lettering.",
      content: <div className="bg-accent mt-6 rounded-xl h-50 w-full" />,
      className:
        "col-span-1 md:col-span-3 lg:col-span-2  lg:border-r dark:border-neutral-800",
    },
    {
      id: "7",
      title: "Visuals",
      description:
        "Discover beautifully websites for design and project — from modern displays to vintage-inspired designs. View all Visuals.",
      content: <div className="bg-accent mt-6 rounded-xl h-50 w-full" />,
      className:
        "col-span-1 md:col-span-6 lg:border-r-0 lg:col-span-2 dark:border-neutral-800",
    },
  ]

  return (
    <div>
      <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-gray-100">
            Bento Grid
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            A flexible bento grid layout for showcasing your work and services
          </p>
        </div>
        <BentoGridWithFeatures features={features} />
    </div>
  )
}

const SkeletonAbout = () => {
  return (
    <div className="flex items-center gap-4">
      <div className="group flex h-full w-full">
        <div className="relative mt-4 w-full">
          <div className="group inline-block w-full text-center">
            <div
              className="border-border-primary w-full rounded-xl border p-2 transition-all duration-500 ease-out group-hover:border-[#fff200]"
              style={{ height: 208 }}
            >
              <div
                className="grid h-full place-items-center rounded-lg border-2 border-[#fff200] bg-[#EDEEF0]"
                style={{ boxShadow: "10px 10px 1.5px 0px #fff200 inset" }}
              ></div>
            </div>
          </div>
          <Image
            src="https://raw.githubusercontent.com/dalim-in/dalim/refs/heads/main/apps/www/public/ali1.jpg"
            alt="ali"
            width={300}
            height={300}
            className="absolute top-1 left-1 h-[200px] w-40 -rotate-[6deg] rounded-lg object-cover shadow-sm transition-all duration-500 group-hover:scale-95 group-hover:rotate-[0deg]"
          />
          <Image
            src="https://raw.githubusercontent.com/dalim-in/dalim/refs/heads/main/apps/www/public/ali3.jpg"
            alt="ali"
            width={300}
            height={300}
            className="absolute top-1 right-24 h-[200px] w-40 rotate-[5deg] rounded-lg object-cover shadow-sm transition-all duration-500 group-hover:scale-95 group-hover:rotate-[0deg]"
          />
          <Image
            src="https://raw.githubusercontent.com/dalim-in/dalim/refs/heads/main/apps/www/public/ali.jpg"
            alt="ali"
            width={300}
            height={300}
            className="absolute top-1 right-1 h-[200px] w-40 -rotate-[6deg] rounded-lg object-cover shadow-sm transition-all duration-500 group-hover:scale-95 group-hover:rotate-[0deg]"
          />
        </div>
      </div>
    </div>
  )
} 
 

```

Implementation Guidelines
 1. Analyze the component structure and identify all required dependencies
 2. Review the component's argumens and state
 3. Identify any required context providers or hooks and install them
 4. Questions to Ask
 - What data/props will be passed to this component?
 - Are there any specific state management requirements?
 - Are there any required assets (images, icons, etc.)?
 - What is the expected responsive behavior?
 - What is the best place to use this component in the app?

Steps to integrate
 0. Copy paste all the code above in the correct directories
 1. Install external dependencies
 2. Fill image assets with Unsplash stock images you know exist
 3. Use lucide-react icons for svgs or logos if component requires them

