import ProfileDetailPage, { generateMetadata as baseGenerateMetadata } from '@/app/[locale]/profiles/[slug]/page';

export async function generateMetadata(props) {
  return baseGenerateMetadata(props);
}

export default function ContributorDetailPage(props) {
  return ProfileDetailPage(props);
}
