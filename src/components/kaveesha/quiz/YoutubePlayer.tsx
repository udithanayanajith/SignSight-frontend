export default function YoutubePlayer({
  url,
  embedAllowed = true,
}: {
  url: string;
  embedAllowed?: boolean;
}) {
  if (!url) return Fallback(url);

  if (!embedAllowed) {
    return Fallback(url);
  }

  const videoId = getVideoId(url);
  if (!videoId) return Fallback(url);

  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0`;

  return (
    <div className="w-full aspect-video rounded-3xl overflow-hidden bg-black">
      <iframe
        src={embedUrl}
        className="w-full h-full"
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

function getVideoId(url: string): string | null {
  try {
    if (url.includes("youtu.be/")) {
      return url.split("youtu.be/")[1]?.split("?")[0];
    }
    return new URL(url).searchParams.get("v");
  } catch {
    return null;
  }
}

function Fallback(url: string) {
  return (
    <div className="w-full aspect-video rounded-3xl bg-black flex flex-col items-center justify-center text-center p-6">
      <p className="text-white text-lg font-semibold mb-4">
        This video can’t be played inside the app
      </p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="px-6 py-3 rounded-full text-lg font-bold bg-red-500 text-white"
      >
        ▶ Open in YouTube
      </a>
    </div>
  );
}
