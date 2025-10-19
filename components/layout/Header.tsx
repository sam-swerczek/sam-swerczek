import Link from "next/link";
import Image from "next/image";
import { getSiteConfig } from "@/lib/supabase/queries";
import HeaderNav from "./HeaderNav";

export default async function Header() {
  const generalConfig = await getSiteConfig('general');
  const heroImageUrl = generalConfig.find(c => c.key === 'hero_image_url')?.value;

  return (
    <header className="relative border-b border-background-secondary">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-accent-blue/5 via-accent-teal/5 to-transparent opacity-50 -z-10" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/10 rounded-full blur-3xl -translate-y-32 translate-x-32 -z-10" />

      <nav className="relative container mx-auto px-4 py-4 md:py-5 lg:py-6">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            {/* Fixed-width container for profile image - 40px */}
            <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
              {heroImageUrl && (
                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-accent-blue/30 group-hover:border-accent-blue/60 transition-colors">
                  <Image
                    src={heroImageUrl}
                    alt="Sam Swerczek"
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-bold group-hover:text-accent-blue transition-colors font-montserrat tracking-tight">
                Sam Swerczek
              </span>
              <span className="hidden sm:block text-[10px] md:text-xs text-text-secondary mt-0.5">
                Software Engineer & Musician
              </span>
            </div>
          </Link>

          <HeaderNav />
        </div>
      </nav>
    </header>
  );
}
