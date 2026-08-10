import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { z } from 'zod';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Initialize Nodemailer transporter with Gmail
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports (STARTTLS)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, '') : undefined
  }
});

const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
});

export async function POST(request) {
  try {
    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    // Check if email or username already exists
    const existingPlayer = await prisma.gamePlayer.findFirst({
      where: {
        OR: [
          { email: validatedData.email },
          { username: validatedData.username }
        ]
      }
    });

    const verificationToken = crypto.randomBytes(32).toString('hex');

    if (existingPlayer) {
      if (existingPlayer.email !== validatedData.email) {
        return NextResponse.json({ error: 'Username is already taken' }, { status: 400 });
      }
      
      // If same email, just resend verification (update token)
      await prisma.gamePlayer.update({
        where: { id: existingPlayer.id },
        data: { verificationToken, verifiedAt: null }
      });
      
    } else {
      // Create new player
      await prisma.gamePlayer.create({
        data: {
          email: validatedData.email,
          username: validatedData.username,
          verificationToken
        }
      });
    }

    // Generate Verification URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const verifyUrl = `${appUrl}/api/games/verify?token=${verificationToken}&email=${encodeURIComponent(validatedData.email)}`;

    // Send email via Nodemailer asynchronously to prevent hanging the API
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      transporter.sendMail({
        from: `"RST Style Studio" <${process.env.EMAIL_USER}>`,
        to: validatedData.email,
        subject: 'Verify your email to play Music Games!',
        html: `<p>Hello ${validatedData.username},</p>
               <p>Click the link below to verify your email and start playing the music games on RST Style Studio LK:</p>
               <a href="${verifyUrl}">Verify Email & Play</a>
               <p>If you didn't request this, please ignore this email.</p>`
      }).catch(emailErr => {
        console.error("Failed to send verification email with Nodemailer:", emailErr);
      });
    } else {
      console.warn("Gmail credentials not found in environment variables.");
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Verification email sent. Please check your inbox.'
    }, { status: 200 });

  } catch (error) {
    console.error('Error in game registration:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation Error', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to register' }, { status: 500 });
  }
}
