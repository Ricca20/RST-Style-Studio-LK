import { ImageResponse } from 'next/og';

import fs from 'fs';
import path from 'path';

// Image metadata
export const size = {
  width: 512,
  height: 512,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
  // Read the local logo file
  const logoPath = path.join(process.cwd(), 'public', 'logo.PNG');
  const logoBuffer = fs.readFileSync(logoPath);
  // Convert buffer to base64
  const logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
        }}
      >
        <img 
          src={logoBase64}
          style={{ width: '130%', height: '130%', objectFit: 'contain' }} 
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
