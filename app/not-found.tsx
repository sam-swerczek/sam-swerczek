"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Countdown timer
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Redirect to home when countdown reaches 0
      router.push("/");
    }
  }, [countdown, router]);

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Floating orbs for visual interest - matching site style */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent-blue/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-teal/10 rounded-full blur-3xl animate-float-delayed"></div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* 404 Heading */}
        <h1 className="text-8xl md:text-9xl font-bold text-accent-blue mb-6 font-montserrat tracking-tight">
          404
        </h1>

        {/* Error Message */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-6 font-montserrat tracking-tight">
          Page Not Found
        </h2>

        <p className="text-lg md:text-xl text-text-secondary leading-relaxed mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Countdown and redirect message */}
        <p className="text-base md:text-lg text-text-secondary mb-10">
          Redirecting to home page in{" "}
          <span className="text-accent-blue font-semibold">{countdown}</span>{" "}
          {countdown === 1 ? "second" : "seconds"}...
        </p>

        {/* Manual link - matching hero section button style */}
        <Link
          href="/"
          className="group inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-transparent border-2 border-accent-blue/30 hover:border-accent-blue/60 text-text-primary rounded-lg transition-all duration-300"
        >
          <svg className="w-5 h-5 text-accent-blue/70 group-hover:text-accent-blue transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="font-medium">Return to Home</span>
        </Link>
      </div>
    </div>
  );
}
