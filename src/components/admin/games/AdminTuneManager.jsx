'use client';

import { useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import ChoiceContentManager from './ChoiceContentManager';

const MAX_AUDIO_BYTES = 5 * 1024 * 1024; // matches /api/admin/media

function AudioField({ value, onChange }) {
  const [isUploading, setIsUploading] = useState(false);

  const upload = async (file) => {
    if (!file) return;
    if (file.size > MAX_AUDIO_BYTES) {
      toast.error('Audio clips must be under 5MB. Trim it to a short preview.');
      return;
    }
    setIsUploading(true);
    try {
      const body = new FormData();
      body.append('file', file);
      const res = await fetch('/api/admin/media', { method: 'POST', body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      onChange(data.url);
      toast.success('Clip uploaded');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">Audio clip * <span className="text-gray-400 font-normal">(MP3, M4A, OGG or WAV, under 5MB, ideally 5–15 seconds)</span></label>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <label className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer shrink-0">
          {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {isUploading ? 'Uploading…' : value ? 'Replace clip' : 'Upload clip'}
          <input type="file" accept="audio/mpeg,audio/mp4,audio/ogg,audio/wav,.mp3,.m4a,.ogg,.wav" className="hidden" disabled={isUploading} onChange={(e) => upload(e.target.files?.[0])} />
        </label>
        {value && <audio controls src={value} className="w-full max-w-md h-10" />}
      </div>
    </div>
  );
}

export default function AdminTuneManager() {
  return (
    <ChoiceContentManager
      title="Name That Tune Clips"
      itemLabel="Clip"
      endpoint="/api/admin/games/tune"
      promptField="title"
      promptLabel="Prompt"
      extraDefaults={{ audioUrl: '' }}
      renderExtraFields={(formData, update) => (
        <AudioField value={formData.audioUrl} onChange={(audioUrl) => update({ audioUrl })} />
      )}
      extraColumnLabel="Clip"
      renderExtraCell={(clip) => <audio controls preload="none" src={clip.audioUrl} className="h-8 w-48" />}
    />
  );
}
