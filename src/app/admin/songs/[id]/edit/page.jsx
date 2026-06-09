import prisma from '@/lib/db';
import { redirect } from 'next/navigation';
import UnifiedSongForm from '@/components/admin/UnifiedSongForm';

export default async function EditSong({ params }) {
  const { id } = await params;
  
  const song = await prisma.song.findUnique({
    where: { id },
    include: {
      contributions: {
        orderBy: { createdAt: 'asc' }
      }
    }
  });

  if (!song) {
    redirect('/admin/songs');
  }

  return <UnifiedSongForm isEdit={true} initialData={song} />;
}
