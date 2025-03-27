"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export const BackgroundGradientAnimation = ({
  gradientBackgroundStart = "rgb(108, 0, 162)",
  gradientBackgroundEnd = "rgb(0, 17, 82)",
  firstColor = "18, 113, 255",
  secondColor = "221, 74, 255",
  thirdColor = "100, 220, 255",
  fourthColor = "200, 50, 50",
  fifthColor = "180, 180, 50",
  pointerColor = "140, 100, 255",
  size = "80%",
  blendingValue = "hard-light",
  children,
  className,
  interactive = true,
  containerClassName,
}: {
  gradientBackgroundStart?: string;
  gradientBackgroundEnd?: string;
  firstColor?: string;
  secondColor?: string;
  thirdColor?: string;
  fourthColor?: string;
  fifthColor?: string;
  pointerColor?: string;
  size?: string;
  blendingValue?: string;
  children?: React.ReactNode;
  className?: string;
  interactive?: boolean;
  containerClassName?: string;
}) => {
  const interactiveRef = useRef<HTMLDivElement>(null);
  const curXRef = useRef(0);
  const curYRef = useRef(0);

  const [tgX, setTgX] = useState(0);
  const [tgY, setTgY] = useState(0);
  
  useEffect(() => {
    document.body.style.setProperty(
      "--gradient-background-start",
      gradientBackgroundStart
    );
    document.body.style.setProperty(
      "--gradient-background-end",
      gradientBackgroundEnd
    );
    document.body.style.setProperty("--first-color", firstColor);
    document.body.style.setProperty("--second-color", secondColor);
    document.body.style.setProperty("--third-color", thirdColor);
    document.body.style.setProperty("--fourth-color", fourthColor);
    document.body.style.setProperty("--fifth-color", fifthColor);
    document.body.style.setProperty("--pointer-color", pointerColor);
    document.body.style.setProperty("--size", size);
    document.body.style.setProperty("--blending-value", blendingValue);
  }, [gradientBackgroundStart, gradientBackgroundEnd, firstColor, secondColor, thirdColor, fourthColor, fifthColor, pointerColor, size, blendingValue]);

  useEffect(() => {
    function move() {
      if (!interactive) return;
      curXRef.current = curXRef.current + (tgX - curXRef.current) / 20;
      curYRef.current = curYRef.current + (tgY - curYRef.current) / 20;
      if (interactiveRef.current) {
        interactiveRef.current.style.transform = `translate(${Math.round(
          curXRef.current
        )}px, ${Math.round(curYRef.current)}px)`;
      }
    }

    move();

    const interval = setInterval(move, 1000 / 60);

    return () => clearInterval(interval);
  }, [tgX, tgY, interactive]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setTgX(event.clientX - rect.left);
    setTgY(event.clientY - rect.top);
  };

  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    setIsSafari(/^((?!chrome|android).)*safari/i.test(navigator.userAgent));
  }, []);

  return (
    <div
      className={cn(
        "h-screen w-screen relative overflow-hidden top-0 left-0 bg-[linear-gradient(40deg,var(--gradient-background-start),var(--gradient-background-end))]",
        containerClassName
      )}
      style={{
        backgroundImage: isSafari
          ? "none"
          : "linear-gradient(40deg, var(--gradient-background-start), var(--gradient-background-end))",
      }}
    >
      <svg className="hidden">
        <defs>
          <filter id="blur">
            <feGaussianBlur stdDeviation="40" />
          </filter>
        </defs>
      </svg>
      <div
        className={cn(
          "relative [--x:0px] [--y:0px] [--size:80%] h-full w-full",
          className
        )}
        onMouseMove={handleMouseMove}
      >
        <div
          ref={interactiveRef}
          className="absolute top-0 left-0 h-full w-full"
          style={{
            filter: "url(#blur)",
            transform: "translate(var(--x), var(--y))",
          }}
        >
          <div
            className="absolute [background:radial-gradient(circle_at_center,_rgba(var(--first-color),_0.8)_0,_rgba(var(--first-color),_0)_50%)_no-repeat]"
            style={{
              top: "0%",
              left: "0%",
              width: "100%",
              height: "100%",
              transform: "translate(-25%, -25%)",
            }}
          ></div>
          <div
            className="absolute [background:radial-gradient(circle_at_center,_rgba(var(--second-color),_0.8)_0,_rgba(var(--second-color),_0)_50%)_no-repeat]"
            style={{
              top: "0%",
              left: "100%",
              width: "100%",
              height: "100%",
              transform: "translate(-75%, -25%)",
            }}
          ></div>
          <div
            className="absolute [background:radial-gradient(circle_at_center,_rgba(var(--third-color),_0.8)_0,_rgba(var(--third-color),_0)_50%)_no-repeat]"
            style={{
              top: "100%",
              left: "100%",
              width: "100%",
              height: "100%",
              transform: "translate(-75%, -75%)",
            }}
          ></div>
          <div
            className="absolute [background:radial-gradient(circle_at_center,_rgba(var(--fourth-color),_0.8)_0,_rgba(var(--fourth-color),_0)_50%)_no-repeat]"
            style={{
              top: "100%",
              left: "0%",
              width: "100%",
              height: "100%",
              transform: "translate(-25%, -75%)",
            }}
          ></div>
          <div
            className="absolute [background:radial-gradient(circle_at_center,_rgba(var(--fifth-color),_0.8)_0,_rgba(var(--fifth-color),_0)_50%)_no-repeat]"
            style={{
              top: "50%",
              left: "50%",
              width: "100%",
              height: "100%",
              transform: "translate(-50%, -50%)",
            }}
          ></div>
        </div>
        <div className="absolute top-0 left-0 h-full w-full">{children}</div>
      </div>
    </div>
  );
};