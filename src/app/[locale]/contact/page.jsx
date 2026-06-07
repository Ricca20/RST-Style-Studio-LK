import { getTranslations } from 'next-intl/server';

export default async function ContactPage({ params }) {
  const { locale } = await params;
  const tContact = await getTranslations({ locale, namespace: 'Contact' });

  return (
    <div className="min-h-screen bg-[#151118] pt-24">
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-10 lg:px-20 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* LEFT COLUMN: Info & Visuals */}
          <div className="lg:col-span-5 flex flex-col gap-10">
            {/* Heading */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-medium tracking-widest text-green-400 uppercase">
                  Studio Online • Accepting Bookings
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black leading-[0.9] tracking-tighter bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                LET&apos;S MAKE<br />NOISE.
              </h1>
              <p className="text-[#ad9db9] text-lg font-normal leading-relaxed max-w-md">
                High fidelity meets creative freedom. Book your session at RST Style Studio and access professional gear in a perfectly treated acoustic space.
              </p>
            </div>

            {/* Contact Info Grid */}
            <div className="flex flex-col gap-0 border-t border-white/10">
              <div className="grid grid-cols-[auto_1fr] gap-x-8 py-5 border-b border-white/10 items-start">
                <div className="text-[#9d2bee] mt-1">
                  <span className="material-symbols-outlined">location_on</span>
                </div>
                <div>
                  <p className="text-[#ad9db9] text-xs uppercase tracking-wider mb-1">{tContact('address')}</p>
                  <p className="text-white text-base font-medium">Sri Lanka</p>
                </div>
              </div>
              <div className="grid grid-cols-[auto_1fr] gap-x-8 py-5 border-b border-white/10 items-start">
                <div className="text-[#9d2bee] mt-1">
                  <span className="material-symbols-outlined">mail</span>
                </div>
                <div>
                  <p className="text-[#ad9db9] text-xs uppercase tracking-wider mb-1">{tContact('email')}</p>
                  <a
                    className="text-white text-base font-medium hover:text-[#9d2bee] transition-colors"
                    href="mailto:hello@rststylestudiolk.com"
                  >
                    hello@rststylestudiolk.com
                  </a>
                </div>
              </div>
              <div className="grid grid-cols-[auto_1fr] gap-x-8 py-5 border-b border-white/10 items-start">
                <div className="text-[#9d2bee] mt-1">
                  <span className="material-symbols-outlined">call</span>
                </div>
                <div>
                  <p className="text-[#ad9db9] text-xs uppercase tracking-wider mb-1">{tContact('phone')}</p>
                  <p className="text-white text-base font-medium">+94 77 123 4567</p>
                </div>
              </div>
              <div className="grid grid-cols-[auto_1fr] gap-x-8 py-5 border-b border-white/10 items-start">
                <div className="text-[#9d2bee] mt-1">
                  <span className="material-symbols-outlined">chat</span>
                </div>
                <div>
                  <p className="text-[#ad9db9] text-xs uppercase tracking-wider mb-1">{tContact('whatsapp')}</p>
                  <p className="text-white text-base font-medium">+94 77 123 4567</p>
                </div>
              </div>
            </div>

            {/* Socials */}
            <div>
              <p className="text-[#ad9db9] text-xs uppercase tracking-wider mb-4">Connect</p>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="group flex items-center justify-center w-12 h-12 rounded-full bg-[#251e2b] border border-white/5 hover:border-[#9d2bee]/50 hover:bg-[#9d2bee]/20 transition-all"
                >
                  <span className="material-symbols-outlined text-white/70 group-hover:text-white text-[20px]">
                    public
                  </span>
                </a>
                <a
                  href="#"
                  className="group flex items-center justify-center w-12 h-12 rounded-full bg-[#251e2b] border border-white/5 hover:border-[#9d2bee]/50 hover:bg-[#9d2bee]/20 transition-all"
                >
                  <span className="material-symbols-outlined text-white/70 group-hover:text-white text-[20px]">
                    play_circle
                  </span>
                </a>
                <a
                  href="#"
                  className="group flex items-center justify-center w-12 h-12 rounded-full bg-[#251e2b] border border-white/5 hover:border-[#9d2bee]/50 hover:bg-[#9d2bee]/20 transition-all"
                >
                  <span className="material-symbols-outlined text-white/70 group-hover:text-white text-[20px]">
                    graphic_eq
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Booking Form */}
          <div className="lg:col-span-7">
            <div className="glass-panel p-6 md:p-8 rounded-2xl shadow-2xl relative overflow-hidden">
              {/* Decorative glow */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#9d2bee]/20 rounded-full blur-[80px] pointer-events-none" />
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2 relative z-10">
                Request a Session
              </h3>
              <form className="flex flex-col gap-6 relative z-10">
                {/* Name & Artist */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#ad9db9]">
                      Contact Name
                    </label>
                    <input
                      className="h-12 w-full rounded-lg border border-[#322839] bg-[#1a151f] px-4 text-white placeholder-gray-600 focus:border-[#9d2bee] focus:ring-1 focus:ring-[#9d2bee] focus:outline-none transition-all"
                      placeholder="Your Name"
                      type="text"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#ad9db9]">
                      Artist / Band Name
                    </label>
                    <input
                      className="h-12 w-full rounded-lg border border-[#322839] bg-[#1a151f] px-4 text-white placeholder-gray-600 focus:border-[#9d2bee] focus:ring-1 focus:ring-[#9d2bee] focus:outline-none transition-all"
                      placeholder="Artist Name"
                      type="text"
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#ad9db9]">
                      Email Address
                    </label>
                    <input
                      className="h-12 w-full rounded-lg border border-[#322839] bg-[#1a151f] px-4 text-white placeholder-gray-600 focus:border-[#9d2bee] focus:ring-1 focus:ring-[#9d2bee] focus:outline-none transition-all"
                      placeholder="you@example.com"
                      type="email"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#ad9db9]">
                      Phone Number
                    </label>
                    <input
                      className="h-12 w-full rounded-lg border border-[#322839] bg-[#1a151f] px-4 text-white placeholder-gray-600 focus:border-[#9d2bee] focus:ring-1 focus:ring-[#9d2bee] focus:outline-none transition-all"
                      placeholder="+94 7X XXX XXXX"
                      type="tel"
                    />
                  </div>
                </div>

                {/* Service Type */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#ad9db9]">
                    Service Needed
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <label className="cursor-pointer">
                      <input defaultChecked className="peer sr-only" name="service" type="radio" />
                      <div className="h-full rounded-lg border border-[#322839] bg-[#1a151f] p-4 text-center hover:bg-[#251e2b] peer-checked:border-[#9d2bee] peer-checked:bg-[#9d2bee]/10 transition-all flex flex-col items-center gap-1">
                        <span className="material-symbols-outlined text-gray-400 peer-checked:text-[#9d2bee] mb-1">
                          mic_external_on
                        </span>
                        <span className="text-sm font-medium text-white">Recording</span>
                      </div>
                    </label>
                    <label className="cursor-pointer">
                      <input className="peer sr-only" name="service" type="radio" />
                      <div className="h-full rounded-lg border border-[#322839] bg-[#1a151f] p-4 text-center hover:bg-[#251e2b] peer-checked:border-[#9d2bee] peer-checked:bg-[#9d2bee]/10 transition-all flex flex-col items-center gap-1">
                        <span className="material-symbols-outlined text-gray-400 peer-checked:text-[#9d2bee] mb-1">
                          tune
                        </span>
                        <span className="text-sm font-medium text-white">Mixing</span>
                      </div>
                    </label>
                    <label className="cursor-pointer">
                      <input className="peer sr-only" name="service" type="radio" />
                      <div className="h-full rounded-lg border border-[#322839] bg-[#1a151f] p-4 text-center hover:bg-[#251e2b] peer-checked:border-[#9d2bee] peer-checked:bg-[#9d2bee]/10 transition-all flex flex-col items-center gap-1">
                        <span className="material-symbols-outlined text-gray-400 peer-checked:text-[#9d2bee] mb-1">
                          album
                        </span>
                        <span className="text-sm font-medium text-white">Mastering</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Date */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#ad9db9]">
                    Preferred Date
                  </label>
                  <input
                    className="h-12 w-full rounded-lg border border-[#322839] bg-[#1a151f] px-4 text-white placeholder-gray-600 focus:border-[#9d2bee] focus:ring-1 focus:ring-[#9d2bee] focus:outline-none transition-all [color-scheme:dark]"
                    type="date"
                  />
                </div>

                {/* Details */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#ad9db9]">
                    Project Details
                  </label>
                  <textarea
                    className="h-32 w-full rounded-lg border border-[#322839] bg-[#1a151f] p-4 text-white placeholder-gray-600 focus:border-[#9d2bee] focus:ring-1 focus:ring-[#9d2bee] focus:outline-none transition-all resize-none"
                    placeholder="Tell us about your project, genre, and how many hours you think you'll need..."
                  />
                </div>

                {/* Submit */}
                <div className="mt-2">
                  <button
                    type="button"
                    className="neon-glow flex w-full cursor-pointer items-center justify-center rounded-lg bg-[#9d2bee] py-4 text-base font-bold text-white hover:bg-[#9d2bee]/90 active:scale-[0.98] transition-all"
                  >
                    Book Session Request
                  </button>
                  <p className="text-center text-xs text-gray-500 mt-2">
                    We&apos;ll get back to you within 24 hours.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
