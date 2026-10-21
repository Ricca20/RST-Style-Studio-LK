export function isYouTubeConfigured() {
  return Boolean(process.env.YOUTUBE_API_KEY && process.env.YOUTUBE_CHANNEL_ID);
}

/**
 * Latest channel videos. Throws on API errors (e.g. quota exceeded) so a failed
 * sync never overwrites the cached data with an empty list.
 */
export async function fetchChannelVideos() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;

  const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&type=video&maxResults=12`;
  const res = await fetch(url, { cache: 'no-store' });
  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(`YouTube API error: ${data.error?.message || res.status}`);
  }
  return data.items || [];
}
