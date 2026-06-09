'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSlug } from '@/lib/slugify';
import ImageUpload from './ImageUpload';

// Predefined genres and project types
const PREDEFINED_GENRES = [
  'Pop', 'Rock', 'Classical', 'Hip-Hop', 'R&B', 'Electronic', 'Jazz', 
  'Acoustic', 'Commercial', 'Branding', 'Wedding', 'Music Video', 'Documentary'
];

export default function UnifiedSongForm({ isEdit = false, initialData = null }) {
  const router = useRouter();
  
  // Basic Fields
  const [titleEn, setTitleEn] = useState(initialData?.titleEn || '');
  const [titleSi, setTitleSi] = useState(initialData?.titleSi || '');
  const [releaseYear, setReleaseYear] = useState(initialData?.releaseYear || '');
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured || false);
  
  // Description
  const [description, setDescription] = useState(initialData?.description || '');

  // Media
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || '');
  const [youtubeUrl, setYoutubeUrl] = useState(initialData?.youtubeUrl || '');
  const [spotifyUrl, setSpotifyUrl] = useState(initialData?.spotifyUrl || '');
  const [facebookUrl, setFacebookUrl] = useState(initialData?.facebookUrl || '');
  
  // Genres (Array of strings)
  const [genres, setGenres] = useState(initialData?.genres || []);

  // Credits
  const [credits, setCredits] = useState(initialData?.contributions || []);
  const [creditName, setCreditName] = useState('');
  const [creditRole, setCreditRole] = useState('');
  const [creditImage, setCreditImage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleGenreToggle = (genre) => {
    if (genres.includes(genre)) {
      setGenres(genres.filter(g => g !== genre));
    } else {
      setGenres([...genres, genre]);
    }
  };

  const handleAddCredit = () => {
    if (creditName.trim() && creditRole.trim()) {
      setCredits([
        ...credits, 
        { name: creditName.trim(), role: creditRole.trim(), imageUrl: creditImage.trim() }
      ]);
      setCreditName('');
      setCreditRole('');
      setCreditImage('');
    }
  };

  const handleRemoveCredit = (index) => {
    setCredits(credits.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titleEn || !titleSi) {
      setError('English and Sinhala titles are required.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const payload = {
      titleEn, titleSi,
      description,
      genres, releaseYear: releaseYear ? parseInt(releaseYear) : null,
      isFeatured,
      coverImage, youtubeUrl, spotifyUrl, facebookUrl,
      credits
    };

    if (!isEdit) {
      payload.slug = createSlug(titleEn || titleSi);
    }

    const url = isEdit ? `/api/admin/songs/${initialData.id}` : '/api/admin/songs';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save');
      }

      router.push('/admin/songs');
      router.refresh();
    } catch (err) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {isEdit ? 'Edit Portfolio Item' : 'Add New Portfolio Item'}
        </h1>
        <button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-blue-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-blue-700 transition shadow-md disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save & Publish'}
        </button>
      </div>
      
      {error && <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg font-medium">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Main Details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Titles */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600">title</span> Titles
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title (English) *</label>
                <input type="text" value={titleEn} onChange={e => setTitleEn(e.target.value)} required className="w-full border-gray-300 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title (Sinhala) *</label>
                <input type="text" value={titleSi} onChange={e => setTitleSi(e.target.value)} required className="w-full border-gray-300 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600">description</span> Description
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Description</label>
              <textarea rows="6" value={description} onChange={e => setDescription(e.target.value)} placeholder="Write the description of the project..." className="w-full border-gray-300 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>

          {/* Credits Manager */}
          <div className="bg-white rounded-xl shadow-sm border p-6 border-l-4 border-l-purple-500">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-purple-600">group</span> Custom Credits
            </h2>
            
            {credits.length > 0 ? (
              <div className="space-y-3 mb-6">
                {credits.map((credit, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-4">
                      {credit.imageUrl ? (
                        <img src={credit.imageUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="material-symbols-outlined text-gray-400">person</span>
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-gray-900">{credit.name}</p>
                        <p className="text-sm text-gray-500">{credit.role}</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => handleRemoveCredit(idx)} className="text-red-500 hover:text-red-700 p-2">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg border border-dashed border-gray-300 p-8 text-center mb-6">
                <span className="material-symbols-outlined text-gray-400 text-3xl mb-2">person_add</span>
                <p className="text-gray-500">No credits added yet.</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-purple-50 p-4 rounded-xl border border-purple-100">
              <div className="md:col-span-4">
                <label className="block text-xs font-medium text-purple-900 mb-1">Name</label>
                <input type="text" value={creditName} onChange={e => setCreditName(e.target.value)} placeholder="e.g. John Doe" className="w-full border-purple-200 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
              <div className="md:col-span-3">
                <label className="block text-xs font-medium text-purple-900 mb-1">Role (Select or Type)</label>
                <input list="preset-roles" type="text" value={creditRole} onChange={e => setCreditRole(e.target.value)} placeholder="e.g. Lead Guitar" className="w-full border-purple-200 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none" />
                <datalist id="preset-roles">
                  <option value="Artist" />
                  <option value="Vocalist" />
                  <option value="Lyricist" />
                  <option value="Melody" />
                  <option value="Music" />
                  <option value="Mix & Mastering" />
                  <option value="Lead Guitar" />
                  <option value="Flute" />
                  <option value="Violin" />
                  <option value="Director" />
                  <option value="Story" />
                  <option value="MUA" />
                  <option value="Assistant Director" />
                  <option value="Lighting" />
                  <option value="Starring" />
                </datalist>
              </div>
              <div className="md:col-span-3">
                <label className="block text-xs font-medium text-purple-900 mb-1">Image (Optional)</label>
                {creditImage ? (
                  <ImageUpload 
                    url={creditImage} 
                    onRemove={() => setCreditImage('')} 
                    compact 
                    className="h-9"
                  />
                ) : (
                  <ImageUpload 
                    onUpload={(url) => setCreditImage(url)} 
                    compact 
                    className="h-9"
                    label="Upload"
                  />
                )}
              </div>
              <div className="md:col-span-2">
                <button type="button" onClick={handleAddCredit} disabled={!creditName || !creditRole} className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-lg transition text-sm">
                  Add
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Sidebar Settings */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Featured Image</h3>
            <ImageUpload 
              url={coverImage}
              onUpload={url => setCoverImage(url)}
              onRemove={() => setCoverImage('')}
              className="aspect-square mb-4"
              label="Upload Cover"
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Metadata</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Genres & Types</label>
                <div className="flex flex-wrap gap-2">
                  {PREDEFINED_GENRES.map(genre => (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => handleGenreToggle(genre)}
                      className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                        genres.includes(genre) 
                          ? 'bg-blue-600 border-blue-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Release Year</label>
                <input type="number" value={releaseYear} onChange={e => setReleaseYear(e.target.value)} min="1990" max="2099" className="w-full border-gray-300 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="flex items-center pt-2">
                <input type="checkbox" id="isFeatured" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} className="w-5 h-5 text-blue-600 rounded" />
                <label htmlFor="isFeatured" className="ml-3 font-medium text-gray-700">Feature on Home Page</label>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">External Links</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">YouTube URL</label>
                <input type="url" value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} className="w-full border-gray-300 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Spotify URL</label>
                <input type="url" value={spotifyUrl} onChange={e => setSpotifyUrl(e.target.value)} className="w-full border-gray-300 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Facebook URL</label>
                <input type="url" value={facebookUrl} onChange={e => setFacebookUrl(e.target.value)} className="w-full border-gray-300 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
