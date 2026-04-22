export async function fetchChannelVideos() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  if (!apiKey || !channelId) return [];

  try {
    const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=5`;
    const res = await fetch(url);
    const data = await res.json();
    return data.items || [];
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return [];
  }
}
  
