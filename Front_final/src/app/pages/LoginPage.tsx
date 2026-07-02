import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { GraduationCap, Languages } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(username, password);
      toast.success(language === 'fr' ? 'Connexion réussie !' : 'Login successful!');
      navigate('/');
    } catch (error) {
      toast.error(language === 'fr' ? 'Échec de connexion. Veuillez réessayer.' : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'en' : 'fr');
  };

  return (
    <div className="min-h-screen flex">
      <div
        className="hidden lg:flex lg:w-1/2 bg-cover bg-center relative"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1730106443463-0fb1512c5e60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBidWlsZGluZyUyMG1vZGVybiUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3Nzc0NTc5MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080)`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 to-purple-900/90" />
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <GraduationCap className="w-24 h-24 mb-6" />
          <h1 className="text-5xl font-bold mb-4">EduGest CM</h1>
          <p className="text-xl text-center">
            {language === 'fr'
              ? 'Système de gestion pour écoles primaires au Cameroun'
              : 'Management system for primary schools in Cameroon'
            }
          </p>
          <div className="mt-12 space-y-4 text-center">
            <p className="text-lg">
              {language === 'fr'
                ? '✓ Gestion des élèves et enseignants'
                : '✓ Student and teacher management'
              }
            </p>
            <p className="text-lg">
              {language === 'fr'
                ? '✓ Suivi des notes et bulletins'
                : '✓ Grade and report card tracking'
              }
            </p>
            <p className="text-lg">
              {language === 'fr'
                ? '✓ Gestion de la scolarité'
                : '✓ Tuition management'
              }
            </p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="w-full max-w-md space-y-8">
          <div className="absolute top-4 right-4">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 rounded-lg transition-colors"
            >
              <Languages className="w-5 h-5" />
              <span className="font-medium">{language === 'fr' ? 'Français' : 'English'}</span>
            </button>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <GraduationCap className="w-12 h-12 text-blue-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">{t('auth.welcome')}</h2>
            <p className="mt-2 text-gray-600">
              {t('auth.loginToAccount')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="username">{t('auth.username')}</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={language === 'fr' ? 'Entrez votre nom d\'utilisateur' : 'Enter your username'}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="password">{t('auth.password')}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={language === 'fr' ? 'Entrez votre mot de passe' : 'Enter your password'}
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                  {t('auth.rememberMe')}
                </label>
              </div>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
                {t('auth.forgotPassword')}
              </a>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loading
                ? (language === 'fr' ? 'Connexion...' : 'Logging in...')
                : t('auth.signIn')
              }
            </Button>
          </form>

          <div className="mt-6 text-sm text-gray-600 bg-gray-50 rounded-xl p-4 space-y-1">
            <p className="font-semibold text-gray-700 mb-2">Comptes de démonstration (mot de passe : <code className="bg-gray-200 px-1 rounded">password123</code>)</p>
            {[
              { user: 'admin', role: 'Administrateur', color: 'bg-red-500' },
              { user: 'directeur', role: 'Directeur', color: 'bg-blue-600' },
              { user: 'enseignant', role: 'Enseignant', color: 'bg-green-600' },
              { user: 'secretaire', role: 'Secrétaire', color: 'bg-purple-600' },
              { user: 'parent', role: 'Parent', color: 'bg-orange-500' }
            ].map((c) => (
              <div key={c.user} className="flex items-center justify-between">
                <code className="text-gray-800">{c.user}</code>
                <span className={`text-xs text-white px-2 py-0.5 rounded-full ${c.color}`}>{c.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
