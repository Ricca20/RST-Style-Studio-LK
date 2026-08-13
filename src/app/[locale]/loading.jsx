export default function LocaleLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6 py-20">
      <div className="flex flex-col items-center gap-6">
        {/* Animated logo pulse */}
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-[#0ea5e9]/10 border border-[#0ea5e9]/30 flex items-center justify-center animate-pulse">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#9d2bee] animate-spin" style={{ animationDuration: '2s' }} />
          </div>
          <div className="absolute -inset-4 bg-[#0ea5e9]/5 rounded-3xl blur-xl animate-pulse" />
        </div>

        <div className="text-center">
          <p className="text-white/40 text-sm font-mono uppercase tracking-widest">Loading</p>
        </div>
      </div>
    </div>
  );
}
