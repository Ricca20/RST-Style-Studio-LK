'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import ConfirmModal from '@/components/ui/ConfirmModal';

export default function DeleteButton({ id, title, endpoint = `/api/admin/songs/${id}` }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const res = await fetch(endpoint, {
        method: 'DELETE',
      });
      
      if (!res.ok) throw new Error('Failed to delete');
      
      toast.success(`Deleted "${title}" successfully`);
      setIsOpen(false);
      
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while deleting.');
      setIsOpen(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        disabled={isPending}
        className={`transition ${isPending ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-red-600'}`}
        title="Delete"
      >
        <Trash2 className="w-5 h-5" />
      </button>

      <ConfirmModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        description={`Are you sure you want to delete "${title}"? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={isPending}
      />
    </>
  );
}
