'use client';

import { useState, useEffect } from 'react';
import { Trash2, Copy, Image as ImageIcon, File, Loader2, ExternalLink, CheckSquare, Square } from 'lucide-react';
import { toast } from 'sonner';
import ConfirmModal from '@/components/ui/ConfirmModal';
import ImageUpload from '@/components/admin/ImageUpload';

export default function AdminMediaPage() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const fetchMedia = async () => {
    try {
      const res = await fetch('/api/admin/media');
      if (!res.ok) throw new Error('Failed to fetch media');
      const data = await res.json();
      setMedia(data);
    } catch (error) {
      toast.error('Error loading media library');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    
    // Check if it's a bulk delete array or a single object
    const isBulk = Array.isArray(deleteTarget);
    const filesToDelete = isBulk ? deleteTarget.map(f => f.name) : [deleteTarget.name];

    try {
      const res = await fetch('/api/admin/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files: filesToDelete })
      });
      if (!res.ok) throw new Error('Failed to delete file(s)');
      toast.success(isBulk ? `${filesToDelete.length} files deleted successfully` : 'File deleted successfully');
      setMedia(media.filter(m => !filesToDelete.includes(m.name)));
      if (isBulk) {
        setSelectedFiles([]);
        setIsSelectMode(false);
      }
      setDeleteTarget(null);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleSelection = (file) => {
    if (selectedFiles.some(f => f.name === file.name)) {
      setSelectedFiles(selectedFiles.filter(f => f.name !== file.name));
    } else {
      setSelectedFiles([...selectedFiles, file]);
    }
  };

  const selectAll = () => {
    if (selectedFiles.length === media.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles([...media]);
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard');
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Media Library</h1>
          <p className="text-gray-500 mt-1">Manage and upload your studio assets.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Upload New Media</h2>
        <div className="w-full max-w-md h-32">
          <ImageUpload 
            onUploadMultiple={(urls) => {
              toast.success(`Successfully uploaded ${urls.length} file(s)`);
              fetchMedia();
            }}
            onUpload={(url) => {
              toast.success('File uploaded successfully');
              fetchMedia();
            }}
            multiple={true}
            label="Drag & Drop or Click to Upload"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden shadow-sm">
        <div className="p-5 border-b flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-4">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-gray-400" /> All Assets
            </h2>
            <span className="text-sm font-medium bg-white px-3 py-1 rounded-full border text-gray-600 shadow-sm">
              {media.length} files
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isSelectMode && selectedFiles.length > 0 && (
              <button 
                onClick={() => setDeleteTarget(selectedFiles)}
                className="text-sm font-medium bg-red-600 text-white px-4 py-1.5 rounded-lg shadow-sm hover:bg-red-700 transition flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Delete ({selectedFiles.length})
              </button>
            )}
            {isSelectMode && (
              <button 
                onClick={selectAll}
                className="text-sm font-medium bg-white border text-gray-700 px-4 py-1.5 rounded-lg shadow-sm hover:bg-gray-50 transition"
              >
                {selectedFiles.length === media.length ? 'Deselect All' : 'Select All'}
              </button>
            )}
            <button 
              onClick={() => { setIsSelectMode(!isSelectMode); setSelectedFiles([]); }}
              className={`text-sm font-medium px-4 py-1.5 rounded-lg shadow-sm transition flex items-center gap-2 border ${isSelectMode ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              <CheckSquare className="w-4 h-4" /> {isSelectMode ? 'Cancel Selection' : 'Bulk Select'}
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-500" />
            <p>Loading media library...</p>
          </div>
        ) : media.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium text-gray-900">No media found</p>
            <p>Your uploaded files will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1 p-1 bg-gray-100">
            {media.map((file) => {
              const isImage = file.metadata?.mimetype?.startsWith('image/') || file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i);
              const isSelected = selectedFiles.some(f => f.name === file.name);

              return (
                <div 
                  key={file.id} 
                  className={`group relative aspect-square bg-white border overflow-hidden ${isSelected ? 'border-blue-500 ring-2 ring-blue-500' : 'border-transparent hover:border-gray-300'} ${isSelectMode ? 'cursor-pointer' : ''}`}
                  onClick={() => isSelectMode && toggleSelection(file)}
                >
                  {isSelectMode && (
                    <div className="absolute top-2 left-2 z-10">
                      <div className={`w-6 h-6 rounded flex items-center justify-center border ${isSelected ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white/80 border-gray-300 text-transparent'}`}>
                        <CheckSquare className="w-4 h-4" />
                      </div>
                    </div>
                  )}

                  {isImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={file.publicUrl} 
                      alt={file.name} 
                      className={`w-full h-full object-cover transition-transform duration-500 ${isSelectMode ? '' : 'group-hover:scale-110'} ${isSelected ? 'opacity-80 scale-95' : ''}`}
                      loading="lazy"
                    />
                  ) : (
                    <div className={`w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400 transition-transform ${isSelected ? 'opacity-80 scale-95' : ''}`}>
                      <File className="w-10 h-10 mb-2" />
                      <span className="text-xs truncate w-3/4 text-center">{file.name.split('.').pop().toUpperCase()}</span>
                    </div>
                  )}
                  
                  {/* Overlay */}
                  {!isSelectMode && (
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); copyToClipboard(file.publicUrl); }}
                          className="p-1.5 bg-white/20 hover:bg-white/40 rounded-md text-white backdrop-blur-sm transition"
                          title="Copy URL"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <a 
                          href={file.publicUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 bg-white/20 hover:bg-white/40 rounded-md text-white backdrop-blur-sm transition"
                          title="Open in new tab"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setDeleteTarget(file); }}
                          className="p-1.5 bg-red-500/80 hover:bg-red-600 rounded-md text-white backdrop-blur-sm transition ml-auto"
                          title="Delete file"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div>
                        <p className="text-white text-xs font-medium truncate drop-shadow-md" title={file.name}>{file.name}</p>
                        <p className="text-white/70 text-[10px] font-medium">{formatBytes(file.metadata?.size)}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={Array.isArray(deleteTarget) ? "Delete Multiple Files" : "Delete Media File"}
        description={`Are you sure you want to delete ${Array.isArray(deleteTarget) ? `these ${deleteTarget.length} files` : `"${deleteTarget?.name}"`}? This will break any image links currently using ${Array.isArray(deleteTarget) ? 'these files' : 'this file'} across your website. This action cannot be undone.`}
        confirmText="Delete Permanently"
        isLoading={isDeleting}
      />
    </div>
  );
}
