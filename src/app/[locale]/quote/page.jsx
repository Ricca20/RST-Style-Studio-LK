'use client';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircle2, ChevronRight, MessageCircle, Music, Upload, X, Paperclip, DollarSign } from 'lucide-react';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

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

const GENRES = ['Pop', 'Classical', 'Hip-Hop', 'R&B', 'Rock', 'Jazz', 'EDM', 'Baila', 'Sinhala Folk', 'Bollywood', 'Lo-Fi', 'Acoustic', 'Other'];

export default function QuotePage() {
  const tQuote = useTranslations('Quote');

  const [step, setStep] = useState(1);
  const [collaboratorsByRole, setCollaboratorsByRole] = useState({});
  const [settings, setSettings] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Selections: { [role]: { id, name, role, roleLabel, price } }
  const [selections, setSelections] = useState({});
  const [genre, setGenre] = useState('');
  const [description, setDescription] = useState('');
  const [attachmentUrls, setAttachmentUrls] = useState([]);
  const [attachmentInput, setAttachmentInput] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetch('/api/public/quote-init')
      .then(res => res.json())
      .then(data => {
        if (data.collaborators) setCollaboratorsByRole(data.collaborators);
        if (data.settings) setSettings(data.settings);
      })
      .catch(e => console.error(e));
  }, []);

  const totalBudget = Object.values(selections).reduce((sum, sel) => sum + (sel?.price || 0), 0);

  const handleSelectPerson = (role, person, roleLabel) => {
    setSelections(prev => {
      const current = prev[role];
      // Toggle off if same person clicked
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
    setAttachmentUrls(prev => [...prev, { url, name: url }]);
    setAttachmentInput('');
  };

  const removeAttachment = (index) => {
    setAttachmentUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => setStep(s => Math.min(s + 1, 4));
  const handlePrev = () => setStep(s => Math.max(s - 1, 1));

  const submitQuote = async () => {
    if (!name.trim() || !phone.trim()) return;
    setIsSubmitting(true);
    try {
      const selectionsArr = Object.values(selections);
      await fetch('/api/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, phone, email,
          description,
          genre,
          selections: selectionsArr,
          attachments: attachmentUrls,
          estimatedBudget: totalBudget
        })
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
    const teamList = selectionsArr.map(s => `• ${s.roleLabel}: ${s.name} (Rs ${s.price?.toLocaleString()})`).join('\n');
    const message = `Hello RST Style Studio!\n\nI am *${name}*.\n\n*Genre:* ${genre || 'Not specified'}\n\n*My Team:*\n${teamList}\n\n*Total Estimate:* Rs ${totalBudget.toLocaleString()}\n\n*Description:*\n${description || 'N/A'}\n\nPlease get back to me at ${phone}.`;
    const contactPhone = settings?.whatsapp || settings?.phone || '+94771234567';
    const waUrl = buildWhatsAppUrl(contactPhone, message);
    window.open(waUrl, '_blank');
  };

  // Success screen
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#0f0d11] py-32 px-4 flex items-center justify-center relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#9d2bee]/20 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-lg w-full bg-[#1e1823] border border-white/5 rounded-3xl p-10 text-center relative z-10 shadow-2xl">
          <div className="w-24 h-24 bg-[#9d2bee]/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(157,43,238,0.3)]">
            <CheckCircle2 className="w-12 h-12 text-[#9d2bee]" />
          </div>
          <h1 className="text-4xl font-black text-white mb-4">Request Submitted!</h1>
          <p className="text-white/60 text-lg mb-8 leading-relaxed">
            Thank you, <strong className="text-white">{name}</strong>! We have received your quotation request with an estimated budget of <strong className="text-[#9d2bee]">Rs {totalBudget.toLocaleString()}</strong>.
            Our team will review and get back to you soon.
          </p>
          <button
            onClick={openWhatsApp}
            className="w-full bg-[#25D366] hover:bg-[#20b858] text-white px-8 py-4 rounded-xl font-bold transition flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(37,211,102,0.3)]"
          >
            <MessageCircle className="w-6 h-6" /> Also Send via WhatsApp
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0d11] pt-32 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-[#9d2bee]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">{tQuote('title') || 'Build Your Song'}</h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto font-light">Choose your team, pick your genre, describe your vision — and get an instant price estimate.</p>
        </div>

        {/* Steps Indicator */}
        <div className="flex justify-between items-center mb-12 relative max-w-xl mx-auto">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-white/10 z-0"></div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#9d2bee] z-0 transition-all duration-500 shadow-[0_0_10px_rgba(157,43,238,0.8)]" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
          {['Core Team', 'Instruments', 'Details', 'Submit'].map((label, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${step > i + 1 ? 'bg-[#9d2bee] text-white shadow-[0_0_15px_rgba(157,43,238,0.5)]' : step === i + 1 ? 'bg-[#1e1823] border-2 border-[#9d2bee] text-[#9d2bee]' : 'bg-[#1a151f] text-white/30 border border-white/10'}`}>
                {step > i + 1 ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
              </div>
              <span className={`text-xs mt-3 hidden sm:block font-medium tracking-wide uppercase ${step >= i + 1 ? 'text-[#9d2bee]' : 'text-white/30'}`}>{label}</span>
            </div>
          ))}
        </div>

        {/* Floating Budget Bar */}
        <div className="sticky top-20 z-30 mb-8">
          <div className="bg-[#1e1823]/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl px-6 py-4 flex items-center justify-between max-w-xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#9d2bee]/20 flex items-center justify-center border border-[#9d2bee]/30">
                <DollarSign className="w-6 h-6 text-[#9d2bee]" />
              </div>
              <div>
                <p className="text-xs text-white/50 font-bold uppercase tracking-widest mb-1">Estimated Budget</p>
                <p className="text-2xl font-black text-white">Rs {totalBudget > 0 ? totalBudget.toLocaleString() : '0'}</p>
              </div>
            </div>
            <span className="text-xs font-bold text-white/40 bg-white/5 px-3 py-1.5 rounded-full">{Object.keys(selections).length} selected</span>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-[#1e1823] rounded-3xl shadow-2xl overflow-hidden border border-white/5 p-8 md:p-12 min-h-[450px] flex flex-col relative">

          {/* Step 1: Core Roles */}
          {step === 1 && (
            <div className="flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-black text-white mb-2 tracking-tight">1. Choose Your Core Team</h2>
              <p className="text-white/50 mb-10 text-lg font-light">Select one person for each vital production role.</p>

              <div className="space-y-10">
                {ROLE_ORDER.map(role => {
                  const people = collaboratorsByRole[role.key] || [];
                  const selected = selections[role.key];
                  return (
                    <div key={role.key} className="bg-white/5 rounded-2xl p-6 border border-white/5">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl border border-white/10 shadow-inner">
                          {role.emoji}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white tracking-tight">{role.label}</h3>
                          <p className="text-sm text-white/50">{role.description}</p>
                        </div>
                      </div>
                      {people.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {people.map(person => {
                            const isSelected = selected?.id === person.id;
                            return (
                              <button
                                key={person.id}
                                type="button"
                                onClick={() => handleSelectPerson(role.key, person, role.label)}
                                className={`relative text-left p-4 rounded-xl border transition-all duration-300 ${isSelected ? 'border-[#9d2bee] bg-[#9d2bee]/10 shadow-[0_0_20px_rgba(157,43,238,0.15)]' : 'border-white/10 bg-[#151118] hover:border-white/30 hover:bg-white/5'}`}
                              >
                                <div className="flex items-center gap-4">
                                  {person.imageUrl ? (
                                    <img src={person.imageUrl} alt="" className="w-12 h-12 rounded-full object-cover ring-2 ring-white/10" />
                                  ) : (
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#9d2bee] to-purple-800 flex items-center justify-center text-white font-bold text-lg ring-2 ring-white/10">
                                      {person.name.charAt(0).toUpperCase()}
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="font-bold text-white truncate text-base">{person.name}</p>
                                    <p className="text-sm font-bold text-[#9d2bee] mt-0.5">Rs {person.price.toLocaleString()}</p>
                                  </div>
                                </div>
                                {isSelected && (
                                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#9d2bee] rounded-full flex items-center justify-center shadow-lg"><CheckCircle2 className="w-4 h-4 text-white" /></div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-white/30 italic pl-16">No {role.label.toLowerCase()} available at the moment.</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Live Instruments */}
          {step === 2 && (
            <div className="flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-black text-white mb-2 tracking-tight">2. Add Live Instruments <span className="text-white/30 font-normal">(Optional)</span></h2>
              <p className="text-white/50 mb-10 text-lg font-light">Choose session musicians for the instruments you need. Skip if not needed.</p>

              <div className="space-y-10">
                {INSTRUMENT_ROLES.map(role => {
                  const people = collaboratorsByRole[role.key] || [];
                  if (people.length === 0) return null;
                  const selected = selections[role.key];
                  return (
                    <div key={role.key} className="bg-white/5 rounded-2xl p-6 border border-white/5">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl border border-white/10 shadow-inner">
                          {role.emoji}
                        </div>
                        <h3 className="text-xl font-bold text-white tracking-tight">{role.label}</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {people.map(person => {
                          const isSelected = selected?.id === person.id;
                          return (
                            <button
                              key={person.id}
                              type="button"
                              onClick={() => handleSelectPerson(role.key, person, role.label)}
                              className={`relative text-left p-4 rounded-xl border transition-all duration-300 ${isSelected ? 'border-[#9d2bee] bg-[#9d2bee]/10 shadow-[0_0_20px_rgba(157,43,238,0.15)]' : 'border-white/10 bg-[#151118] hover:border-white/30 hover:bg-white/5'}`}
                            >
                              <div className="flex items-center gap-4">
                                {person.imageUrl ? (
                                  <img src={person.imageUrl} alt="" className="w-12 h-12 rounded-full object-cover ring-2 ring-white/10" />
                                ) : (
                                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-lg ring-2 ring-white/10">
                                    {person.name.charAt(0).toUpperCase()}
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="font-bold text-white truncate text-base">{person.name}</p>
                                  <p className="text-sm font-bold text-[#9d2bee] mt-0.5">Rs {person.price.toLocaleString()}</p>
                                </div>
                              </div>
                              {isSelected && (
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#9d2bee] rounded-full flex items-center justify-center shadow-lg"><CheckCircle2 className="w-4 h-4 text-white" /></div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
                {INSTRUMENT_ROLES.every(r => !(collaboratorsByRole[r.key]?.length)) && (
                  <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/5">
                    <Music className="w-16 h-16 mx-auto mb-4 text-white/20" />
                    <p className="text-lg font-medium text-white/60 mb-2">No live instrument players available.</p>
                    <p className="text-sm text-white/40">You can proceed to the next step.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Description, Genre, Attachments */}
          {step === 3 && (
            <div className="flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-black text-white mb-2 tracking-tight">3. Tell Us About Your Song</h2>
              <p className="text-white/50 mb-10 text-lg font-light">Describe your vision, pick a genre, and attach any reference materials.</p>

              <div className="space-y-8">
                <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                  <label className="block text-sm font-bold text-white uppercase tracking-widest mb-4">Preferred Genre</label>
                  <div className="flex flex-wrap gap-3">
                    {GENRES.map(g => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGenre(genre === g ? '' : g)}
                        className={`px-5 py-2.5 rounded-full text-sm font-bold border transition-all duration-300 ${genre === g ? 'bg-[#9d2bee] border-[#9d2bee] text-white shadow-[0_0_15px_rgba(157,43,238,0.4)]' : 'bg-[#151118] border-white/10 text-white/70 hover:border-white/30 hover:text-white'}`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                  <label className="block text-sm font-bold text-white uppercase tracking-widest mb-4">Song Description</label>
                  <textarea
                    rows="5"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Describe the mood, theme, lyrics idea, reference songs, or anything else about your vision..."
                    className="w-full bg-[#151118] border-white/10 border rounded-xl px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-[#9d2bee] focus:ring-1 focus:ring-[#9d2bee] resize-y transition-colors"
                  />
                </div>

                <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                  <label className="block text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Paperclip className="w-4 h-4 text-[#9d2bee]" /> Attachments <span className="text-white/30 font-normal lowercase tracking-normal">(links to files, voice notes)</span>
                  </label>
                  <div className="flex gap-3 mb-4">
                    <input
                      type="text"
                      value={attachmentInput}
                      onChange={e => setAttachmentInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addAttachment())}
                      placeholder="Paste a link (Google Drive, Dropbox, etc.)"
                      className="flex-1 bg-[#151118] border-white/10 border rounded-xl px-5 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#9d2bee] focus:ring-1 focus:ring-[#9d2bee] transition-colors"
                    />
                    <button type="button" onClick={addAttachment} className="bg-[#9d2bee] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#9d2bee]/90 transition-colors">Add</button>
                  </div>
                  {attachmentUrls.length > 0 && (
                    <div className="space-y-3">
                      {attachmentUrls.map((att, i) => (
                        <div key={i} className="flex items-center justify-between bg-[#151118] px-5 py-3 rounded-xl border border-white/10 text-sm">
                          <span className="text-[#9d2bee] truncate flex-1 mr-4">{att.url}</span>
                          <button onClick={() => removeAttachment(i)} className="text-red-400 hover:text-red-500 shrink-0 p-1 bg-white/5 rounded-md hover:bg-white/10 transition-colors"><X className="w-4 h-4" /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Contact & Submit */}
          {step === 4 && (
            <div className="flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-black text-white mb-2 tracking-tight">4. Almost Done!</h2>
              <p className="text-white/50 mb-10 text-lg font-light">Enter your contact details so we can reach you.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-white uppercase tracking-widest pl-1">Your Name *</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Kasun" className="w-full bg-[#151118] border-white/10 border rounded-xl px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-[#9d2bee] focus:ring-1 focus:ring-[#9d2bee] transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-white uppercase tracking-widest pl-1">Phone (WhatsApp) *</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+94 77..." className="w-full bg-[#151118] border-white/10 border rounded-xl px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-[#9d2bee] focus:ring-1 focus:ring-[#9d2bee] transition-colors" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-bold text-white uppercase tracking-widest pl-1">Email <span className="text-white/30 normal-case tracking-normal font-normal">(Optional)</span></label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" className="w-full bg-[#151118] border-white/10 border rounded-xl px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-[#9d2bee] focus:ring-1 focus:ring-[#9d2bee] transition-colors" />
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gradient-to-br from-[#1e1823] to-[#151118] rounded-2xl p-8 border border-[#9d2bee]/30 shadow-[0_0_30px_rgba(157,43,238,0.1)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#9d2bee]/10 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none" />
                
                <h3 className="font-black text-xl text-white mb-6 flex items-center gap-2 tracking-tight">
                  <span className="material-symbols-outlined text-[#9d2bee]">receipt_long</span> 
                  Your Quotation Summary
                </h3>
                
                {Object.values(selections).length > 0 ? (
                  <div className="space-y-3 mb-6">
                    {Object.values(selections).map((sel, i) => (
                      <div key={i} className="flex justify-between items-center text-sm bg-white/5 border border-white/5 px-4 py-3 rounded-xl">
                        <span className="text-white/80 font-medium"><strong className="text-white">{sel.roleLabel}</strong> — {sel.name}</span>
                        <span className="font-bold text-[#9d2bee] bg-[#9d2bee]/10 px-3 py-1 rounded-full">Rs {sel.price?.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-white/5 rounded-xl border border-white/5 mb-6">
                    <p className="text-white/40 font-medium">No team members selected.</p>
                  </div>
                )}
                
                {genre && <div className="inline-block bg-white/5 border border-white/10 text-white/70 px-4 py-2 rounded-lg text-sm mb-6"><strong className="text-white mr-2">Genre:</strong>{genre}</div>}
                
                <div className="flex items-center justify-between bg-[#151118] rounded-xl p-6 border-l-4 border-l-[#9d2bee] mt-4 shadow-inner">
                  <span className="text-white/60 text-sm font-bold uppercase tracking-widest">Total Estimate</span>
                  <span className="text-4xl font-black text-white">Rs {totalBudget > 0 ? totalBudget.toLocaleString() : '0'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-8 mt-12 border-t border-white/10 flex items-center justify-between">
            <button
              onClick={handlePrev}
              className={`px-6 py-3 font-bold uppercase tracking-wider rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-colors ${step === 1 ? 'invisible' : 'visible'}`}
            >
              Back
            </button>

            {step < 4 ? (
              <button
                onClick={handleNext}
                className="bg-[#9d2bee] hover:bg-[#9d2bee]/90 text-white px-8 py-4 rounded-xl font-black uppercase tracking-wider transition-all flex items-center shadow-[0_0_20px_rgba(157,43,238,0.3)] hover:shadow-[0_0_30px_rgba(157,43,238,0.5)] transform hover:-translate-y-0.5"
              >
                Next Step <ChevronRight className="w-6 h-6 ml-2" />
              </button>
            ) : (
              <button
                onClick={submitQuote}
                disabled={!name.trim() || !phone.trim() || isSubmitting}
                className="bg-white hover:bg-gray-100 text-[#0f0d11] px-10 py-4 rounded-xl font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transform hover:-translate-y-0.5"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-[#0f0d11]/30 border-t-[#0f0d11] rounded-full animate-spin" />
                    Submitting...
                  </span>
                ) : 'Submit Quotation'}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
