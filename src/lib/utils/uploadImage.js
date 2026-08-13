export async function uploadImage(file) {
  if (!file) throw new Error('No file provided');

  // Security Validation: Size and Type Limits
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File exceeds the maximum limit of 5MB.');
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only JPG, PNG, WEBP, and GIF are allowed.');
  }

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/admin/media', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to upload image');
  }

  const { url } = await response.json();
  return url;
}
