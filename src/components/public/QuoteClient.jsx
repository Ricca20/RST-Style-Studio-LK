'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Check, MessageCircle, X, Paperclip, ArrowLeft, ArrowRight } from 'lucide-react';
import { buildWhatsAppUrl } from '@/lib/services/whatsapp';
import { calculateBudgetEstimate } from '@/lib/utils/budget';
import { CORE_ROLES, INSTRUMENT_ROLES } from '@/lib/quoteRoles';
import BookingStatusNotice from '@/components/public/BookingStatusNotice';
import PageHero from '@/components/music/PageHero';
import Equalizer from '@/components/music/Equalizer';
import Waveform from '@/components/music/Waveform';
import Vinyl from '@/components/music/Vinyl';
import PillLink from '@/components/music/PillLink';

const GENRES = ['Pop', 'Classical', 'Hip-Hop', 'R&B', 'Rock', 'Jazz', 'EDM', 'Baila', 'Sinhala Folk', 'Bollywood', 'Lo-Fi', 'Acoustic', 'Other'];
const STEPS = ['Core team', 'Instruments', 'Your song', 'Contact'];
const inputClass = 'w-full rounded-2xl border border-ink/15 bg-paper px-5 py-3.5 placeholder:text-smoke focus:outline-none focus:border-ink transition-colors';
const formatRs = (n) => `Rs ${Math.round(n).toLocaleString()}`;

