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
modal-pricing.tsx
"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check, Sparkles, Zap } from "lucide-react";

interface PlanOption {
    id: string;
    name: string;
    price: string;
    description: string;
    features: string[];
}

const plansSample: PlanOption[] = [
    {
        id: "basic",
        name: "Basic",
        price: "$9",
        description: "Perfect for side projects",
        features: ["5 projects", "Basic analytics", "24h support"],
    },
    {
        id: "pro",
        name: "Pro",
        price: "$19",
        description: "For professional developers",
        features: [
            "Unlimited projects",
            "Advanced analytics",
            "Priority support",
        ],
    },
];

function ModalPricing({
    plans = plansSample,
}: {
    plans: PlanOption[];
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState("pro");

    return (
        <>
            <div className="flex justify-center">
                <Button
                    onClick={() => setIsOpen(true)}
                    className="bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
                >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Upgrade Plan
                </Button>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[425px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-zinc-900 dark:text-white">
                            <Zap className="h-5 w-5 text-zinc-900 dark:text-white" />
                            Choose Your Plan
                        </DialogTitle>
                        <p className="text-sm text-zinc-600 dark:text-zinc-300">
                            Select the perfect plan for your needs. Upgrade or
                            downgrade at any time.
                        </p>
                    </DialogHeader>

                    <RadioGroup
                        defaultValue={selectedPlan}
                        onValueChange={setSelectedPlan}
                        className="gap-4 py-4"
                    >
                        {plans.map((plan) => (
                            <label
                                key={plan.id}
                                className={`relative flex flex-col p-4 cursor-pointer rounded-xl border-2 transition-all
                                    ${
                                        selectedPlan === plan.id
                                            ? "border-zinc-900 bg-zinc-50 dark:border-white dark:bg-zinc-800/50"
                                            : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                                    }`}
                            >
                                <RadioGroupItem
                                    value={plan.id}
                                    className="sr-only"
                                />
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                                            {plan.name}
                                        </h3>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                            {plan.description}
                                        </p>
                                    </div>
                                    <div className="flex items-baseline">
                                        <span className="text-2xl font-bold text-zinc-900 dark:text-white">
                                            {plan.price}
                                        </span>
                                        <span className="ml-1 text-zinc-500 dark:text-zinc-400">
                                            /mo
                                        </span>
                                    </div>
                                </div>
                                <ul className="space-y-2 mt-4">
                                    {plan.features.map((feature, index) => (
                                        <li
                                            key={index}
                                            className="flex items-center text-sm text-zinc-600 dark:text-zinc-300"
                                        >
                                            <Check className="w-4 h-4 mr-2 text-zinc-900 dark:text-white" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                {selectedPlan === plan.id && (
                                    <div className="absolute -top-2 -right-2">
                                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-zinc-900 dark:bg-white">
                                            <Check className="h-3 w-3 text-white dark:text-zinc-900" />
                                        </span>
                                    </div>
                                )}
                            </label>
                        ))}
                    </RadioGroup>

                    <DialogFooter className="flex flex-col gap-2">
                        <Button
                            onClick={() => setIsOpen(false)}
                            className="w-full bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
                        >
                            Confirm Selection
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => setIsOpen(false)}
                            className="w-full text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                        >
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}


export { ModalPricing, PlanOption }

demo.tsx
import { ModalPricing } from "@/components/ui/modal-pricing"

interface PlanOption {
    id: string;
    name: string;
    price: string;
    description: string;
    features: string[];
}

const plansSample: PlanOption[] = [
    {
        id: "basic",
        name: "Basic",
        price: "$9",
        description: "Perfect for side projects",
        features: ["5 projects", "Basic analytics", "24h support"],
    },
    {
        id: "pro",
        name: "Pro",
        price: "$19",
        description: "For professional developers",
        features: [
            "Unlimited projects",
            "Advanced analytics",
            "Priority support",
        ],
    },
];


function DemoModal() {
    return <ModalPricing plans={plansSample} />
}

export { DemoModal }
```

Copy-paste these files for dependencies:
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
shadcn/radio-group
"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }

```
```tsx
shadcn/label
"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }

```
```tsx
shadcn/dialog
'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg',
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col space-y-1.5 text-center sm:text-left',
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
```

Install NPM dependencies:
```bash
lucide-react, @radix-ui/react-slot, class-variance-authority, @radix-ui/react-radio-group, @radix-ui/react-label, @radix-ui/react-dialog
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
diced-hero-section.tsx
"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChronicleButton } from './chronicle-button';

interface TextStyle {
  color?: string;
  fontSize?: string;
  gradient?: string;
}
interface ButtonStyle {
  backgroundColor?: string;
  color?: string;
  borderRadius?: string;
  hoverColor?: string;
  hoverForeground?: string; // NEW: color of text on hover
}
interface SlideContent {
  title: string;
  image: string;
}
interface DicedHeroSectionProps {
  topText: string;
  mainText: string;
  subMainText: string;
  buttonText: string;
  slides: SlideContent[];
  onMainButtonClick?: () => void;
  onGridImageHover?: (index: number) => void;
  onGridImageClick?: (index: number) => void;
  topTextStyle?: TextStyle;
  mainTextStyle?: TextStyle;
  subMainTextStyle?: TextStyle;
  buttonStyle?: ButtonStyle;
  componentBorderRadius?: string;
  backgroundColor?: string;
  separatorColor?: string;
  maxContentWidth?: string;
  mobileBreakpoint?: number;
  fontFamily?: string;
  isRTL?: boolean;
}

export const DicedHeroSection: React.FC<DicedHeroSectionProps> = ({
  topText,
  mainText,
  subMainText,
  buttonText,
  slides,
  onMainButtonClick,
  onGridImageHover,
  onGridImageClick,
  topTextStyle,
  mainTextStyle,
  subMainTextStyle,
  buttonStyle = {},
  componentBorderRadius = '0px',
  backgroundColor,
  separatorColor = '#005baa',
  maxContentWidth = '1536px',
  mobileBreakpoint = 1000,
  fontFamily = 'inherit',
  isRTL = false,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isRTLCheck = (text: string): boolean => {
    return /[\u0590-\u05FF\u0600-\u06FF\u0700-\u074F]/.test(text);
  };

  useEffect(() => {
    const checkMobile = () => {
      if (containerRef.current) {
        setIsMobile(containerRef.current.offsetWidth < mobileBreakpoint);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [mobileBreakpoint]);

  const getGradientStyle = (gradient?: string) => {
    if (gradient) {
      return {
        backgroundImage: gradient,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      };
    }
    return {};
  };

  return (
    <main
      ref={containerRef}
      style={{
        borderRadius: componentBorderRadius,
        backgroundColor,
        padding: '2rem',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: isMobile ? 'column' : isRTL ? 'row-reverse' : 'row',
        justifyContent: 'center',
        alignItems: 'stretch',
        width: '100%',
        maxWidth: maxContentWidth,
        margin: '0 auto',
        minHeight: 'auto',
        height: 'auto',
        fontFamily,
        position: 'relative',
      }}
    >
      <div
        style={{
          flex: 1,
          marginRight: isMobile ? 0 : isRTL ? 0 : '2rem',
          marginLeft: isMobile ? 0 : isRTL ? '2rem' : 0,
          textAlign: isMobile ? 'center' : isRTL ? 'right' : 'left',
          alignItems: isMobile ? 'center' : isRTL ? 'flex-end' : 'flex-start',
          maxWidth: isMobile ? '100%' : '50%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          zIndex: 1,
          paddingBottom: isMobile ? '2rem' : 0,
        }}
      >
        <div>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              ...topTextStyle,
              ...getGradientStyle(topTextStyle?.gradient),
              direction: isRTLCheck(topText) ? 'rtl' : 'ltr',
              textAlign: isRTLCheck(topText) ? 'right' : 'left',
            }}
          >
            {topText}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              ...mainTextStyle,
              direction: isRTLCheck(mainText) ? 'rtl' : 'ltr',
              textAlign: isMobile
                ? 'center'
                : isRTLCheck(mainText)
                ? 'right'
                : 'left',
              fontSize: mainTextStyle?.fontSize,
            }}
          >
            <motion.span
              style={{
                ...getGradientStyle(mainTextStyle?.gradient),
                display: 'inline-block',
              }}
            >
              {mainText}
            </motion.span>
          </motion.h1>
          <motion.hr
            initial={{ width: 0 }}
            animate={{ width: '6.25rem' }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              height: '0.25rem',
              background: separatorColor,
              border: 'none',
              margin: isMobile
                ? '1.125rem auto 1.875rem'
                : isRTLCheck(mainText)
                ? '1.125rem 0 1.875rem auto'
                : '1.125rem 0 1.875rem',
              alignSelf: isMobile
                ? 'center'
                : isRTLCheck(mainText)
                ? 'flex-end'
                : 'flex-start',
            }}
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              ...subMainTextStyle,
              ...getGradientStyle(subMainTextStyle?.gradient),
              direction: isRTLCheck(subMainText) ? 'rtl' : 'ltr',
              textAlign: isRTLCheck(subMainText) ? 'right' : 'left',
            }}
          >
            {subMainText}
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{
            marginTop: '1rem',
            display: 'flex',
            justifyContent: isMobile
              ? 'center'
              : isRTL
              ? 'flex-end'
              : 'flex-start',
          }}
        >
          <ChronicleButton
            text={buttonText}
            onClick={onMainButtonClick}
            hoverColor={buttonStyle?.hoverColor}
            hoverForeground={buttonStyle?.hoverForeground ?? '#fff'} // NEW
            borderRadius={buttonStyle?.borderRadius}
            fontFamily={fontFamily}
            customBackground={buttonStyle?.backgroundColor}
            customForeground={buttonStyle?.color}
          />
        </motion.div>
      </div>
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: isRTL ? 'flex-start' : 'flex-end',
          position: 'relative',
          width: isMobile ? '100%' : '50%',
          paddingLeft: isMobile ? 0 : isRTL ? 0 : '2rem',
          paddingRight: isMobile ? 0 : isRTL ? '2rem' : 0,
          height: 'auto',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px',
            width: '100%',
            aspectRatio: '1 / 1',
          }}
        >
          {[slides[3], slides[2], slides[1], slides[0]].map((slide, index) => (
            <div
              key={index}
              style={{
                position: 'relative',
                width: '100%',
                paddingBottom: '100%',
                overflow: 'hidden',
                borderRadius: '20px',
              }}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className={`warped-image ${
                  ['bottom-right', 'bottom-left', 'top-right', 'top-left'][
                    index
                  ]
                }`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  cursor: 'pointer',
                }}
                onClick={() => onGridImageClick && onGridImageClick(index)}
                onMouseEnter={() => onGridImageHover && onGridImageHover(index)}
              />
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        .warped-image {
          --r: 20px;
          --s: 40px;
          --x: 25px;
          --y: 5px;
        }
        .top-right {
          --_m:/calc(2*var(--r)) calc(2*var(--r)) radial-gradient(#000 70%,#0000 72%);
          --_g:conic-gradient(at calc(100% - var(--r)) var(--r),#0000 25%,#000 0);
          --_d:(var(--s) + var(--r));
          mask: calc(100% - var(--_d) - var(--x)) 0 var(--_m), 100% calc(var(--_d) + var(--y)) var(--_m), radial-gradient(var(--s) at 100% 0,#0000 99%,#000 calc(100% + 1px)) calc(-1*var(--r) - var(--x)) calc(var(--r) + var(--y)), var(--_g) calc(-1*var(--_d) - var(--x)) 0, var(--_g) 0 calc(var(--_d) + var(--y));
          mask-repeat: no-repeat;
        }
        .top-left {
          --_m:/calc(2*var(--r)) calc(2*var(--r)) radial-gradient(#000 70%,#0000 72%);
          --_g:conic-gradient(at var(--r) var(--r),#000 75%,#0000 0);
          --_d:(var(--s) + var(--r));
          mask: calc(var(--_d) + var(--x)) 0 var(--_m), 0 calc(var(--_d) + var(--y)) var(--_m), radial-gradient(var(--s) at 0 0,#0000 99%,#000 calc(100% + 1px)) calc(var(--r) + var(--x)) calc(var(--r) + var(--y)), var(--_g) calc(var(--_d) + var(--x)) 0, var(--_g) 0 calc(var(--_d) + var(--y));
          mask-repeat: no-repeat;
        }
        .bottom-left {
          --_m:/calc(2*var(--r)) calc(2*var(--r)) radial-gradient(#000 70%,#0000 72%);
          --_g:conic-gradient(from 180deg at var(--r) calc(100% - var(--r)),#0000 25%,#000 0);
          --_d:(var(--s) + var(--r));
          mask: calc(var(--_d) + var(--x)) 100% var(--_m), 0 calc(100% - var(--_d) - var(--y)) var(--_m), radial-gradient(var(--s) at 0 100%,#0000 99%,#000 calc(100% + 1px)) calc(var(--r) + var(--x)) calc(-1*var(--r) - var(--y)), var(--_g) calc(var(--_d) + var(--x)) 0, var(--_g) 0 calc(-1*var(--_d) - var(--y));
          mask-repeat: no-repeat;
        }
        .bottom-right {
          --_m:/calc(2*var(--r)) calc(2*var(--r)) radial-gradient(#000 70%,#0000 72%);
          --_g:conic-gradient(from 90deg at calc(100% - var(--r)) calc(100% - var(--r)),#0000 25%,#000 0);
          --_d:(var(--s) + var(--r));
          mask: calc(100% - var(--_d) - var(--x)) 100% var(--_m), 100% calc(100% - var(--_d) - var(--y)) var(--_m), radial-gradient(var(--s) at 100% 100%,#0000 99%,#000 calc(100% + 1px)) calc(-1*var(--r) - var(--x)) calc(-1*var(--r) - var(--y)), var(--_g) calc(-1*var(--_d) - var(--x)) 0, var(--_g) 0 calc(-1*var(--_d) - var(--y));
          mask-repeat: no-repeat;
        }
      `}</style>
    </main>
  );
};


demo.tsx
import { DicedHeroSection } from "@/components/ui/diced-hero-section.tsx";

// LTR Demo
export function DemoLTR() {
  return (
    <DicedHeroSection
      topText="Discover"
      mainText="Freshness"
      subMainText="Explore a vibrant harvest of organic, seasonal fruits and vegetables, bursting with flavors. Unveil a paramount selection of naturally delicious and nutritious premium produce sourced directly from local farms!"
      buttonText="Shop Now"
      slides={[
        {
          title: "Purple Cauliflower",
          image: "https://images.unsplash.com/photo-1620053927547-cf64d4829ff4?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
          title: "Strawberry",
          image: "https://images.unsplash.com/photo-1623227866882-c005c26dfe41?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
          title: "Feijoa",
          image: "https://images.unsplash.com/photo-1541857754-557a44522bec?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
          title: "Fruits and Vegetables",
          image: "https://images.unsplash.com/photo-1646340691161-521e588e9964?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ]}
      onMainButtonClick={() => console.log("Main button clicked for LTR")}
      onGridImageHover={index => console.log(`Grid image ${index} hovered for LTR`)}
      onGridImageClick={index => console.log(`Grid image ${index} clicked for the LTR`)}
      topTextStyle={{ color: "var(--diced-hero-section-top-text)" }}
      mainTextStyle={{
        fontSize: "4.5rem",
        gradient: "linear-gradient(45deg, var(--diced-hero-section-main-gradient-from), var(--diced-hero-section-main-gradient-to))",
      }}
      subMainTextStyle={{ color: "var(--diced-hero-section-sub-text)" }}
      buttonStyle={{
        backgroundColor: "var(--diced-hero-section-button-bg)",
        color: "var(--diced-hero-section-button-fg)",
        borderRadius: "2rem",
        hoverColor: "var(--diced-hero-section-button-hover-bg)",
        hoverForeground: "var(--diced-hero-section-button-hover-fg)",
      }}
      separatorColor="var(--diced-hero-section-separator)"
      mobileBreakpoint={1000}
      fontFamily="Arial, sans-serif"
    />
  );
}

// RTL Demo
export function DemoRTL() {
  return (
    <DicedHeroSection
      topText="גלה"
      mainText="טריות"
      subMainText="חקור יבול עשיר של פירות וירקות אורגניים עונתיים, מלאי טעמים. גלה מבחר מעולה של תוצרת איכותית, טעימה וטבעית, מזינה ומגיעה ישירות מחוות מקומיות!"
      buttonText="קנה עכשיו"
      slides={[
        {
          title: "כרובית סגולה",
          image: "https://images.unsplash.com/photo-1620053927547-cf64d4829ff4?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
          title: "תותים",
          image: "https://images.unsplash.com/photo-1623227866882-c005c26dfe41?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
          title: "פיג'ויה",
          image: "https://images.unsplash.com/photo-1541857754-557a44522bec?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
          title: "מגוון פירות וירקות",
          image: "https://images.unsplash.com/photo-1646340691161-521e588e9964?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ]}
      onMainButtonClick={() => console.log("Main button clicked for the RTL")}
      onGridImageHover={index => console.log(`Grid image ${index} hovered for RTL`)}
      onGridImageClick={index => console.log(`Grid image ${index} clicked for the RTL`)}
      topTextStyle={{ color: "var(--diced-hero-section-top-text)" }}
      mainTextStyle={{
        fontSize: "5rem",
        gradient: "linear-gradient(45deg, var(--diced-hero-section-main-gradient-from), var(--diced-hero-section-main-gradient-to))",
      }}
      subMainTextStyle={{ color: "var(--diced-hero-section-sub-text)" }}
      buttonStyle={{
        backgroundColor: "var(--diced-hero-section-button-bg)",
        color: "var(--diced-hero-section-button-fg)",
        borderRadius: "7px",
        hoverColor: "var(--diced-hero-section-button-hover-bg)",
        hoverForeground: "var(--diced-hero-section-button-hover-fg)",
      }}
      separatorColor="var(--diced-hero-section-separator)"
      maxContentWidth="1190px"
      mobileBreakpoint={910}
      fontFamily="Arial, sans-serif"
      isRTL={true}
    />
  );
}

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

Install NPM dependencies:
```bash
framer-motion
```

Extend existing Tailwind 4 index.css with this code (or if project uses Tailwind 3, extend tailwind.config.js or globals.css):
```css
@import "tailwindcss";
@import "tw-animate-css";

:root {
  --diced-hero-section-top-text: #2c3e50;
  --diced-hero-section-main-gradient-from: #16a085;
  --diced-hero-section-main-gradient-to: #2980b9;
  --diced-hero-section-main-gradient-foreground: #16a085;
  --diced-hero-section-separator: #005baa;
  --diced-hero-section-sub-text: #34495e;
  --diced-hero-section-button-bg: #27ae60;
  --diced-hero-section-button-fg: #ffffff;
  --diced-hero-section-button-hover-bg: #2ecc71;
  --diced-hero-section-button-hover-fg: #fff;
}

.dark {
  --diced-hero-section-top-text: #f7f7ff;
  --diced-hero-section-main-gradient-from: #9F4EFF;
  --diced-hero-section-main-gradient-to: #00A6FB;
  --diced-hero-section-main-gradient-foreground: #9F4EFF;
  --diced-hero-section-separator: #086CA2;
  --diced-hero-section-sub-text: #f7f7ff;
  --diced-hero-section-button-bg: #00A6FB;
  --diced-hero-section-button-fg: #0A0A0A;
  --diced-hero-section-button-hover-bg: #9F4EFF;
  --diced-hero-section-button-hover-fg: #FFFFFF;
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
vhs-hero-section.tsx
"use client"

import { gsap } from "gsap"
import { useFrame, Canvas } from "@react-three/fiber"
import type { Points } from "three"
import type { ShaderMaterial } from "three"
import type * as THREE from "three"
import { useEffect, useRef, useState, useCallback, useMemo } from "react"
import { Button } from "/src/components/ui/button"

interface DistortionBackgroundProps {
  mousePosition: { x: number; y: number }
}

function DistortionBackground({ mousePosition }: DistortionBackgroundProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<ShaderMaterial>(null)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: [0, 0] },
      uResolution: { value: [window.innerWidth, window.innerHeight] },
      uNoiseScale: { value: 8.0 },
      uDistortionStrength: { value: 0.3 },
    }),
    [],
  )

  const vertexShader = `
    varying vec2 vUv;
    uniform float uTime;
    uniform float uDistortionStrength;
    
    // Noise function
    float noise(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }
    
    void main() {
      vUv = uv;
      
      vec3 pos = position;
      
      // Add vertex distortion
      float n1 = noise(uv * 10.0 + uTime * 0.5);
      float n2 = noise(uv * 20.0 - uTime * 0.3);
      
      pos.z += sin(pos.x * 5.0 + uTime * 2.0) * uDistortionStrength * n1;
      pos.z += cos(pos.y * 8.0 + uTime * 1.5) * uDistortionStrength * n2;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `

  const fragmentShader = `
    uniform float uTime;
    uniform vec2 uMouse;
    uniform vec2 uResolution;
    uniform float uNoiseScale;
    uniform float uDistortionStrength;
    varying vec2 vUv;

    // Enhanced noise functions
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    float noise(vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);
      
      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));
      
      vec2 u = f * f * (3.0 - 2.0 * f);
      
      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    float fbm(vec2 st) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 0.0;
      
      for (int i = 0; i < 6; i++) {
        value += amplitude * noise(st);
        st *= 2.0;
        amplitude *= 0.5;
      }
      return value;
    }

    vec3 distortedNoise(vec2 uv) {
      vec2 st = uv * uNoiseScale;
      
      // Create complex distortion
      float time = uTime * 0.5;
      vec2 q = vec2(fbm(st + vec2(0.0, 0.0)),
                    fbm(st + vec2(5.2, 1.3)));
      
      vec2 r = vec2(fbm(st + 4.0 * q + vec2(1.7 - time * 0.15, 9.2)),
                    fbm(st + 4.0 * q + vec2(8.3 - time * 0.126, 2.8)));
      
      float f = fbm(st + r);
      
      // Mouse interaction distortion
      vec2 mouseInfluence = (uMouse - 0.5) * 2.0;
      float mouseDistance = length(uv - (uMouse * 0.5 + 0.5));
      float mouseEffect = 1.0 - smoothstep(0.0, 0.6, mouseDistance);
      
      // Add glitch effect
      float glitch = step(0.98, random(vec2(floor(uTime * 10.0), floor(uv.y * 50.0))));
      f += glitch * 0.5;
      
      // Color mapping with distortion
      vec3 color = vec3(0.0);
      
      color.r = f * f * f + 0.6 * f * f + 0.5 * f;
      color.g = f * f * f * f + 0.4 * f * f + 0.2 * f;
      color.b = f * f * f * f * f * f + 0.7 * f * f + 0.5 * f;
      
      // Add noise texture
      float noiseTexture = random(uv * 100.0 + time);
      color += noiseTexture * 0.1;
      
      // Mouse interaction color shift
      color += mouseEffect * vec3(0.3, 0.1, 0.2);
      
      // Scanline effect
      float scanline = sin(uv.y * 800.0) * 0.04;
      color += scanline;
      
      return color;
    }

    void main() {
      vec2 uv = vUv;
      
      // Add chromatic aberration
      float aberration = 0.005;
      vec3 color;
      color.r = distortedNoise(uv + vec2(aberration, 0.0)).r;
      color.g = distortedNoise(uv).g;
      color.b = distortedNoise(uv - vec2(aberration, 0.0)).b;
      
      // Add film grain
      float grain = random(uv + uTime) * 0.1;
      color += grain;
      
      // Vignette effect
      float vignette = 1.0 - length(uv - 0.5) * 1.2;
      color *= vignette;
      
      // Contrast and saturation boost
      color = pow(color, vec3(1.2));
      color *= 1.3;
      
      gl_FragColor = vec4(color, 0.95);
    }
  `

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
      materialRef.current.uniforms.uMouse.value = [mousePosition.x, mousePosition.y]

      // Dynamic distortion based on time
      const distortion = 0.2 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      materialRef.current.uniforms.uDistortionStrength.value = distortion
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0, -1]}>
      <planeGeometry args={[25, 25, 100, 100]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
      />
    </mesh>
  )
}


interface NoiseParticlesProps {
  count: number
  mousePosition: { x: number; y: number }
}

function NoiseParticles({ count, mousePosition }: NoiseParticlesProps) {
  const pointsRef = useRef<Points>(null)

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3

      // Random positions
      positions[i3] = (Math.random() - 0.5) * 20
      positions[i3 + 1] = (Math.random() - 0.5) * 20
      positions[i3 + 2] = (Math.random() - 0.5) * 10

      // Noise-based colors (red, white, cyan)
      const colorChoice = Math.random()
      if (colorChoice < 0.33) {
        colors[i3] = 1.0 // Red
        colors[i3 + 1] = 0.0
        colors[i3 + 2] = 0.0
      } else if (colorChoice < 0.66) {
        colors[i3] = 1.0 // White
        colors[i3 + 1] = 1.0
        colors[i3 + 2] = 1.0
      } else {
        colors[i3] = 0.0 // Cyan
        colors[i3 + 1] = 1.0
        colors[i3 + 2] = 1.0
      }

      sizes[i] = Math.random() * 0.03 + 0.01
    }

    return { positions, colors, sizes }
  }, [count])

  useFrame((state) => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array

      for (let i = 0; i < count; i++) {
        const i3 = i * 3

        // Chaotic movement
        positions[i3] += (Math.random() - 0.5) * 0.02
        positions[i3 + 1] += (Math.random() - 0.5) * 0.02
        positions[i3 + 2] += Math.sin(state.clock.elapsedTime * 3 + i * 0.1) * 0.01

        // Mouse repulsion
        const mouseInfluence =
          1 / (1 + Math.abs(positions[i3] - mousePosition.x * 10) + Math.abs(positions[i3 + 1] - mousePosition.y * 10))
        if (mouseInfluence > 0.1) {
          positions[i3] += (Math.random() - 0.5) * 0.1
          positions[i3 + 1] += (Math.random() - 0.5) * 0.1
        }

        // Boundary wrapping
        if (Math.abs(positions[i3]) > 10) positions[i3] *= -0.8
        if (Math.abs(positions[i3 + 1]) > 10) positions[i3 + 1] *= -0.8
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={particles.positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={particles.colors} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={count} array={particles.sizes} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial size={0.02} vertexColors transparent opacity={0.8} sizeAttenuation blending={2} />
    </points>
  )
}


interface GlitchTextProps {
  text: string
  className?: string
  fontSize?: string
  fontFamily?: string
  fontWeight?: string
  color?: string
  glitchIntensity?: number
  glitchFrequency?: number
}

export function GlitchText({
  text,
  className = "",
  fontSize = "4rem",
  fontFamily = "inherit",
  fontWeight = "900",
  color = "#ffffff",
  glitchIntensity = 0.8,
  glitchFrequency = 100,
}: GlitchTextProps) {
  const textRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!textRef.current) return

    const element = textRef.current
    const originalText = text

    // Create glitch effect
    const glitchChars = "!@#$%^&*()_+-=[]{}|;:,.<>?"

    const glitchAnimation = () => {
      if (Math.random() > 1 - glitchIntensity * 0.05) {
        // Random glitch based on intensity
        const glitchedText = originalText
          .split("")
          .map((char) => {
            if (Math.random() > 1 - glitchIntensity * 0.2) {
              return glitchChars[Math.floor(Math.random() * glitchChars.length)]
            }
            return char
          })
          .join("")

        element.textContent = glitchedText

        setTimeout(
          () => {
            element.textContent = originalText
          },
          50 + Math.random() * (100 * glitchIntensity),
        )
      }
    }

    const interval = setInterval(glitchAnimation, glitchFrequency)

    // GSAP glitch effects with intensity
    gsap.to(element, {
      textShadow: `${2 * glitchIntensity}px 0 #ff0000, ${-2 * glitchIntensity}px 0 #00ffff`,
      duration: 0.1,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
    })

    return () => {
      clearInterval(interval)
    }
  }, [text, glitchIntensity, glitchFrequency])

  return (
    <h1
      ref={textRef}
      className={`${className} relative`}
      style={{
        fontSize,
        fontFamily,
        fontWeight,
        color,
        textShadow: `2px 0 #ff0000, -2px 0 #00ffff, 0 0 20px rgba(255, 255, 255, 0.5)`,
      }}
    >
      {text}
    </h1>
  )
}

export default function DistortHero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)

  const handleMouseMove = useCallback((event: MouseEvent) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 2
    const y = (event.clientY / window.innerHeight - 0.5) * 2
    setMousePosition({ x, y })
  }, [])

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [handleMouseMove])

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isLoaded) return

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set([titleRef.current, subtitleRef.current, buttonRef.current], {
        opacity: 0,
        y: 100,
        scale: 0.8,
        filter: "blur(10px)",
      })

      gsap.set(canvasRef.current, {
        opacity: 0,
        scale: 1.2,
      })

      // Create aggressive timeline
      const tl = gsap.timeline({ delay: 0.2 })

      // Canvas entrance with distortion
      tl.to(canvasRef.current, {
        opacity: 1,
        scale: 1,
        duration: 2,
        ease: "power4.out",
      })

      // Aggressive text entrance
      tl.to(
        titleRef.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.5,
          ease: "back.out(2)",
        },
        "-=1.5",
      )
        .to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 1.2,
            ease: "power3.out",
          },
          "-=1",
        )
        .to(
          buttonRef.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 1,
            ease: "power3.out",
          },
          "-=0.6",
        )

      // Glitch effects
      const glitchTl = gsap.timeline({ repeat: -1, repeatDelay: 2 })
      glitchTl
        .to(heroRef.current, {
          filter: "hue-rotate(180deg) saturate(2)",
          duration: 0.1,
        })
        .to(heroRef.current, {
          filter: "none",
          duration: 0.1,
        })
        .to(heroRef.current, {
          x: 5,
          duration: 0.05,
        })
        .to(heroRef.current, {
          x: -5,
          duration: 0.05,
        })
        .to(heroRef.current, {
          x: 0,
          duration: 0.05,
        })

      // Mouse interaction chaos
      const handleMouseMove = (e: MouseEvent) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 30
        const y = (e.clientY / window.innerHeight - 0.5) * 30

        gsap.to(titleRef.current, {
          x: x * 0.1,
          y: y * 0.05,
          rotationX: y * 0.02,
          rotationY: x * 0.02,
          duration: 0.3,
          ease: "power2.out",
        })
      }

      window.addEventListener("mousemove", handleMouseMove)

      return () => {
        window.removeEventListener("mousemove", handleMouseMove)
      }
    }, heroRef)

    return () => ctx.revert()
  }, [isLoaded])

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Distorted WebGL Background */}
      <div ref={canvasRef} className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          style={{ background: "linear-gradient(135deg, #000000 0%, #1a0000 50%, #000000 100%)" }}
        >
          <DistortionBackground mousePosition={mousePosition} />
          <NoiseParticles count={800} mousePosition={mousePosition} />
        </Canvas>
      </div>

      {/* Noise overlay */}
      <div
        className="absolute inset-0 z-10 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Hero Content */}
      <div ref={heroRef} className="relative z-20 flex min-h-screen items-center justify-center px-6">
        <div className="text-center max-w-5xl mx-auto">
          <div ref={titleRef}>
            <GlitchText
              text="VHS HERO SECTION"
              fontSize="clamp(4rem, 12vw, 12rem)"
              fontFamily="'Courier New', monospace"
              fontWeight="900"
              color="#ffffff"
              glitchIntensity={0.9}
              glitchFrequency={80}
              className="leading-none tracking-tighter"
            />
          </div>

          <div className="mt-4">
            <GlitchText
              text="WITH NOISE"
              fontSize="clamp(1.5rem, 4vw, 3rem)"
              fontFamily="'Courier New', monospace"
              fontWeight="400"
              color="#ff0000"
              glitchIntensity={0.6}
              glitchFrequency={150}
              className="tracking-widest opacity-80"
            />
          </div>

          <p
            ref={subtitleRef}
            className="text-xl md:text-2xl lg:text-3xl text-red-400 mb-12 max-w-3xl mx-auto leading-relaxed font-mono tracking-wider uppercase"
            style={{
              textShadow: "0 0 10px rgba(255, 0, 0, 0.5), 2px 0 #00ffff, -2px 0 #ff0000",
            }}
          >
            {">"} REALITY.CORRUPTED {"<"}
            <br />
            {">"} NOISE.AMPLIFIED {"<"}
          </p>

          <div ref={buttonRef}>
            <Button
              size="lg"
              className="group relative overflow-hidden bg-red-600/20 backdrop-blur-sm border-2 border-red-500 text-red-400 hover:bg-red-600/40 hover:text-white px-10 py-4 text-lg font-mono uppercase tracking-wider transition-all duration-300 transform hover:scale-105"
            >
              <span className="relative z-10">
                {">"} ENTER_CHAOS {"<"}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
            </Button>
          </div>
        </div>
      </div>

      {/* Glitch UI Elements */}
      <div className="absolute top-8 left-8 z-30">
        <div className="text-red-400 font-mono text-xs tracking-wider">{">"} SYSTEM.CORRUPTED</div>
      </div>

      <div className="absolute top-8 right-8 z-30">
        <div className="text-cyan-400 font-mono text-xs tracking-wider">ERROR_404 {"<"}</div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
        <div className="w-px h-16 bg-gradient-to-b from-red-500/60 to-transparent animate-pulse" />
      </div>

      {/* Scanlines */}
      <div
        className="absolute inset-0 z-15 pointer-events-none opacity-10"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 255, 255, 0.1) 2px, rgba(255, 255, 255, 0.1) 4px)",
        }}
      />
    </div>
  )
}

