import Image from 'next/image';

/**
 * A vinyl record: CSS grooves, a centre label (cover image or text) and a spindle hole.
 * Size it with the parent (it fills its width and stays square).
 */
export default function Vinyl({ image, label = 'RST', spinning = false, className = '', sizes = '300px' }) {
  return (
    <div className={`relative aspect-square w-full vinyl shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)] ${spinning ? 'spin-record' : ''} ${className}`}>
      <div className="absolute inset-[33%] rounded-full overflow-hidden bg-lime flex items-center justify-center ring-4 ring-black/40">
        {image ? (
          <Image src={image} alt="" fill sizes={sizes} className="object-cover" />
        ) : (
          <span className="font-display font-extrabold text-ink text-[clamp(0.5rem,2.5vw,1.1rem)] tracking-tight">{label}</span>
        )}
      </div>
      <div className="absolute left-1/2 top-1/2 w-[4%] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full bg-paper" />
    </div>
  );
}
