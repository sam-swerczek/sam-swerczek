interface SpotifyEmbedProps {
  url: string;
  type?: "track" | "album" | "playlist" | "artist";
  height?: string;
}

export default function SpotifyEmbed({
  url,
  type = "playlist",
  height = "380"
}: SpotifyEmbedProps) {
  // Extract the Spotify ID from the URL
  const getSpotifyEmbedUrl = (url: string) => {
    // If it's already an embed URL, return it
    if (url.includes("embed")) return url;

    // Extract ID from standard Spotify URLs
    const match = url.match(/spotify\.com\/(track|album|playlist|artist)\/([a-zA-Z0-9]+)/);
    if (match) {
      const [, urlType, id] = match;
      return `https://open.spotify.com/embed/${urlType}/${id}`;
    }

    return url;
  };

  const embedUrl = getSpotifyEmbedUrl(url);

  return (
    <div className="w-full">
      <div className="relative w-full overflow-hidden rounded-lg" style={{ paddingBottom: height + 'px' }}>
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={embedUrl}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          style={{ border: 'none' }}
        />
      </div>
    </div>
  );
}