export const Component = ()  => {
  return (
    <DistortHero />
  )
}

demo.tsx
import { Component } from "@/components/ui/vhs-hero-section";

export default function DemoOne() {
  return <Component />;
}

```

Copy-paste these files for dependencies:
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

Install NPM dependencies:
```bash
gsap, three, @react-three/fiber, @radix-ui/react-slot, class-variance-authority
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
ethereal.tsx
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ScrollHero = ({
  sections = [
    { id: 'hero', headline: 'Ethereal', subheadline: 'Beyond Reality', body: 'Immersive experiences through computational artistry' },
    { id: 'about', headline: 'Innovation', subheadline: 'Through Design', body: 'Pushing boundaries of digital experiences' },
    { id: 'services', headline: 'Crafted', subheadline: 'With Purpose', body: 'Every pixel serves a greater vision' },
    { id: 'contact', headline: 'Connect', subheadline: 'Create Together', body: 'Let\'s build something extraordinary' }
  ],
  colorPalette = {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    tertiary: '#ec4899',
    accent: '#06ffa5',
    dark: '#0a0a0a'
  },
  logo = 'STUDIO',
  menuItems = ['Work', 'About', 'Services', 'Contact']
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const meshRef = useRef(null);
  const composerRef = useRef(null);
  const sectionsRef = useRef([]);
  const progressRef = useRef(null);

  const scrollRef = useRef({
    progress: 0,
    velocity: 0,
    rotation: { x: 0, y: 0 }
  });
  const mouseRef = useRef({ x: 0.5, y: 0.5, sx: 0.5, sy: 0.5 });

  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState(0);

  // COSINE PALETTE for animated gradients (cinematic-friendly)
  // ref: IQ's palette technique
  const paletteGLSL = `
    vec3 cosPalette(float t, vec3 a, vec3 b, vec3 c, vec3 d){
      return a + b*cos(6.28318*(c*t + d));
    }
  `;

  // Vertex shader: displacement + derivatives-friendly output for better shading
  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vWorldPos;
    varying vec3 vNormal;
    varying float vDist;

    uniform float uTime;
    uniform vec2  uMouse;
    uniform float uScrollProgress;
    uniform float uScrollVelocity;
    uniform float uSectionT;

    // Simplex noise
    vec3 mod289(vec3 x){ return x - floor(x*(1.0/289.0))*289.0; }
    vec4 mod289(vec4 x){ return x - floor(x*(1.0/289.0))*289.0; }
    vec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314*r; }

    float snoise(vec3 v){
      const vec2  C = vec2(1.0/6.0, 1.0/3.0);
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g  = step(x0.yzx, x0.xyz);
      vec3 l  = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i);
      vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0))
        + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      float n_ = 0.142857142857;
      vec3  ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0*floor(p*ns.z*ns.z);
      vec4 x_ = floor(j*ns.z);
      vec4 y_ = floor(j - 7.0*x_);
      vec4 x = x_*ns.x + ns.yyyy;
      vec4 y = y_*ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1),
                                     dot(p2,p2), dot(p3,p3)));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1),
                              dot(x2,x2), dot(x3,x3)), 0.0);
      m = m*m;
      return 42.0*dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                  dot(p2,x2), dot(p3,x3) ) );
    }

    float fbm(vec3 p){
      float v = 0.0;
      float a = 0.5;
      for(int i=0;i<5;i++){
        v += a * snoise(p);
        p *= 2.0;
        a *= 0.5;
      }
      return v;
    }

    void main(){
      vUv = uv;

      // base pos
      vec3 pos = position;

      // organic domain warping
      vec3 p = pos * 1.1;
      float t = uTime * 0.25;
      // smooth “breathing” that doesn’t rotate the mesh
      float warp1 = fbm(p + vec3(t, -t, t*0.5));
      float warp2 = snoise(p*2.0 + vec3(-t*0.7, t*0.9, t*0.2));
      float warp = warp1*0.25 + warp2*0.1;

      // scroll-velocity twist only when scrolling (cinematic inertia)
      float twist = uScrollVelocity * 0.6;
      float angle = pos.y * twist;
      mat2 R = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
      pos.xz = R * pos.xz;

      // displacement along normal for sculpted look
      float ridge = max(0.0, 1.0 - abs(snoise(p*1.5)));
      float disp = warp + ridge*0.15;
      vDist = disp;
      pos += normal * disp;

      vec4 world = modelMatrix * vec4(pos,1.0);
      vWorldPos = world.xyz;

      // send original normal (we’ll recompute better normal in fragment via derivatives)
      vNormal = normalize(normalMatrix * normal);

      gl_Position = projectionMatrix * viewMatrix * world;
    }
  `;

  // Fragment shader: Cook-Torrance-ish lighting, animated color gradients, env-ish reflection
  const fragmentShader = `
    precision highp float;

    varying vec2 vUv;
    varying vec3 vWorldPos;
    varying vec3 vNormal;
    varying float vDist;

    uniform float uTime;
    uniform float uScrollProgress;
    uniform float uSectionIndex;
    uniform vec2  uMouse;

    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    uniform vec3 uAccent;

    // palette
    ${paletteGLSL}

    // ACES-ish clamp
    float saturate(float x){ return clamp(x,0.0,1.0); }

    // Recompute geometric normal from derivatives for better shading on displaced surface
    vec3 normalFromDerivatives(vec3 p){
      vec3 dx = dFdx(p);
      vec3 dy = dFdy(p);
      return normalize(cross(dx,dy));
    }

    // Fresnel (Schlick)
    vec3 F_Schlick(float cosTheta, vec3 F0){
      return F0 + (1.0 - F0)*pow(1.0 - cosTheta, 5.0);
    }

    // GGX
    float D_GGX(float NdotH, float rough){
      float a = rough*rough;
      float a2 = a*a;
      float d = (NdotH*NdotH)*(a2 - 1.0) + 1.0;
      return a2 / (3.14159 * d * d);
    }

    float G_SchlickGGX(float NdotV, float rough){
      float r = rough + 1.0;
      float k = (r*r)/8.0;
      return NdotV / (NdotV*(1.0 - k) + k);
    }

    float G_Smith(float NdotV, float NdotL, float rough){
      return G_SchlickGGX(NdotV, rough) * G_SchlickGGX(NdotL, rough);
    }

    // Fake environment gradient (sky/ground)
    vec3 envGradient(vec3 r, vec3 skyA, vec3 skyB, vec3 ground){
      float h = r.y * 0.5 + 0.5;
      vec3 sky = mix(skyB, skyA, h);
      return mix(ground, sky, saturate(h*1.2));
    }

    // Domain-warped gradient parameter
    float gradParam(vec2 uv, float time){
      vec2 q = uv*2.0 - 1.0;
      q.x *= 1.2;
      float a = sin(q.x*2.5 + time*0.25);
      float b = cos(q.y*3.0 - time*0.2);
      return saturate(0.5 + 0.5*(a*0.6 + b*0.4));
    }

    void main(){
      // derive world-space normal for correct specular on displaced mesh
      vec3 N = normalFromDerivatives(vWorldPos);

      // view/light setup
      vec3 V = normalize(cameraPosition - vWorldPos);

      // three cinematic lights moving slowly (not rotating the mesh)
      float t = uTime*0.6;
      vec3 L1pos = vec3( 6.0*sin(t*0.7),  4.0,  6.0*cos(t*0.7));
      vec3 L2pos = vec3(-5.0*cos(t*0.5), -3.5, 5.0*sin(t*0.45));
      vec3 L3pos = vec3( 0.0,  6.0*sin(t*0.25), -6.0);

      vec3 L1 = normalize(L1pos - vWorldPos);
      vec3 L2 = normalize(L2pos - vWorldPos);
      vec3 L3 = normalize(L3pos - vWorldPos);

      // animated palette (cosine palette + section crossfade)
      float gp = gradParam(vUv, uTime) + vDist*0.6;
      float sectionMix = clamp(uSectionIndex/3.0, 0.0, 1.0);

      // Two palettes we blend between for a richer filmic feel
      vec3 palA = cosPalette(
        gp,
        vec3(0.55,0.55,0.58),
        vec3(0.45,0.35,0.35),
        vec3(0.95,0.80,0.70),
        vec3(0.00,0.35,0.55)
      );

      vec3 palB = cosPalette(
        gp + 0.15*sin(uTime*0.25),
        vec3(0.55,0.56,0.58),
        vec3(0.35,0.45,0.55),
        vec3(0.90,0.55,0.75),
        vec3(0.25,0.10,0.60)
      );

      vec3 baseAlbedo = mix(palA, palB, sectionMix);
      // bias toward your provided brand colors
      baseAlbedo = mix(baseAlbedo, uColor1, 0.15);
      baseAlbedo = mix(baseAlbedo, uColor2, 0.10);

      // Microfacet parameters
      float metallic = 0.25 + 0.15*sin(uTime*0.2 + gp*3.0);
      float rough    = clamp(0.18 + 0.12*sin(gp*6.283 + uTime*0.35), 0.06, 0.6);

      vec3 F0 = mix(vec3(0.04), baseAlbedo, metallic);

      // BRDF for each light
      vec3 H1 = normalize(V + L1);
      vec3 H2 = normalize(V + L2);
      vec3 H3 = normalize(V + L3);

      float NdotV = saturate(dot(N,V));
      float NdotL1= saturate(dot(N,L1));
      float NdotL2= saturate(dot(N,L2));
      float NdotL3= saturate(dot(N,L3));

      float NdotH1= saturate(dot(N,H1));
      float NdotH2= saturate(dot(N,H2));
      float NdotH3= saturate(dot(N,H3));

      float D1 = D_GGX(NdotH1, rough);
      float D2 = D_GGX(NdotH2, rough);
      float D3 = D_GGX(NdotH3, rough);

      float G1 = G_Smith(NdotV, NdotL1, rough);
      float G2 = G_Smith(NdotV, NdotL2, rough);
      float G3 = G_Smith(NdotV, NdotL3, rough);

      vec3  F1 = F_Schlick(saturate(dot(V,H1)), F0);
      vec3  F2 = F_Schlick(saturate(dot(V,H2)), F0);
      vec3  F3 = F_Schlick(saturate(dot(V,H3)), F0);

      vec3 spec1 = (D1*G1*F1) / max(4.0*NdotV*NdotL1, 0.001);
      vec3 spec2 = (D2*G2*F2) / max(4.0*NdotV*NdotL2, 0.001);
      vec3 spec3 = (D3*G3*F3) / max(4.0*NdotV*NdotL3, 0.001);

      vec3 kS = F_Schlick(NdotV, F0);
      vec3 kD = (vec3(1.0) - kS) * (1.0 - metallic);

      vec3 diffuse = baseAlbedo / 3.14159;

      // cinematic light colors
      vec3 c1 = vec3(1.0);
      vec3 c2 = mix(uColor3, vec3(0.9,0.95,1.0), 0.6);
      vec3 c3 = mix(uAccent, vec3(1.0,0.9,0.75), 0.5);

      vec3 direct =
        (kD*diffuse + spec1) * c1 * NdotL1 * 0.9 +
        (kD*diffuse + spec2) * c2 * NdotL2 * 0.6 +
        (kD*diffuse + spec3) * c3 * NdotL3 * 0.5;

      // fake environment reflection
      vec3 R = reflect(-V, N);
      vec3 env = envGradient(R,
        vec3(0.12,0.16,0.25),  // zenith
        vec3(0.04,0.06,0.10),  // horizon
        vec3(0.01,0.01,0.012)  // ground
      );
      vec3 Fenv = F_Schlick(saturate(dot(N,V)), F0);
      vec3 envSpec = Fenv * env * (1.0 - rough) * 0.6;

      // rim/iris accent
      float rim = pow(1.0 - saturate(dot(N,V)), 2.0);
      vec3 rimCol = mix(uAccent, uColor3, 0.4) * rim * 0.35;

      // glow from displacement
      vec3 glow = mix(uAccent, uColor3, 0.5) * abs(vDist) * 0.25;

      vec3 color = direct + envSpec + rimCol + glow;

      // subtle holographic shimmer
      float pattern = sin(vUv.x*40.0 + uTime) * sin(vUv.y*38.0 - uTime);
      color += pattern * 0.015;

      // mild exposure/gamma here; final look in post
      color = clamp(color, 0.0, 4.0);
      gl_FragColor = vec4(color, 1.0 - uScrollProgress*0.12);
    }
  `;

  // Cinematic post: ACES filmic + color temp/tint + grain + vignette + subtle CA + gentle bloom pass in pipeline
  const cinematicPostShader = {
    uniforms: {
      tDiffuse: { value: null },
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2() },
      uTemperature: { value: 0.08 }, // warm a touch
      uTint: { value: 0.02 },        // green-magenta
      uContrast: { value: 1.06 },
      uSaturation: { value: 1.05 },
      uVignette: { value: 0.35 },
      uAberration: { value: 0.0018 },
      uGrain: { value: 0.22 },
      uLetterbox: { value: 0.6 } // 0..0.2 bars
    },
    vertexShader: `
      varying vec2 vUv;
      void main(){
        vUv = uv;
        gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
      }
    `,
    fragmentShader: `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D tDiffuse;
      uniform float uTime;
      uniform vec2  uResolution;
      uniform float uTemperature, uTint, uContrast, uSaturation, uVignette, uAberration, uGrain, uLetterbox;

      float rand(vec2 co){ return fract(sin(dot(co, vec2(12.9898,78.233))) * 43758.5453); }

      vec3 aces(vec3 x){
        // ACES filmic approximation
        float a=2.51,b=0.03,c=2.43,d=0.59,e=0.14;
        return clamp((x*(a*x+b))/(x*(c*x+d)+e),0.0,1.0);
      }

      vec3 tempTint(vec3 c, float temp, float tint){
        // very lightweight temp/tint
        c.r += temp*0.2;
        c.b -= temp*0.2;
        c.g += tint*0.15;
        return c;
      }

      vec3 satContrast(vec3 c, float sat, float con){
        vec3 g = vec3(dot(c, vec3(0.299,0.587,0.114)));
        c = mix(g, c, sat);
        c = (c - 0.5)*con + 0.5;
        return c;
      }

      void main(){
        // subtle CA (direction from center)
        vec2 p = vUv - 0.5;
        vec2 dir = normalize(p + 1e-6);
        float dist = length(p);
        vec2 off = dir * uAberration * dist;

        float r = texture2D(tDiffuse, vUv + off).r;
        float g = texture2D(tDiffuse, vUv).g;
        float b = texture2D(tDiffuse, vUv - off).b;
        vec3 col = vec3(r,g,b);

        // grain
        float n = rand(vUv*vec2(uResolution.x, uResolution.y) + uTime*60.0) - 0.5;
        col += n * uGrain * 0.08;

        // grading
        col = tempTint(col, uTemperature, uTint);
        col = satContrast(col, uSaturation, uContrast);

        // vignette
        float vig = smoothstep(0.85, 0.2, dist);
        col *= mix(1.0, vig, uVignette);

        // letterbox bars
        float bar = smoothstep(uLetterbox, 0.0, abs(vUv.y - 0.5));
        col *= bar;

        // ACES + gamma
        col = aces(col);
        col = pow(col, vec3(1.0/2.2));

        gl_FragColor = vec4(col, 1.0);
      }
    `
  };

  // Initialize Three.js
  useEffect(() => {
    if (!canvasRef.current) return;

    let scene, camera, renderer, composer;
    let mesh;
    let clock = new THREE.Clock();
    let frameId;

    const init = () => {
      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
      camera.position.set(0, 0, 5);

      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
        alpha: true
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.0;
      renderer.outputEncoding = THREE.sRGBEncoding;

      // geometry with lots of facets for specular play
      const geometry = new THREE.IcosahedronGeometry(1.85, 5);

      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2(0.5, 0.5) },
          uScrollProgress: { value: 0 },
          uScrollVelocity: { value: 0 },
          uSectionT: { value: 0 },
          uSectionIndex: { value: 0 },
          uColor1: { value: new THREE.Color(colorPalette.primary) },
          uColor2: { value: new THREE.Color(colorPalette.secondary) },
          uColor3: { value: new THREE.Color(colorPalette.tertiary) },
          uAccent: { value: new THREE.Color(colorPalette.accent) }
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        side: THREE.DoubleSide
      });

      mesh = new THREE.Mesh(geometry, material);
      meshRef.current = mesh;
      scene.add(mesh);

      // Composer: Render -> Bloom -> CinematicPost
      composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));

      const bloom = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.7,   // strength
        0.35,  // radius
        0.92   // threshold
      );
      composer.addPass(bloom);

      const cinePass = new ShaderPass(cinematicPostShader);
      cinePass.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
      composer.addPass(cinePass);

      composerRef.current = composer;
      setIsLoaded(true);

      const animate = () => {
        frameId = requestAnimationFrame(animate);
        const t = clock.getElapsedTime();

        if (mesh) {
          // time & inputs
          mesh.material.uniforms.uTime.value = t;

          // smooth mouse
          mouseRef.current.sx += (mouseRef.current.x - mouseRef.current.sx) * 0.1;
          mouseRef.current.sy += (mouseRef.current.y - mouseRef.current.sy) * 0.1;
          mesh.material.uniforms.uMouse.value.set(mouseRef.current.sx, mouseRef.current.sy);

          // scroll uniforms
          mesh.material.uniforms.uScrollProgress.value = scrollRef.current.progress;
          mesh.material.uniforms.uScrollVelocity.value = scrollRef.current.velocity;

          // scroll-only rotation
          mesh.rotation.x = scrollRef.current.rotation.x;
          mesh.rotation.y = scrollRef.current.rotation.y;

          // idle breathing only when not scrolling (translation, not rotation)
          if (Math.abs(scrollRef.current.velocity) < 0.01) {
            mesh.position.y = Math.sin(t * 0.45) * 0.06;
          } else {
            mesh.position.y *= 0.9;
          }
        }

        // post uniforms
        const lastPass = composer.passes[composer.passes.length - 1];
        if (lastPass?.uniforms?.uTime) lastPass.uniforms.uTime.value = t;

        composer.render();
      };

      animate();

      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        composer.setSize(window.innerWidth, window.innerHeight);
        const lastPass = composer.passes[composer.passes.length - 1];
        if (lastPass?.uniforms?.uResolution) {
          lastPass.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
        }
      };
      window.addEventListener('resize', onResize);

      return () => {
        window.removeEventListener('resize', onResize);
        if (frameId) cancelAnimationFrame(frameId);
        geometry.dispose();
        material.dispose();
        renderer.dispose();
      };
    };

    init();
  }, [colorPalette]);

  // Scroll logic (rotation only; cinematic inertia; section color transitions)
  useEffect(() => {
    if (!isLoaded) return;

    let lastY = window.scrollY;
    let vel = 0;
    let velTimeout;

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        scrollRef.current.progress = self.progress;

        // velocity
        const y = window.scrollY;
        vel = (y - lastY) * 0.01;
        lastY = y;
        scrollRef.current.velocity = THREE.MathUtils.clamp(vel, -1, 1);

        // rotation mapping to progress (no time-based auto-rot)
        gsap.to(scrollRef.current.rotation, {
          x: self.progress * Math.PI * 3.0,
          y: self.progress * Math.PI * 4.5,
          duration: 0.3,
          ease: 'power2.out'
        });

        // decay velocity after stop
        clearTimeout(velTimeout);
        velTimeout = setTimeout(() => {
          gsap.to(scrollRef.current, { velocity: 0, duration: 0.5, ease: 'power2.out' });
        }, 120);

        // progress bar
        if (progressRef.current) {
          gsap.to(progressRef.current, { scaleY: self.progress, duration: 0.12 });
        }
      }
    });

    // Section enter -> palette morph
    sections.forEach((section, idx) => {
      const el = sectionsRef.current[idx];
      if (!el) return;

      // content in
      gsap.fromTo(
        el.querySelectorAll('.section-headline, .section-subheadline, .section-body'),
        { opacity: 0, y: 80, rotationX: -10 },
        {
          opacity: 1, y: 0, rotationX: 0, duration: 1,
          stagger: 0.15,
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            end: 'top 20%',
            scrub: 1
          }
        }
      );

      // shader palette crossfade
      ScrollTrigger.create({
        trigger: el,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => {
          setActiveSection(idx);
          if (meshRef.current) {
            gsap.to(meshRef.current.material.uniforms.uSectionIndex, {
              value: idx,
              duration: 1.2,
              ease: 'power2.inOut'
            });
            // kick a little morph pulse
            gsap.fromTo(
              meshRef.current.material.uniforms.uSectionT,
              { value: 0 },
              { value: 1, duration: 0.5, ease: 'power2.in', yoyo: true, repeat: 1 }
            );
          }
        },
        onEnterBack: () => {
          setActiveSection(idx);
          if (meshRef.current) {
            gsap.to(meshRef.current.material.uniforms.uSectionIndex, {
              value: idx,
              duration: 1.2,
              ease: 'power2.inOut'
            });
          }
        }
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [isLoaded, sections]);

  // Mouse smoothing (for glow/iris; no rotation)
  useEffect(() => {
    const onMove = (e) => {
      mouseRef.current.x = e.clientX / window.innerWidth;
      mouseRef.current.y = 1 - (e.clientY / window.innerHeight);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div ref={containerRef} className="scroll-hero">
      <canvas ref={canvasRef} className="hero-canvas" />

      <div className="scroll-progress">
        <div ref={progressRef} className="scroll-progress-bar" />
      </div>

      <nav className="nav-container">
        <div className="nav-inner">
          <div className="nav-logo">{logo}</div>
          <div className="nav-menu">
            {menuItems.map((item, i) => (
              <a
                key={i}
                href={`#${item.toLowerCase()}`}
                className={`nav-item ${activeSection === i ? 'active' : ''}`}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {sections.map((section, index) => (
        <section
          key={section.id}
          ref={el => sectionsRef.current[index] = el}
          className="hero-section"
          data-section={index}
        >
          <div className="section-content">
            <h1 className="section-headline">{section.headline}</h1>
            <h2 className="section-subheadline">{section.subheadline}</h2>
            <p className="section-body">{section.body}</p>
          </div>
        </section>
      ))}

      <div className={`loading-overlay ${isLoaded ? 'loaded' : ''}`}>
        <div className="loading-text">Loading</div>
      </div>
    </div>
  );
};

