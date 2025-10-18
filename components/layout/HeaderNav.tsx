"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MenuIcon } from "@/components/ui/icons";

interface NavLink {
  href: string;
  label: string;
}

const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/music", label: "Music" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

// Icon helper function for route-specific icons
const getIconForRoute = (href: string) => {
  const iconClass = "w-5 h-5";

  switch(href) {
    case '/':
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      );
    case '/music':
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      );
    case '/blog':
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      );
    case '/contact':
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    default:
      return null;
  }
};

export default function HeaderNav() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const hamburgerButtonRef = useRef<HTMLButtonElement>(null);

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname?.startsWith(path)) return true;
    return false;
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Body scroll lock when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Focus trap and keyboard navigation
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Close on Escape key
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
        hamburgerButtonRef.current?.focus();
        return;
      }

      // Focus trap
      if (e.key === "Tab") {
        const focusableElements = mobileMenuRef.current?.querySelectorAll(
          'a[href], button:not([disabled])'
        );
        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node) &&
        !hamburgerButtonRef.current?.contains(e.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Desktop Navigation - hidden on mobile, visible from md breakpoint */}
      <div className="hidden md:flex gap-6 lg:gap-8">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`hover:text-accent-blue transition-colors ${
              isActive(link.href) ? "text-accent-blue" : "text-text-secondary"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Mobile Hamburger Button - visible on mobile, hidden from md breakpoint */}
      <button
        ref={hamburgerButtonRef}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden p-2 -mr-2 text-text-secondary hover:text-accent-blue transition-colors"
        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        aria-expanded={isMobileMenuOpen}
        aria-controls="mobile-menu"
        style={{ minWidth: '44px', minHeight: '44px' }}
      >
        <MenuIcon isOpen={isMobileMenuOpen} className="w-6 h-6" />
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 md:hidden animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Panel - Right Slide-out */}
      <div
        ref={mobileMenuRef}
        id="mobile-menu"
        className={`fixed top-0 right-0 bottom-0 w-[360px] max-w-[90vw] bg-gradient-to-b from-background-secondary via-background-secondary to-background-secondary/95 shadow-[-8px_0_24px_0_rgba(0,0,0,0.3)] border-l border-white/5 z-50 md:hidden transition-transform duration-250 ease-out ${
          isMobileMenuOpen ? 'translate-x-0 animate-slide-in-from-right' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        {/* Header with Menu label and close button */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <span className="text-text-primary font-medium tracking-wide">Menu</span>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="group p-2 text-text-secondary hover:text-accent-blue hover:bg-background-primary/30 rounded-lg transition-all"
            aria-label="Close menu"
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            {/* X icon with rotation animation */}
            <svg
              className="w-6 h-6 group-hover:rotate-90 transition-transform duration-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Links with Staggered Animation */}
        <nav className="flex flex-col px-6 py-4 gap-1.5">
          {NAV_LINKS.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              className={`
                group relative flex items-center gap-3 px-5 py-4 rounded-xl transition-all
                active:scale-[0.98]
                ${isActive(link.href)
                  ? 'text-accent-blue bg-accent-blue/20'
                  : 'text-text-secondary hover:text-text-primary hover:bg-background-primary/40 active:bg-background-primary/60'
                }
                animate-slide-in-from-top-2
              `}
              style={{
                animationDelay: `${80 + index * 40}ms`,
                animationFillMode: 'backwards',
                minHeight: '52px',
              }}
              aria-current={isActive(link.href) ? 'page' : undefined}
            >
              {/* Icon */}
              <span className={`w-5 h-5 ${isActive(link.href) ? 'text-accent-blue' : 'text-text-secondary group-hover:text-accent-blue'} transition-colors`}>
                {getIconForRoute(link.href)}
              </span>

              {/* Label */}
              <span className="font-medium text-[15px] tracking-wide">
                {link.label}
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
