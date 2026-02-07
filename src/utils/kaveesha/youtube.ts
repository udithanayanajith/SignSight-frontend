
export function toYoutubeEmbed(url: string) {
  // youtu.be/VIDEO_ID
  if (url.includes("youtu.be")) {
    return `https://www.youtube.com/embed/${
      url.split("youtu.be/")[1].split("?")[0]
    }`;
  }

  // youtube.com/watch?v=VIDEO_ID
  if (url.includes("watch?v=")) {
    return `https://www.youtube.com/embed/${
      url.split("watch?v=")[1].split("&")[0]
    }`;
  }

  return url;
}