export default ScrollHero;

demo.tsx
import CinematicHeroSection from "@/components/ui/ethereal";

export default function DemoOne() {
  return <CinematicHeroSection />;
}

```

Install NPM dependencies:
```bash
gsap, three
```

Extend existing Tailwind 4 index.css with this code (or if project uses Tailwind 3, extend tailwind.config.js or globals.css):
```css
@import "tailwindcss";
@import "tw-animate-css";

:root {
  --scroll-progress: 0;
}


@keyframes pulse {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
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
ethereal.tsx
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ScrollHero = ({
  sections = [
    { id: 'hero', headline: 'Ethereal', subheadline: 'Beyond Reality', body: 'Immersive experiences through computational artistry' },
    { id: 'about', headline: 'Innovation', subheadline: 'Through Design', body: 'Pushing boundaries of digital experiences' },
    { id: 'services', headline: 'Crafted', subheadline: 'With Purpose', body: 'Every pixel serves a greater vision' },
    { id: 'contact', headline: 'Connect', subheadline: 'Create Together', body: 'Let\'s build something extraordinary' }
  ],
  colorPalette = {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    tertiary: '#ec4899',
    accent: '#06ffa5',
    dark: '#0a0a0a'
  },
  logo = 'STUDIO',
  menuItems = ['Work', 'About', 'Services', 'Contact']
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const meshRef = useRef(null);
  const composerRef = useRef(null);
  const sectionsRef = useRef([]);
  const progressRef = useRef(null);

  const scrollRef = useRef({
    progress: 0,
    velocity: 0,
    rotation: { x: 0, y: 0 }
  });
  const mouseRef = useRef({ x: 0.5, y: 0.5, sx: 0.5, sy: 0.5 });

  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState(0);

  // COSINE PALETTE for animated gradients (cinematic-friendly)
  // ref: IQ's palette technique
  const paletteGLSL = `
    vec3 cosPalette(float t, vec3 a, vec3 b, vec3 c, vec3 d){
      return a + b*cos(6.28318*(c*t + d));
    }
  `;

  // Vertex shader: displacement + derivatives-friendly output for better shading
  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vWorldPos;
    varying vec3 vNormal;
    varying float vDist;

    uniform float uTime;
    uniform vec2  uMouse;
    uniform float uScrollProgress;
    uniform float uScrollVelocity;
    uniform float uSectionT;

    // Simplex noise
    vec3 mod289(vec3 x){ return x - floor(x*(1.0/289.0))*289.0; }
    vec4 mod289(vec4 x){ return x - floor(x*(1.0/289.0))*289.0; }
    vec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314*r; }

    float snoise(vec3 v){
      const vec2  C = vec2(1.0/6.0, 1.0/3.0);
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g  = step(x0.yzx, x0.xyz);
      vec3 l  = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i);
      vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0))
        + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      float n_ = 0.142857142857;
      vec3  ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0*floor(p*ns.z*ns.z);
      vec4 x_ = floor(j*ns.z);
      vec4 y_ = floor(j - 7.0*x_);
      vec4 x = x_*ns.x + ns.yyyy;
      vec4 y = y_*ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1),
                                     dot(p2,p2), dot(p3,p3)));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1),
                              dot(x2,x2), dot(x3,x3)), 0.0);
      m = m*m;
      return 42.0*dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                  dot(p2,x2), dot(p3,x3) ) );
    }

    float fbm(vec3 p){
      float v = 0.0;
      float a = 0.5;
      for(int i=0;i<5;i++){
        v += a * snoise(p);
        p *= 2.0;
        a *= 0.5;
      }
      return v;
    }

    void main(){
      vUv = uv;

      // base pos
      vec3 pos = position;

      // organic domain warping
      vec3 p = pos * 1.1;
      float t = uTime * 0.25;
      // smooth “breathing” that doesn’t rotate the mesh
      float warp1 = fbm(p + vec3(t, -t, t*0.5));
      float warp2 = snoise(p*2.0 + vec3(-t*0.7, t*0.9, t*0.2));
      float warp = warp1*0.25 + warp2*0.1;

      // scroll-velocity twist only when scrolling (cinematic inertia)
      float twist = uScrollVelocity * 0.6;
      float angle = pos.y * twist;
      mat2 R = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
      pos.xz = R * pos.xz;

      // displacement along normal for sculpted look
      float ridge = max(0.0, 1.0 - abs(snoise(p*1.5)));
      float disp = warp + ridge*0.15;
      vDist = disp;
      pos += normal * disp;

      vec4 world = modelMatrix * vec4(pos,1.0);
      vWorldPos = world.xyz;

      // send original normal (we’ll recompute better normal in fragment via derivatives)
      vNormal = normalize(normalMatrix * normal);

      gl_Position = projectionMatrix * viewMatrix * world;
    }
  `;

  // Fragment shader: Cook-Torrance-ish lighting, animated color gradients, env-ish reflection
  const fragmentShader = `
    precision highp float;

    varying vec2 vUv;
    varying vec3 vWorldPos;
    varying vec3 vNormal;
    varying float vDist;

    uniform float uTime;
    uniform float uScrollProgress;
    uniform float uSectionIndex;
    uniform vec2  uMouse;

    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    uniform vec3 uAccent;

    // palette
    ${paletteGLSL}

    // ACES-ish clamp
    float saturate(float x){ return clamp(x,0.0,1.0); }

    // Recompute geometric normal from derivatives for better shading on displaced surface
    vec3 normalFromDerivatives(vec3 p){
      vec3 dx = dFdx(p);
      vec3 dy = dFdy(p);
      return normalize(cross(dx,dy));
    }

    // Fresnel (Schlick)
    vec3 F_Schlick(float cosTheta, vec3 F0){
      return F0 + (1.0 - F0)*pow(1.0 - cosTheta, 5.0);
    }

    // GGX
    float D_GGX(float NdotH, float rough){
      float a = rough*rough;
      float a2 = a*a;
      float d = (NdotH*NdotH)*(a2 - 1.0) + 1.0;
      return a2 / (3.14159 * d * d);
    }

    float G_SchlickGGX(float NdotV, float rough){
      float r = rough + 1.0;
      float k = (r*r)/8.0;
      return NdotV / (NdotV*(1.0 - k) + k);
    }

    float G_Smith(float NdotV, float NdotL, float rough){
      return G_SchlickGGX(NdotV, rough) * G_SchlickGGX(NdotL, rough);
    }

    // Fake environment gradient (sky/ground)
    vec3 envGradient(vec3 r, vec3 skyA, vec3 skyB, vec3 ground){
      float h = r.y * 0.5 + 0.5;
      vec3 sky = mix(skyB, skyA, h);
      return mix(ground, sky, saturate(h*1.2));
    }

    // Domain-warped gradient parameter
    float gradParam(vec2 uv, float time){
      vec2 q = uv*2.0 - 1.0;
      q.x *= 1.2;
      float a = sin(q.x*2.5 + time*0.25);
      float b = cos(q.y*3.0 - time*0.2);
      return saturate(0.5 + 0.5*(a*0.6 + b*0.4));
    }

    void main(){
      // derive world-space normal for correct specular on displaced mesh
      vec3 N = normalFromDerivatives(vWorldPos);

      // view/light setup
      vec3 V = normalize(cameraPosition - vWorldPos);

      // three cinematic lights moving slowly (not rotating the mesh)
      float t = uTime*0.6;
      vec3 L1pos = vec3( 6.0*sin(t*0.7),  4.0,  6.0*cos(t*0.7));
      vec3 L2pos = vec3(-5.0*cos(t*0.5), -3.5, 5.0*sin(t*0.45));
      vec3 L3pos = vec3( 0.0,  6.0*sin(t*0.25), -6.0);

      vec3 L1 = normalize(L1pos - vWorldPos);
      vec3 L2 = normalize(L2pos - vWorldPos);
      vec3 L3 = normalize(L3pos - vWorldPos);

      // animated palette (cosine palette + section crossfade)
      float gp = gradParam(vUv, uTime) + vDist*0.6;
      float sectionMix = clamp(uSectionIndex/3.0, 0.0, 1.0);

      // Two palettes we blend between for a richer filmic feel
      vec3 palA = cosPalette(
        gp,
        vec3(0.55,0.55,0.58),
        vec3(0.45,0.35,0.35),
        vec3(0.95,0.80,0.70),
        vec3(0.00,0.35,0.55)
      );

      vec3 palB = cosPalette(
        gp + 0.15*sin(uTime*0.25),
        vec3(0.55,0.56,0.58),
        vec3(0.35,0.45,0.55),
        vec3(0.90,0.55,0.75),
        vec3(0.25,0.10,0.60)
      );

      vec3 baseAlbedo = mix(palA, palB, sectionMix);
      // bias toward your provided brand colors
      baseAlbedo = mix(baseAlbedo, uColor1, 0.15);
      baseAlbedo = mix(baseAlbedo, uColor2, 0.10);

      // Microfacet parameters
      float metallic = 0.25 + 0.15*sin(uTime*0.2 + gp*3.0);
      float rough    = clamp(0.18 + 0.12*sin(gp*6.283 + uTime*0.35), 0.06, 0.6);

      vec3 F0 = mix(vec3(0.04), baseAlbedo, metallic);

      // BRDF for each light
      vec3 H1 = normalize(V + L1);
      vec3 H2 = normalize(V + L2);
      vec3 H3 = normalize(V + L3);

      float NdotV = saturate(dot(N,V));
      float NdotL1= saturate(dot(N,L1));
      float NdotL2= saturate(dot(N,L2));
      float NdotL3= saturate(dot(N,L3));

      float NdotH1= saturate(dot(N,H1));
      float NdotH2= saturate(dot(N,H2));
      float NdotH3= saturate(dot(N,H3));

      float D1 = D_GGX(NdotH1, rough);
      float D2 = D_GGX(NdotH2, rough);
      float D3 = D_GGX(NdotH3, rough);

      float G1 = G_Smith(NdotV, NdotL1, rough);
      float G2 = G_Smith(NdotV, NdotL2, rough);
      float G3 = G_Smith(NdotV, NdotL3, rough);

      vec3  F1 = F_Schlick(saturate(dot(V,H1)), F0);
      vec3  F2 = F_Schlick(saturate(dot(V,H2)), F0);
      vec3  F3 = F_Schlick(saturate(dot(V,H3)), F0);

      vec3 spec1 = (D1*G1*F1) / max(4.0*NdotV*NdotL1, 0.001);
      vec3 spec2 = (D2*G2*F2) / max(4.0*NdotV*NdotL2, 0.001);
      vec3 spec3 = (D3*G3*F3) / max(4.0*NdotV*NdotL3, 0.001);

      vec3 kS = F_Schlick(NdotV, F0);
      vec3 kD = (vec3(1.0) - kS) * (1.0 - metallic);

      vec3 diffuse = baseAlbedo / 3.14159;

      // cinematic light colors
      vec3 c1 = vec3(1.0);
      vec3 c2 = mix(uColor3, vec3(0.9,0.95,1.0), 0.6);
      vec3 c3 = mix(uAccent, vec3(1.0,0.9,0.75), 0.5);

      vec3 direct =
        (kD*diffuse + spec1) * c1 * NdotL1 * 0.9 +
        (kD*diffuse + spec2) * c2 * NdotL2 * 0.6 +
        (kD*diffuse + spec3) * c3 * NdotL3 * 0.5;

      // fake environment reflection
      vec3 R = reflect(-V, N);
      vec3 env = envGradient(R,
        vec3(0.12,0.16,0.25),  // zenith
        vec3(0.04,0.06,0.10),  // horizon
        vec3(0.01,0.01,0.012)  // ground
      );
      vec3 Fenv = F_Schlick(saturate(dot(N,V)), F0);
      vec3 envSpec = Fenv * env * (1.0 - rough) * 0.6;

      // rim/iris accent
      float rim = pow(1.0 - saturate(dot(N,V)), 2.0);
      vec3 rimCol = mix(uAccent, uColor3, 0.4) * rim * 0.35;

      // glow from displacement
      vec3 glow = mix(uAccent, uColor3, 0.5) * abs(vDist) * 0.25;

      vec3 color = direct + envSpec + rimCol + glow;

      // subtle holographic shimmer
      float pattern = sin(vUv.x*40.0 + uTime) * sin(vUv.y*38.0 - uTime);
      color += pattern * 0.015;

      // mild exposure/gamma here; final look in post
      color = clamp(color, 0.0, 4.0);
      gl_FragColor = vec4(color, 1.0 - uScrollProgress*0.12);
    }
  `;

  // Cinematic post: ACES filmic + color temp/tint + grain + vignette + subtle CA + gentle bloom pass in pipeline
  const cinematicPostShader = {
    uniforms: {
      tDiffuse: { value: null },
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2() },
      uTemperature: { value: 0.08 }, // warm a touch
      uTint: { value: 0.02 },        // green-magenta
      uContrast: { value: 1.06 },
      uSaturation: { value: 1.05 },
      uVignette: { value: 0.35 },
      uAberration: { value: 0.0018 },
      uGrain: { value: 0.22 },
      uLetterbox: { value: 0.6 } // 0..0.2 bars
    },
    vertexShader: `
      varying vec2 vUv;
      void main(){
        vUv = uv;
        gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
      }
    `,
    fragmentShader: `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D tDiffuse;
      uniform float uTime;
      uniform vec2  uResolution;
      uniform float uTemperature, uTint, uContrast, uSaturation, uVignette, uAberration, uGrain, uLetterbox;

      float rand(vec2 co){ return fract(sin(dot(co, vec2(12.9898,78.233))) * 43758.5453); }

      vec3 aces(vec3 x){
        // ACES filmic approximation
        float a=2.51,b=0.03,c=2.43,d=0.59,e=0.14;
        return clamp((x*(a*x+b))/(x*(c*x+d)+e),0.0,1.0);
      }

      vec3 tempTint(vec3 c, float temp, float tint){
        // very lightweight temp/tint
        c.r += temp*0.2;
        c.b -= temp*0.2;
        c.g += tint*0.15;
        return c;
      }

      vec3 satContrast(vec3 c, float sat, float con){
        vec3 g = vec3(dot(c, vec3(0.299,0.587,0.114)));
        c = mix(g, c, sat);
        c = (c - 0.5)*con + 0.5;
        return c;
      }

      void main(){
        // subtle CA (direction from center)
        vec2 p = vUv - 0.5;
        vec2 dir = normalize(p + 1e-6);
        float dist = length(p);
        vec2 off = dir * uAberration * dist;

        float r = texture2D(tDiffuse, vUv + off).r;
        float g = texture2D(tDiffuse, vUv).g;
        float b = texture2D(tDiffuse, vUv - off).b;
        vec3 col = vec3(r,g,b);

        // grain
        float n = rand(vUv*vec2(uResolution.x, uResolution.y) + uTime*60.0) - 0.5;
        col += n * uGrain * 0.08;

        // grading
        col = tempTint(col, uTemperature, uTint);
        col = satContrast(col, uSaturation, uContrast);

        // vignette
        float vig = smoothstep(0.85, 0.2, dist);
        col *= mix(1.0, vig, uVignette);

        // letterbox bars
        float bar = smoothstep(uLetterbox, 0.0, abs(vUv.y - 0.5));
        col *= bar;

        // ACES + gamma
        col = aces(col);
        col = pow(col, vec3(1.0/2.2));

        gl_FragColor = vec4(col, 1.0);
      }
    `
  };

  // Initialize Three.js
  useEffect(() => {
    if (!canvasRef.current) return;

    let scene, camera, renderer, composer;
    let mesh;
    let clock = new THREE.Clock();
    let frameId;

    const init = () => {
      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
      camera.position.set(0, 0, 5);

      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
        alpha: true
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.0;
      renderer.outputEncoding = THREE.sRGBEncoding;

      // geometry with lots of facets for specular play
      const geometry = new THREE.IcosahedronGeometry(1.85, 5);

      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2(0.5, 0.5) },
          uScrollProgress: { value: 0 },
          uScrollVelocity: { value: 0 },
          uSectionT: { value: 0 },
          uSectionIndex: { value: 0 },
          uColor1: { value: new THREE.Color(colorPalette.primary) },
          uColor2: { value: new THREE.Color(colorPalette.secondary) },
          uColor3: { value: new THREE.Color(colorPalette.tertiary) },
          uAccent: { value: new THREE.Color(colorPalette.accent) }
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        side: THREE.DoubleSide
      });

      mesh = new THREE.Mesh(geometry, material);
      meshRef.current = mesh;
      scene.add(mesh);

      // Composer: Render -> Bloom -> CinematicPost
      composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));

      const bloom = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.7,   // strength
        0.35,  // radius
        0.92   // threshold
      );
      composer.addPass(bloom);

      const cinePass = new ShaderPass(cinematicPostShader);
      cinePass.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
      composer.addPass(cinePass);

      composerRef.current = composer;
      setIsLoaded(true);

      const animate = () => {
        frameId = requestAnimationFrame(animate);
        const t = clock.getElapsedTime();

        if (mesh) {
          // time & inputs
          mesh.material.uniforms.uTime.value = t;

          // smooth mouse
          mouseRef.current.sx += (mouseRef.current.x - mouseRef.current.sx) * 0.1;
          mouseRef.current.sy += (mouseRef.current.y - mouseRef.current.sy) * 0.1;
          mesh.material.uniforms.uMouse.value.set(mouseRef.current.sx, mouseRef.current.sy);

          // scroll uniforms
          mesh.material.uniforms.uScrollProgress.value = scrollRef.current.progress;
          mesh.material.uniforms.uScrollVelocity.value = scrollRef.current.velocity;

          // scroll-only rotation
          mesh.rotation.x = scrollRef.current.rotation.x;
          mesh.rotation.y = scrollRef.current.rotation.y;

          // idle breathing only when not scrolling (translation, not rotation)
          if (Math.abs(scrollRef.current.velocity) < 0.01) {
            mesh.position.y = Math.sin(t * 0.45) * 0.06;
          } else {
            mesh.position.y *= 0.9;
          }
        }

        // post uniforms
        const lastPass = composer.passes[composer.passes.length - 1];
        if (lastPass?.uniforms?.uTime) lastPass.uniforms.uTime.value = t;

        composer.render();
      };

      animate();

      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        composer.setSize(window.innerWidth, window.innerHeight);
        const lastPass = composer.passes[composer.passes.length - 1];
        if (lastPass?.uniforms?.uResolution) {
          lastPass.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
        }
      };
      window.addEventListener('resize', onResize);

      return () => {
        window.removeEventListener('resize', onResize);
        if (frameId) cancelAnimationFrame(frameId);
        geometry.dispose();
        material.dispose();
        renderer.dispose();
      };
    };

    init();
  }, [colorPalette]);

  // Scroll logic (rotation only; cinematic inertia; section color transitions)
  useEffect(() => {
    if (!isLoaded) return;

    let lastY = window.scrollY;
    let vel = 0;
    let velTimeout;

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        scrollRef.current.progress = self.progress;

        // velocity
        const y = window.scrollY;
        vel = (y - lastY) * 0.01;
        lastY = y;
        scrollRef.current.velocity = THREE.MathUtils.clamp(vel, -1, 1);

        // rotation mapping to progress (no time-based auto-rot)
        gsap.to(scrollRef.current.rotation, {
          x: self.progress * Math.PI * 3.0,
          y: self.progress * Math.PI * 4.5,
          duration: 0.3,
          ease: 'power2.out'
        });

        // decay velocity after stop
        clearTimeout(velTimeout);
        velTimeout = setTimeout(() => {
          gsap.to(scrollRef.current, { velocity: 0, duration: 0.5, ease: 'power2.out' });
        }, 120);

        // progress bar
        if (progressRef.current) {
          gsap.to(progressRef.current, { scaleY: self.progress, duration: 0.12 });
        }
      }
    });

    // Section enter -> palette morph
    sections.forEach((section, idx) => {
      const el = sectionsRef.current[idx];
      if (!el) return;

      // content in
      gsap.fromTo(
        el.querySelectorAll('.section-headline, .section-subheadline, .section-body'),
        { opacity: 0, y: 80, rotationX: -10 },
        {
          opacity: 1, y: 0, rotationX: 0, duration: 1,
          stagger: 0.15,
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            end: 'top 20%',
            scrub: 1
          }
        }
      );

      // shader palette crossfade
      ScrollTrigger.create({
        trigger: el,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => {
          setActiveSection(idx);
          if (meshRef.current) {
            gsap.to(meshRef.current.material.uniforms.uSectionIndex, {
              value: idx,
              duration: 1.2,
              ease: 'power2.inOut'
            });
            // kick a little morph pulse
            gsap.fromTo(
              meshRef.current.material.uniforms.uSectionT,
              { value: 0 },
              { value: 1, duration: 0.5, ease: 'power2.in', yoyo: true, repeat: 1 }
            );
          }
        },
        onEnterBack: () => {
          setActiveSection(idx);
          if (meshRef.current) {
            gsap.to(meshRef.current.material.uniforms.uSectionIndex, {
              value: idx,
              duration: 1.2,
              ease: 'power2.inOut'
            });
          }
        }
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [isLoaded, sections]);

  // Mouse smoothing (for glow/iris; no rotation)
  useEffect(() => {
    const onMove = (e) => {
      mouseRef.current.x = e.clientX / window.innerWidth;
      mouseRef.current.y = 1 - (e.clientY / window.innerHeight);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div ref={containerRef} className="scroll-hero">
      <canvas ref={canvasRef} className="hero-canvas" />

      <div className="scroll-progress">
        <div ref={progressRef} className="scroll-progress-bar" />
      </div>

      <nav className="nav-container">
        <div className="nav-inner">
          <div className="nav-logo">{logo}</div>
          <div className="nav-menu">
            {menuItems.map((item, i) => (
              <a
                key={i}
                href={`#${item.toLowerCase()}`}
                className={`nav-item ${activeSection === i ? 'active' : ''}`}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {sections.map((section, index) => (
        <section
          key={section.id}
          ref={el => sectionsRef.current[index] = el}
          className="hero-section"
          data-section={index}
        >
          <div className="section-content">
            <h1 className="section-headline">{section.headline}</h1>
            <h2 className="section-subheadline">{section.subheadline}</h2>
            <p className="section-body">{section.body}</p>
          </div>
        </section>
      ))}

      <div className={`loading-overlay ${isLoaded ? 'loaded' : ''}`}>
        <div className="loading-text">Loading</div>
      </div>
    </div>
  );
};

