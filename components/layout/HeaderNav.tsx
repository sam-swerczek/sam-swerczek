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
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Panel - Right Slide-out */}
      <div
        ref={mobileMenuRef}
        id="mobile-menu"
        className={`fixed top-0 right-0 bottom-0 w-[320px] max-w-[85vw] bg-background-secondary border-l border-background-primary z-50 md:hidden transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0 animate-slide-in-from-right' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        {/* Close button inside panel */}
        <div className="flex justify-end p-4 border-b border-background-primary">
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 text-text-secondary hover:text-accent-blue transition-colors"
            aria-label="Close menu"
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            <MenuIcon isOpen={true} className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Links with Staggered Animation */}
        <nav className="flex flex-col p-6 gap-2">
          {NAV_LINKS.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              className={`
                px-4 py-3 rounded-lg transition-all
                hover:bg-background-primary/50
                ${isActive(link.href)
                  ? 'text-accent-blue bg-background-primary/30 border-l-4 border-accent-blue'
                  : 'text-text-secondary border-l-4 border-transparent'
                }
                animate-slide-in-from-top-2
              `}
              style={{
                animationDelay: `${100 + index * 50}ms`,
                animationFillMode: 'backwards',
                minHeight: '44px',
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
