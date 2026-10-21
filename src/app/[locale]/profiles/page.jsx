import { redirect } from '@/i18n/routing';

// /profiles was a duplicate of /contributors; next.config.mjs also redirects it permanently.
export default async function ProfilesPage({ params }) {
  const { locale } = await params;
  redirect({ href: '/contributors', locale });
}
