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
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20 px-4">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-4">Request Submitted!</h1>
          <p className="text-gray-500 text-lg mb-8">
            Thank you, <strong>{name}</strong>! We have received your quotation request with an estimated budget of <strong>Rs {totalBudget.toLocaleString()}</strong>.
            Our team will review and get back to you soon.
          </p>
          <button
            onClick={openWhatsApp}
            className="bg-[#25D366] hover:bg-green-600 text-white px-8 py-4 rounded-xl font-bold transition flex items-center gap-3 mx-auto shadow-lg shadow-green-500/30"
          >
            <MessageCircle className="w-6 h-6" /> Also Send via WhatsApp
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-gray-900 mb-4">{tQuote('title') || 'Build Your Song'}</h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">Choose your team, pick your genre, describe your vision — and get an instant price estimate.</p>
        </div>

        {/* Steps Indicator */}
        <div className="flex justify-between items-center mb-12 relative max-w-xl mx-auto">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 z-0 rounded-full"></div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 z-0 rounded-full transition-all duration-500" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
          {['Core Team', 'Instruments', 'Details', 'Submit'].map((label, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 shadow-sm ${step > i + 1 ? 'bg-blue-600 text-white' : step === i + 1 ? 'bg-blue-600 text-white ring-4 ring-blue-100' : 'bg-gray-100 text-gray-400 border-2 border-gray-200'}`}>
                {step > i + 1 ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
              </div>
              <span className="text-xs text-gray-500 mt-2 hidden sm:block">{label}</span>
            </div>
          ))}
        </div>

        {/* Floating Budget Bar */}
        <div className="sticky top-4 z-30 mb-8">
          <div className="bg-white/90 backdrop-blur-md border rounded-2xl shadow-lg px-6 py-4 flex items-center justify-between max-w-xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Estimated Budget</p>
                <p className="text-2xl font-black text-gray-900">Rs {totalBudget > 0 ? totalBudget.toLocaleString() : '0'}</p>
              </div>
            </div>
            <span className="text-xs text-gray-400">{Object.keys(selections).length} selected</span>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 p-8 md:p-12 min-h-[450px] flex flex-col relative">

          {/* Step 1: Core Roles */}
          {step === 1 && (
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">1. Choose Your Core Team</h2>
              <p className="text-gray-500 mb-8">Select one person for each vital production role.</p>

              <div className="space-y-8">
                {ROLE_ORDER.map(role => {
                  const people = collaboratorsByRole[role.key] || [];
                  const selected = selections[role.key];
                  return (
                    <div key={role.key}>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl">{role.emoji}</span>
                        <div>
                          <h3 className="font-bold text-gray-900">{role.label}</h3>
                          <p className="text-sm text-gray-500">{role.description}</p>
                        </div>
                      </div>
                      {people.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {people.map(person => {
                            const isSelected = selected?.id === person.id;
                            return (
                              <button
                                key={person.id}
                                type="button"
                                onClick={() => handleSelectPerson(role.key, person, role.label)}
                                className={`relative text-left p-4 rounded-xl border-2 transition-all ${isSelected ? 'border-blue-600 bg-blue-50 shadow-sm' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}
                              >
                                <div className="flex items-center gap-3">
                                  {person.imageUrl ? (
                                    <img src={person.imageUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
                                  ) : (
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                                      {person.name.charAt(0).toUpperCase()}
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-900 truncate">{person.name}</p>
                                    <p className="text-sm font-bold text-green-700">Rs {person.price.toLocaleString()}</p>
                                  </div>
                                </div>
                                {isSelected && (
                                  <div className="absolute top-2 right-2 text-blue-600"><CheckCircle2 className="w-5 h-5" /></div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 italic pl-10">No {role.label.toLowerCase()} available at the moment.</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Live Instruments */}
          {step === 2 && (
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">2. Add Live Instruments (Optional)</h2>
              <p className="text-gray-500 mb-8">Choose session musicians for the instruments you need. Skip if not needed.</p>

              <div className="space-y-8">
                {INSTRUMENT_ROLES.map(role => {
                  const people = collaboratorsByRole[role.key] || [];
                  if (people.length === 0) return null;
                  const selected = selections[role.key];
                  return (
                    <div key={role.key}>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl">{role.emoji}</span>
                        <h3 className="font-bold text-gray-900">{role.label}</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {people.map(person => {
                          const isSelected = selected?.id === person.id;
                          return (
                            <button
                              key={person.id}
                              type="button"
                              onClick={() => handleSelectPerson(role.key, person, role.label)}
                              className={`relative text-left p-4 rounded-xl border-2 transition-all ${isSelected ? 'border-blue-600 bg-blue-50 shadow-sm' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}
                            >
                              <div className="flex items-center gap-3">
                                {person.imageUrl ? (
                                  <img src={person.imageUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-sm">
                                    {person.name.charAt(0).toUpperCase()}
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-gray-900 truncate">{person.name}</p>
                                  <p className="text-sm font-bold text-green-700">Rs {person.price.toLocaleString()}</p>
                                </div>
                              </div>
                              {isSelected && (
                                <div className="absolute top-2 right-2 text-blue-600"><CheckCircle2 className="w-5 h-5" /></div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
                {INSTRUMENT_ROLES.every(r => !(collaboratorsByRole[r.key]?.length)) && (
                  <div className="text-center py-12 text-gray-400">
                    <Music className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No live instrument players available at the moment.</p>
                    <p className="text-sm">You can skip this step.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Description, Genre, Attachments */}
          {step === 3 && (
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">3. Tell Us About Your Song</h2>
              <p className="text-gray-500 mb-8">Describe your vision, pick a genre, and attach any reference materials.</p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Genre</label>
                  <div className="flex flex-wrap gap-2">
                    {GENRES.map(g => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGenre(genre === g ? '' : g)}
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${genre === g ? 'bg-purple-600 border-purple-600 text-white' : 'bg-white border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50'}`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Song Description</label>
                  <textarea
                    rows="5"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Describe the mood, theme, lyrics idea, reference songs, or anything else about your vision..."
                    className="w-full border-gray-300 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Paperclip className="w-4 h-4 inline mr-1" /> Attachments (links to files, voice notes, lyrics docs, etc.)
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={attachmentInput}
                      onChange={e => setAttachmentInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addAttachment())}
                      placeholder="Paste a link (Google Drive, Dropbox, etc.)"
                      className="flex-1 border-gray-300 border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button type="button" onClick={addAttachment} className="bg-gray-900 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-600 transition">Add</button>
                  </div>
                  {attachmentUrls.length > 0 && (
                    <div className="space-y-2">
                      {attachmentUrls.map((att, i) => (
                        <div key={i} className="flex items-center justify-between bg-gray-50 px-4 py-2.5 rounded-lg border text-sm">
                          <span className="text-blue-600 truncate flex-1 mr-4">{att.url}</span>
                          <button onClick={() => removeAttachment(i)} className="text-red-400 hover:text-red-600 shrink-0"><X className="w-4 h-4" /></button>
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
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">4. Almost Done!</h2>
              <p className="text-gray-500 mb-8">Enter your contact details so we can reach you.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Kasun" className="w-full border-gray-300 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone (WhatsApp) *</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+94 77..." className="w-full border-gray-300 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email (Optional)</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" className="w-full border-gray-300 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="font-bold text-gray-900 mb-4">📋 Your Quotation Summary</h3>
                {Object.values(selections).length > 0 ? (
                  <div className="space-y-2 mb-4">
                    {Object.values(selections).map((sel, i) => (
                      <div key={i} className="flex justify-between text-sm bg-white px-4 py-2.5 rounded-lg">
                        <span><strong>{sel.roleLabel}</strong> — {sel.name}</span>
                        <span className="font-bold text-green-700">Rs {sel.price?.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mb-4">No team members selected.</p>
                )}
                {genre && <p className="text-sm text-gray-600 mb-2"><strong>Genre:</strong> {genre}</p>}
                <div className="flex items-center justify-between bg-white rounded-xl p-4 border-2 border-blue-200 mt-4">
                  <span className="text-blue-800 text-sm font-bold uppercase tracking-wider">Total Estimate</span>
                  <span className="text-3xl font-black text-gray-900">Rs {totalBudget > 0 ? totalBudget.toLocaleString() : '0'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-8 mt-auto border-t flex items-center justify-between">
            <button
              onClick={handlePrev}
              className={`px-6 py-3 font-medium rounded-lg text-gray-600 hover:bg-gray-100 transition ${step === 1 ? 'invisible' : 'visible'}`}
            >
              Back
            </button>

            {step < 4 ? (
              <button
                onClick={handleNext}
                className="bg-gray-900 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-bold transition flex items-center"
              >
                Next Step <ChevronRight className="w-5 h-5 ml-1" />
              </button>
            ) : (
              <button
                onClick={submitQuote}
                disabled={!name.trim() || !phone.trim() || isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition flex items-center gap-2 shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Quotation'}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
