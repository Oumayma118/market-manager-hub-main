import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useT } from '@/hooks/useTranslation';

export default function RegisterPage() {
  const navigate = useNavigate();
  const t = useT();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name) errs.name = `${t('full_name')} requis`;
    if (!form.email) errs.email = `${t('email')} requis`;
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Email invalide';
    if (!form.password) errs.password = `${t('password')} requis`;
    else if (form.password.length < 6) errs.password = 'Minimum 6 caractères';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Mots de passe différents';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email, password: form.password,
      options: { data: { display_name: form.name } },
    });
    setLoading(false);
    if (error) {
      toast({ title: t('error'), description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: t('register_success') });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
        <div className="text-center space-y-6 px-12">
          <div className="flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-secondary">
              <Building2 className="h-10 w-10 text-secondary-foreground" />
            </div>
          </div>
          <h1 className="font-display text-4xl font-bold text-white">INDH Market Manager</h1>
          <p className="text-white/70 text-lg max-w-md">{t('hero_register')}</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden flex items-center gap-3 justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <Building2 className="h-7 w-7 text-primary-foreground" />
            </div>
            <span className="font-display text-2xl font-bold">INDH</span>
          </div>

          <div className="text-center">
            <h2 className="font-display text-3xl font-bold text-foreground">{t('register')}</h2>
            <p className="mt-2 text-muted-foreground">{t('register_subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">{t('full_name')}</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="name" placeholder={t('full_name')} className="pl-10" value={form.name} onChange={e => update('name', e.target.value)} />
              </div>
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="votre@email.com" className="pl-10" value={form.email} onChange={e => update('email', e.target.value)} />
              </div>
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t('password')}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="pl-10 pr-10" value={form.password} onChange={e => update('password', e.target.value)} />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t('confirm_password')}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="confirmPassword" type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="pl-10" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} />
              </div>
              {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? '...' : t('create_account')}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            {t('have_account')}{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">{t('connect')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
