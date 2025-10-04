"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname?.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="border-b border-background-secondary">
      <nav className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold hover:text-accent-blue transition-colors font-montserrat tracking-tight">
            Sam Swerczek
          </Link>

          <div className="flex gap-8">
            <Link
              href="/"
              className={`hover:text-accent-blue transition-colors ${
                isActive("/") && pathname === "/" ? "text-accent-blue" : "text-text-secondary"
              }`}
            >
              Home
            </Link>
            <Link
              href="/music"
              className={`hover:text-accent-blue transition-colors ${
                isActive("/music") ? "text-accent-blue" : "text-text-secondary"
              }`}
            >
              Music
            </Link>
            <Link
              href="/blog"
              className={`hover:text-accent-blue transition-colors ${
                isActive("/blog") ? "text-accent-blue" : "text-text-secondary"
              }`}
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className={`hover:text-accent-blue transition-colors ${
                isActive("/contact") ? "text-accent-blue" : "text-text-secondary"
              }`}
            >
              Contact
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
