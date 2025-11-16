import { ExternalLink } from 'lucide-react';

const LICHESS_USERNAME = 'samswerczek';

export default function LichessChallenge() {
  const challengeUrl = `https://lichess.org/?user=${LICHESS_USERNAME}#friend`;

  return (
    <div className="bg-background-secondary/50 backdrop-blur-sm border border-accent-blue/20 rounded-lg p-4">
      <h3 className="text-text-primary font-semibold text-sm mb-3">Challenge Me</h3>
      <p className="text-text-secondary text-sm mb-3">
        Want a real challenge? Play me on Lichess!
      </p>
      <a
        href={challengeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-accent-teal/10 hover:bg-accent-teal/20 border border-accent-teal/30 hover:border-accent-teal/50 text-accent-teal rounded-lg transition-all duration-300 font-medium text-sm group"
      >
        <span>Challenge on Lichess</span>
        <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
      </a>
    </div>
  );
}
