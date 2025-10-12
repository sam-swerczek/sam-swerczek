import { SpotifyIcon, AppleMusicIcon, YoutubeIcon } from "@/components/ui/icons";

interface StreamingLinksProps {
  spotifyUrl?: string;
  appleMusicUrl?: string;
  youtubePlaylistUrl?: string;
}

interface StreamingPlatform {
  name: string;
  url: string;
  icon: React.ReactNode;
  iconColor: string;
  borderColor: string;
  hoverBorderColor: string;
}

export default function StreamingLinks({
  spotifyUrl,
  appleMusicUrl,
  youtubePlaylistUrl,
}: StreamingLinksProps) {
  const platforms: StreamingPlatform[] = [
    {
      name: "Spotify",
      url: spotifyUrl || "",
      icon: <SpotifyIcon className="w-4 h-4" />,
      iconColor: "text-[#1DB954]/70 group-hover:text-[#1DB954]",
      borderColor: "border-[#1DB954]/30",
      hoverBorderColor: "group-hover:border-[#1DB954]/50",
    },
    {
      name: "Apple Music",
      url: appleMusicUrl || "",
      icon: <AppleMusicIcon className="w-4 h-4" />,
      iconColor: "text-[#FA243C]/70 group-hover:text-[#FA243C]",
      borderColor: "border-[#FA243C]/30",
      hoverBorderColor: "group-hover:border-[#FA243C]/50",
    },
    {
      name: "YouTube Music",
      url: youtubePlaylistUrl || "",
      icon: <YoutubeIcon className="w-4 h-4" />,
      iconColor: "text-[#FF0000]/70 group-hover:text-[#FF0000]",
      borderColor: "border-[#FF0000]/30",
      hoverBorderColor: "group-hover:border-[#FF0000]/50",
    },
  ].filter(platform => platform.url);

  if (platforms.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-text-secondary">No streaming links available yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {platforms.map((platform) => (
        <a
          key={platform.name}
          href={platform.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group w-full px-6 py-3 bg-transparent border border-text-secondary/20 hover:border-text-secondary/40 text-text-primary rounded-lg transition-all duration-300 inline-flex items-center justify-center"
        >
          <span className="flex items-center gap-2.5">
            <span className={`w-8 h-8 rounded-full bg-background-secondary/50 border ${platform.borderColor} ${platform.hoverBorderColor} flex items-center justify-center flex-shrink-0 transition-colors duration-300`}>
              <span className={`${platform.iconColor} transition-colors duration-300`}>
                {platform.icon}
              </span>
            </span>
            <span className="font-medium">{platform.name}</span>
          </span>
        </a>
      ))}
    </div>
  );
}
