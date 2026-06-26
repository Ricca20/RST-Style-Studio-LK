'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Plus, Users, Trash2, Camera, Link as LinkIcon, Globe, PlaySquare, MoveVertical, Save, Eye, X, Edit2
} from 'lucide-react';
import { toast } from 'sonner';
import ConfirmModal from '@/components/ui/ConfirmModal';
import ImageUpload from '@/components/admin/ImageUpload';
import AdminSearchFilter from '@/components/admin/AdminSearchFilter';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableProfileCard({ profile, onToggleActive, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: profile.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    position: 'relative'
  };

  return (
    <div ref={setNodeRef} style={style} className={`bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col ${!profile.isActive ? 'opacity-60 grayscale' : ''} ${isDragging ? 'shadow-2xl scale-105' : ''}`}>
      <div className="p-2 bg-gray-50 border-b flex justify-center cursor-grab active:cursor-grabbing text-gray-400" {...attributes} {...listeners}>
        <div className="w-10 h-1.5 bg-gray-300 rounded-full"></div>
      </div>
      <div className="p-6 flex gap-4">
        {profile.imageUrl ? (
          <img src={profile.imageUrl} alt="" className="w-16 h-16 rounded-full object-cover shrink-0 border" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 to-blue-500 flex items-center justify-center text-white font-bold text-xl shrink-0">
            {profile.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 truncate">{profile.name}</h3>
          <p className="text-xs text-blue-600 mb-1 truncate">{profile.mainRole || 'Contributor'}</p>
          <div className="flex gap-2 text-gray-400 mt-2">
            {profile.socialLinks?.facebook && <Globe className="w-3.5 h-3.5" />}
            {profile.socialLinks?.instagram && <Camera className="w-3.5 h-3.5" />}
            {profile.socialLinks?.youtube && <PlaySquare className="w-3.5 h-3.5" />}
            {profile.socialLinks?.spotify && <LinkIcon className="w-3.5 h-3.5" />}
          </div>
        </div>
      </div>
      <div className="px-6 pb-4 flex-1">
        <p className="text-sm text-gray-600 line-clamp-3">{profile.bio || 'No bio provided.'}</p>
      </div>
      <div className="bg-gray-50 border-t px-6 py-3 flex items-center justify-between">
        {!profile.isApproved ? (
          <button 
            onPointerDown={e => e.stopPropagation()}
            onClick={() => onToggleActive(profile, true)}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center shadow-sm"
          >
            APPROVE PROFILE
          </button>
        ) : (
          <label className="flex items-center cursor-pointer" onPointerDown={e => e.stopPropagation()}>
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={profile.isActive} 
                onChange={() => onToggleActive(profile)} 
              />
              <div className={`block w-10 h-6 rounded-full transition-colors ${profile.isActive ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
              <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${profile.isActive ? 'transform translate-x-4' : ''}`}></div>
            </div>
            <span className="ml-3 text-xs font-medium text-gray-600">{profile.isActive ? 'ACTIVE' : 'INACTIVE'}</span>
          </label>
        )}
        <div className="flex items-center gap-2" onPointerDown={e => e.stopPropagation()}>
          <button onClick={() => onEdit(profile)} className="text-gray-500 hover:text-blue-600 transition p-1.5 hover:bg-blue-50 rounded-lg text-sm flex items-center font-medium">
            <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
          </button>
          <button onClick={() => onDelete(profile)} className="text-gray-500 hover:text-red-600 transition p-1.5 hover:bg-red-50 rounded-lg text-sm flex items-center font-medium">
            <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

const PREDEFINED_ROLES = [
  'Artist', 'Vocalist', 'Lyricist', 'Melody', 'Music', 'Mix & Mastering',
  'Lead Guitar', 'Flute', 'Violin', 'Director', 'Story', 'MUA', 
  'Assistant Director', 'Lighting', 'Starring'
];

export default function AdminProfilesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formMainRole, setFormMainRole] = useState('');
  const [formBio, setFormBio] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formGalleryImages, setFormGalleryImages] = useState([]);
  const [formActive, setFormActive] = useState(true);
  const [socials, setSocials] = useState({ facebook: '', instagram: '', youtube: '', spotify: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewSlug, setPreviewSlug] = useState('');

  const fetchProfiles = async () => {
    try {
      const res = await fetch('/api/admin/profiles');
      if (res.ok) {
        const data = await res.json();
        setProfiles(data);
      }
    } catch (err) {
      toast.error('Failed to load profiles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProfiles();
  }, []);

  const resetForm = () => {
    setFormName('');
    setFormMainRole('');
    setFormBio('');
    setFormImage('');
    setFormGalleryImages([]);
    setSocials({ facebook: '', instagram: '', youtube: '', spotify: '' });
    setFormActive(true);
    setEditingId(null);
    setPreviewSlug('');
    setShowForm(false);
  };

  const openEditForm = (profile) => {
    setFormName(profile.name);
    setFormMainRole(profile.mainRole || '');
    setFormBio(profile.bio || '');
    setFormImage(profile.imageUrl || '');
    setFormGalleryImages(profile.galleryImages || []);
    setSocials(profile.socialLinks || { facebook: '', instagram: '', youtube: '', spotify: '' });
    setFormActive(profile.isActive);
    setEditingId(profile.id);
    setPreviewSlug(profile.slug || '');
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formName.trim()) {
      toast.error('Name is required');
      return;
    }
    setIsSaving(true);
    try {
      const payload = { 
        name: formName, 
        mainRole: formMainRole,
        bio: formBio, 
        imageUrl: formImage, 
        galleryImages: formGalleryImages,
        socialLinks: socials,
        isActive: formActive 
      };
      const url = editingId ? `/api/admin/profiles/${editingId}` : '/api/admin/profiles';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to save');

      toast.success(editingId ? 'Profile updated' : 'Profile added');
      resetForm();
      startTransition(() => { fetchProfiles(); });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/profiles/${deleteTarget.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success(`Removed "${deleteTarget.name}"`);
      setDeleteTarget(null);
      startTransition(() => { fetchProfiles(); });
    } catch (err) {
      toast.error(err.message);
      setDeleteTarget(null);
    }
  };

  const handleToggleActive = async (profile, approveMode = false) => {
    try {
      const payload = { 
        name: profile.name, 
        mainRole: profile.mainRole,
        bio: profile.bio, 
        imageUrl: profile.imageUrl, 
        galleryImages: profile.galleryImages,
        socialLinks: profile.socialLinks,
        isActive: approveMode ? true : !profile.isActive,
        isApproved: approveMode ? true : profile.isApproved
      };
      
      setProfiles(profiles.map(p => p.id === profile.id ? { 
        ...p, 
        isActive: approveMode ? true : !p.isActive, 
        isApproved: approveMode ? true : p.isApproved 
      } : p));
      
      const res = await fetch(`/api/admin/profiles/${profile.id}`, { 
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(payload) 
      });
      
      if (!res.ok) throw new Error('Failed to update status');
      toast.success(`${profile.name} is now ${!profile.isActive ? 'Active' : 'Inactive'}`);
    } catch (err) {
      toast.error(err.message);
      setProfiles(profiles.map(p => p.id === profile.id ? { ...p, isActive: profile.isActive } : p));
    }
  };

  // Filtering Logic
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';
  const statusFilter = searchParams.get('status') || 'ALL';

  const filteredProfiles = profiles.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery);
    let matchesStatus = true;
    if (statusFilter === 'ACTIVE') matchesStatus = p.isActive && p.isApproved;
    if (statusFilter === 'INACTIVE') matchesStatus = !p.isActive && p.isApproved;
    if (statusFilter === 'PENDING') matchesStatus = !p.isApproved;
    return matchesSearch && matchesStatus;
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = profiles.findIndex(p => p.id === active.id);
      const newIndex = profiles.findIndex(p => p.id === over.id);
      const newOrder = arrayMove(profiles, oldIndex, newIndex);
      setProfiles(newOrder);

      const items = newOrder.map((p, idx) => ({ id: p.id, sortOrder: idx }));

      try {
        const res = await fetch('/api/admin/reorder', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'PROFILE', items })
        });
        if (!res.ok) throw new Error('Failed to save new order');
        toast.success('Profile order saved');
      } catch (err) {
        toast.error('Failed to save order');
        fetchProfiles();
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Profiles</h1>
          <p className="text-gray-500 mt-1">Create and manage public profiles for your core team</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center transition shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" /> Add Profile
        </button>
      </div>

      <AdminSearchFilter 
        placeholder="Search profiles by name..." 
        statusOptions={[
          { value: 'ACTIVE', label: 'Active' },
          { value: 'INACTIVE', label: 'Inactive' },
          { value: 'PENDING', label: 'Pending Approval' }
        ]}
      />

      {/* Add/Edit Form Panel */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">{editingId ? 'Edit Profile' : 'Add New Profile'}</h2>
            <div className="flex items-center gap-4">
              {editingId && previewSlug && (
                <button 
                  onClick={() => setShowPreview(true)}
                  className="bg-white/20 hover:bg-white/30 text-white font-medium px-4 py-1.5 rounded-lg transition flex items-center gap-2 text-sm"
                >
                  <Eye className="w-4 h-4" /> Live Preview
                </button>
              )}
              <button onClick={resetForm} className="text-white/70 hover:text-white transition"><X className="w-5 h-5" /></button>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Basic Info */}
              <div className="lg:col-span-2 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                    <input type="text" value={formName} onChange={e => setFormName(e.target.value)} placeholder="e.g. Kasun Perera" className="w-full border-gray-300 border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Main Role</label>
                    <select 
                      value={PREDEFINED_ROLES.includes(formMainRole) || formMainRole === '' ? formMainRole : 'Other'} 
                      onChange={e => setFormMainRole(e.target.value === 'Other' ? '' : e.target.value)} 
                      className="w-full border-gray-300 border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    >
                      <option value="">Select Role...</option>
                      {PREDEFINED_ROLES.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                      <option value="Other">Other (Custom)</option>
                    </select>
                    {(!PREDEFINED_ROLES.includes(formMainRole) && formMainRole !== '') || (formMainRole === '' && false) ? null : null}
                    {(!PREDEFINED_ROLES.includes(formMainRole) && formMainRole !== '') || (formMainRole === 'Other') ? (
                      <input 
                        type="text" 
                        value={formMainRole} 
                        onChange={e => setFormMainRole(e.target.value)} 
                        placeholder="Type custom role" 
                        className="w-full border-gray-300 border rounded-lg px-4 py-2.5 mt-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                        autoFocus 
                      />
                    ) : null}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio (Short Description)</label>
                  <textarea rows="4" value={formBio} onChange={e => setFormBio(e.target.value)} placeholder="Tell us about this person..." className="w-full border-gray-300 border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none resize-y" />
                </div>
                
                {/* Social Links */}
                <div className="pt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-3 border-b pb-2">Social Links</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex rounded-lg border overflow-hidden">
                      <span className="bg-gray-50 border-r px-3 flex items-center text-gray-400"><Globe className="w-4 h-4" /></span>
                      <input type="text" value={socials.facebook || ''} onChange={e => setSocials({...socials, facebook: e.target.value})} placeholder="Facebook URL" className="flex-1 px-3 py-2 outline-none text-sm" />
                    </div>
                    <div className="flex rounded-lg border overflow-hidden">
                      <span className="bg-gray-50 border-r px-3 flex items-center text-gray-400"><Camera className="w-4 h-4" /></span>
                      <input type="text" value={socials.instagram || ''} onChange={e => setSocials({...socials, instagram: e.target.value})} placeholder="Instagram URL" className="flex-1 px-3 py-2 outline-none text-sm" />
                    </div>
                    <div className="flex rounded-lg border overflow-hidden">
                      <span className="bg-gray-50 border-r px-3 flex items-center text-gray-400"><PlaySquare className="w-4 h-4" /></span>
                      <input type="text" value={socials.youtube || ''} onChange={e => setSocials({...socials, youtube: e.target.value})} placeholder="YouTube URL" className="flex-1 px-3 py-2 outline-none text-sm" />
                    </div>
                    <div className="flex rounded-lg border overflow-hidden">
                      <span className="bg-gray-50 border-r px-3 flex items-center text-gray-400"><LinkIcon className="w-4 h-4" /></span>
                      <input type="text" value={socials.spotify || ''} onChange={e => setSocials({...socials, spotify: e.target.value})} placeholder="Spotify URL" className="flex-1 px-3 py-2 outline-none text-sm" />
                    </div>
                  </div>
                </div>

                {/* Gallery Images */}
                <div className="pt-4 border-t">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Portfolio / Gallery Images</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {formGalleryImages.map((img, index) => (
                      <div key={index} className="relative group border rounded-xl overflow-hidden aspect-square">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                          <button onClick={() => setFormGalleryImages(prev => prev.filter((_, i) => i !== index))} className="bg-red-600 text-white p-1.5 rounded-lg text-sm font-medium">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="aspect-square border-2 border-dashed rounded-xl flex items-center justify-center bg-gray-50">
                      <ImageUpload 
                        onUploadMultiple={urls => setFormGalleryImages(prev => [...prev, ...urls])}
                        onUpload={url => setFormGalleryImages(prev => [...prev, url])} 
                        compact 
                        multiple
                        label="Add Images" 
                        className="text-sm" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Photo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Profile Photo</label>
                {formImage ? (
                  <div className="relative group border rounded-xl overflow-hidden aspect-square max-w-[200px] mb-2">
                    <img src={formImage} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <button onClick={() => setFormImage('')} className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium">Remove</button>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-square max-w-[200px] border-2 border-dashed rounded-xl flex items-center justify-center bg-gray-50 mb-2">
                    <ImageUpload onUpload={url => setFormImage(url)} compact label="Upload Photo" className="text-sm" />
                  </div>
                )}
                <p className="text-xs text-gray-500">Recommended: Square image, at least 400x400px.</p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-8 pt-5 border-t">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formActive} onChange={e => setFormActive(e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />
                <span className="text-sm font-medium text-gray-700">Active (Visible on public team page)</span>
              </label>
              <div className="flex items-center gap-3">
                <button onClick={resetForm} className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition">Cancel</button>
                <button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium flex items-center transition disabled:opacity-50">
                  <Save className="w-4 h-4 mr-2" /> {isSaving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profiles Grid */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading profiles...</div>
      ) : filteredProfiles.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-700 mb-2">No profiles found</h3>
          <p className="text-gray-500 mb-4">Add your core team members so they can be assigned to songs and quotations, or adjust your search.</p>
          <button onClick={() => setShowForm(true)} className="text-blue-600 font-medium hover:underline">Add First Profile</button>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={filteredProfiles.map(p => p.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProfiles.map(profile => (
                <SortableProfileCard 
                  key={profile.id} 
                  profile={profile} 
                  onToggleActive={handleToggleActive} 
                  onEdit={openEditForm} 
                  onDelete={setDeleteTarget} 
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Profile"
        description={deleteTarget ? `Are you sure you want to delete "${deleteTarget.name}"? This will unlink them from any song credits and quotation roles. This cannot be undone.` : ''}
        confirmText="Delete Profile"
      />

      {/* Live Preview Modal */}
      {showPreview && editingId && previewSlug && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden relative">
            <div className="bg-gray-900 text-white p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-lg">Live Preview</h3>
                <span className="bg-gray-800 text-gray-400 text-xs px-2 py-1 rounded">Save changes before previewing</span>
              </div>
              <button onClick={() => setShowPreview(false)} className="text-gray-400 hover:text-white transition">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 w-full h-full bg-gray-100 overflow-hidden relative">
              <iframe 
                src={`/en/profiles/${previewSlug}`} 
                className="w-full h-full border-none absolute inset-0"
                title="Live Preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
