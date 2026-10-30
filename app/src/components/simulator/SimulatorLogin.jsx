import { useState } from 'react';
import { LogIn, Lock, Mail, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';

const LOGO_ISOTIPO = "https://lh3.googleusercontent.com/aida-public/AB6AXuBJh3TTpvGdRvBA81-hYwvB_uiIxuLMt2_yxlq52oRJtyM6XX2ZkXexZzWB4J_fgGDQZYhxegta3V-g0WB6pQN7CykFESLnkVu55iuqBVpeB8mudTMfxlxUiKhToIYXns6gr1BWJ3ta_RuU-bV--BATWjYoM-Yndjj3rOivtVyl-o7JIJISa9QvySrfBzJC4Nf27WLTdfEfPWRUJyhPj3Ix0pF7umz5b8xFilkiM2g-55cpTrE5BJ80cKO0EYehWWfs_4KessPrB-M";
const LOGO_WORDMARK = "https://lh3.googleusercontent.com/aida-public/AB6AXuDyFARvUFR03QImWBW5uozcc9AbGk9UArF7epzg7aRwxeC08p5082fRZPFzHBWLhc8pGGuzOmEyqVL6hkkzRUW6Hzz-TFdWuL_Bgj2WwF1RdvIuIIOPH9co_BgZbJPTwgS_thHkSuL2tQih0756GlkhY4hvRu1AnqK9q4feQ8fvdeEjxA5WZhMDjI5cbS_xmLRNkC40Jm9XzrYiUK0Z1X3xA2rU3XNuOC9ZMk6XO1gViJnG3vv4hXWM8sxQVQBxs28z9E6TfvPJ_ZQ";

export const SimulatorLogin = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/simulador/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email.trim(),
          password
        })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || 'Credenciales inválidas o error de conexión');
      }

      if (data.token) {
        try {
          localStorage.setItem('simulator_token', data.token);
          if (data.user) {
            localStorage.setItem('simulator_user', JSON.stringify(data.user));
          }
        } catch (e) {
          console.warn('No se pudo guardar la sesión en localStorage:', e);
        }

        if (typeof onLoginSuccess === 'function') {
          onLoginSuccess(data.token, data.user);
        }
      } else {
        throw new Error('Respuesta inválida del servidor');
      }
    } catch (err) {
      console.error('[SimulatorLogin] Error al iniciar sesión:', err);
      setError(err.message || 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex items-center justify-center p-4 selection:bg-primary-container selection:text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-tertiary-container/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main card */}
      <div className="w-full max-w-md bg-surface-container/90 backdrop-blur-xl border border-white/10 rounded-2xl p-8 sm:p-10 shadow-2xl shadow-black/40 relative z-10 animate-fade-in">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6 bg-white/5 py-3 px-5 rounded-xl border border-white/10 shadow-inner">
            <img 
              src={LOGO_ISOTIPO} 
              alt="Akredita Me Isotipo" 
              className="h-9 w-auto object-contain"
            />
            <img 
              src={LOGO_WORDMARK} 
              alt="Akredita Me Wordmark" 
              className="h-6 w-auto object-contain"
            />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-container/10 text-primary border border-primary/20 mb-3 tracking-wide uppercase">
            <Lock className="w-3.5 h-3.5 text-primary-container" />
            <span>Acceso Restringido</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-headline-lg font-bold text-white tracking-tight">
            Portal Privado — Simulador OP1
          </h1>
          <p className="text-sm text-on-secondary-container mt-2 leading-relaxed">
            Ingresa tus credenciales autorizadas para consultar el modelo financiero
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div 
            role="alert" 
            className="mb-6 p-4 rounded-xl bg-error-container/20 border border-error/30 text-error flex items-start gap-3 text-sm animate-shake"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label 
              htmlFor="simulator-email" 
              className="block text-xs font-medium uppercase tracking-wider text-on-surface-variant mb-2"
            >
              Correo Institucional
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
                <Mail className="w-5 h-5 text-on-surface-variant/70" />
              </div>
              <input
                id="simulator-email"
                type="email"
                required
                autoFocus
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@dominio.com"
                disabled={loading}
                className="w-full pl-11 pr-4 py-3 bg-surface-container-high/60 border border-white/10 rounded-xl text-white placeholder-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary-container/50 focus:border-primary-container transition-all text-sm disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label 
                htmlFor="simulator-password" 
                className="block text-xs font-medium uppercase tracking-wider text-on-surface-variant"
              >
                Contraseña
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
                <Lock className="w-5 h-5 text-on-surface-variant/70" />
              </div>
              <input
                id="simulator-password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                className="w-full pl-11 pr-11 py-3 bg-surface-container-high/60 border border-white/10 rounded-xl text-white placeholder-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary-container/50 focus:border-primary-container transition-all text-sm disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-on-surface-variant/70 hover:text-white transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 px-4 bg-primary-container hover:brightness-110 active:scale-[0.99] text-white font-semibold rounded-xl flex items-center justify-center gap-2.5 transition-all duration-200 shadow-lg shadow-primary-container/20 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Verificando credenciales...</span>
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>Ingresar al Simulador</span>
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-xs text-on-surface-variant/70 leading-relaxed">
            Sistema confidencial de modelado financiero Akredita Me.
            <br />
            Para solicitar acceso o restablecer credenciales, contacta a la administración.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimulatorLogin;
