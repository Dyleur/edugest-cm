import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSwitcher } from '../components/ui/language-switcher';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { GraduationCap, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(username, password);
      toast.success(language === 'fr' ? 'Connexion réussie !' : 'Login successful!');
      navigate('/app');
    } catch (error) {
      toast.error(language === 'fr' ? 'Échec de connexion. Veuillez réessayer.' : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary via-primary/95 to-primary/90">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="relative z-10 flex flex-col justify-center items-center p-16 w-full text-center">
          <div className="flex items-center gap-3 mb-8 justify-center">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-white font-bold text-xl">
              EG
            </div>
            <span className="text-white font-bold text-2xl">EduGest CM</span>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white/80 text-base mb-8">
              <GraduationCap className="w-5 h-5" />
              {language === 'fr' ? 'Gestion scolaire intelligente' : 'Smart School Management'}
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              {language === 'fr'
                ? 'Bienvenue sur EduGest CM'
                : 'Welcome to EduGest CM'}
            </h1>
            <p className="text-xl text-white/70 leading-relaxed max-w-xl mx-auto">
              {language === 'fr'
                ? 'La plateforme moderne de gestion des écoles primaires au Cameroun.'
                : 'The modern management platform for primary schools in Cameroon.'}
            </p>
            <div className="mt-12 space-y-5 inline-block text-left">
              {[
                language === 'fr' ? 'Gestion complète des élèves et enseignants' : 'Complete student and teacher management',
                language === 'fr' ? 'Suivi des notes, bulletins et présences' : 'Grade, report card and attendance tracking',
                language === 'fr' ? 'Paiements et communication avec les parents' : 'Payments and parent communication',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 text-white/80 text-lg">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-white/40 text-base mt-12">
            &copy; {new Date().getFullYear()} EduGest CM
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-12 relative">
        <div className="absolute top-6 right-6">
          <LanguageSwitcher />
        </div>
        <div className="w-full max-w-lg">

          <div className="text-center mb-10">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <GraduationCap className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-foreground">{t('auth.welcome')}</h2>
            <p className="text-lg text-muted-foreground mt-2">{t('auth.loginToAccount')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2.5">
              <Label htmlFor="username" className="text-base">{t('auth.username')}</Label>
              <div className="relative">
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={language === 'fr' ? 'Entrez votre nom d\'utilisateur' : 'Enter your username'}
                  required
                  className="h-12 text-base"
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="password" className="text-base">{t('auth.password')}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={language === 'fr' ? 'Entrez votre mot de passe' : 'Enter your password'}
                  required
                  className="h-12 pr-12 text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-border text-primary focus:ring-primary/20"
                />
                <span className="text-base text-muted-foreground">{t('auth.rememberMe')}</span>
              </label>
              <button type="button" className="text-base text-primary hover:text-primary/80 font-medium">
                {t('auth.forgotPassword')}
              </button>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-base bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {language === 'fr' ? 'Connexion...' : 'Logging in...'}
                </span>
              ) : t('auth.signIn')}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
