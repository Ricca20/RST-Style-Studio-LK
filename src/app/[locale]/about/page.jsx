import Image from 'next/image';
import { Music4, Globe2, Heart } from 'lucide-react';
import PageHero from '@/components/music/PageHero';
import SectionLabel from '@/components/music/SectionLabel';
import PillLink from '@/components/music/PillLink';
import Reveal from '@/components/music/Reveal';
import Vinyl from '@/components/music/Vinyl';
import Equalizer from '@/components/music/Equalizer';
import Marquee from '@/components/music/Marquee';
import HonoraryMentionsSection from '@/components/public/HonoraryMentionsSection';

export async function generateMetadata() {
  return {
    title: 'About | RST Style Studio LK',
    description: 'The story of RST Style Studio: a studio built on melody, from its first acoustic room to today’s hybrid mastering setup.',
  };
}

const PILLARS = [
  { title: 'Harmonic mastery', desc: 'Orchestral arrangements and melody structuring.', Icon: Music4 },
  { title: 'Cultural roots', desc: 'Authentic Sri Lankan musical traditions.', Icon: Globe2 },
  { title: 'Acoustic soul', desc: 'The guiding philosophy behind RST Studio.', Icon: Heart },
];

// Image paths are case-sensitive in production
const ERAS = [
  {
    side: '01',
    era: 'Origins',
    title: 'The first acoustic room',
    text: 'Our earliest studio setup was built with an uncompromising focus on acoustic purity. Designed to capture organic instruments and warm vocals, the room laid the foundation for our signature sound.',
    tags: ['Acoustic panels', 'Analog tracking'],
    image: '/Studio2.jpg',
  },
  {
    side: '02',
    era: 'Expansion',
    title: 'Analog summing & outboard',
    text: 'As production demands grew, we added analog summing, outboard compression and high-voltage preamps for analog weight and harmonic warmth.',
    tags: ['Summing mixers', 'Outboard compression'],
    image: '/Studio3.jpg',
  },
  {
    side: '03',
    era: 'Today',
    title: 'The hybrid control room',
    text: 'Today RST Style Studio unites analog character with precise digital mastering, for releases that sound right on every speaker and streaming platform.',
    tags: ['Hybrid signal chain', 'Digital mastering'],
    image: '/Studio1.jpg',
  },
];

