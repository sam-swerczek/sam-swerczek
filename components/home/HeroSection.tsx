import HeroClient from './HeroClient';

interface HeroSectionProps {
  heroImageUrl?: string;
}

export default function HeroSection({ heroImageUrl }: HeroSectionProps) {
  return <HeroClient heroImageUrl={heroImageUrl} />;
}