export default ScrollHero;

demo.tsx
import CinematicHeroSection from "@/components/ui/ethereal";

export default function DemoOne() {
  return <CinematicHeroSection />;
}

```

Install NPM dependencies:
```bash
gsap, three
```

Extend existing Tailwind 4 index.css with this code (or if project uses Tailwind 3, extend tailwind.config.js or globals.css):
```css
@import "tailwindcss";
@import "tw-animate-css";

:root {
  --scroll-progress: 0;
}


@keyframes pulse {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
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
aero-hero-3.tsx
import { cn } from "@/lib/utils";
import { useState } from "react";

export const Component = () => {
  const [count, setCount] = useState(0);

  return (
    <div className={cn("flex flex-col items-center gap-4 p-4 rounded-lg")}>
      <h1 className="text-2xl font-bold mb-2">Component Example</h1>
      <h2 className="text-xl font-semibold">{count}</h2>
      <div className="flex gap-2">
        <button onClick={() => setCount((prev) => prev - 1)}>-</button>
        <button onClick={() => setCount((prev) => prev + 1)}>+</button>
      </div>
    </div>
  );
};


demo.tsx
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative flex h-screen w-full items-center justify-center">
      <div className="absolute inset-0 z-10 size-full">
        <div className="grid w-full grid-cols-12 divide-x divide-white/20">
          <div className="col-span-1 h-screen" />
          <div className="col-span-3 h-screen" />
          <div className="col-span-4 h-screen" />
          <div className="col-span-3 h-screen" />
          <div className="col-span-1 h-screen" />
        </div>
      </div>
      <div
        className="absolute inset-0 bg-center bg-cover"
        style={{
          backgroundImage:
            "url(https://images.cnippet.dev/image/upload/v1770400411/img_14002.jpg)",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-20 max-w-5xl px-6 text-center text-white">
        <h1 className="text-center font-kanturmuy font-normal text-5xl text-white tracking-tight md:text-6xl lg:text-8xl">
          Sustainable Solutions for a Better Future
        </h1>

        <p className="mx-auto mb-8 max-w-2xl text-center font-light text-lg text-white/90 md:text-xl">
          Empowering businesses and communities to thrive in a low-carbon world
          through tailored clean energy solutions.
        </p>

        <Button className="group not-disabled:inset-shadow-none mx-auto flex cursor-pointer items-center justify-center gap-0 rounded-full border-none bg-transparent px-0 py-5 font-normal shadow-none hover:bg-transparent [:hover,[data-pressed]]:bg-transparent">
          <span className="rounded-full bg-[#e1fcad] px-6 py-3 text-black duration-500 ease-in-out group-hover:bg-[#122023] group-hover:text-[#e1fcad] group-hover:transition-colors">
            Start a Project
          </span>
          <div className="relative flex h-fit cursor-pointer items-center overflow-hidden rounded-full bg-[#e1fcad] p-5 text-black duration-500 ease-in-out group-hover:bg-[#122023] group-hover:text-[#e1fcad] group-hover:transition-colors">
            <ArrowUpRight className="absolute h-5 w-5 -translate-x-1/2 transition-all duration-500 ease-in-out group-hover:translate-x-10" />
            <ArrowUpRight className="absolute h-5 w-5 -translate-x-10 transition-all duration-500 ease-in-out group-hover:-translate-x-1/2" />
          </div>
        </Button>
      </div>
    </section>
  );
}

```

Copy-paste these files for dependencies:
```tsx
cnippet.dev/button
"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg border font-medium text-base outline-none transition-shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-64 sm:text-sm [&_svg:not([class*='opacity-'])]:opacity-80 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:-mx-0.5 [&_svg]:shrink-0",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "h-9 px-[calc(--spacing(3)-1px)] sm:h-8",
        icon: "size-9 sm:size-8",
        "icon-lg": "size-10 sm:size-9",
        "icon-sm": "size-8 sm:size-7",
        "icon-xl":
          "size-11 sm:size-10 [&_svg:not([class*='size-'])]:size-5 sm:[&_svg:not([class*='size-'])]:size-4.5",
        "icon-xs":
          "size-7 rounded-md before:rounded-[calc(var(--radius-md)-1px)] sm:size-6 not-in-data-[slot=input-group]:[&_svg:not([class*='size-'])]:size-4 sm:not-in-data-[slot=input-group]:[&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-10 px-[calc(--spacing(3.5)-1px)] sm:h-9",
        sm: "h-8 gap-1.5 px-[calc(--spacing(2.5)-1px)] sm:h-7",
        xl: "h-11 px-[calc(--spacing(4)-1px)] text-lg sm:h-10 sm:text-base [&_svg:not([class*='size-'])]:size-5 sm:[&_svg:not([class*='size-'])]:size-4.5",
        xs: "h-7 gap-1 rounded-md px-[calc(--spacing(2)-1px)] text-sm before:rounded-[calc(var(--radius-md)-1px)] sm:h-6 sm:text-xs [&_svg:not([class*='size-'])]:size-4 sm:[&_svg:not([class*='size-'])]:size-3.5",
      },
      variant: {
        default:
          "not-disabled:inset-shadow-[0_1px_--theme(--color-white/16%)] border-primary bg-primary text-primary-foreground shadow-primary/24 shadow-xs [:active,[data-pressed]]:inset-shadow-[0_1px_--theme(--color-black/8%)] [:disabled,:active,[data-pressed]]:shadow-none [:hover,[data-pressed]]:bg-primary/90",
        destructive:
          "not-disabled:inset-shadow-[0_1px_--theme(--color-white/16%)] border-destructive bg-destructive text-white shadow-destructive/24 shadow-xs [:active,[data-pressed]]:inset-shadow-[0_1px_--theme(--color-black/8%)] [:disabled,:active,[data-pressed]]:shadow-none [:hover,[data-pressed]]:bg-destructive/90",
        "destructive-outline":
          "border-input bg-transparent not-dark:bg-clip-padding text-destructive-foreground shadow-xs/5 not-disabled:not-active:not-data-pressed:before:shadow-[0_1px_--theme(--color-black/6%)] dark:bg-input/32 dark:not-disabled:before:shadow-[0_-1px_--theme(--color-white/2%)] dark:not-disabled:not-active:not-data-pressed:before:shadow-[0_-1px_--theme(--color-white/6%)] [:disabled,:active,[data-pressed]]:shadow-none [:hover,[data-pressed]]:border-destructive/32 [:hover,[data-pressed]]:bg-destructive/4",
        ghost:
          "border-transparent text-foreground data-pressed:bg-accent [:hover,[data-pressed]]:bg-accent",
        link: "border-transparent underline-offset-4 [:hover,[data-pressed]]:underline",
        outline:
          "border-input bg-background not-dark:bg-clip-padding text-foreground shadow-xs/5 not-disabled:not-active:not-data-pressed:before:shadow-[0_1px_--theme(--color-black/6%)] dark:bg-input/32 dark:not-disabled:before:shadow-[0_-1px_--theme(--color-white/2%)] dark:not-disabled:not-active:not-data-pressed:before:shadow-[0_-1px_--theme(--color-white/6%)] [:disabled,:active,[data-pressed]]:shadow-none [:hover,[data-pressed]]:bg-accent/50 dark:[:hover,[data-pressed]]:bg-input/64",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [:active,[data-pressed]]:bg-secondary/80 [:hover,[data-pressed]]:bg-secondary/90",
      },
    },
  },
);

