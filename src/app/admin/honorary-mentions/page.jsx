'use client';

import { Award } from 'lucide-react';
import SimpleCrudPage from '@/components/admin/SimpleCrudPage';

const today = () => new Date().toISOString().split('T')[0];

export default function HonoraryMentionsPage() {
  return (
    <SimpleCrudPage
      title="Honorary Mentions"
      description="Studio awards, recognitions and special mentions, shown on the About page."
      Icon={Award}
      itemLabel="Mention"
      endpoint="/api/honorary-mentions"
      emptyItem={{ name: '', title: '', description: '', imageUrl: '', awardedAt: today() }}
      toForm={(m) => ({
        name: m.name,
        title: m.title || '',
        description: m.description || '',
        imageUrl: m.imageUrl || '',
        awardedAt: m.awardedAt ? m.awardedAt.split('T')[0] : today(),
      })}
      fields={[
        { name: 'name', label: 'Name', required: true, placeholder: 'E.g. John Doe' },
        { name: 'title', label: 'Title / Award', placeholder: 'E.g. Best Producer 2026' },
        { name: 'imageUrl', label: 'Photo', type: 'image' },
        { name: 'awardedAt', label: 'Date Awarded', type: 'date' },
        { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Brief description…' },
      ]}
      columns={[
        { label: 'Name', render: (m) => <span className="font-semibold text-gray-900">{m.name}</span> },
        { label: 'Title / Award', render: (m) => m.title || '—' },
        { label: 'Date', render: (m) => (m.awardedAt ? new Date(m.awardedAt).toLocaleDateString() : '—') },
      ]}
    />
  );
}
