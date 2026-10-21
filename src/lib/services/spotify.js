export function isSpotifyConfigured() {
  return Boolean(process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET && process.env.SPOTIFY_ARTIST_ID);
}

/** Artist top tracks (client-credentials flow). Throws on API errors. */
export async function fetchArtistTopTracks() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const artistId = process.env.SPOTIFY_ARTIST_ID;

  const authString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${authString}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials',
    cache: 'no-store',
  });
  const { access_token, error_description } = await tokenRes.json();
  if (!tokenRes.ok || !access_token) {
    throw new Error(`Spotify auth error: ${error_description || tokenRes.status}`);
  }

  const tracksRes = await fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=LK`, {
    headers: { 'Authorization': `Bearer ${access_token}` },
    cache: 'no-store',
  });
  const data = await tracksRes.json();
  if (!tracksRes.ok || data.error) {
    throw new Error(`Spotify API error: ${data.error?.message || tracksRes.status}`);
  }
  return data.tracks || [];
}
