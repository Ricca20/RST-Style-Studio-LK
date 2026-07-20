'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, Download, Sparkles, Image as ImageIcon, ExternalLink } from 'lucide-react';

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

export default function MediaGalleryClient() {
  const [images, setImages] = useState(DEFAULT_MEDIA_IMAGES);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [downloadingIndex, setDownloadingIndex] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Fetch newly uploaded images from Admin Dashboard (Supabase 'media' bucket)
    const fetchAdminMedia = async () => {
      try {
        const res = await fetch('/api/public/media');
        if (res.ok) {
          const cloudUrls = await res.json();
          if (Array.isArray(cloudUrls) && cloudUrls.length > 0) {
            // Prepend admin-uploaded cloud images ahead of static studio photos
            const combined = Array.from(new Set([...cloudUrls, ...DEFAULT_MEDIA_IMAGES]));
            setImages(combined);
          }
        }
      } catch (err) {
        console.error('Failed to load admin uploaded media:', err);
      }
    };
    fetchAdminMedia();
  }, []);

  // Reliable Universal Download Handler
  const handleDownload = async (url, index, e) => {
    if (e) e.stopPropagation();
    setDownloadingIndex(index);
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      const rawName = url.split('/').pop() || `RST-Studio-Moment-${index + 1}.jpg`;
      link.download = decodeURIComponent(rawName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      const link = document.createElement('a');
      link.href = url;
      link.download = `RST-Studio-Moment-${index + 1}`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setDownloadingIndex(null);
    }
  };

  const handleKeyDown = (e) => {
    if (lightboxIndex === null) return;
    if (e.key === 'Escape') setLightboxIndex(null);
    if (e.key === 'ArrowRight') {
      setLightboxIndex((prev) => (prev + 1) % images.length);
    }
    if (e.key === 'ArrowLeft') {
      setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, images.length]);

  // Render Fullscreen Lightbox via React Portal directly to document.body
  const renderLightboxModal = () => {
    if (lightboxIndex === null || !mounted || typeof document === 'undefined') return null;

    return createPortal(
      <div
        onClick={() => setLightboxIndex(null)}
        className="fixed inset-0 z-[999999] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-between p-4 sm:p-8 select-none overflow-hidden cursor-pointer"
      >
        {/* Top Header Bar */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-7xl flex items-center justify-between z-30 pt-2 cursor-default"
        >
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white font-mono text-xs shadow-xl">
            <ImageIcon className="w-4 h-4 text-[#0ea5e9]" />
            <span>STUDIO MOMENT {String(lightboxIndex + 1).padStart(2, '0')} {'//'} {images.length}</span>
          </div>

          <button
            onClick={() => setLightboxIndex(null)}
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-rose-600 text-white border border-white/20 flex items-center justify-center transition-all hover:scale-110 shadow-xl cursor-pointer"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Fixed Symmetrical Navigation Arrows */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
          }}
          className="fixed left-6 sm:left-10 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 hover:bg-[#0ea5e9] text-white border border-white/20 flex items-center justify-center transition-all hover:scale-110 shadow-2xl z-40 cursor-pointer"
          aria-label="Previous Image"
        >
          <ChevronLeft className="w-7 h-7" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setLightboxIndex((prev) => (prev + 1) % images.length);
          }}
          className="fixed right-6 sm:right-10 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 hover:bg-[#0ea5e9] text-white border border-white/20 flex items-center justify-center transition-all hover:scale-110 shadow-2xl z-40 cursor-pointer"
          aria-label="Next Image"
        >
          <ChevronRight className="w-7 h-7" />
        </button>

        {/* Center Main Viewport: Photo */}
        <div className="w-full flex-1 flex items-center justify-center overflow-hidden py-4">
          <img
            onClick={(e) => e.stopPropagation()}
            src={images[lightboxIndex]}
            alt={`Studio Moment ${lightboxIndex + 1}`}
            className="max-w-[85vw] max-h-[75vh] object-contain rounded-2xl shadow-[0_0_90px_rgba(0,0,0,0.95)] border border-white/20 bg-black/40 cursor-default"
          />
        </div>

        {/* Bottom Actions Toolbar */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="z-30 pb-2 flex items-center gap-4 cursor-default"
        >
          <button
            onClick={(e) => handleDownload(images[lightboxIndex], lightboxIndex, e)}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-[#0ea5e9] to-cyan-500 hover:from-cyan-400 hover:to-[#0ea5e9] text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_25px_rgba(14,165,233,0.6)] hover:scale-105 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{downloadingIndex === lightboxIndex ? 'DOWNLOADING HD...' : 'DOWNLOAD HIGH-RES'}</span>
          </button>

          <a
            href={images[lightboxIndex]}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 border border-white/15 transition-all hover:scale-105 cursor-pointer"
          >
            <ExternalLink className="w-4 h-4 text-cyan-300" />
            <span>OPEN FULL SIZE</span>
          </a>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div className="w-full">
      {/* Top Gallery Header */}
      <div className="flex items-center justify-between mb-8 px-2 font-mono text-xs text-slate-400 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#0ea5e9]" />
          <span>STUDIO MOMENTS ARCHIVE // <strong className="text-white">{images.length} CAPTURES</strong></span>
        </div>
        <span className="text-cyan-300 font-bold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#0ea5e9] animate-pulse" />
          HD DOWNLOAD ENABLED
        </span>
      </div>

      {/* Pure Visual Moments Wall */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((src, index) => {
          const isFeatured = index === 0 || index === 7 || index === 14;
          return (
            <div
              key={index}
              onClick={() => setLightboxIndex(index)}
              className={`group relative rounded-3xl overflow-hidden border border-white/15 hover:border-[#0ea5e9] transition-all duration-500 cursor-pointer shadow-xl bg-black/60 ${
                isFeatured ? 'sm:col-span-2 sm:row-span-2 h-[360px] sm:h-[500px]' : 'h-[260px]'
              }`}
            >
              {/* Studio Photo */}
              <img
                src={src}
                alt={`Studio Moment ${index + 1}`}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-out"
              />

              {/* Quick Download Button on Hover */}
              <button
                onClick={(e) => handleDownload(src, index, e)}
                title="Download High-Res Image"
                className="absolute bottom-4 left-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 px-3.5 py-1.5 rounded-full bg-black/80 hover:bg-[#0ea5e9] text-white border border-white/20 flex items-center gap-1.5 font-mono text-[11px] font-bold shadow-lg"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{downloadingIndex === index ? 'SAVING...' : 'DOWNLOAD'}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Render Portal Modal */}
      {renderLightboxModal()}
    </div>
  );
}
