'use client';

import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';
import ConfirmModal from '@/components/ui/ConfirmModal';

export default function RevokeSessionsButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleRevoke = async () => {
    setIsPending(true);
    try {
      const res = await fetch('/api/admin/auth/revoke-sessions', {
        method: 'POST'
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to revoke sessions');
      
      toast.success('All active sessions have been revoked.');
      setIsOpen(false);
      
      // Optionally redirect to login since this device might be signed out too, 
      // depending on Supabase global sign out behavior.
      setTimeout(() => {
        window.location.href = '/en/login';
      }, 2000);
      
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <button 
        type="button"
        onClick={() => setIsOpen(true)}
        className="bg-white text-rose-600 border border-rose-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-rose-50 transition shadow-sm flex items-center justify-center gap-2"
      >
        <LogOut className="w-4 h-4" /> Revoke All Active Sessions
      </button>

      <ConfirmModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleRevoke}
        title="Revoke All Sessions"
        description="Are you sure you want to sign out from all other devices? You will be signed out from this device as well and will need to log back in."
        confirmText="Revoke Sessions"
        isLoading={isPending}
      />
    </>
  );
}
