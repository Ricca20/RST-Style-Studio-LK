import { notFound } from 'next/navigation';

// Unknown paths inside a locale render the localized 404 (with nav and footer)
export default function CatchAll() {
  notFound();
}
