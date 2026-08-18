'use client';

import { useState } from 'react';
import { toast } from 'sonner';

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
      if (res.ok) {
        toast.success('Profile saved successfully! It will be reviewed by an admin.');
      } else {
        toast.error('Failed to save profile.');
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
      if (res.ok) {
        const newClaim = await res.json();
        setLocalClaims([newClaim, ...localClaims]);
        toast.success('Claim submitted successfully! Awaiting admin approval.');
        setClaimForm({ songId: '', role: '', proof: '' });
      } else {
        toast.error('Failed to submit claim.');
      }
    } catch (err) {
      toast.error('An error occurred.');
    }
    setIsSubmittingClaim(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* Profile Section */}
      <div className="glass-panel p-8 rounded-2xl">
        <h2 className="text-2xl font-bold text-white mb-6">Your Profile</h2>
        {initialProfile?.isApproved === false && (
          <div className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 p-4 rounded-xl mb-6 text-sm">
            Your profile is currently pending admin approval. It will not be visible publicly until approved.
          </div>
        )}
        {initialProfile?.isApproved === true && (
          <div className="bg-green-500/20 text-green-300 border border-green-500/30 p-4 rounded-xl mb-6 text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-green-400">verified</span>
            Your profile is verified and public!
          </div>
        )}
        <form onSubmit={handleProfileSave} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-white/60 mb-2">Display Name (Artist Name)</label>
            <input 
              type="text" 
              required
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#0ea5e9] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-2">Main Role (e.g. Lead Singer, Producer)</label>
            <input 
              type="text" 
              required
              value={profile.mainRole || ''}
              onChange={(e) => setProfile({ ...profile, mainRole: e.target.value })}
              className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#0ea5e9] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-2">Bio</label>
            <textarea 
              rows="4"
              value={profile.bio || ''}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#0ea5e9] focus:outline-none resize-none"
            />
          </div>
          <button 
            type="submit" 
            disabled={isSavingProfile}
            className="mt-2 bg-[#0ea5e9] text-white font-bold py-3 px-6 rounded-xl hover:bg-[#0ea5e9]/90 transition-all disabled:opacity-50"
          >
            {isSavingProfile ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>

      {/* Claims Section */}
      <div className="flex flex-col gap-8">
        <div className="glass-panel p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-white mb-6">Claim a Song</h2>
          <form onSubmit={handleClaimSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm text-white/60 mb-2">Select Song</label>
              <select 
                required
                value={claimForm.songId}
                onChange={(e) => setClaimForm({ ...claimForm, songId: e.target.value })}
                className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#0ea5e9] focus:outline-none"
              >
                <option value="">-- Choose a Song --</option>
                {allSongs.map(song => (
                  <option key={song.id} value={song.id}>{song.titleEn}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">Your Role on this Song</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Backing Vocals, Mix Engineer"
                value={claimForm.role}
                onChange={(e) => setClaimForm({ ...claimForm, role: e.target.value })}
                className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#0ea5e9] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">Proof / Notes for Admin (Optional)</label>
              <input 
                type="text" 
                placeholder="Link to credits or a note"
                value={claimForm.proof}
                onChange={(e) => setClaimForm({ ...claimForm, proof: e.target.value })}
                className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#0ea5e9] focus:outline-none"
              />
            </div>
            <button 
              type="submit" 
              disabled={isSubmittingClaim || !initialProfile}
              className="mt-2 bg-[#0ea5e9] text-white font-bold py-3 px-6 rounded-xl hover:bg-[#0ea5e9]/90 transition-all disabled:opacity-50"
            >
              {isSubmittingClaim ? 'Submitting...' : 'Submit Claim'}
            </button>
            {!initialProfile && (
              <p className="text-red-400 text-xs mt-1">You must save your profile first before claiming songs.</p>
            )}
          </form>
        </div>

        <div className="glass-panel p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-white mb-6">Your Claims</h2>
          {localClaims.length === 0 ? (
            <p className="text-white/40 text-sm">You haven&apos;t claimed any songs yet.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {localClaims.map(claim => (
                <div key={claim.id} className="flex items-center justify-between p-4 bg-[#0f172a]/50 border border-white/5 rounded-xl">
                  <div>
                    <h4 className="text-white font-bold">{claim.song?.titleEn || 'Unknown Song'}</h4>
                    <p className="text-white/60 text-xs">Role: {claim.role}</p>
                  </div>
                  <div>
                    {claim.status === 'PENDING' && <span className="bg-yellow-500/20 text-yellow-300 text-xs px-3 py-1 rounded-full border border-yellow-500/30">Pending</span>}
                    {claim.status === 'APPROVED' && <span className="bg-green-500/20 text-green-300 text-xs px-3 py-1 rounded-full border border-green-500/30">Approved</span>}
                    {claim.status === 'REJECTED' && <span className="bg-red-500/20 text-red-300 text-xs px-3 py-1 rounded-full border border-red-500/30">Rejected</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
