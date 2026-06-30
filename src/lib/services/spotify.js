export async function fetchArtistTopTracks() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const artistId = process.env.SPOTIFY_ARTIST_ID;

  if (!clientId || !clientSecret || !artistId) return [];

  try {
    const authString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });
    
    const { access_token } = await tokenRes.json();
    if (!access_token) return [];

    const tracksRes = await fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=LK`, {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });
    
    const data = await tracksRes.json();
    return data.tracks || [];
  } catch (error) {
    console.error('Error fetching Spotify tracks:', error);
    return [];
  }
}
  
