import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { z } from 'zod';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

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
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  language: z.enum(['si', 'en', 'it']).optional().default('en')
});

export async function POST(request) {
  try {
    // Each request sends an email, so limit per IP and per address to stop inbox flooding
    if (!(await rateLimit(`game-register:${getClientIp(request)}`, 5, 60 * 60 * 1000)).success) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    if (!(await rateLimit(`game-register-email:${validatedData.email.toLowerCase()}`, 3, 60 * 60 * 1000)).success) {
      return NextResponse.json({ error: 'A verification email was sent recently. Please check your inbox.' }, { status: 429 });
    }

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
    const verificationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    if (existingPlayer) {
      if (existingPlayer.email !== validatedData.email) {
        return NextResponse.json({ error: 'Username is already taken' }, { status: 400 });
      }
      
      // Same email: send a fresh link. It also works as a sign-in link on a new
      // device, so an already-verified player stays verified (otherwise anyone
      // could un-verify an account just by knowing its email).
      await prisma.gamePlayer.update({
        where: { id: existingPlayer.id },
        data: { verificationToken, verificationExpiresAt, language: validatedData.language }
      });
      
    } else {
      // Create new player
      await prisma.gamePlayer.create({
        data: {
          email: validatedData.email,
          username: validatedData.username,
          language: validatedData.language,
          verificationToken,
          verificationExpiresAt
        }
      });
    }

    // Generate Verification URL
    const appUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
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
      return NextResponse.json({ error: 'Validation Error', details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to register' }, { status: 500 });
  }
}
