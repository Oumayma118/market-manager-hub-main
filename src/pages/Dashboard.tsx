import { useEffect } from 'react';
import { Building2, Store, Users, TrendingUp, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
import { fetchCenters } from '@/redux/slices/centersSlice';
import { fetchLocals } from '@/redux/slices/localsSlice';
import { fetchOwners } from '@/redux/slices/ownersSlice';
import { fetchActivities } from '@/redux/slices/activitiesSlice';
import { Button } from '@/components/ui/button';
import { useT } from '@/hooks/useTranslation';
import { formatCurrency, convertFromMAD, getCurrencySymbol } from '@/lib/currency';

const COLORS = ['#1e3a5f', '#c9a84c', '#2563eb', '#16a34a', '#f59e0b', '#ef4444'];

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { centers } = useAppSelector((state) => state.centers);
  const { locals } = useAppSelector((state) => state.locals);
  const { owners } = useAppSelector((state) => state.owners);
  const { activities } = useAppSelector((state) => state.activities);
  const t = useT();
  const currency = useAppSelector((state) => state.settings.currency);

  useEffect(() => {
    dispatch(fetchCenters());
    dispatch(fetchLocals());
    dispatch(fetchOwners());
    dispatch(fetchActivities());
  }, [dispatch]);

  const totalLocals = locals.length;
  const availableLocals = locals.filter((l) => l.status === 'available').length;
  const rentedLocals = locals.filter((l) => l.status === 'rented').length;
  const occupancyRate = totalLocals > 0 ? Math.round((rentedLocals / totalLocals) * 100) : 0;
  const totalRent = locals.filter((l) => l.status === 'rented').reduce((sum, l) => sum + l.monthlyRent, 0);

  const recentLocals = [...locals]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const activityLabels: Record<string, string> = {
    boutique: t('boutique'), restaurant: t('restaurant'), service: t('service'),
    artisanat: t('artisanat'), autre: t('other'),
  };

  const activityTypeData = ['boutique', 'restaurant', 'service', 'artisanat', 'autre'].map((type) => ({
    name: activityLabels[type], value: activities.filter((a) => a.type === type).length,
  })).filter(d => d.value > 0);

  const centersChartData = centers.map((c) => ({
    name: c.name.length > 12 ? c.name.slice(0, 12) + '…' : c.name,
    [t('rented')]: c.totalLocals - c.availableLocals,
    [t('available')]: c.availableLocals,
  }));

  const occupancyPieData = [
    { name: t('rented'), value: rentedLocals },
    { name: t('available'), value: availableLocals },
  ];

  const monthlyRevenueData = [
    { month: 'Sep', revenue: totalRent * 0.82 },
    { month: 'Oct', revenue: totalRent * 0.88 },
    { month: 'Nov', revenue: totalRent * 0.91 },
    { month: 'Déc', revenue: totalRent * 0.95 },
    { month: 'Jan', revenue: totalRent * 0.97 },
    { month: 'Fév', revenue: totalRent },
  ].map(d => ({ ...d, revenue: convertFromMAD(Math.round(d.revenue), currency) }));

  return (
    <MainLayout>
      <PageHeader title={t('dashboard')} subtitle={t('dashboard_subtitle')} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard title={t('commercial_centers')} value={centers.length} subtitle={`${centers.reduce((sum, c) => sum + c.totalLocals, 0)} ${t('total_locals')}`} icon={Building2} variant="primary" />
        <StatCard title={t('available_locals')} value={availableLocals} subtitle={`${t('out_of')} ${totalLocals} ${t('locals').toLowerCase()}`} icon={Store} variant="success" />
        <StatCard title={t('active_owners')} value={owners.length} subtitle={`${rentedLocals} ${t('ongoing_rentals')}`} icon={Users} variant="default" />
        <StatCard title={t('monthly_revenue')} value={formatCurrency(totalRent, currency)} subtitle={`${t('occupancy_rate')}: ${occupancyRate}%`} icon={TrendingUp} variant="warning" trend={{ value: 12, positive: true }} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        <div className="lg:col-span-2 bg-card rounded-xl border border-border shadow-sm p-6 animate-fade-in">
          <h2 className="font-display text-lg font-semibold mb-4">{t('revenue_evolution')}</h2>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyRevenueData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c9a84c" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#c9a84c" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value: number) => [`${value.toLocaleString()} ${getCurrencySymbol(currency)}`, t('monthly_revenue')]} contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="revenue" stroke="#c9a84c" strokeWidth={2} fill="url(#revenueGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl border border-border shadow-sm p-6 animate-fade-in">
          <h2 className="font-display text-lg font-semibold mb-4">{t('occupancy_chart')}</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={occupancyPieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                {occupancyPieData.map((_, i) => (<Cell key={i} fill={i === 0 ? '#1e3a5f' : '#16a34a'} />))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2 text-xs">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#1e3a5f' }} />{t('rented')} ({rentedLocals})</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#16a34a' }} />{t('available')} ({availableLocals})</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <div className="bg-card rounded-xl border border-border shadow-sm p-6 animate-fade-in">
          <h2 className="font-display text-lg font-semibold mb-4">{t('locals_per_center')}</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={centersChartData} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey={t('rented')} fill="#1e3a5f" radius={[4, 4, 0, 0]} />
              <Bar dataKey={t('available')} fill="#16a34a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl border border-border shadow-sm p-6 animate-fade-in">
          <h2 className="font-display text-lg font-semibold mb-4">{t('activities_distribution')}</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={activityTypeData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name} (${value})`} fontSize={11}>
                {activityTypeData.map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-card rounded-xl border border-border shadow-sm animate-slide-up">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="font-display text-xl font-semibold">{t('recent_locals')}</h2>
            <Link to="/locals"><Button variant="ghost" size="sm" className="gap-1">{t('view_all')} <ArrowUpRight className="h-4 w-4" /></Button></Link>
          </div>
          <div className="divide-y divide-border">
            {recentLocals.map((local) => (
              <div key={local.id} className="flex items-center justify-between p-4 hover:bg-accent/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted"><Store className="h-5 w-5 text-muted-foreground" /></div>
                  <div>
                    <p className="font-medium text-foreground">{local.number}</p>
                    <p className="text-sm text-muted-foreground">{local.centerName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">{formatCurrency(local.monthlyRent, currency)}</span>
                  <StatusBadge status={local.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border shadow-sm animate-slide-up">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="font-display text-xl font-semibold">{t('commercial_centers')}</h2>
            <Link to="/centers"><Button variant="ghost" size="sm" className="gap-1">{t('manage')} <ArrowUpRight className="h-4 w-4" /></Button></Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left text-sm font-semibold">{t('center')}</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">{t('locals')}</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">{t('occupation')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {centers.map((center) => {
                  const occ = center.totalLocals > 0 ? Math.round(((center.totalLocals - center.availableLocals) / center.totalLocals) * 100) : 0;
                  return (
                    <tr key={center.id} className="hover:bg-accent/30 transition-colors">
                      <td className="px-4 py-3"><div className="flex items-center gap-2"><Building2 className="h-4 w-4 text-primary" /><span className="font-medium text-sm">{center.name}</span></div></td>
                      <td className="px-4 py-3 text-center text-sm">{center.totalLocals}</td>
                      <td className="px-4 py-3"><div className="flex items-center justify-center gap-2"><div className="h-2 w-16 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-secondary" style={{ width: `${occ}%` }} /></div><span className="text-xs font-medium">{occ}%</span></div></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
