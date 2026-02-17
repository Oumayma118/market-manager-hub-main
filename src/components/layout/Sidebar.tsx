import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Store,
  Users,
  Briefcase,
  Settings,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useT } from '@/hooks/useTranslation';

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = useT();

  const navigation = [
    { name: t('dashboard'), href: '/', icon: LayoutDashboard },
    { name: t('centers'), href: '/centers', icon: Building2 },
    { name: t('locals'), href: '/locals', icon: Store },
    { name: t('owners'), href: '/owners', icon: Users },
    { name: t('activities'), href: '/activities', icon: Briefcase },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <>
      <div className="flex h-20 items-center gap-3 px-6 border-b border-sidebar-border">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary">
          <Building2 className="h-6 w-6 text-sidebar-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="font-display text-lg font-bold text-sidebar-foreground">INDH</span>
          <span className="text-xs text-sidebar-foreground/70">Market Manager</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} to={item.href} onClick={() => setMobileOpen(false)}
              className={cn('nav-link', isActive(item.href) && 'active')}>
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-4 space-y-1">
        <Link to="/settings" className="nav-link" onClick={() => setMobileOpen(false)}>
          <Settings className="h-5 w-5" />
          <span>{t('settings')}</span>
        </Link>
        <button onClick={handleLogout} className="nav-link w-full text-left text-destructive hover:bg-destructive/10">
          <LogOut className="h-5 w-5" />
          <span>{t('logout')}</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      <button type="button" className="fixed left-4 top-4 z-50 rounded-lg bg-primary p-2 text-primary-foreground shadow-lg lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}>
        {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={cn('fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar transition-transform duration-300 lg:hidden',
        mobileOpen ? 'translate-x-0' : '-translate-x-full')}>
        <SidebarContent />
      </aside>

      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-64 lg:flex-col bg-sidebar">
        <SidebarContent />
      </aside>
    </>
  );
}
