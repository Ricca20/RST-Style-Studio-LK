export async function generateMetadata({ params }) {
  const { locale } = await params;
  return {
    title: 'Request a Quote | RST Style Studio LK',
    description: 'Use our collaborative pricing wizard to estimate costs for your music project.',
  };
}

export default function QuoteLayout({ children }) {
  return children;
}
