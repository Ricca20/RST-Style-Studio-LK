'use client';
import { Link } from '@/i18n/routing';
import TiltCard from '@/components/ui/TiltCard';
import { Mic, SlidersHorizontal, Music4, Headphones, ArrowRight, Disc } from 'lucide-react';

export default function ServicesOverviewSection() {
  const services = [
    {
      id: 'mixing',
      title: 'Mixing',
      desc: 'Achieve perfect balance, depth, and clarity. We blend your tracks into a cohesive, radio-ready masterpiece.',
      icon: <SlidersHorizontal className="w-8 h-8 text-[#0ea5e9]" />,
      link: '/services'
    },
    {
      id: 'mastering',
      title: 'Mastering',
      desc: 'The final polish. Enhancing loudness and EQ so your music translates beautifully across all streaming platforms.',
      icon: <Disc className="w-8 h-8 text-[#0ea5e9]" />,
      link: '/services'
    },
    {
      id: 'vocal-production',
      title: 'Vocal Production',
      desc: 'Pitch correction, comping, and dynamic processing to make your vocals sit perfectly in the mix.',
      icon: <Mic className="w-8 h-8 text-[#0ea5e9]" />,
      link: '/services'
    },
    {
      id: 'custom-beats',
      title: 'Custom Beats & Scoring',
      desc: 'Original compositions and arrangements tailored to your unique artistic vision or cinematic project.',
      icon: <Music4 className="w-8 h-8 text-[#0ea5e9]" />,
      link: '/services'
    }
  ];

  return (
    <section className="py-24 px-4 md:px-10 relative overflow-hidden bg-transparent border-t border-white/10">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="section-label">
              Professional Audio
            </span>
            <h2 className="section-heading text-4xl md:text-6xl">
              OUR <span className="accent">SERVICES</span>
            </h2>
            <p className="handwritten-accent text-2xl md:text-3xl mt-3">
              elevating your sound to industry standards
            </p>
          </div>
          
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-[#0ea5e9] hover:text-white font-bold text-sm tracking-wide uppercase transition-colors group"
          >
            <span>View Full Price List</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, idx) => (
            <TiltCard key={service.id}>
              <Link href={service.link} className="group relative flex flex-col aerospace-card rounded-3xl overflow-hidden h-full p-8 border border-white/5 hover:border-[#0ea5e9]/30 transition-all duration-300">
                
                {/* Hardware Screws */}
                <div className="absolute top-4 left-4 w-3 h-3 rounded-full bg-gray-800/80 border border-white/20 flex items-center justify-center text-white/30 text-[7px]">+</div>
                <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-gray-800/80 border border-white/20 flex items-center justify-center text-white/30 text-[7px]">+</div>
                
                <div className="mb-6 w-16 h-16 rounded-full bg-[#0ea5e9]/10 border border-[#0ea5e9]/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#0ea5e9]/20 transition-all duration-500 shadow-[0_0_15px_rgba(14,165,233,0.1)] group-hover:shadow-[0_0_25px_rgba(14,165,233,0.3)]">
                  {/* Since Disc is imported above, we need it. Let's fix the import if missing, but it should be fine */}
                  {service.id === 'mastering' ? <Headphones className="w-8 h-8 text-[#0ea5e9]" /> : service.icon}
                </div>
                
                <h3 className="card-title text-2xl mb-3 group-hover:text-[#0ea5e9] transition-colors">
                  {service.title}
                </h3>
                
                <p className="card-desc mb-6 flex-grow">
                  {service.desc}
                </p>
                
                <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between opacity-70 group-hover:opacity-100 transition-opacity">
                  <span className="mono-label text-[#0ea5e9]">
                    Details
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-[#0ea5e9] text-white flex items-center justify-center transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
                
              </Link>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