interface ButtonProps extends useRender.ComponentProps<"button"> {
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
}

function Button({ className, variant, size, render, ...props }: ButtonProps) {
  const typeValue: React.ButtonHTMLAttributes<HTMLButtonElement>["type"] =
    render ? undefined : "button";

  const defaultProps = {
    className: cn(buttonVariants({ className, size, variant })),
    "data-slot": "button",
    type: typeValue,
  };

  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(defaultProps, props),
    render,
  });
}

export { Button, buttonVariants };

```

Install NPM dependencies:
```bash
@base-ui/react, class-variance-authority
```

Extend existing Tailwind 4 index.css with this code (or if project uses Tailwind 3, extend tailwind.config.js or globals.css):
```css
@import "tailwindcss";
@import "tw-animate-css";

@theme inline {
  --color-destructive-foreground: var(--destructive-foreground);
  --color-info: var(--info);
  --color-info-foreground: var(--info-foreground);
  --color-success: var(--success);
  --color-success-foreground: var(--success-foreground);
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
  --ring: var(----ring);
  --input: var(----input);
  --border: var(----border);
  --warning-foreground: var(----warning-foreground);
  --warning: var(----warning);
  --success-foreground: var(----success-foreground);
  --success: var(----success);
  --info-foreground: var(----info-foreground);
  --info: var(----info);
  --destructive-foreground: var(----destructive-foreground);
  --destructive: var(----destructive);
  --accent-foreground: var(----accent-foreground);
  --accent: var(----accent);
  --muted-foreground: var(----muted-foreground);
  --muted: var(----muted);
  --secondary-foreground: var(----secondary-foreground);
  --primary-foreground: var(----primary-foreground);
  --popover-foreground: var(----popover-foreground);
  --popover: var(----popover);
  --card-foreground: var(----card-foreground);
  --card: var(----card);
  --foreground: var(----foreground);
  --background: var(----background);
}

