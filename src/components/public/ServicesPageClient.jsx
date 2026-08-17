'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  CheckCircle2,
  ChevronRight,
  MessageCircle,
  Music,
  X,
  Paperclip,
  DollarSign,
  Guitar,
  Calculator,
  Sliders,
  Sparkles,
  ArrowRight,
  Mic,
  Disc,
  Volume2,
  Send
} from 'lucide-react';
import { buildWhatsAppUrl } from '@/lib/services/whatsapp';
import TiltCard from '@/components/ui/TiltCard';

const ROLE_ORDER = [
  { key: 'LYRICS', label: 'Lyrics', description: 'Songwriter / Lyricist', emoji: '✍️', required: true },
  { key: 'MELODY', label: 'Melody', description: 'Melody Composer', emoji: '🎵', required: true },
  { key: 'MUSIC', label: 'Music Arrangement', description: 'Music Arranger / Producer', emoji: '🎹', required: true },
  { key: 'MIX_MASTER', label: 'Mix & Master', description: 'Mixing & Mastering Engineer', emoji: '🎛️', required: true },
];

const INSTRUMENT_ROLES = [
  { key: 'LEAD_GUITAR', label: 'Lead Guitar', emoji: '🎸' },
  { key: 'RHYTHM_GUITAR', label: 'Rhythm Guitar', emoji: '🎸' },
  { key: 'BASS_GUITAR', label: 'Bass Guitar', emoji: '🎸' },
  { key: 'FLUTE', label: 'Flute', emoji: '🪈' },
  { key: 'SITAR', label: 'Sitar', emoji: '🪕' },
  { key: 'VIOLIN', label: 'Violin', emoji: '🎻' },
  { key: 'DRUMS', label: 'Drums', emoji: '🥁' },
  { key: 'KEYBOARD', label: 'Keyboard', emoji: '🎹' },
  { key: 'TABLA', label: 'Tabla', emoji: '🪘' },
  { key: 'SINGING', label: 'Singing / Vocals', emoji: '🎤' },
];

const GENRES = [
  'Pop', 'Classical', 'Hip-Hop', 'R&B', 'Rock', 'Jazz', 'EDM',
  'Baila', 'Sinhala Folk', 'Bollywood', 'Lo-Fi', 'Acoustic', 'Other'
];

