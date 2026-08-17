'use client';
import { Link } from '@/i18n/routing';
import { ArrowRight, FileText } from 'lucide-react';

export default function CtaSection() {
  return (
    <section className="py-24 px-8 md:px-16 relative overflow-hidden bg-transparent border-t border-white/10">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-[#0ea5e9]/10 rounded-[100%] blur-[120px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10 text-center flex flex-col items-center">
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md shadow-xl">
          <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
          Accepting New Projects
        </div>
        
        <h2 className="section-heading text-5xl md:text-7xl mb-6">
          READY TO <span className="accent">RECORD?</span>
        </h2>
        
        <p className="card-desc text-lg md:text-xl max-w-2xl mb-12 text-center">
          Bring your musical vision to life. Get a detailed, transparent estimate for your next project using our interactive Quotation Wizard.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link
            href="/quote"
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#0ea5e9] hover:bg-[#0284c7] text-white rounded-full font-bold text-sm tracking-wider uppercase transition-all duration-300 shadow-[0_0_20px_rgba(14,165,233,0.4)] hover:shadow-[0_0_35px_rgba(14,165,233,0.6)] hover:-translate-y-1 overflow-hidden"
          >
            {/* Glossy overlay effect */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none rounded-t-full" />
            
            <FileText className="w-5 h-5" />
            <span>Get a Free Quote</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link
            href="/contact"
            className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-transparent border border-white/20 hover:border-white/50 text-white rounded-full font-bold text-sm tracking-wider uppercase transition-all duration-300 hover:bg-white/5"
          >
            <span>Contact Studio</span>
          </Link>
        </div>
        
        <div className="mt-12 flex items-center justify-center gap-8 opacity-50">
          {/* Subtle hardware screws for the section */}
          <div className="w-3 h-3 rounded-full bg-gray-800 border border-white/20 flex items-center justify-center text-white/40 text-[6px]">+</div>
          <div className="w-48 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="w-3 h-3 rounded-full bg-gray-800 border border-white/20 flex items-center justify-center text-white/40 text-[6px]">+</div>
        </div>
        
      </div>
    </section>
  );
}