:root {
  --destructive-foreground: var(--color-red-700);
  --info: var(--color-blue-500);
  --info-foreground: var(--color-blue-700);
  --success: var(--color-emerald-500);
  --success-foreground: var(--color-emerald-700);
  --warning: var(--color-amber-500);
  --warning-foreground: var(--color-amber-700);
}

.dark {
  --destructive-foreground: var(--color-red-400);
  --info: var(--color-blue-500);
  --info-foreground: var(--color-blue-400);
  --success: var(--color-emerald-500);
  --success-foreground: var(--color-emerald-400);
  --warning: var(--color-amber-500);
  --warning-foreground: var(--color-amber-400);
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
growth-hero-section.tsx
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils"; // Assuming you have a utility for class names

// Prop definition for the component
interface GrowthHeroSectionProps {
  /** The main title, can include <br /> for line breaks */
  title: React.ReactNode;
  /** The first paragraph of description text */
  description1: string;
  /** The second paragraph of description text */
  description2: string;
  /** An array of 4 image source URLs for the growth animation */
  images: [string, string, string, string];
  /** Call-to-action details */
  cta: {
    text: string;
    href: string;
  };
  /** Optional brand name to display at the top */
  brandName?: string;
  /** Optional className to override styles */
  className?: string;
}

/**
 * A responsive hero section with an animated image gallery.
 * Uses shadcn's theme variables for light/dark mode support.
 */
export const GrowthHeroSection = ({
  title,
  description1,
  description2,
  images,
  cta,
  brandName,
  className,
}: GrowthHeroSectionProps) => {

  // Animation variants for the container to orchestrate children animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Each child will animate 0.2s after the previous one
        delayChildren: 0.3,
      },
    },
  };

  // Animation variants for each individual item (image, text)
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section
      className={cn(
        "w-full bg-background text-foreground antialiased",
        className
      )}
    >
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 text-center">
        {/* Optional Brand Name */}
        {brandName && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-8 text-lg font-medium tracking-wide text-muted-foreground"
          >
            {brandName}
          </motion.div>
        )}

        {/* Animated Images */}
        <motion.div
          className="mb-8 flex items-end justify-center space-x-4 sm:space-x-6 md:space-x-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          aria-label="Illustration of a plant growing in four stages"
        >
          {images.map((src, index) => (
            <motion.div key={index} variants={itemVariants}>
              <img
                src={src}
                alt={`Plant growth stage ${index + 1}`}
                className="h-auto max-h-[120px] w-full"
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Main Title */}
        <motion.h1
          className="mb-6 max-w-3xl text-3xl font-medium tracking-tight text-foreground md:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {title}
        </motion.h1>
        
        {/* Description Paragraphs */}
        <motion.div
          className="max-w-3xl space-y-4 text-base text-muted-foreground md:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <p>{description1}</p>
          <p>{description2}</p>
        </motion.div>

        {/* Call to Action Link */}
        <motion.a
          href={cta.href}
          className="mt-12 text-sm font-medium text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          aria-label={cta.text}
        >
          {cta.text}
        </motion.a>
      </div>
    </section>
  );
};