export default function ServicesPageClient({
  services = [],
  pricing = [],
  collaboratorsByRole = {},
  settings = null,
  locale = 'en'
}) {
  const [activeTab, setActiveTab] = useState('SERVICES'); // 'SERVICES' | 'PRICING' | 'WIZARD'
  
  // Quotation Wizard State
  const [step, setStep] = useState(1);
  const [selections, setSelections] = useState({});
  const [genre, setGenre] = useState('');
  const [description, setDescription] = useState('');
  const [attachmentUrls, setAttachmentUrls] = useState([]);
  const [attachmentInput, setAttachmentInput] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const t = (obj, key) => {
    if (!obj) return '';
    const kLoc = `${key}${locale.charAt(0).toUpperCase() + locale.slice(1)}`;
    return obj[kLoc] || obj[`${key}En`] || obj[key] || '';
  };

  const iconMap = {
    mic: 'mic_external_on',
    mix: 'tune',
    master: 'album',
    video: 'videocam',
    brand: 'palette',
    default: 'surround_sound',
  };

  const totalBudget = Object.values(selections).reduce((sum, sel) => sum + (sel?.price || 0), 0);
  const minBudget = Math.floor(totalBudget * 0.85);
  const maxBudget = Math.ceil(totalBudget * 1.15);

  const handleSelectPerson = (role, person, roleLabel) => {
    setSelections((prev) => {
      const current = prev[role];
      if (current && current.id === person.id) {
        const next = { ...prev };
        delete next[role];
        return next;
      }
      return { ...prev, [role]: { ...person, role, roleLabel } };
    });
  };

  const addAttachment = () => {
    const url = attachmentInput.trim();
    if (!url) return;
    setAttachmentUrls((prev) => [...prev, { url, name: url }]);
    setAttachmentInput('');
  };

  const removeAttachment = (index) => {
    setAttachmentUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => setStep((s) => Math.min(s + 1, 4));
  const handlePrev = () => setStep((s) => Math.max(s - 1, 1));

  const scrollToWizard = () => {
    setActiveTab('WIZARD');
    const el = document.getElementById('quotation-wizard-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const submitQuote = async () => {
    if (!name.trim() || !phone.trim()) return;
    setIsSubmitting(true);
    try {
      const selectionsArr = Object.values(selections);
      await fetch('/api/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          email,
          description,
          genre,
          selections: selectionsArr,
          attachments: attachmentUrls,
          estimatedBudget: totalBudget,
        }),
      });
      setIsSubmitted(true);
    } catch (e) {
      console.error('Submission failed:', e);
      alert('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openWhatsApp = () => {
    const selectionsArr = Object.values(selections);
    const teamList = selectionsArr
      .map((s) => `• ${s.roleLabel}: ${s.name} (Rs ${s.price?.toLocaleString()})`)
      .join('\n');
    const message = `Hello RST Style Studio!\n\nI am *${name}*.\n\n*Genre:* ${genre || 'Not specified'}\n\n*My Team:*\n${teamList}\n\n*Estimated Budget:* Rs ${minBudget.toLocaleString()} - Rs ${maxBudget.toLocaleString()}\n\n*Description:*\n${description || 'N/A'}\n\nPlease get back to me at ${phone}.`;
    const contactPhone = settings?.whatsapp || settings?.phone || '+94771234567';
    const waUrl = buildWhatsAppUrl(contactPhone, message);
    window.open(waUrl, '_blank');
  };

  return (
    <div className="w-full">
      {/* ═══════════════════════════════════════════════════════════
          STUDIO NAVIGATION & SECTION BAR
          ═══════════════════════════════════════════════════════════ */}
      <div className="flex items-center justify-start md:justify-center mb-12 overflow-x-auto pb-4 md:pb-0 px-2 no-scrollbar">
        <div className="inline-flex p-1.5 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-xl shadow-2xl shrink-0">
          <button
            onClick={() => setActiveTab('SERVICES')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-mono text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'SERVICES'
                ? 'bg-[#0ea5e9] text-white shadow-[0_0_20px_rgba(14,165,233,0.5)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sliders className="w-4 h-4 shrink-0" />
            RACK SERVICES ({services.length})
          </button>
          <button
            onClick={() => setActiveTab('PRICING')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-mono text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'PRICING'
                ? 'bg-[#0ea5e9] text-white shadow-[0_0_20px_rgba(14,165,233,0.5)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <DollarSign className="w-4 h-4 shrink-0" />
            ITEMIZED RATES ({pricing.length})
          </button>
          <button
            onClick={scrollToWizard}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-mono text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'WIZARD'
                ? 'bg-[#0ea5e9] text-white shadow-[0_0_20px_rgba(14,165,233,0.5)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Calculator className="w-4 h-4 shrink-0" />
            LIVE QUOTATION BUILDER
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 1: STUDIO CAPABILITIES RACK GRID
          ═══════════════════════════════════════════════════════════ */}
      {(activeTab === 'SERVICES' || activeTab === 'WIZARD') && (
        <section className="mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div>
              <span className="text-xs font-mono text-[#0ea5e9] uppercase tracking-widest block mb-2">
                FULLY MANAGEABLE VIA ADMIN DASHBOARD
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                ANALOG & DIGITAL <span className="text-[#0ea5e9]">STUDIO SERVICES</span>
              </h2>
            </div>
            <button
              onClick={scrollToWizard}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#0ea5e9] hover:bg-[#0ea5e9]/90 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(14,165,233,0.4)] cursor-pointer"
            >
              <Calculator className="w-4 h-4" />
              BUILD CUSTOM QUOTE NOW
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((svc, idx) => {
              const name = t(svc, 'name') || svc.nameEn || 'Studio Service';
              const desc = t(svc, 'description') || svc.descriptionEn || 'Professional studio service.';
              const iconName = iconMap[svc.icon] || svc.icon || iconMap.default;

              return (
                <TiltCard key={svc.id || idx}>
                  <div className="group relative bg-black/60 backdrop-blur-xl rounded-3xl border border-white/10 hover:border-[#0ea5e9]/60 p-6 flex flex-col justify-between h-full transition-all duration-300 shadow-2xl overflow-hidden">
                    {/* Hardware Corner Screws */}
                    <div className="absolute top-3 left-3 w-4 h-4 rounded-full bg-gray-950 border border-white/20 flex items-center justify-center text-white/30 text-[9px]">+</div>
                    <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-gray-950 border border-white/20 flex items-center justify-center text-white/30 text-[9px]">+</div>

                    {/* Rack Header */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                      <div className="flex items-center gap-1.5 font-mono text-[10px] text-gray-400 uppercase tracking-widest">
                        <span className="w-2 h-2 rounded-full bg-[#0ea5e9] shadow-[0_0_8px_#0ea5e9]" />
                        CH 0{idx + 1} {'//'} ACTIVE
                      </div>
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="Power OK" />
                        <div className="w-2 h-2 rounded-full bg-yellow-500" title="Signal Active" />
                      </div>
                    </div>

                    {/* Main Unit Details */}
                    <div className="flex-1 flex flex-col">
                      <div className="w-16 h-16 rounded-2xl bg-[#0ea5e9]/15 border border-[#0ea5e9]/30 flex items-center justify-center text-[#0ea5e9] mb-6 shadow-inner group-hover:scale-110 transition-transform">
                        {svc.icon === 'mic' ? <Mic className="w-8 h-8" /> :
                         svc.icon === 'mix' ? <Sliders className="w-8 h-8" /> :
                         svc.icon === 'master' ? <Disc className="w-8 h-8" /> :
                         svc.icon === 'video' ? <Volume2 className="w-8 h-8" /> :
                         <Music className="w-8 h-8" />}
                      </div>
                      <h3 className="text-2xl font-black text-white mb-3 group-hover:text-[#0ea5e9] transition-colors tracking-tight">
                        {name}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed mb-6 font-light">
                        {desc}
                      </p>
                    </div>

                    {/* Rack Footer */}
                    <div className="pt-5 border-t border-white/10 flex items-center justify-between mt-auto bg-black/40 backdrop-blur-sm -mx-6 -mb-6 p-6 rounded-b-3xl">
                      <div>
                        <span className="text-[10px] font-mono text-gray-500 uppercase block">STARTING RATE</span>
                        <span className="text-xl font-black text-white font-mono">
                          {svc.basePrice ? `Rs ${svc.basePrice.toLocaleString()}` : 'Custom Quote'}
                        </span>
                      </div>
                      <button
                        onClick={scrollToWizard}
                        className="px-4 py-2.5 rounded-xl bg-[#0ea5e9] hover:bg-[#0ea5e9]/90 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(14,165,233,0.3)] cursor-pointer"
                      >
                        <span>QUOTE</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </TiltCard>
              );
            })}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          SECTION 2: TRANSPARENT ITEMIZED RATES TABLE
          ═══════════════════════════════════════════════════════════ */}
      {(activeTab === 'PRICING' || activeTab === 'WIZARD') && pricing.length > 0 && (
        <section className="mb-20">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 text-xs font-mono uppercase tracking-widest mb-3">
              LIVE DB PRICING TARIFF
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
              FIXED <span className="text-[#0ea5e9]">ITEMIZED RATES</span>
            </h2>
            <p className="text-gray-400 text-sm sm:text-base font-light">
              All prices are transparently retrieved from your database and can be updated anytime from Admin Dashboard → Settings / Pricing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
            {pricing.map((item, idx) => (
              <div
                key={item.id || idx}
                className="group relative bg-black/60 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-[#0ea5e9]/50 flex items-center justify-between gap-4 transition-all shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0ea5e9]/15 border border-[#0ea5e9]/30 flex items-center justify-center text-[#0ea5e9] shrink-0 font-mono font-bold">
                    0{idx + 1}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg group-hover:text-[#0ea5e9] transition-colors">
                      {item.itemKey || item.name}
                    </h4>
                    <span className="text-xs font-mono text-gray-400 uppercase">
                      {item.type || 'STUDIO TARIFF'}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-mono text-gray-400 block">FIXED RATE</span>
                  <span className="text-xl font-black text-white font-mono">
                    {item.currency || 'Rs'} {item.price?.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          SECTION 3: INLINE INTERACTIVE STUDIO QUOTATION WIZARD
          ═══════════════════════════════════════════════════════════ */}
      <section id="quotation-wizard-section" className="py-12 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0ea5e9]/15 border border-[#0ea5e9]/30 text-[#0ea5e9] text-xs font-mono font-bold uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              INTERACTIVE QUOTE GENERATOR
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
              BUILD YOUR <span className="text-[#0ea5e9]">STUDIO QUOTE</span>
            </h2>
            <p className="text-gray-400 text-sm">
              Select your songwriting, melody, mixing engineers, and instrumentation to get a real-time instant estimate.
            </p>
          </div>

          {isSubmitted ? (
            /* Submission Success Screen */
            <div className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 text-center shadow-2xl relative overflow-hidden">
              <div className="w-20 h-20 bg-[#0ea5e9]/20 border border-[#0ea5e9]/40 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(14,165,233,0.4)]">
                <CheckCircle2 className="w-10 h-10 text-[#0ea5e9]" />
              </div>
              <h3 className="text-3xl font-black text-white mb-3">Quotation Request Submitted!</h3>
              <p className="text-gray-300 text-base max-w-lg mx-auto mb-8 leading-relaxed">
                Thank you, <strong className="text-white">{name}</strong>! We have saved your project inquiry in our database with an estimated budget range of <strong className="text-[#0ea5e9]">Rs {minBudget.toLocaleString()} – Rs {maxBudget.toLocaleString()}</strong>.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={openWhatsApp}
                  className="px-8 py-4 rounded-2xl bg-green-600 hover:bg-green-500 text-white font-mono text-sm font-bold flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(22,163,74,0.4)] transition-all cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5" /> Send Directly to Studio WhatsApp
                </button>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setStep(1);
                    setSelections({});
                  }}
                  className="px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-mono text-sm font-bold transition-all cursor-pointer"
                >
                  Start Another Quote
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
              {/* Hardware Screws */}
              <div className="absolute top-4 left-4 w-4 h-4 rounded-full bg-gray-900 border border-white/20 flex items-center justify-center text-white/30 text-[9px]">+</div>
              <div className="absolute top-4 right-4 w-4 h-4 rounded-full bg-gray-900 border border-white/20 flex items-center justify-center text-white/30 text-[9px]">+</div>

              {/* Progress Stepper Ribbon */}
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
                {[
                  { num: 1, title: 'Production Roles' },
                  { num: 2, title: 'Instrumentation' },
                  { num: 3, title: 'Project Details' },
                  { num: 4, title: 'Estimate & Submit' },
                ].map((s) => (
                  <div key={s.num} className="flex items-center gap-2">
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                        step === s.num
                          ? 'bg-[#0ea5e9] text-white shadow-[0_0_15px_#0ea5e9]'
                          : step > s.num
                          ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                          : 'bg-white/5 text-gray-500 border border-white/10'
                      }`}
                    >
                      {step > s.num ? '✓' : s.num}
                    </span>
                    <span className={`text-xs font-mono hidden sm:inline ${step === s.num ? 'text-white font-bold' : 'text-gray-400'}`}>
                      {s.title}
                    </span>
                  </div>
                ))}
              </div>

              {/* STEP 1: CORE ROLES */}
              {step === 1 && (
                <div>
                  <h3 className="text-2xl font-black text-white mb-2">Step 1: Select Core Production Team</h3>
                  <p className="text-gray-400 text-sm mb-6">
                    Pick your preferred songwriting, melody composer, and audio engineer.
                  </p>

                  <div className="space-y-6">
                    {ROLE_ORDER.map((roleObj) => {
                      const people = collaboratorsByRole[roleObj.key] || [];
                      const currentSelection = selections[roleObj.key];

                      return (
                        <div key={roleObj.key} className="p-5 rounded-2xl bg-white/5 border border-white/10">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h4 className="text-white font-bold text-base flex items-center gap-2">
                                <span>{roleObj.emoji}</span>
                                {roleObj.label}
                              </h4>
                              <p className="text-xs text-gray-400">{roleObj.description}</p>
                            </div>
                            {currentSelection && (
                              <span className="text-xs font-mono bg-[#0ea5e9]/20 text-[#0ea5e9] px-3 py-1 rounded-full border border-[#0ea5e9]/30 font-bold">
                                SELECTED: {currentSelection.name}
                              </span>
                            )}
                          </div>

                          {people.length === 0 ? (
                            <div className="text-xs text-gray-500 italic font-mono">
                              Studio default engineers assigned (Manage via Admin Dashboard → Roster / Collaborators).
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                              {people.map((person) => {
                                const isSelected = currentSelection?.id === person.id;
                                return (
                                  <button
                                    key={person.id}
                                    type="button"
                                    onClick={() => handleSelectPerson(roleObj.key, person, roleObj.label)}
                                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                                      isSelected
                                        ? 'bg-[#0ea5e9]/20 border-[#0ea5e9] text-white shadow-[0_0_15px_rgba(14,165,233,0.3)]'
                                        : 'bg-black/40 border-white/10 text-gray-300 hover:border-white/30'
                                    }`}
                                  >
                                    <div className="flex items-center gap-3 min-w-0">
                                      {person.imageUrl ? (
                                        <img src={person.imageUrl} alt={person.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                                      ) : (
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs shrink-0">
                                          {person.name.charAt(0)}
                                        </div>
                                      )}
                                      <div className="truncate">
                                        <div className="font-bold text-sm truncate">{person.name}</div>
                                        <div className="text-xs font-mono text-[#0ea5e9]">
                                          Rs {person.price?.toLocaleString()}
                                        </div>
                                      </div>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? 'bg-[#0ea5e9] border-[#0ea5e9] text-white' : 'border-white/20'}`}>
                                      {isSelected && '✓'}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2: INSTRUMENTS */}
              {step === 2 && (
                <div>
                  <h3 className="text-2xl font-black text-white mb-2">Step 2: Add Acoustic & Live Instrumentation</h3>
                  <p className="text-gray-400 text-sm mb-6">
                    Add session guitarists, flutists, sitar artists, or background vocalists.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {INSTRUMENT_ROLES.map((roleObj) => {
                      const people = collaboratorsByRole[roleObj.key] || [];
                      const currentSelection = selections[roleObj.key];

                      return (
                        <div key={roleObj.key} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-white font-bold text-sm flex items-center gap-2">
                              <span>{roleObj.emoji}</span> {roleObj.label}
                            </span>
                            {currentSelection && (
                              <span className="text-[10px] font-mono text-[#0ea5e9] font-bold">
                                ADDED: {currentSelection.name}
                              </span>
                            )}
                          </div>

                          {people.length === 0 ? (
                            <span className="text-xs text-gray-500 italic font-mono">Available on custom request</span>
                          ) : (
                            <div className="space-y-2">
                              {people.map((person) => {
                                const isSelected = currentSelection?.id === person.id;
                                return (
                                  <button
                                    key={person.id}
                                    type="button"
                                    onClick={() => handleSelectPerson(roleObj.key, person, roleObj.label)}
                                    className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                                      isSelected
                                        ? 'bg-[#0ea5e9]/20 border-[#0ea5e9] text-white'
                                        : 'bg-black/40 border-white/10 text-gray-300 hover:border-white/30'
                                    }`}
                                  >
                                    <span className="font-bold text-sm">{person.name}</span>
                                    <span className="font-mono text-xs text-[#0ea5e9]">
                                      Rs {person.price?.toLocaleString()}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 3: PROJECT DETAILS */}
              {step === 3 && (
                <div>
                  <h3 className="text-2xl font-black text-white mb-2">Step 3: Project Specifications</h3>
                  <p className="text-gray-400 text-sm mb-6">
                    Tell us your target genre, style, and reference songs.
                  </p>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-mono text-gray-400 uppercase mb-2">Primary Music Genre</label>
                      <div className="flex flex-wrap gap-2">
                        {GENRES.map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => setGenre(g)}
                            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                              genre === g
                                ? 'bg-[#0ea5e9] text-white shadow-[0_0_15px_rgba(14,165,233,0.4)]'
                                : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                            }`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-gray-400 uppercase mb-2">Project Vision & Notes</label>
                      <textarea
                        rows="4"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe the mood, target audience, instrumentation preferences, or timeline..."
                        className="w-full px-4 py-3 rounded-2xl bg-black/50 border border-white/15 focus:border-[#0ea5e9] text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/30"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-gray-400 uppercase mb-2">Reference Track URL (YouTube, Spotify, Drive)</label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={attachmentInput}
                          onChange={(e) => setAttachmentInput(e.target.value)}
                          placeholder="https://..."
                          className="flex-1 px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-white text-sm focus:outline-none focus:border-[#0ea5e9]"
                        />
                        <button
                          type="button"
                          onClick={addAttachment}
                          className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold cursor-pointer"
                        >
                          Add Link
                        </button>
                      </div>
                      {attachmentUrls.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {attachmentUrls.map((item, i) => (
                            <span key={i} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-mono text-white">
                              {item.url}
                              <button onClick={() => removeAttachment(i)} className="text-red-400 hover:text-red-300">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: ESTIMATE & SUBMIT */}
              {step === 4 && (
                <div>
                  <h3 className="text-2xl font-black text-white mb-2">Step 4: Review Live Quotation & Submit</h3>
                  <p className="text-gray-400 text-sm mb-6">
                    Review your customized studio package and contact details.
                  </p>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left: Contact Form */}
                    <div className="lg:col-span-7 space-y-4">
                      <div>
                        <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Your Full Name *</label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Ricky Perera"
                          className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 focus:border-[#0ea5e9] text-white text-sm focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-gray-400 uppercase mb-1">WhatsApp / Phone Number *</label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+94 77 123 4567"
                          className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 focus:border-[#0ea5e9] text-white text-sm focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Email Address (Optional)</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="client@example.com"
                          className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 focus:border-[#0ea5e9] text-white text-sm focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Right: Live Budget Estimate */}
                    <div className="lg:col-span-5 p-6 rounded-2xl bg-gradient-to-b from-gray-900 to-black border border-[#0ea5e9]/40 shadow-xl flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-mono text-[#0ea5e9] font-bold uppercase tracking-widest block mb-2">
                          ESTIMATED STUDIO TARIFF
                        </span>
                        <div className="text-3xl font-black text-white font-mono mb-4">
                          Rs {minBudget.toLocaleString()} – {maxBudget.toLocaleString()}
                        </div>

                        <div className="space-y-2 border-t border-white/10 pt-4 text-xs font-mono text-gray-400">
                          {Object.values(selections).length === 0 ? (
                            <div className="italic text-gray-500">Standard studio production package selected.</div>
                          ) : (
                            Object.values(selections).map((sel, idx) => (
                              <div key={idx} className="flex justify-between items-center">
                                <span>{sel.roleLabel}: {sel.name}</span>
                                <span className="text-white">Rs {sel.price?.toLocaleString()}</span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={submitQuote}
                        disabled={isSubmitting || !name.trim() || !phone.trim()}
                        className="w-full mt-6 py-4 rounded-xl bg-[#0ea5e9] hover:bg-[#0ea5e9]/90 disabled:opacity-50 text-white font-mono text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_#0ea5e9] transition-all cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                        {isSubmitting ? 'SUBMITTING REQUEST...' : 'SUBMIT QUOTATION REQUEST'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Footer */}
              <div className="flex items-center justify-between pt-8 mt-8 border-t border-white/10">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={step === 1}
                  className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white font-mono text-xs font-bold uppercase transition-all cursor-pointer"
                >
                  ← PREVIOUS
                </button>

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-8 py-3 rounded-xl bg-[#0ea5e9] hover:bg-[#0ea5e9]/90 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_#0ea5e9] transition-all cursor-pointer"
                  >
                    CONTINUE →
                  </button>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
