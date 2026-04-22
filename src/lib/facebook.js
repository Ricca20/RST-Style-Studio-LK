export async function fetchPagePosts() {
  const pageId = process.env.FACEBOOK_PAGE_ID;
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;

  if (!pageId || !accessToken) return [];

  try {
    const url = `https://graph.facebook.com/v18.0/${pageId}/posts?access_token=${accessToken}&limit=5`;
    const res = await fetch(url);
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching Facebook posts:', error);
    return [];
  }
}
  
