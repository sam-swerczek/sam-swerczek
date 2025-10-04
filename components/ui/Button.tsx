import Link from "next/link";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "accent";
  size?: "sm" | "md" | "lg";
  className?: string;
  target?: string;
  rel?: string;
}

export default function Button({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  target,
  rel,
}: ButtonProps) {
  const baseStyles = "group relative font-semibold rounded-lg transition-all duration-300 inline-flex items-center justify-center overflow-hidden transform hover:scale-105";

  const variantStyles = {
    primary: "bg-gradient-to-r from-accent-blue to-accent-teal text-white hover:shadow-[0_0_30px_rgba(74,158,255,0.5)] hover:from-accent-teal hover:to-accent-blue",
    secondary: "border-2 border-accent-gold text-accent-gold hover:bg-accent-gold hover:text-background-primary hover:shadow-[0_0_30px_rgba(212,165,116,0.5)]",
    accent: "bg-accent-gold hover:bg-accent-gold/90 text-background-primary shadow-lg hover:shadow-xl hover:scale-105",
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  const content = (
    <>
      {/* Shine effect on hover */}
      <span className="absolute inset-0 w-0 bg-white/20 transition-all duration-500 ease-out group-hover:w-full skew-x-12 -translate-x-full group-hover:translate-x-full"></span>
      <span className="relative z-10">{children}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={combinedStyles} target={target} rel={rel}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={combinedStyles}>
      {content}
    </button>
  );
}