demo.tsx
import { GrowthHeroSection } from "@/components/ui/growth-hero-section"; // Adjust the import path

export default function GrowthHeroSectionDemo() {
  // Props are defined here and passed into the component for reusability
  const heroData = {
    brandName: "Bliss",
    title: (
      <>
        Accelerating The Builders
        <br />
        Of The Next Decade
      </>
    ),
    description1:
      "We're A Venture Capital Firm Focused On Early-Stage Startups With Disruptive Potential. With Deep Operational Experience And A Founder-First Approach, We Partner With Visionary Teams To Build Tomorrow's Category Leaders.",
    description2:
      "We Invest In Startups Solving Real-World Problems Through Technology, Design, And Grit. Our Global Network, Operational Support, And Long-Term Mindset Help Founders Move Fast And Build Things That Matter.",
    images: [
      "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-v9C8luPQsZdmebTqL8qWFnHq9MxOjA.png&w=320&q=75",
      "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-stQRgfBCiMg8IA6Bab2Ps4i8JGwdSY.png&w=320&q=75",
      "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-GpHZV8hHsDz012a8YoUSZPF2LKqIfV.png&w=320&q=75",
      "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-vhtQnzOAq2TG349yFiuZGtvFxPGfzU.png&w=320&q=75",
    ] as [string, string, string, string],
    cta: {
      text: "Apply To Join A Community",
      href: "#",
    },
  };

  return (
    <div className="w-full bg-background">
      <GrowthHeroSection {...heroData} />
    </div>
  );
}
```

Install NPM dependencies:
```bash
framer-motion
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
growth-hero-section.tsx
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils"; // Assuming you have a utility for class names

