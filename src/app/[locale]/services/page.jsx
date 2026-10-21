import { getTranslations } from 'next-intl/server';
import { Headphones, Mic2, SlidersHorizontal, Music4, Disc3, Film } from 'lucide-react';
import prisma from '@/lib/db';
import { t } from '@/lib/utils/t';
import { getPublicSettings } from '@/lib/settings';
import { QUOTE_ROLES } from '@/lib/quoteRoles';
import PageHero from '@/components/music/PageHero';
import SectionLabel from '@/components/music/SectionLabel';
import PillLink from '@/components/music/PillLink';
import Reveal from '@/components/music/Reveal';
import Equalizer from '@/components/music/Equalizer';
import BookingStatusNotice from '@/components/public/BookingStatusNotice';

export async function generateMetadata() {
  return {
    title: 'Services & Pricing | RST Style Studio LK',
    description: 'Recording, mixing, mastering and production services, with a transparent rate card.',
  };
}

const ICONS = [SlidersHorizontal, Headphones, Mic2, Music4, Disc3, Film];
const formatRs = (n) => `Rs ${Math.round(n).toLocaleString()}`;

export default async function ServicesPage({ params }) {
  const { locale } = await params;
  const tServices = await getTranslations({ locale, namespace: 'Services' });

  let services = [];
  let collaborators = [];
  let settings = null;
  try {
    [services, collaborators, settings] = await Promise.all([
      prisma.service.findMany({ where: { isActive: true, deletedAt: null }, orderBy: { sortOrder: 'asc' } }),
      prisma.collaborator.findMany({ where: { isActive: true }, include: { profile: { select: { name: true } } } }),
      getPublicSettings(),
    ]);
  } catch (e) {
    console.error('Failed fetching services page data:', e);
  }

  // Rate card: one row per quote role with who offers it and the price range
  const rateCard = QUOTE_ROLES.map((role) => {
    const people = collaborators.filter((c) => c.role === role.key);
    if (people.length === 0) return null;
    const prices = people.map((p) => p.price);
    return { ...role, people: people.map((p) => p.profile?.name).filter(Boolean), min: Math.min(...prices), max: Math.max(...prices) };
  }).filter(Boolean);

  return (
    <>
      <PageHero
        label="Studio sessions"
        title={['Everything', 'your song', 'needs.']}
        intro="From the first lyric to the final master. Pick single sessions, or build a whole team in the quotation wizard and see the estimate instantly."
        seed={53}
      >
        <BookingStatusNotice status={settings?.bookingStatus} className="mb-5" />
        <PillLink href="/quote" variant="lime">Build your quote</PillLink>
      </PageHero>

      {/* Services */}
      {services.length > 0 && (
        <section className="px-5 md:px-10 pt-6">
          <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service, i) => {
              const Icon = ICONS[i % ICONS.length];
              const dark = i % 4 === 1;
              return (
                <Reveal key={service.id} delay={(i % 3) * 0.08}>
                  <article className={`group h-full rounded-[2rem] p-8 flex flex-col transition-transform duration-500 hover:-translate-y-1 ${dark ? 'bg-ink text-paper' : 'bg-paper-2'}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-sm opacity-50 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                      <span className={`w-12 h-12 rounded-full flex items-center justify-center ${dark ? 'bg-lime text-ink' : 'bg-ink text-paper group-hover:bg-lime group-hover:text-ink'} transition-colors`}>
                        <Icon className="w-5 h-5" />
                      </span>
                    </div>
                    <h2 className="display text-3xl md:text-4xl mt-10">{t(service, 'name', locale)}</h2>
                    {t(service, 'description', locale) && (
                      <p className={`mt-4 leading-relaxed flex-1 ${dark ? 'text-paper/70' : 'text-ink/70'}`}>{t(service, 'description', locale)}</p>
                    )}
                    {service.basePrice > 0 && (
                      <p className="mt-8 pt-6 border-t border-current/10 text-sm">
                        <span className="opacity-60">{tServices('basePrice')} </span>
                        <span className="font-display font-bold text-2xl">{formatRs(service.basePrice)}</span>
                      </p>
                    )}
                  </article>
                </Reveal>
              );
            })}
          </div>
        </section>
      )}

      {/* Rate card */}
      {rateCard.length > 0 && (
        <section className="px-5 md:px-10 pt-32">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-[22rem_1fr] gap-12">
            <Reveal>
              <SectionLabel>Rate card</SectionLabel>
              <h2 className="display text-[clamp(2.75rem,6vw,4.5rem)] mt-5">Pick your<br />players.</h2>
              <p className="mt-6 text-smoke leading-relaxed">Each role is offered by one or more artists in the RST collective. Prices are per song; the wizard adds them up for you.</p>
              <div className="mt-8"><PillLink href="/quote" variant="ink">Start the wizard</PillLink></div>
            </Reveal>
            <Reveal delay={0.1}>
              <ul>
                {rateCard.map((role) => (
                  <li key={role.key} className="flex items-center gap-5 py-5 border-b border-ink/10">
                    <span className="text-2xl w-9 shrink-0" aria-hidden="true">{role.emoji}</span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-3">
                        <span className="font-display font-bold text-xl md:text-2xl">{role.label}</span>
                        {role.required && <span className="eyebrow text-[0.58rem] rounded-full bg-lime px-2 py-0.5">Core</span>}
                      </span>
                      <span className="block text-sm text-smoke mt-1 truncate">{role.people.join(', ')}</span>
                    </span>
                    <span className="font-display font-bold text-lg md:text-xl text-right shrink-0 tabular-nums">
                      {role.min === role.max ? formatRs(role.min) : `${formatRs(role.min)} – ${formatRs(role.max)}`}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="px-5 md:px-10 pt-32">
        <div className="max-w-7xl mx-auto rounded-[2rem] bg-ink text-paper p-8 md:p-14">
          <SectionLabel tone="paper">How a session works</SectionLabel>
          <ol className="grid md:grid-cols-4 gap-8 mt-10">
            {[
              ['Build', 'Choose your team and options in the quotation wizard.'],
              ['Talk', 'We confirm scope, schedule and the final price with you.'],
              ['Record', 'Writing, tracking and production in the studio.'],
              ['Release', 'Mixed, mastered and ready for every platform.'],
            ].map(([title, text], i) => (
              <li key={title}>
                <Equalizer bars={i + 2} className="h-6 text-lime" />
                <p className="display text-4xl mt-5">{title}</p>
                <p className="text-paper/60 mt-3 leading-relaxed">{text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-12 flex flex-wrap gap-3">
            <PillLink href="/quote" variant="lime">Get a quote</PillLink>
            <PillLink href="/contact" variant="light">Ask a question</PillLink>
          </div>
        </div>
      </section>
    </>
  );
}
