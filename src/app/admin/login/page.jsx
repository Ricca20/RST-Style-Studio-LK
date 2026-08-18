import { redirect } from 'next/navigation';

export default function AdminLoginRedirect() {
  // Gracefully redirect users who accidentally visit /admin/login to the public localized login page
  // The middleware already handles redirecting unauthenticated users from /admin to /[locale]/login
  redirect('/en/login');
}