// Prop definition for the component
interface GrowthHeroSectionProps {
  /** The main title, can include <br /> for line breaks */
  title: React.ReactNode;
  /** The first paragraph of description text */
  description1: string;
  /** The second paragraph of description text */
  description2: string;
  /** An array of 4 image source URLs for the growth animation */
  images: [string, string, string, string];
  /** Call-to-action details */
  cta: {
    text: string;
    href: string;
  };
  /** Optional brand name to display at the top */
  brandName?: string;
  /** Optional className to override styles */
  className?: string;
}

/**
 * A responsive hero section with an animated image gallery.
 * Uses shadcn's theme variables for light/dark mode support.
 */
export const GrowthHeroSection = ({
  title,
  description1,
  description2,
  images,
  cta,
  brandName,
  className,
}: GrowthHeroSectionProps) => {

  // Animation variants for the container to orchestrate children animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Each child will animate 0.2s after the previous one
        delayChildren: 0.3,
      },
    },
  };

  // Animation variants for each individual item (image, text)
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section
      className={cn(
        "w-full bg-background text-foreground antialiased",
        className
      )}
    >
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 text-center">
        {/* Optional Brand Name */}
        {brandName && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-8 text-lg font-medium tracking-wide text-muted-foreground"
          >
            {brandName}
          </motion.div>
        )}

        {/* Animated Images */}
        <motion.div
          className="mb-8 flex items-end justify-center space-x-4 sm:space-x-6 md:space-x-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          aria-label="Illustration of a plant growing in four stages"
        >
          {images.map((src, index) => (
            <motion.div key={index} variants={itemVariants}>
              <img
                src={src}
                alt={`Plant growth stage ${index + 1}`}
                className="h-auto max-h-[120px] w-full"
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Main Title */}
        <motion.h1
          className="mb-6 max-w-3xl text-3xl font-medium tracking-tight text-foreground md:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {title}
        </motion.h1>
        
        {/* Description Paragraphs */}
        <motion.div
          className="max-w-3xl space-y-4 text-base text-muted-foreground md:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <p>{description1}</p>
          <p>{description2}</p>
        </motion.div>

        {/* Call to Action Link */}
        <motion.a
          href={cta.href}
          className="mt-12 text-sm font-medium text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          aria-label={cta.text}
        >
          {cta.text}
        </motion.a>
      </div>
    </section>
  );
};

demo.tsx
import { GrowthHeroSection } from "@/components/ui/growth-hero-section"; // Adjust the import path

export default function GrowthHeroSectionDemo() {
  // Props are defined here and passed into the component for reusability
  const heroData = {
    brandName: "Bliss",
    title: (
      <>
        Accelerating The Builders
        <br />
        Of The Next Decade
      </>
    ),
    description1:
      "We're A Venture Capital Firm Focused On Early-Stage Startups With Disruptive Potential. With Deep Operational Experience And A Founder-First Approach, We Partner With Visionary Teams To Build Tomorrow's Category Leaders.",
    description2:
      "We Invest In Startups Solving Real-World Problems Through Technology, Design, And Grit. Our Global Network, Operational Support, And Long-Term Mindset Help Founders Move Fast And Build Things That Matter.",
    images: [
      "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-v9C8luPQsZdmebTqL8qWFnHq9MxOjA.png&w=320&q=75",
      "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-stQRgfBCiMg8IA6Bab2Ps4i8JGwdSY.png&w=320&q=75",
      "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-GpHZV8hHsDz012a8YoUSZPF2LKqIfV.png&w=320&q=75",
      "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-vhtQnzOAq2TG349yFiuZGtvFxPGfzU.png&w=320&q=75",
    ] as [string, string, string, string],
    cta: {
      text: "Apply To Join A Community",
      href: "#",
    },
  };

  return (
    <div className="w-full bg-background">
      <GrowthHeroSection {...heroData} />
    </div>
  );
}
```

Install NPM dependencies:
```bash
framer-motion
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
hero-section-enterprise-ready-landing-page-hero-with-dual-ctas.tsx
import React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // Assumes shadcn's utility for class merging
import { ArrowRight, Zap } from 'lucide-react';

// Define the type for the CTA buttons
export interface CTAButton {
  /** The text displayed on the button. */
  label: string;
  /** The action to perform when the button is clicked. */
  onClick: () => void;
  /** Whether the button should be disabled. */
  disabled?: boolean;
}

// --- 📦 API (Props) Definition ---
export interface HeroSectionProps {
  /** The main, attention-grabbing heading. */
  title: React.ReactNode;
  /** The supporting paragraph explaining the value proposition. */
  subtitle: React.ReactNode;
  /** Configuration for the primary call-to-action button. */
  primaryCta: CTAButton;
  /** Configuration for the secondary (outline/ghost) call-to-action button. */
  secondaryCta: CTAButton;
  /** Optional class name for the main container. */
  className?: string;
}

/**
 * A professional, enterprise-ready Hero Section for a landing page.
 * Features a strong headline, supporting text, and dual CTAs with a monochrome, theme-aware design.
 */
const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  className,
}) => {
  return (
    <section
      className={cn(
        "flex flex-col items-center justify-center min-h-[50vh] text-center p-4 sm:p-8 md:p-16 bg-background text-foreground",
        className
      )}
      role="region"
      aria-label="Product Hero Section"
    >
      <div className="max-w-4xl mx-auto">
        {/* Optional: Simple Feature Highlight Badge */}
        <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-6 text-muted-foreground bg-muted hover:bg-muted/70 transition-colors duration-150">
          <Zap className="h-3 w-3 mr-1.5 text-primary" aria-hidden="true" />
          Enterprise Grade Tools
        </div>

        {/* Primary Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tighter mb-4 text-foreground">
          {title}
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 font-normal">
          {subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="flex justify-center gap-3 sm:gap-4 flex-wrap">
          <Button
            size="lg"
            onClick={primaryCta.onClick}
            disabled={primaryCta.disabled}
            className="text-base font-semibold transition-shadow duration-200 shadow-md hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label={primaryCta.label}
          >
            {primaryCta.label}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={secondaryCta.onClick}
            disabled={secondaryCta.disabled}
            className="text-base font-semibold transition-colors duration-150 hover:bg-accent hover:text-accent-foreground border-border focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label={secondaryCta.label}
          >
            {secondaryCta.label}
          </Button>
        </div>
        
        {/* Placeholder for Trust/Social Proof (optional below CTAs) */}
        <p className="mt-8 text-xs text-muted-foreground">
            Trusted by teams at Fortune 500 companies.
        </p>
      </div>
    </section>
  );
};


// --- Example Usage Snippet ---

const ExampleUsage = () => {
  const handlePrimaryClick = () => console.log("Primary CTA clicked: Start Free Trial");
  const handleSecondaryClick = () => console.log("Secondary CTA clicked: View Documentation");

  return (
    <HeroSection
      title={
        <>
          The Modern Stack for {" "}
          <span className="text-primary/90 dark:text-primary">
            Data Orchestration
          </span>
        </>
      }
      subtitle="Seamlessly connect, process, and deploy your business data with a single, powerful, and unified platform built for scale and efficiency."
      primaryCta={{
        label: "Start Free Trial",
        onClick: handlePrimaryClick,
      }}
      secondaryCta={{
        label: "View Documentation",
        onClick: handleSecondaryClick,
      }}
      className="border-b"
    />
  );
};

export default ExampleUsage;

demo.tsx
import ExampleUsage from "@/components/ui/hero-section-enterprise-ready-landing-page-hero-with-dual-ctas";

export default function DemoOne() {
  return <ExampleUsage />;
}

```

Copy-paste these files for dependencies:
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

Install NPM dependencies:
```bash
lucide-react, @radix-ui/react-slot, class-variance-authority
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
