import prisma from '@/lib/db';
import { Music, Users, FileVideo, MessageSquare, Briefcase, Activity, AlertTriangle, Clock, CheckCircle2, TrendingUp, Settings, Plus, LayoutDashboard, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import DashboardCharts from '@/components/admin/DashboardCharts';

export default async function AdminDashboard({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const days = parseInt(resolvedSearchParams?.days) || 30;

  const [
    songCount, 
    profileCount, 
    serviceCount,
    settings,
    socialCaches,
    totalQuotesCount,
    pendingQuotesCount,
    acceptedQuotesCount,
    pendingAgg,
    acceptedAgg
  ] = await Promise.all([
    prisma.song.count(),
    prisma.profile.count(),
    prisma.service.count(),
    prisma.studioSettings.findFirst(),
    prisma.socialCache.findMany({ select: { platform: true, updatedAt: true } }),
    prisma.quotationRequest.count(),
    prisma.quotationRequest.count({ where: { status: 'PENDING' } }),
    prisma.quotationRequest.count({ where: { status: 'ACCEPTED' } }),
    prisma.quotationRequest.aggregate({ _sum: { estimatedBudget: true }, where: { status: 'PENDING' } }),
    prisma.quotationRequest.aggregate({ _sum: { estimatedBudget: true }, where: { status: 'ACCEPTED' } })
  ]);

  const pendingRevenue = pendingAgg._sum.estimatedBudget || 0;
  const securedRevenue = acceptedAgg._sum.estimatedBudget || 0;
  const conversionRate = totalQuotesCount > 0 ? Math.round((acceptedQuotesCount / totalQuotesCount) * 100) : 0;

  const [recentSongs, recentQuotes, recentProfiles] = await Promise.all([
    prisma.song.findMany({ take: 5, orderBy: { updatedAt: 'desc' }, select: { id: true, titleEn: true, updatedAt: true, projectType: true } }),
    prisma.quotationRequest.findMany({ take: 5, orderBy: { createdAt: 'desc' }, select: { id: true, name: true, createdAt: true, status: true, estimatedBudget: true } }),
    prisma.profile.findMany({ take: 5, orderBy: { createdAt: 'desc' }, select: { id: true, name: true, createdAt: true } })
  ]);

  const feed = [
    ...recentSongs.map(s => ({
      id: `song-${s.id}`,
      type: 'Project Updated',
      title: s.titleEn,
      date: s.updatedAt,
      icon: s.projectType === 'MUSIC_VIDEO' ? FileVideo : Music,
      color: 'text-gray-600 bg-gray-100'
    })),
    ...recentQuotes.map(q => ({
      id: `quote-${q.id}`,
      type: `${q.status} Quote`,
      title: `${q.name} (${settings?.defaultCurrency || 'LKR'} ${q.estimatedBudget?.toLocaleString()})`,
      date: q.createdAt,
      icon: MessageSquare,
      color: q.status === 'PENDING' ? 'text-amber-600 bg-amber-50 border-amber-200' : 
             q.status === 'ACCEPTED' ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : 'text-gray-600 bg-gray-100'
    })),
    ...recentProfiles.map(p => ({
      id: `prof-${p.id}`,
      type: 'Profile Added',
      title: p.name,
      date: p.createdAt,
      icon: Users,
      color: 'text-gray-600 bg-gray-100'
    }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8);

  // --- Compute Chart Data ---
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const chartQuotes = await prisma.quotationRequest.findMany({
    where: { createdAt: { gte: startDate } },
    select: { createdAt: true, genre: true }
  });

  // Group by Date for Line Chart
  const quotesByDate = {};
  chartQuotes.forEach(q => {
    const dateStr = q.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    quotesByDate[dateStr] = (quotesByDate[dateStr] || 0) + 1;
  });
  const chartData = Object.keys(quotesByDate).map(date => ({ date, count: quotesByDate[date] })).reverse(); // Reverse if needed depending on sort, but let's just sort by actual date
  // Generate an array of last N days and fill in counts:
  const lastDaysArr = Array.from({length: days}, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });
  const finalChartData = lastDaysArr.map(date => ({ date, count: quotesByDate[date] || 0 }));

  // Group by Genre for Pie Chart
  const genreCounts = {};
  chartQuotes.forEach(q => {
    const genre = q.genre || 'Unspecified';
    genreCounts[genre] = (genreCounts[genre] || 0) + 1;
  });
  const genrePieData = Object.keys(genreCounts).map(name => ({ name, value: genreCounts[name] }));

  const currency = settings?.defaultCurrency || 'LKR';

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "m ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return "Just now";
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 space-y-10">
      
      {/* Minimal Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Overview</h1>
          <p className="text-gray-500 mt-1 text-sm">Studio performance and recent activities.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/settings" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition flex items-center gap-2">
            <Settings className="w-4 h-4" /> Settings
          </Link>
          <Link href="/admin/songs/new" className="px-4 py-2 text-sm font-medium bg-black hover:bg-gray-800 text-white rounded-lg transition flex items-center gap-2 shadow-sm">
            <Plus className="w-4 h-4" /> New Project
          </Link>
        </div>
      </div>

      {settings?.maintenanceMode && (
        <div className="bg-rose-50/50 border border-rose-200 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <p className="text-sm text-rose-800 font-medium">Maintenance Mode is ON. Public website is hidden.</p>
        </div>
      )}

      {/* Financials (Minimal Clean Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 text-gray-500 mb-4">
            <Briefcase className="w-4 h-4" />
            <h3 className="text-xs font-semibold uppercase tracking-wider">Pending Revenue</h3>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-gray-500 text-lg">{currency}</span>
            <span className="text-3xl font-semibold text-gray-900 tracking-tight">{pendingRevenue.toLocaleString()}</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">{pendingQuotesCount} quotes awaiting review</p>
        </div>

        <div className="bg-white rounded-2xl border p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 text-emerald-600 mb-4">
            <CheckCircle2 className="w-4 h-4" />
            <h3 className="text-xs font-semibold uppercase tracking-wider">Secured Revenue</h3>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-gray-500 text-lg">{currency}</span>
            <span className="text-3xl font-semibold text-gray-900 tracking-tight">{securedRevenue.toLocaleString()}</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">{acceptedQuotesCount} accepted projects</p>
        </div>

        <div className="bg-white rounded-2xl border p-6 hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-center gap-2 text-gray-500 mb-4">
            <TrendingUp className="w-4 h-4" />
            <h3 className="text-xs font-semibold uppercase tracking-wider">Conversion Rate</h3>
          </div>
          <div>
            <span className="text-3xl font-semibold text-gray-900 tracking-tight">{conversionRate}%</span>
            <div className="w-full bg-gray-100 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-gray-900 h-full rounded-full" style={{ width: `${conversionRate}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      <DashboardCharts quotesData={finalChartData} genreData={genrePieData} currentDays={days} conversionRate={conversionRate} funnelData={{ total: totalQuotesCount, pending: pendingQuotesCount, accepted: acceptedQuotesCount }} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        
        {/* Left: Entity Stats & Health */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-50/50 rounded-2xl border p-5 flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Projects</p>
                <p className="text-2xl font-semibold text-gray-900">{songCount}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white border flex items-center justify-center text-gray-600">
                <Music className="w-5 h-5" />
              </div>
            </div>
            
            <div className="bg-gray-50/50 rounded-2xl border p-5 flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Profiles</p>
                <p className="text-2xl font-semibold text-gray-900">{profileCount}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white border flex items-center justify-center text-gray-600">
                <Users className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-gray-50/50 rounded-2xl border p-5 flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Services</p>
                <p className="text-2xl font-semibold text-gray-900">{serviceCount}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white border flex items-center justify-center text-gray-600">
                <LayoutDashboard className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border overflow-hidden">
            <div className="p-5 border-b flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">API Health</h3>
              <Activity className="w-4 h-4 text-gray-400" />
            </div>
            <div className="p-5">
              {socialCaches.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {socialCaches.map(cache => (
                    <div key={cache.platform} className="px-4 py-2 rounded-full border bg-gray-50/50 text-sm flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span className="font-medium text-gray-700">{cache.platform}</span>
                      <span className="text-gray-400 ml-1">{timeAgo(cache.updatedAt)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No external API connections established yet.</p>
              )}
            </div>
          </div>

        </div>

        {/* Right: Minimal Activity Feed */}
        <div className="bg-white rounded-2xl border flex flex-col">
          <div className="p-5 border-b flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Recent Activity</h3>
            <Link href="/admin/quotations" className="text-xs text-gray-500 hover:text-black flex items-center gap-1 transition">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="p-5 flex-1">
            {feed.length > 0 ? (
              <div className="space-y-6">
                {feed.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.id} className="flex gap-4 group">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${item.color}`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        {index !== feed.length - 1 && <div className="w-px h-full bg-gray-200 my-2"></div>}
                      </div>
                      <div className="pb-2">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">{item.type}</span>
                          <span className="text-xs text-gray-400">• {timeAgo(item.date)}</span>
                        </div>
                        <p className="text-sm text-gray-900">{item.title}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-10">No recent activity.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
  
