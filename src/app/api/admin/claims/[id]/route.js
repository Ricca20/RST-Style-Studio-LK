import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/server-auth';
import prisma from '@/lib/db';

export async function PATCH(req, { params }) {
  try {
    const auth = await requireRole(['SUPER_ADMIN', 'ADMIN']);
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const { id } = await params;
    const body = await req.json();
    const { status } = body; // 'APPROVED' or 'REJECTED'

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Update the claim status
    const claim = await prisma.claimRequest.update({
      where: { id },
      data: { status },
      include: {
        user: { include: { Profile: true } },
        song: true
      }
    });

    // If approved, create the contribution record
    if (status === 'APPROVED') {
      const profile = claim.user.Profile; // Note: In prisma schema it's actually just profile relation, I need to check how it's defined
      // Wait, let's verify the relation. The schema has: `Profile Profile?` inside `User` model?
      // No, wait, in schema.prisma, `Profile` has `userId String? @unique` and `user User?`. 
      // So to get the profile from userId, we can just query it.
      
      const userProfile = await prisma.profile.findUnique({
        where: { userId: claim.userId }
      });

      if (userProfile) {
        // Create the Contribution
        await prisma.contribution.upsert({
          where: {
            songId_name_role: {
              songId: claim.songId,
              name: userProfile.name,
              role: claim.role
            }
          },
          update: {
            profileId: userProfile.id
          },
          create: {
            songId: claim.songId,
            profileId: userProfile.id,
            name: userProfile.name,
            role: claim.role,
            imageUrl: userProfile.imageUrl
          }
        });
      }
    }

    return NextResponse.json(claim);
  } catch (error) {
    console.error('Error updating claim:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
