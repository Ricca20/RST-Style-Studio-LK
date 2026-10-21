// Build privacy-friendly embed URLs from the links stored on songs.

/** YouTube embed URL for watch, share (youtu.be), embed or shorts links; null if unrecognised. */
export function youtubeEmbedUrl(url, { autoplay = false } = {}) {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (!match) return null;
  return `https://www.youtube.com/embed/${match[1]}?rel=0${autoplay ? '&autoplay=1' : ''}`;
}

/** Spotify embed URL for track, album or playlist links; null if unrecognised. */
export function spotifyEmbedUrl(url) {
  if (!url) return null;
  const match = url.match(/open\.spotify\.com\/(?:intl-[a-z]+\/)?(track|album|playlist)\/([a-zA-Z0-9]+)/);
  return match ? `https://open.spotify.com/embed/${match[1]}/${match[2]}?utm_source=generator` : null;
}
