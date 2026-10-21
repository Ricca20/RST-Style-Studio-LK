export function isFacebookConfigured() {
  return Boolean(process.env.FACEBOOK_PAGE_ID && process.env.FACEBOOK_ACCESS_TOKEN);
}

/** Latest page posts. Throws on API errors (e.g. an expired token). */
export async function fetchPagePosts() {
  const pageId = process.env.FACEBOOK_PAGE_ID;
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;

  const url = `https://graph.facebook.com/v18.0/${pageId}/posts?access_token=${accessToken}&limit=10&fields=id,message,created_time,permalink_url,full_picture`;
  const res = await fetch(url, { cache: 'no-store' });
  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(`Facebook API error: ${data.error?.message || res.status}`);
  }
  return data.data || [];
}
