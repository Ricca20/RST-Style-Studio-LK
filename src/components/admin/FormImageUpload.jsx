'use client';
import { useState } from 'react';
import ImageUpload from './ImageUpload';

export default function FormImageUpload({ name, defaultValue, label = "Upload Image" }) {
  const [url, setUrl] = useState(defaultValue || '');

  return (
    <div>
      <input type="hidden" name={name} value={url} />
      {url ? (
        <div className="relative group border rounded-xl overflow-hidden aspect-video max-w-sm mb-2">
          <img src={url} alt="OG Image Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
            <button 
              type="button" 
              onClick={() => setUrl('')} 
              className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div className="aspect-video max-w-sm border-2 border-dashed rounded-xl flex items-center justify-center bg-gray-50 mb-2">
          <ImageUpload 
            onUpload={uploadedUrl => setUrl(uploadedUrl)} 
            compact 
            label={label} 
          />
        </div>
      )}
    </div>
  );
}
