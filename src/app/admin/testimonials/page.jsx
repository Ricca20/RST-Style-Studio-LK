'use client';

import { Quote, Star } from 'lucide-react';
import SimpleCrudPage from '@/components/admin/SimpleCrudPage';

export default function TestimonialsPage() {
  return (
    <SimpleCrudPage
      title="Testimonials"
      description="Client reviews shown on the home page. Turn the section on or off with “Client Reviews” in Settings."
      Icon={Quote}
      itemLabel="Testimonial"
      endpoint="/api/admin/testimonials"
      emptyItem={{ name: '', role: '', quote: '', rating: '5', imageUrl: '', isPublished: true, sortOrder: 0 }}
      toForm={(t) => ({
        name: t.name,
        role: t.role || '',
        quote: t.quote,
        rating: t.rating ? String(t.rating) : '',
        imageUrl: t.imageUrl || '',
        isPublished: t.isPublished,
        sortOrder: t.sortOrder,
      })}
      fields={[
        { name: 'name', label: 'Client name', required: true },
        { name: 'role', label: 'Role / project', placeholder: "E.g. Vocalist — 'Sanda Eliya'" },
        { name: 'quote', label: 'Quote', type: 'textarea', required: true },
        {
          name: 'rating', label: 'Rating', type: 'select',
          options: [{ value: '', label: 'No rating' }, ...[5, 4, 3, 2, 1].map((n) => ({ value: String(n), label: `${n} star${n > 1 ? 's' : ''}` }))],
        },
        { name: 'imageUrl', label: 'Photo', type: 'image' },
        { name: 'isPublished', type: 'checkbox', checkboxLabel: 'Published (visible on the website)' },
      ]}
      columns={[
        { label: 'Client', render: (t) => <span className="font-semibold text-gray-900">{t.name}</span> },
        { label: 'Quote', render: (t) => <span className="line-clamp-2 max-w-md">{t.quote}</span> },
        { label: 'Rating', render: (t) => (t.rating ? <span className="flex items-center gap-1">{t.rating}<Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" /></span> : '—') },
        { label: 'Status', render: (t) => (t.isPublished ? <span className="text-green-600 text-xs font-medium">Published</span> : <span className="text-gray-400 text-xs font-medium">Hidden</span>) },
      ]}
    />
  );
}
