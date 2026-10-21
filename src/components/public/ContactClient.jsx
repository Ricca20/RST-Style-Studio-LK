'use client';
import { useState } from 'react';
import { Mic, SlidersHorizontal, Music2, Clapperboard, MessageCircle, Mail, Phone, MapPin, ArrowRight, ArrowUpRight } from 'lucide-react';
import { buildWhatsAppUrl } from '@/lib/services/whatsapp';
import Vinyl from '@/components/music/Vinyl';
import Equalizer from '@/components/music/Equalizer';

const SERVICES = [
  { label: 'Vocal Tracking & Recording', Icon: Mic },
  { label: 'Mixing & Mastering', Icon: SlidersHorizontal },
  { label: 'Full Song Production', Icon: Music2 },
  { label: 'Music Video / Commercial', Icon: Clapperboard },
];

const inputClass = 'w-full rounded-2xl border border-ink/15 bg-paper px-5 py-3.5 placeholder:text-smoke focus:outline-none focus:border-ink transition-colors';

/**
 * Booking/contact form plus direct contact lines.
 * `socials` is [{ label, url }] already sanitised on the server.
 */
export default function ContactClient({ settings = null, socials = [] }) {
  const [name, setName] = useState('');
  const [artistName, setArtistName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState(SERVICES[0].label);
  const [preferredDate, setPreferredDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // No placeholder numbers: an unset phone must not send visitors to a stranger's WhatsApp.
  const contactPhone = settings?.phone || null;
  const contactEmail = settings?.email || null;
  const contactAddress = settings?.address || 'Sri Lanka';
  const whatsappNumber = settings?.whatsapp || settings?.phone || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setErrorMsg('Please enter your name, email and phone number.');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const response = await fetch('/api/public/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, artistName, email, phone, service, preferredDate, notes }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Failed to send your message.');
      setIsSubmitted(true);
    } catch (err) {
      setErrorMsg(err.message || 'Something went wrong. You can also contact us on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappHref = whatsappNumber
    ? buildWhatsAppUrl(whatsappNumber, isSubmitted
      ? `Hello RST Style Studio!\n\nI am *${name}*${artistName ? ` (${artistName})` : ''}.\n\n*Service:* ${service}\n*Preferred Date:* ${preferredDate || 'Flexible'}\n*Email:* ${email}\n\n*Notes:*\n${notes || 'N/A'}`
      : 'Hello RST Style Studio! I would like to ask about a session.')
    : null;

  const lines = [
    whatsappHref && { label: 'WhatsApp', value: 'Chat with the studio', href: whatsappHref, Icon: MessageCircle, external: true },
    contactPhone && { label: 'Phone', value: contactPhone, href: `tel:${contactPhone.replace(/[^\d+]/g, '')}`, Icon: Phone },
    contactEmail && { label: 'Email', value: contactEmail, href: `mailto:${contactEmail}`, Icon: Mail },
    { label: 'Studio', value: contactAddress, Icon: MapPin },
  ].filter(Boolean);

  return (
    <div className="grid lg:grid-cols-[1fr_24rem] gap-10 items-start">
      {/* Session request */}
      <div className="rounded-[2rem] bg-paper-2 p-6 md:p-10">
        {isSubmitted ? (
          <div className="py-10 grid sm:grid-cols-[1fr_auto] gap-8 items-center">
            <div>
              <p className="eyebrow text-smoke">Message received</p>
              <h2 className="display text-5xl md:text-6xl mt-3">Thanks, {name.split(' ')[0]}.</h2>
              <p className="text-smoke mt-4 max-w-md">We&apos;ll get back to you at {phone} or {email} shortly.</p>
              {whatsappHref && (
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-8 rounded-full bg-[#25D366] text-white px-6 py-3.5 text-sm font-bold hover:brightness-95 transition">
                  <MessageCircle className="w-5 h-5" /> Also send on WhatsApp
                </a>
              )}
            </div>
            <div className="w-40 justify-self-center"><Vinyl spinning label="RST" /></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8" noValidate>
            <div>
              <h2 className="display text-4xl md:text-5xl">Book a session.</h2>
              <p className="text-smoke mt-2">Tell us what you&apos;re working on and when you&apos;d like to come in.</p>
            </div>

            <fieldset>
              <legend className="eyebrow mb-4">What do you need?</legend>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {SERVICES.map(({ label, Icon }) => {
                  const selected = service === label;
                  return (
                    <button key={label} type="button" onClick={() => setService(label)} aria-pressed={selected}
                      className={`rounded-2xl p-4 text-left border transition-colors ${selected ? 'bg-ink text-paper border-ink' : 'bg-paper border-ink/10 hover:border-ink/40'}`}>
                      <Icon className={`w-5 h-5 ${selected ? 'text-lime' : ''}`} />
                      <span className="block text-sm font-semibold mt-4 leading-snug">{label}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="grid md:grid-cols-2 gap-5">
              <label className="block"><span className="eyebrow block mb-3">Your name *</span>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} autoComplete="name" /></label>
              <label className="block"><span className="eyebrow block mb-3">Artist / band</span>
                <input type="text" value={artistName} onChange={(e) => setArtistName(e.target.value)} className={inputClass} /></label>
              <label className="block"><span className="eyebrow block mb-3">Email *</span>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} autoComplete="email" /></label>
              <label className="block"><span className="eyebrow block mb-3">Phone / WhatsApp *</span>
                <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+94 7X XXX XXXX" className={inputClass} autoComplete="tel" /></label>
              <label className="block md:col-span-2"><span className="eyebrow block mb-3">Preferred date</span>
                <input type="text" value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} placeholder="e.g. next weekend, or flexible" className={inputClass} /></label>
              <label className="block md:col-span-2"><span className="eyebrow block mb-3">Notes</span>
                <textarea rows="5" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Song idea, references, number of tracks…" className={`${inputClass} resize-y`} /></label>
            </div>

            {errorMsg && <p className="rounded-2xl bg-red-100 text-red-900 px-5 py-4 text-sm">{errorMsg}</p>}

            <button type="submit" disabled={isSubmitting} className="group inline-flex items-center gap-3 rounded-full bg-ink text-paper pl-6 pr-1.5 py-1.5 font-bold hover:bg-ink-2 transition-colors disabled:opacity-50">
              {isSubmitting ? 'Sending…' : 'Send request'}
              <span className="w-10 h-10 rounded-full bg-lime text-ink flex items-center justify-center group-hover:-rotate-45 transition-transform"><ArrowRight className="w-4 h-4" /></span>
            </button>
          </form>
        )}
      </div>

      {/* Direct lines */}
      <aside className="space-y-5 lg:sticky lg:top-28">
        <div className="rounded-[2rem] bg-ink text-paper p-7">
          <p className="eyebrow text-paper/50 flex items-center gap-2"><Equalizer bars={4} className="h-3 text-lime" /> Direct lines</p>
          <ul className="mt-6 divide-y divide-paper/10">
            {lines.map(({ label, value, href, Icon, external }) => {
              const body = (
                <>
                  <span className="w-11 h-11 rounded-full bg-paper/10 group-hover:bg-lime group-hover:text-ink flex items-center justify-center shrink-0 transition-colors"><Icon className="w-5 h-5" /></span>
                  <span className="min-w-0">
                    <span className="block eyebrow text-paper/40 text-[0.6rem]">{label}</span>
                    <span className="block font-semibold truncate">{value}</span>
                  </span>
                </>
              );
              return (
                <li key={label}>
                  {href ? (
                    <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="group flex items-center gap-4 py-4">{body}</a>
                  ) : (
                    <div className="group flex items-center gap-4 py-4">{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {socials.length > 0 && (
          <div className="rounded-[2rem] border border-ink/10 p-7">
            <p className="eyebrow text-smoke mb-4">Follow the studio</p>
            <ul className="divide-y divide-ink/10">
              {socials.map(({ label, url }) => (
                <li key={label}>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between py-3 font-display font-bold text-xl">
                    {label}
                    <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>
    </div>
  );
}
