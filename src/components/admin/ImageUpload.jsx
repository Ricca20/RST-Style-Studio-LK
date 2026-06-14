'use client';
import { useState, useRef } from 'react';
import { uploadImage } from '@/lib/uploadImage';
import { ImagePlus, Loader2, X } from 'lucide-react';
import imageCompression from 'browser-image-compression';

export default function ImageUpload({ 
  url, 
  onUpload, 
  onUploadMultiple,
  onRemove, 
  className = '', 
  label = "Upload Image",
  compact = false,
  multiple = false
}) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const optimizeImage = async (file) => {
    if (file.type === 'image/svg+xml' || file.type === 'image/gif') return file;
    
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: 'image/webp'
    };

    try {
      const compressedFile = await imageCompression(file, options);
      const newFileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
      return new File([compressedFile], newFileName, { type: 'image/webp' });
    } catch (error) {
      console.error("Error compressing image:", error);
      return file;
    }
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      setIsUploading(true);
      if (multiple) {
        const optimizedFiles = await Promise.all(files.map(f => optimizeImage(f)));
        const uploadedUrls = await Promise.all(optimizedFiles.map(f => uploadImage(f)));
        if (onUploadMultiple) {
          onUploadMultiple(uploadedUrls);
        } else {
          uploadedUrls.forEach(url => onUpload(url));
        }
      } else {
        const optimizedFile = await optimizeImage(files[0]);
        const uploadedUrl = await uploadImage(optimizedFile);
        onUpload(uploadedUrl);
      }
    } catch (error) {
      alert('Failed to upload image(s). Make sure files are images and less than 5MB.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  if (url) {
    return (
      <div className={`relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt="Uploaded preview" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            type="button"
            onClick={onRemove}
            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer flex flex-col items-center justify-center text-gray-500 ${className}`}
      onClick={() => !isUploading && fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        accept="image/*" 
        multiple={multiple}
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileChange}
        disabled={isUploading}
      />
      {isUploading ? (
        <Loader2 className={`animate-spin text-blue-500 ${compact ? 'w-5 h-5' : 'w-8 h-8 mb-2'}`} />
      ) : (
        <ImagePlus className={`${compact ? 'w-5 h-5' : 'w-8 h-8 mb-2'} text-gray-400`} />
      )}
      {!compact && (
        <span className="text-sm font-medium">{isUploading ? 'Uploading...' : label}</span>
      )}
    </div>
  );
}