function PersonCard({ person, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`relative text-left rounded-2xl p-4 border transition-colors flex items-center gap-4 w-full ${selected ? 'bg-ink text-paper border-ink' : 'bg-paper border-ink/10 hover:border-ink/40'}`}
    >
      <span className="relative w-12 h-12 rounded-full overflow-hidden bg-ink shrink-0">
        {person.imageUrl ? (
          <Image src={person.imageUrl} alt="" fill sizes="48px" className="object-cover" />
        ) : (
          <span className="absolute inset-0.5"><Vinyl label={person.name.charAt(0)} /></span>
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-bold truncate">{person.name}</span>
        <span className={`block text-sm font-semibold tabular-nums ${selected ? 'text-lime' : 'text-smoke'}`}>{formatRs(person.price)}</span>
      </span>
      <span className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border ${selected ? 'bg-lime text-ink border-lime' : 'border-ink/20'}`}>
        {selected && <Check className="w-4 h-4" />}
      </span>
    </button>
  );
}

function RoleGroup({ role, people, selected, onSelect, emptyText }) {
  return (
    <div className="py-8 border-b border-ink/10 first:pt-0">
      <div className="flex items-center gap-4 mb-5">
        <span className="text-2xl" aria-hidden="true">{role.emoji}</span>
        <div>
          <h3 className="font-display font-bold text-2xl">{role.label}</h3>
          {role.description && <p className="text-sm text-smoke">{role.description}</p>}
        </div>
      </div>
      {people.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-3">
          {people.map((person) => (
            <PersonCard key={person.id} person={person} selected={selected?.id === person.id} onSelect={() => onSelect(role.key, person, role.label)} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-smoke italic">{emptyText}</p>
      )}
    </div>
  );
}

export default function QuoteClient() {
  const tQuote = useTranslations('Quote');

  const [step, setStep] = useState(1);
  const [collaboratorsByRole, setCollaboratorsByRole] = useState({});
  const [settings, setSettings] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

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

  const minimumBudget = settings?.minimumQuotationBudget || 0;
  const { tax, totalBudget, minBudget, maxBudget, belowMinimum } = calculateBudgetEstimate(selections, {
    taxRate: settings?.taxRate,
    minimumBudget,
  });
  const contactPhone = settings?.whatsapp || settings?.phone || null;
  const team = Object.values(selections);

  const handleSelectPerson = (role, person, roleLabel) => {
    setSelections(prev => {
      // Toggle off if the same person is clicked again
      if (prev[role]?.id === person.id) {
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

  const goTo = (n) => {
    setStep(Math.min(Math.max(n, 1), STEPS.length));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submitQuote = async () => {
    if (!name.trim() || !phone.trim() || belowMinimum) return;
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, phone, email,
          description,
          genre,
          selections: team,
          attachments: attachmentUrls,
          estimatedBudget: totalBudget
        })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to submit. Please try again.');
      }
      setIsSubmitted(true);
    } catch (e) {
      console.error('Submission failed:', e);
      setSubmitError(e.message || 'Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openWhatsApp = () => {
    if (!contactPhone) return;
    const teamList = team.map(s => `• ${s.roleLabel}: ${s.name} (Rs ${s.price?.toLocaleString()})`).join('\n');
    const message = `Hello RST Style Studio!\n\nI am *${name}*.\n\n*Genre:* ${genre || 'Not specified'}\n\n*My Team:*\n${teamList}\n\n*Estimated Budget:* Rs ${minBudget.toLocaleString()} - Rs ${maxBudget.toLocaleString()}\n\n*Description:*\n${description || 'N/A'}\n\nPlease get back to me at ${phone}.`;
    window.open(buildWhatsAppUrl(contactPhone, message), '_blank');
  };

  if (isSubmitted) {
    return (
      <section className="min-h-[80vh] flex items-center px-5 md:px-10 pt-32 pb-20">
        <div className="max-w-7xl mx-auto w-full grid md:grid-cols-[1fr_auto] gap-12 items-center">
          <div>
            <p className="eyebrow text-smoke">Request received</p>
            <h1 className="display text-[clamp(3.5rem,10vw,8rem)] mt-4">That&apos;s<br />a wrap, {name.split(' ')[0]}.</h1>
            <p className="mt-6 max-w-lg text-lg text-smoke">
              Your estimate is <strong className="text-ink">{formatRs(minBudget)} – {formatRs(maxBudget)}</strong>. We&apos;ll review your request and get back to you soon.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              {contactPhone && (
                <button onClick={openWhatsApp} className="inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white px-6 py-3.5 text-sm font-bold hover:brightness-95 transition">
                  <MessageCircle className="w-5 h-5" /> Also send via WhatsApp
                </button>
              )}
              <PillLink href="/songs" variant="outline">Listen while you wait</PillLink>
            </div>
          </div>
          <div className="w-56 md:w-80 justify-self-center"><Vinyl spinning label="RST" /></div>
        </div>
      </section>
    );
  }

  const hasInstruments = INSTRUMENT_ROLES.some(r => collaboratorsByRole[r.key]?.length);

  return (
    <>
      <PageHero
        label={tQuote('title')}
        title={['Build your', 'track.']}
        intro="Choose your team, tell us about the song and get an instant estimate. Nothing is booked until we've talked it through with you."
        seed={61}
      />

      <section className="px-5 md:px-10 pt-4">
        <div className="max-w-7xl mx-auto">
          <BookingStatusNotice status={settings?.bookingStatus} className="mb-8" />

          {/* Step tabs */}
          <ol className="flex flex-wrap gap-2 mb-10">
            {STEPS.map((label, i) => {
              const n = i + 1;
              return (
                <li key={label}>
                  <button
                    type="button"
                    onClick={() => goTo(n)}
                    aria-current={step === n ? 'step' : undefined}
                    className={`inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-sm font-semibold border transition-colors ${step === n ? 'bg-ink text-paper border-ink' : step > n ? 'border-ink/30' : 'border-ink/10 text-smoke hover:border-ink/40'}`}
                  >
                    <span className="font-display font-bold tabular-nums">{String(n).padStart(2, '0')}</span>
                    {label}
                    {step > n && <Check className="w-3.5 h-3.5" />}
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="grid lg:grid-cols-[1fr_24rem] gap-10 items-start">
            {/* Steps */}
            <div className="min-w-0">
              {step === 1 && (
                <div>
                  <h2 className="display text-4xl md:text-5xl mb-2">Pick your core team.</h2>
                  <p className="text-smoke mb-10">One person for each role. Tap again to deselect.</p>
                  {CORE_ROLES.map(role => (
                    <RoleGroup key={role.key} role={role} people={collaboratorsByRole[role.key] || []} selected={selections[role.key]} onSelect={handleSelectPerson} emptyText={`No ${role.label.toLowerCase()} available at the moment.`} />
                  ))}
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="display text-4xl md:text-5xl mb-2">Add live instruments.</h2>
                  <p className="text-smoke mb-10">Optional session players. Skip ahead if you don&apos;t need any.</p>
                  {hasInstruments ? (
                    INSTRUMENT_ROLES.filter(r => collaboratorsByRole[r.key]?.length).map(role => (
                      <RoleGroup key={role.key} role={role} people={collaboratorsByRole[role.key]} selected={selections[role.key]} onSelect={handleSelectPerson} />
                    ))
                  ) : (
                    <div className="rounded-[2rem] bg-paper-2 p-10 text-center">
                      <Equalizer bars={5} className="h-8 mx-auto" playing={false} />
                      <p className="font-display font-bold text-2xl mt-5">No session players listed yet.</p>
                      <p className="text-smoke mt-2">You can continue to the next step.</p>
                    </div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-10">
                  <div>
                    <h2 className="display text-4xl md:text-5xl mb-2">Tell us about your song.</h2>
                    <p className="text-smoke">The mood, the story, the songs you love. Anything helps.</p>
                  </div>
                  <div>
                    <p className="eyebrow mb-4">Genre</p>
                    <div className="flex flex-wrap gap-2">
                      {GENRES.map(g => (
                        <button key={g} type="button" onClick={() => setGenre(genre === g ? '' : g)} aria-pressed={genre === g}
                          className={`rounded-full px-4 py-2 text-sm font-semibold border transition-colors ${genre === g ? 'bg-ink text-paper border-ink' : 'border-ink/15 hover:border-ink/50'}`}>
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                  <label className="block">
                    <span className="eyebrow block mb-4">Description</span>
                    <textarea rows="6" value={description} onChange={e => setDescription(e.target.value)} className={`${inputClass} resize-y`}
                      placeholder="Describe the mood, theme, lyric ideas, reference songs…" />
                  </label>
                  <div>
                    <span className="eyebrow mb-4 flex items-center gap-2"><Paperclip className="w-3.5 h-3.5" /> Attachments <span className="normal-case tracking-normal font-normal text-smoke">(links to demos, voice notes, references)</span></span>
                    <div className="flex gap-3">
                      <input type="url" value={attachmentInput} onChange={e => setAttachmentInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addAttachment(); } }}
                        placeholder="Paste a Google Drive, Dropbox or YouTube link" className={inputClass} />
                      <button type="button" onClick={addAttachment} className="rounded-full bg-ink text-paper px-6 font-bold hover:bg-ink-2 transition-colors">Add</button>
                    </div>
                    {attachmentUrls.length > 0 && (
                      <ul className="mt-3 space-y-2">
                        {attachmentUrls.map((att, i) => (
                          <li key={i} className="flex items-center justify-between gap-4 rounded-2xl bg-paper-2 px-5 py-3 text-sm">
                            <span className="truncate">{att.url}</span>
                            <button type="button" onClick={() => removeAttachment(i)} aria-label="Remove link" className="w-8 h-8 rounded-full hover:bg-ink hover:text-paper flex items-center justify-center shrink-0 transition-colors"><X className="w-4 h-4" /></button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div>
                  <h2 className="display text-4xl md:text-5xl mb-2">Where can we reach you?</h2>
                  <p className="text-smoke mb-10">We&apos;ll reply with a confirmed price and schedule.</p>
                  <div className="grid md:grid-cols-2 gap-5">
                    <label className="block">
                      <span className="eyebrow block mb-3">Your name *</span>
                      <input type="text" value={name} onChange={e => setName(e.target.value)} className={inputClass} autoComplete="name" />
                    </label>
                    <label className="block">
                      <span className="eyebrow block mb-3">Phone (WhatsApp) *</span>
                      <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+94 7X XXX XXXX" className={inputClass} autoComplete="tel" />
                    </label>
                    <label className="block md:col-span-2">
                      <span className="eyebrow block mb-3">Email <span className="normal-case tracking-normal font-normal text-smoke">(optional)</span></span>
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputClass} autoComplete="email" />
                    </label>
                  </div>
                  {belowMinimum && (
                    <p className="mt-6 rounded-2xl bg-amber-100 text-amber-900 px-5 py-4 text-sm">
                      Our minimum project budget is {formatRs(minimumBudget)}. Please add more to your team to submit this request.
                    </p>
                  )}
                  {submitError && <p className="mt-6 rounded-2xl bg-red-100 text-red-900 px-5 py-4 text-sm">{submitError}</p>}
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between gap-4 mt-12 pt-8 border-t border-ink/10">
                <button type="button" onClick={() => goTo(step - 1)} className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold hover:bg-ink/5 transition-colors ${step === 1 ? 'invisible' : ''}`}>
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                {step < STEPS.length ? (
                  <button type="button" onClick={() => goTo(step + 1)} className="group inline-flex items-center gap-3 rounded-full bg-ink text-paper pl-6 pr-1.5 py-1.5 text-sm font-bold hover:bg-ink-2 transition-colors">
                    Next: {STEPS[step]}
                    <span className="w-9 h-9 rounded-full bg-lime text-ink flex items-center justify-center group-hover:-rotate-45 transition-transform"><ArrowRight className="w-4 h-4" /></span>
                  </button>
                ) : (
                  <button type="button" onClick={submitQuote} disabled={!name.trim() || !phone.trim() || isSubmitting || belowMinimum}
                    className="group inline-flex items-center gap-3 rounded-full bg-lime text-ink pl-6 pr-1.5 py-1.5 text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed">
                    {isSubmitting ? 'Sending…' : 'Send my request'}
                    <span className="w-9 h-9 rounded-full bg-ink text-lime flex items-center justify-center"><ArrowRight className="w-4 h-4" /></span>
                  </button>
                )}
              </div>
            </div>

            {/* Master bus: running summary */}
            <aside className="lg:sticky lg:top-28 rounded-[2rem] bg-ink text-paper p-7">
              <p className="eyebrow text-paper/50 flex items-center gap-2"><Equalizer bars={4} className="h-3 text-lime" playing={team.length > 0} /> Master bus</p>
              <p className="display text-4xl mt-5 tabular-nums">
                {totalBudget > 0 ? <>{formatRs(minBudget)}<span className="block text-paper/40 text-2xl">to {formatRs(maxBudget)}</span></> : 'Rs 0'}
              </p>
              <p className="text-xs text-paper/50 mt-2">{tQuote('budgetEstimate')} (±15%){tax > 0 ? `, incl. ${settings.taxRate}% tax` : ''}</p>
              <Waveform seed={team.length * 7 + 3} bars={48} progress={Math.min(team.length / 6, 1)} className="h-10 w-full mt-6 text-paper/15" />

              <ul className="mt-6 space-y-2.5">
                {team.length === 0 ? (
                  <li className="text-sm text-paper/50">Your team will appear here.</li>
                ) : team.map(sel => (
                  <li key={sel.role} className="flex items-center justify-between gap-3 text-sm">
                    <span className="min-w-0"><span className="text-paper/50">{sel.roleLabel}</span> <span className="font-semibold">{sel.name}</span></span>
                    <span className="tabular-nums shrink-0">{formatRs(sel.price)}</span>
                  </li>
                ))}
              </ul>
              {genre && <p className="mt-6 pt-5 border-t border-paper/10 text-sm"><span className="text-paper/50">Genre</span> {genre}</p>}
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
