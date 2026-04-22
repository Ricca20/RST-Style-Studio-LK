import prisma from '@/lib/db';
import { redirect } from 'next/navigation';
import { createSlug } from '@/lib/slugify';

export default function NewSong() {
  async function createSong(formData) {
    'use server';
    const titleEn = formData.get('titleEn');
    const titleSi = formData.get('titleSi');
    const titleIt = formData.get('titleIt') || null;
    const genre = formData.get('genre') || null;
    const releaseYear = formData.get('releaseYear') ? parseInt(formData.get('releaseYear')) : null;
    const isFeatured = formData.get('isFeatured') === 'on';
    const youtubeUrl = formData.get('youtubeUrl') || null;
    const spotifyUrl = formData.get('spotifyUrl') || null;

    const slug = createSlug(titleEn || titleSi);

    await prisma.song.create({
      data: {
        titleEn, titleSi, titleIt,
        slug, genre, releaseYear, isFeatured,
        youtubeUrl, spotifyUrl
      }
    });

    redirect('/admin/songs');
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Song</h1>
      
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <form action={createSong} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title (English) *</label>
              <input type="text" name="titleEn" required className="w-full border-gray-300 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title (Sinhala) *</label>
              <input type="text" name="titleSi" required className="w-full border-gray-300 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title (Italian)</label>
              <input type="text" name="titleIt" className="w-full border-gray-300 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Genre</label>
              <input type="text" name="genre" className="w-full border-gray-300 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Release Year</label>
              <input type="number" name="releaseYear" min="1990" max="2099" className="w-full border-gray-300 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Media Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">YouTube URL</label>
                <input type="url" name="youtubeUrl" className="w-full border-gray-300 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Spotify URL</label>
                <input type="url" name="spotifyUrl" className="w-full border-gray-300 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none" />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center">
            <input type="checkbox" id="isFeatured" name="isFeatured" className="w-5 h-5 text-blue-600 rounded" />
            <label htmlFor="isFeatured" className="ml-3 font-medium text-gray-700">Feature this song on the Home Page</label>
          </div>

          <div className="pt-6">
            <button type="submit" className="bg-gray-900 text-white font-bold px-8 py-3 rounded-lg hover:bg-blue-600 transition shadow-md">
              Save Song
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
  
