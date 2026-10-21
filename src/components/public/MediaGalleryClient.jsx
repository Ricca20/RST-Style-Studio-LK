'use client';

import { useState, useEffect, useEffectEvent, useSyncExternalStore } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, Download, ExternalLink, Maximize2 } from 'lucide-react';
import Equalizer from '@/components/music/Equalizer';

const DEFAULT_MEDIA_IMAGES = [
  '/Media/0.png',
  '/Media/DASA WASAGENA COVER.png',
  '/Media/20251102_132928.jpg',
  '/Media/20251102_133420.jpg',
  '/Media/20260405_181524.jpg',
  '/Media/20260405_181540.jpg',
  '/Media/IMG_1872.JPEG',
  '/Media/IMG_1909.JPEG',
  '/Media/IMG_4315.JPG',
  '/Media/IMG_9481.JPG',
  '/Media/156063431_10222673115284155_4423779512645169005_n.jpg',
  '/Media/156707446_10222673121724316_6136063186524725267_n.jpg',
  '/Media/156813173_10222673077683215_2147553241336599257_n.jpg',
  '/Media/156825863_10222673075643164_1181271398179974721_n.jpg',
  '/Media/156988647_10222673123004348_336129329861291130_n.jpg',
  '/Media/157068451_10222673117444209_7962225358266021650_n.jpg',
  '/Media/157237246_10222673122524336_5777224488825589045_n.jpg',
  '/Media/157284175_10222673113244104_5267063594493283371_n.jpg',
  '/Media/157522585_10222673114564137_5154424459188684319_n.jpg',
  '/Media/157692584_10222673119244254_7365903355606165553_n.jpg',
  '/Media/471202909_10232184637866275_3021973107202086470_n.jpg',
  '/Media/48356043_10215952512793293_2061506734970634240_n.jpg',
  '/Media/48358773_10215952506553137_3146751984627875840_n.jpg',
  '/Media/48359867_10215952502353032_9182893816925913088_n.jpg',
  '/Media/48362418_10215952510593238_1906466786476294144_n.jpg',
  '/Media/48364388_10215952507313156_1096593695714574336_n.jpg',
  '/Media/48372541_10215952475152352_8719496060055060480_n.jpg',
  '/Media/48373782_10215952508553187_7355621979665203200_n.jpg',
  '/Media/48374426_10215952513353307_6737462798634188800_n.jpg',
  '/Media/48386620_10215952474792343_1169310532872699904_n.jpg',
  '/Media/48388367_10215952511033249_2232116476783886336_n.jpg',
  '/Media/48403654_10215952501713016_3099030392548622336_n.jpg',
  '/Media/494389732_10233474783599112_8365896070705487941_n.jpg',
  '/Media/494474894_10233474787839218_3072384789398701485_n.jpg',
  '/Media/494512292_10233474783359106_347289382826221763_n.jpg',
  '/Media/494598869_10233474785319155_3713332982978798550_n.jpg',
  '/Media/49515761_10216093198870357_5421445494419226624_n.jpg',
  '/Media/49542290_10216093197870332_7552586925001932800_n.jpg',
  '/Media/49639288_10216093197470322_1589667477577531392_n.jpg',
  '/Media/49676581_10216093201190415_539466828888408064_n.jpg',
  '/Media/49731928_10216093196710303_5161138341336317952_n.jpg',
  '/Media/49895515_10216093191470172_3018574479589638144_n.jpg',
  '/Media/50000508_10216093197350319_5102370196450967552_n.jpg',
  '/Media/504263705_10234007795204069_2299769300316919386_n.jpg',
  '/Media/504273207_10234007794044040_8691395174553651975_n.jpg',
  '/Media/505089007_10233990862460761_3594436859927635125_n.jpg',
  '/Media/505673367_10234007793924037_8547289014636539206_n.jpg',
  '/Media/505918218_10234007792764008_4685879429940999270_n.jpg',
];

const subscribeNoop = () => () => {};

