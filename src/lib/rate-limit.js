const rateLimitMap = new Map();

export function rateLimit(ip, limit = 5, windowMs = 60000) {
  const now = Date.now();
  const windowStart = now - windowMs;

  let requestData = rateLimitMap.get(ip);
  if (!requestData) {
    requestData = { count: 1, firstRequest: now };
    rateLimitMap.set(ip, requestData);
    return { success: true };
  }

  // Reset if the window has passed
  if (requestData.firstRequest < windowStart) {
    requestData.count = 1;
    requestData.firstRequest = now;
    return { success: true };
  }

  // Increment count
  requestData.count++;

  if (requestData.count > limit) {
    return { success: false };
  }

  return { success: true };
}
