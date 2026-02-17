import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { Bell, Shield, Palette, Globe, DollarSign, Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { setLanguage, setCurrency, setNotification, setAnimations, setTheme } from '@/redux/slices/settingsSlice';
import { useTheme } from '@/components/ThemeProvider';
import { toast } from '@/hooks/use-toast';
import { useT } from '@/hooks/useTranslation';

const languages = [
  { value: 'fr', label: 'Français' },
  { value: 'ar', label: 'العربية' },
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
];

const currencies = [
  { value: 'MAD', label: 'Dirham marocain (DH)' },
  { value: 'EUR', label: 'Euro (€)' },
  { value: 'USD', label: 'Dollar US ($)' },
  { value: 'GBP', label: 'Livre sterling (£)' },
];

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(state => state.settings);
  const { theme, setTheme: applyTheme } = useTheme();
  const t = useT();

  const handleLanguageChange = (value: string) => {
    dispatch(setLanguage(value));
    const lang = languages.find(l => l.value === value);
    toast({ title: t('language_changed'), description: lang?.label });
  };

  const handleCurrencyChange = (value: string) => {
    dispatch(setCurrency(value));
    const curr = currencies.find(c => c.value === value);
    toast({ title: t('currency_changed'), description: curr?.label });
  };

  const handleThemeChange = (value: 'light' | 'dark' | 'system') => {
    dispatch(setTheme(value));
    applyTheme(value);
    toast({ title: t('theme_changed'), description: t(value) });
  };

  return (
    <MainLayout>
      <PageHeader title={t('settings')} subtitle={t('settings_subtitle')} />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Language */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Globe className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold">{t('language')}</h2>
              <p className="text-sm text-muted-foreground">{t('language_desc')}</p>
            </div>
          </div>
          <Select value={settings.language} onValueChange={handleLanguageChange}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {languages.map(lang => (
                <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Currency */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/20">
              <DollarSign className="h-5 w-5 text-secondary-foreground" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold">{t('currency')}</h2>
              <p className="text-sm text-muted-foreground">{t('currency_desc')}</p>
            </div>
          </div>
          <Select value={settings.currency} onValueChange={handleCurrencyChange}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {currencies.map(curr => (
                <SelectItem key={curr.value} value={curr.value}>{curr.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Notifications */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
              <Bell className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold">{t('notifications')}</h2>
              <p className="text-sm text-muted-foreground">{t('notifications_desc')}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div><Label>{t('new_tenants')}</Label><p className="text-sm text-muted-foreground">{t('new_tenants_desc')}</p></div>
              <Switch checked={settings.notifications.newTenants} onCheckedChange={v => dispatch(setNotification({ key: 'newTenants', value: v }))} />
            </div>
            <div className="flex items-center justify-between">
              <div><Label>{t('late_payments')}</Label><p className="text-sm text-muted-foreground">{t('late_payments_desc')}</p></div>
              <Switch checked={settings.notifications.latePayments} onCheckedChange={v => dispatch(setNotification({ key: 'latePayments', value: v }))} />
            </div>
            <div className="flex items-center justify-between">
              <div><Label>{t('monthly_reports')}</Label><p className="text-sm text-muted-foreground">{t('monthly_reports_desc')}</p></div>
              <Switch checked={settings.notifications.monthlyReports} onCheckedChange={v => dispatch(setNotification({ key: 'monthlyReports', value: v }))} />
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Palette className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold">{t('appearance')}</h2>
              <p className="text-sm text-muted-foreground">{t('appearance_desc')}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label className="mb-3 block">{t('theme')}</Label>
              <div className="flex gap-2">
                <Button variant={theme === 'light' ? 'default' : 'outline'} size="sm" onClick={() => handleThemeChange('light')} className="flex items-center gap-2">
                  <Sun className="h-4 w-4" /> {t('light')}
                </Button>
                <Button variant={theme === 'dark' ? 'default' : 'outline'} size="sm" onClick={() => handleThemeChange('dark')} className="flex items-center gap-2">
                  <Moon className="h-4 w-4" /> {t('dark')}
                </Button>
                <Button variant={theme === 'system' ? 'default' : 'outline'} size="sm" onClick={() => handleThemeChange('system')} className="flex items-center gap-2">
                  <Monitor className="h-4 w-4" /> {t('system')}
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <div><Label>{t('animations')}</Label><p className="text-sm text-muted-foreground">{t('animations_desc')}</p></div>
              <Switch checked={settings.animations} onCheckedChange={v => {
                dispatch(setAnimations(v));
                toast({ title: v ? t('animations_enabled') : t('animations_disabled') });
              }} />
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <Shield className="h-5 w-5 text-success" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold">{t('security')}</h2>
              <p className="text-sm text-muted-foreground">{t('security_desc')}</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div><Label>{t('two_factor')}</Label><p className="text-sm text-muted-foreground">{t('two_factor_desc')}</p></div>
              <Button variant="outline" size="sm">{t('enable')}</Button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div><Label>{t('change_password')}</Label><p className="text-sm text-muted-foreground">{t('change_password_desc')}</p></div>
              <Button variant="outline" size="sm">{t('modify')}</Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
