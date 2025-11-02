import Image from "next/image";
import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import { MessageIcon } from "@/components/ui/icons";

interface ConnectSectionProps {
  contactImageUrl?: string;
}

export default function ConnectSection({ contactImageUrl }: ConnectSectionProps) {
  return (
    <section className="relative py-12 md:py-16 bg-background-primary overflow-hidden">
      {/* Background gradient matching hero section bottom - navy left to orange right */}
      <div className="absolute inset-0 bg-gradient-to-r from-background-navy via-[rgb(21,23,25)] to-background-primary/95" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-accent-gold/8" />

      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <SectionHeader
            title="Connect With Me"
            subtitle="Let's work together on your next project or event"
          />

          <div className="flex flex-col items-center gap-6">
            {/* Contact Image */}
            {contactImageUrl && (
              <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-accent-blue/30 shadow-2xl">
                <Image
                  src={contactImageUrl}
                  alt="Sam Swerczek"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 192px, 256px"
                />
              </div>
            )}

            {/* Get in Touch Button - matching hero section style */}
            <Link
              href="/contact"
              className="group w-auto px-6 py-3 bg-transparent border border-text-secondary/20 hover:border-text-secondary/40 text-text-primary rounded-lg transition-all duration-300 inline-flex items-center justify-center"
            >
              <span className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-full bg-background-secondary/50 border border-accent-gold/30 group-hover:border-accent-gold/50 flex items-center justify-center flex-shrink-0 transition-colors duration-300">
                  <MessageIcon className="w-4 h-4 text-accent-gold/70 group-hover:text-accent-gold transition-colors duration-300" />
                </span>
                <span className="font-medium">Get in Touch</span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