/** Studio photo wall: bundled photos plus anything uploaded in Admin → Media Library. */
export default function MediaGalleryClient() {
  const [images, setImages] = useState(DEFAULT_MEDIA_IMAGES);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [downloadingIndex, setDownloadingIndex] = useState(null);
  // true only in the browser (false during server render), without an extra effect
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);

  useEffect(() => {
    let ignore = false;
    // Newly uploaded images from the admin media library (Supabase 'media' bucket)
    fetch('/api/public/media')
      .then((res) => (res.ok ? res.json() : []))
      .then((cloudUrls) => {
        if (ignore || !Array.isArray(cloudUrls) || cloudUrls.length === 0) return;
        setImages(Array.from(new Set([...cloudUrls, ...DEFAULT_MEDIA_IMAGES])));
      })
      .catch((err) => console.error('Failed to load admin uploaded media:', err));
    return () => { ignore = true; };
  }, []);

  const step = (delta) => setLightboxIndex((prev) => (prev + delta + images.length) % images.length);

  const handleDownload = async (url, index) => {
    setDownloadingIndex(index);
    try {
      const response = await fetch(url);
      const blobUrl = window.URL.createObjectURL(await response.blob());
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = decodeURIComponent(url.split('/').pop() || `RST-Studio-${index + 1}.jpg`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, '_blank', 'noopener');
    } finally {
      setDownloadingIndex(null);
    }
  };

  const onKeyDown = useEffectEvent((e) => {
    if (lightboxIndex === null) return;
    if (e.key === 'Escape') setLightboxIndex(null);
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
  });

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const lightbox = lightboxIndex !== null && mounted && createPortal(
    <div className="fixed inset-0 z-[100] bg-ink/95 text-paper flex flex-col" role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={() => setLightboxIndex(null)}>
      <div className="flex items-center justify-between p-5 md:p-8" onClick={(e) => e.stopPropagation()}>
        <p className="eyebrow text-paper/60 flex items-center gap-2"><Equalizer bars={3} className="h-3 text-lime" /> Frame {String(lightboxIndex + 1).padStart(2, '0')} / {images.length}</p>
        <button onClick={() => setLightboxIndex(null)} aria-label="Close" className="w-12 h-12 rounded-full bg-paper/10 hover:bg-lime hover:text-ink flex items-center justify-center transition-colors"><X className="w-5 h-5" /></button>
      </div>
      <div className="relative flex-1 mx-5 md:mx-24" onClick={(e) => e.stopPropagation()}>
        <Image src={images[lightboxIndex]} alt={`Studio photo ${lightboxIndex + 1}`} fill sizes="100vw" className="object-contain" />
      </div>
      <button onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Previous photo" className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-paper/10 hover:bg-lime hover:text-ink flex items-center justify-center transition-colors"><ChevronLeft className="w-6 h-6" /></button>
      <button onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Next photo" className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-paper/10 hover:bg-lime hover:text-ink flex items-center justify-center transition-colors"><ChevronRight className="w-6 h-6" /></button>
      <div className="flex justify-center gap-3 p-5 md:p-8" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => handleDownload(images[lightboxIndex], lightboxIndex)} className="inline-flex items-center gap-2 rounded-full bg-lime text-ink px-5 py-3 text-sm font-bold">
          <Download className="w-4 h-4" /> {downloadingIndex === lightboxIndex ? 'Saving…' : 'Download'}
        </button>
        <a href={images[lightboxIndex]} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-paper/25 px-5 py-3 text-sm font-bold hover:bg-paper hover:text-ink transition-colors">
          <ExternalLink className="w-4 h-4" /> Original
        </a>
      </div>
    </div>,
    document.body
  );

  return (
    <div>
      <p className="eyebrow text-smoke mb-8">{images.length} frames</p>
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 [&>*]:mb-4">
        {images.map((src, index) => (
          <button
            key={src}
            type="button"
            onClick={() => setLightboxIndex(index)}
            className="group relative block w-full overflow-hidden rounded-[1.25rem] bg-paper-2 break-inside-avoid"
          >
            <Image src={src} alt={`Studio photo ${index + 1}`} width={600} height={600} sizes="(max-width: 768px) 50vw, 25vw" className="w-full h-auto object-cover transition duration-700 group-hover:scale-105" />
            <span className="absolute inset-0 bg-ink/0 group-hover:bg-ink/30 transition-colors" />
            <span className="absolute top-3 left-3 rounded-full bg-paper/90 px-2.5 py-1 text-[0.65rem] font-bold tabular-nums">{String(index + 1).padStart(2, '0')}</span>
            <span className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-lime text-ink flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize2 className="w-4 h-4" />
            </span>
          </button>
        ))}
      </div>
      {lightbox}
    </div>
  );
}
