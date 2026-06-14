'use client';

import { useState } from 'react';
import { Trash2, Link as LinkIcon, FileImage, File } from 'lucide-react';
import { deleteMediaFile } from '@/lib/media-actions';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

export default function MediaListClient({ initialFiles }) {
  const [files, setFiles] = useState(initialFiles);
  const [deleting, setDeleting] = useState(null);
  const searchParams = useSearchParams();

  const searchQuery = searchParams.get('search')?.toLowerCase() || '';

  const filteredFiles = files.filter(f => 
    f.name.toLowerCase().includes(searchQuery)
  );

  const handleDelete = async (fileName) => {
    if (!confirm('Are you sure you want to permanently delete this file? This might break images currently in use on the website.')) return;
    
    setDeleting(fileName);
    try {
      await deleteMediaFile(fileName);
      setFiles(files.filter(f => f.name !== fileName));
    } catch (error) {
      alert('Failed to delete file.');
    } finally {
      setDeleting(null);
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isImage = (mimetype) => mimetype?.startsWith('image/');

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {filteredFiles.map(file => (
        <div key={file.id} className="border rounded-xl overflow-hidden group hover:shadow-md transition-all bg-gray-50 flex flex-col">
          <div className="aspect-square bg-gray-100 relative flex items-center justify-center border-b overflow-hidden">
            {isImage(file.metadata?.mimetype) ? (
              <Image 
                src={file.publicUrl} 
                alt={file.name} 
                fill 
                className="object-cover"
                unoptimized
              />
            ) : (
              <File className="w-10 h-10 text-gray-400" />
            )}
            
            {/* Hover Actions */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button 
                onClick={() => copyToClipboard(file.publicUrl)}
                className="p-2 bg-white text-gray-900 rounded-full hover:bg-gray-200 transition"
                title="Copy Link"
              >
                <LinkIcon className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleDelete(file.name)}
                disabled={deleting === file.name}
                className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition disabled:opacity-50"
                title="Delete File"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="p-3">
            <p className="text-xs font-medium text-gray-900 truncate" title={file.name}>{file.name}</p>
            <div className="flex justify-between items-center mt-1">
              <span className="text-[10px] text-gray-500 uppercase">{file.metadata?.mimetype?.split('/')[1] || 'FILE'}</span>
              <span className="text-[10px] text-gray-500">{formatSize(file.metadata?.size)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
