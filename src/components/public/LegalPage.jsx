/** Shared layout for the Privacy Policy and Terms pages. */
export default function LegalPage({ title, updated, children }) {
  return (
    <div className="min-h-screen bg-transparent text-white pt-32 pb-24 px-4 md:px-10">
      <article className="max-w-3xl mx-auto bg-black/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">{title}</h1>
        <p className="text-sm text-white/40 mb-10">Last updated: {updated}</p>
        <div className="space-y-8 text-white/75 leading-relaxed [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1.5 [&_a]:text-[#0ea5e9] [&_a]:underline">
          {children}
        </div>
      </article>
    </div>
  );
}
