import QuoteClient from '@/components/public/QuoteClient';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return {
    title: 'Get a Quote | RST Style Studio LK',
    description: 'Use our interactive wizard to get an instant budget estimate for your next music production project.',
  };
}

export default function QuotePage() {
  return <QuoteClient />;
}
