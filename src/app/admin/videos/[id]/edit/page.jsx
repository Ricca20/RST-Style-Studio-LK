import prisma from '@/lib/db';
import { redirect } from 'next/navigation';
import UnifiedSongForm from '@/components/admin/UnifiedSongForm';

export default async function EditVideo({ params }) {
  const { id } = await params;
  
  const video = await prisma.song.findUnique({
    where: { id },
    include: {
      contributions: {
        orderBy: { createdAt: 'asc' }
      }
    }
  });

  if (!video || video.projectType !== 'MUSIC_VIDEO') {
    redirect('/admin/videos');
  }

  return <UnifiedSongForm isEdit={true} initialData={video} projectType="MUSIC_VIDEO" />;
}
