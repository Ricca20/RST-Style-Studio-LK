'use client';

import { useState } from 'react';
import { toast, Toaster } from 'sonner';
import { LogOut } from 'lucide-react';

export default function PortalClient({ initialProfile, claims, allSongs, userId }) {
  const [profile, setProfile] = useState(initialProfile || { name: '', bio: '', mainRole: '' });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [claimForm, setClaimForm] = useState({ songId: '', role: '', proof: '' });
  const [isSubmittingClaim, setIsSubmittingClaim] = useState(false);
  const [localClaims, setLocalClaims] = useState(claims);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      const res = await fetch('/api/portal/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        toast.success('Profile saved successfully! It will be reviewed by an admin.');
      } else {
        toast.error(data.error || 'Failed to save profile.');
      }
    } catch (err) {
      toast.error('An error occurred.');
    }
    setIsSavingProfile(false);
  };

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingClaim(true);
    try {
      const res = await fetch('/api/portal/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(claimForm)
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setLocalClaims([data, ...localClaims]);
        toast.success('Claim submitted successfully! Awaiting admin approval.');
        setClaimForm({ songId: '', role: '', proof: '' });
      } else {
        toast.error(data.error || 'Failed to submit claim.');
      }
    } catch (err) {
      toast.error('An error occurred.');
    }
    setIsSubmittingClaim(false);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      window.location.href = '/';
    }
  };

  return (
    <>
    <Toaster position="bottom-right" />
    <div className="flex justify-end mb-6">
      <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold hover:bg-ink hover:text-paper transition-colors">
        <LogOut className="w-4 h-4" /> Log out
      </button>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* Profile Section */}
      <div className="rounded-[2rem] bg-paper-2 p-6 md:p-8">
        <h2 className="display text-4xl mb-6">Your Profile</h2>
        {initialProfile?.isApproved === false && (
          <div className="bg-amber-100 text-amber-900 p-4 rounded-2xl mb-6 text-sm">
            Your profile is currently pending admin approval. It will not be visible publicly until approved.
          </div>
        )}
        {initialProfile?.isApproved === true && (
          <div className="bg-emerald-100 text-emerald-900 p-4 rounded-2xl mb-6 text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-700">verified</span>
            Your profile is verified and public!
          </div>
        )}
        <form onSubmit={handleProfileSave} className="flex flex-col gap-4">
          <div>
            <label className="eyebrow block mb-3">Display Name (Artist Name)</label>
            <input 
              type="text" 
              required
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full bg-paper border border-ink/15 rounded-2xl px-4 py-3 focus:border-ink focus:outline-none"
            />
          </div>
          <div>
            <label className="eyebrow block mb-3">Main Role (e.g. Lead Singer, Producer)</label>
            <input 
              type="text" 
              required
              value={profile.mainRole || ''}
              onChange={(e) => setProfile({ ...profile, mainRole: e.target.value })}
              className="w-full bg-paper border border-ink/15 rounded-2xl px-4 py-3 focus:border-ink focus:outline-none"
            />
          </div>
          <div>
            <label className="eyebrow block mb-3">Bio</label>
            <textarea 
              rows="4"
              value={profile.bio || ''}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full bg-paper border border-ink/15 rounded-2xl px-4 py-3 focus:border-ink focus:outline-none resize-y"
            />
          </div>
          <button 
            type="submit" 
            disabled={isSavingProfile}
            className="mt-2 self-start rounded-full bg-ink text-paper font-bold py-3.5 px-7 hover:bg-ink-2 transition-colors disabled:opacity-50"
          >
            {isSavingProfile ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>

      {/* Claims Section */}
      <div className="flex flex-col gap-8">
        <div className="rounded-[2rem] bg-paper-2 p-6 md:p-8">
          <h2 className="display text-4xl mb-6">Claim a Song</h2>
          <form onSubmit={handleClaimSubmit} className="flex flex-col gap-4">
            <div>
              <label className="eyebrow block mb-3">Select Song</label>
              <select 
                required
                value={claimForm.songId}
                onChange={(e) => setClaimForm({ ...claimForm, songId: e.target.value })}
                className="w-full bg-paper border border-ink/15 rounded-2xl px-4 py-3 focus:border-ink focus:outline-none"
              >
                <option value="">-- Choose a Song --</option>
                {allSongs.map(song => (
                  <option key={song.id} value={song.id}>{song.titleEn}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="eyebrow block mb-3">Your Role on this Song</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Backing Vocals, Mix Engineer"
                value={claimForm.role}
                onChange={(e) => setClaimForm({ ...claimForm, role: e.target.value })}
                className="w-full bg-paper border border-ink/15 rounded-2xl px-4 py-3 focus:border-ink focus:outline-none"
              />
            </div>
            <div>
              <label className="eyebrow block mb-3">Proof / Notes for Admin (Optional)</label>
              <input 
                type="text" 
                placeholder="Link to credits or a note"
                value={claimForm.proof}
                onChange={(e) => setClaimForm({ ...claimForm, proof: e.target.value })}
                className="w-full bg-paper border border-ink/15 rounded-2xl px-4 py-3 focus:border-ink focus:outline-none"
              />
            </div>
            <button 
              type="submit" 
              disabled={isSubmittingClaim || !initialProfile}
              className="mt-2 self-start rounded-full bg-ink text-paper font-bold py-3.5 px-7 hover:bg-ink-2 transition-colors disabled:opacity-50"
            >
              {isSubmittingClaim ? 'Submitting...' : 'Submit Claim'}
            </button>
            {!initialProfile && (
              <p className="text-red-700 text-xs mt-1">You must save your profile first before claiming songs.</p>
            )}
          </form>
        </div>

        <div className="rounded-[2rem] bg-paper-2 p-6 md:p-8">
          <h2 className="display text-4xl mb-6">Your Claims</h2>
          {localClaims.length === 0 ? (
            <p className="text-smoke text-sm">You haven&apos;t claimed any songs yet.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {localClaims.map(claim => (
                <div key={claim.id} className="flex items-center justify-between gap-4 p-4 bg-paper border border-ink/10 rounded-2xl">
                  <div>
                    <h4 className="font-bold">{claim.song?.titleEn || 'Unknown Song'}</h4>
                    <p className="text-smoke text-xs">Role: {claim.role}</p>
                  </div>
                  <div>
                    {claim.status === 'PENDING' && <span className="bg-amber-100 text-amber-900 text-xs font-semibold px-3 py-1 rounded-full">Pending</span>}
                    {claim.status === 'APPROVED' && <span className="bg-emerald-100 text-emerald-900 text-xs font-semibold px-3 py-1 rounded-full">Approved</span>}
                    {claim.status === 'REJECTED' && <span className="bg-red-100 text-red-900 text-xs font-semibold px-3 py-1 rounded-full">Rejected</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