const GENRES = [
  { name: 'Pop & Acoustic', tag: 'Vocal focus' },
  { name: 'R&B, Soul & Hip-Hop', tag: 'Deep low end' },
  { name: 'Cinematic & Orchestral', tag: 'Film score' },
  { name: 'Electronic & Synthwave', tag: 'Wide & bright' },
  { name: 'Traditional & Baila', tag: 'Sri Lankan roots' },
  { name: 'Rock & Alternative', tag: 'Live drums' },
  { name: 'Commercials & Jingles', tag: 'Broadcast ready' },
  { name: 'Spatial Audio', tag: 'Immersive' },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        label="Our story"
        title={['A studio', 'built on melody.']}
        intro="Before summing desks and plug-ins, RST Style Studio was founded on a lifetime of orchestral storytelling and melody."
        seed={83}
      />

      {/* The composer */}
      <section className="px-5 md:px-10 pt-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[minmax(0,26rem)_1fr] gap-14 lg:gap-24 items-center">
          <Reveal>
            <figure className="relative">
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-ink -rotate-2">
                <Image src="/sampath1.jpg" alt="The founding composer of RST Style Studio" fill sizes="(max-width: 1024px) 80vw, 420px" className="object-cover grayscale" priority />
              </div>
              <div className="absolute -bottom-8 -right-8 w-32"><Vinyl spinning label="RST" /></div>
              <figcaption className="eyebrow text-smoke mt-12">The founding composer</figcaption>
            </figure>
          </Reveal>
          <Reveal delay={0.1}>
            <SectionLabel side="A">The composer&apos;s soul</SectionLabel>
            <blockquote className="font-display font-semibold text-[clamp(1.75rem,3.4vw,3rem)] leading-[1.12] tracking-tight mt-8">
              &ldquo;Great production doesn&apos;t begin with machines. It begins with understanding the <span className="mark">emotion</span>, <span className="mark">melody</span> and humanity behind every note.&rdquo;
            </blockquote>
            <p className="mt-8 text-lg text-ink/75 leading-relaxed max-w-2xl">
              RST Style Studio was built on the lifetime legacy of our founding composer. Decades of arranging orchestral pieces, scoring cinematic productions and mentoring musicians laid the blueprint for the studio&apos;s acoustic philosophy.
            </p>
            <ul className="grid sm:grid-cols-3 gap-4 mt-10">
              {PILLARS.map(({ title, desc, Icon }) => (
                <li key={title} className="rounded-2xl bg-paper-2 p-5">
                  <Icon className="w-5 h-5" />
                  <p className="font-display font-bold text-lg mt-4">{title}</p>
                  <p className="text-sm text-smoke mt-1">{desc}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Studio eras */}
      <section className="px-5 md:px-10 pt-32">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <SectionLabel>The studio, through the years</SectionLabel>
            <h2 className="display text-[clamp(3rem,7vw,6rem)] mt-5 mb-16">Three eras,<br />one sound.</h2>
          </Reveal>
          <div className="space-y-6">
            {ERAS.map((era, i) => (
              <Reveal key={era.side}>
                <article className={`grid md:grid-cols-2 rounded-[2rem] overflow-hidden ${i === 1 ? 'bg-ink text-paper' : 'bg-paper-2'}`}>
                  <div className={`relative aspect-[4/3] md:aspect-auto md:min-h-[24rem] ${i % 2 ? 'md:order-2' : ''}`}>
                    <Image src={era.image} alt={`RST Style Studio — ${era.era}`} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                  </div>
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <p className="eyebrow opacity-60">Track {era.side} · {era.era}</p>
                    <h3 className="display text-4xl md:text-5xl mt-4">{era.title}</h3>
                    <p className="mt-6 leading-relaxed opacity-75">{era.text}</p>
                    <div className="flex flex-wrap gap-2 mt-8">
                      {era.tags.map((tag) => (
                        <span key={tag} className="rounded-full border border-current/20 px-3 py-1 text-xs font-semibold">{tag}</span>
                      ))}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Lead engineer */}
      <section className="px-5 md:px-10 pt-32">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_minmax(0,24rem)] gap-14 lg:gap-24 items-center">
          <Reveal>
            <SectionLabel side="B">Founder · Lead engineer</SectionLabel>
            <blockquote className="font-display font-semibold text-[clamp(1.6rem,3vw,2.6rem)] leading-[1.15] tracking-tight mt-8">
              &ldquo;Our obsession has always been the space between the notes. We built RST Style Studio to capture the raw emotion of a live performance, with the clarity modern streaming demands.&rdquo;
            </blockquote>
            <p className="mt-8 text-lg text-ink/75 leading-relaxed max-w-2xl">
              Over a decade of analog experimentation and digital signal processing has shaped a sonic signature that makes Sri Lankan records sound wider, punchier and deeper.
            </p>
            <p className="font-handwritten text-4xl mt-8 -rotate-2 inline-block">— RST Style Studio</p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden bg-ink rotate-2">
              <Image src="/Sampath2.JPG" alt="The lead engineer playing guitar in the studio" fill sizes="(max-width: 1024px) 80vw, 400px" className="object-cover" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Genres */}
      <section className="pt-32">
        <div className="px-5 md:px-10">
          <div className="max-w-7xl mx-auto">
            <Reveal>
              <SectionLabel>Range</SectionLabel>
              <h2 className="display text-[clamp(3rem,7vw,6rem)] mt-5">No style<br />out of bounds.</h2>
              <p className="mt-6 max-w-xl text-lg text-smoke">From rich acoustic and traditional Sri Lankan compositions to hard-hitting commercial and electronic productions.</p>
            </Reveal>
          </div>
        </div>
        <Marquee items={GENRES.map((g) => g.name)} className="mt-14 border-y border-ink/10 py-6" duration={45} />
        <div className="px-5 md:px-10 mt-10">
          <ul className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            {GENRES.map((g, i) => (
              <li key={g.name} className="rounded-2xl border border-ink/10 p-5 hover:bg-ink hover:text-paper transition-colors group">
                <Equalizer bars={(i % 4) + 3} className="h-5 group-hover:text-lime" />
                <p className="font-display font-bold text-lg mt-5 leading-tight">{g.name}</p>
                <p className="eyebrow text-[0.6rem] opacity-50 mt-2">{g.tag}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <HonoraryMentionsSection />

      <section className="px-5 md:px-10 pt-32">
        <div className="max-w-7xl mx-auto rounded-[2rem] bg-lime text-ink p-8 md:p-14 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <h2 className="display text-[clamp(2.5rem,5vw,4rem)]">Ready to record<br />your next hit?</h2>
          <div className="flex flex-wrap gap-3">
            <PillLink href="/quote" variant="ink">Build a quote</PillLink>
            <PillLink href="/contact" variant="outline">Talk to us</PillLink>
          </div>
        </div>
      </section>
    </>
  );
}
