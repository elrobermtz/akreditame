import { useState, useEffect, useCallback } from 'react';
import { Shield, Users, LogOut, User as UserIcon } from 'lucide-react';
import { SimulatorLogin } from './SimulatorLogin';
import { SimulatorAdminModal } from './SimulatorAdminModal';

const LOGO_ISOTIPO = "https://lh3.googleusercontent.com/aida-public/AB6AXuBJh3TTpvGdRvBA81-hYwvB_uiIxuLMt2_yxlq52oRJtyM6XX2ZkXexZzWB4J_fgGDQZYhxegta3V-g0WB6pQN7CykFESLnkVu55iuqBVpeB8mudTMfxlxUiKhToIYXns6gr1BWJ3ta_RuU-bV--BATWjYoM-Yndjj3rOivtVyl-o7JIJISa9QvySrfBzJC4Nf27WLTdfEfPWRUJyhPj3Ix0pF7umz5b8xFilkiM2g-55cpTrE5BJ80cKO0EYehWWfs_4KessPrB-M";
const LOGO_WORDMARK = "https://lh3.googleusercontent.com/aida-public/AB6AXuDyFARvUFR03QImWBW5uozcc9AbGk9UArF7epzg7aRwxeC08p5082fRZPFzHBWLhc8pGGuzOmEyqVL6hkkzRUW6Hzz-TFdWuL_Bgj2WwF1RdvIuIIOPH9co_BgZbJPTwgS_thHkSuL2tQih0756GlkhY4hvRu1AnqK9q4feQ8fvdeEjxA5WZhMDjI5cbS_xmLRNkC40Jm9XzrYiUK0Z1X3xA2rU3XNuOC9ZMk6XO1gViJnG3vv4hXWM8sxQVQBxs28z9E6TfvPJ_ZQ";

export const SimulatorView = () => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  useEffect(() => {
    document.title = "Simulador OP1 — Operadora Energética I | Akredita Me";

    const verifyAuth = async () => {
      const storedToken = localStorage.getItem('simulator_token');

      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/simulador/verify', {
          headers: {
            'Authorization': `Bearer ${storedToken}`
          }
        });

        const data = await response.json().catch(() => ({}));

        if (response.ok && data.valid && data.user) {
          setToken(storedToken);
          setUser(data.user);
          try {
            localStorage.setItem('simulator_user', JSON.stringify(data.user));
          } catch (e) {
            console.warn('[SimulatorView] Error al guardar simulator_user:', e);
          }
        } else {
          localStorage.removeItem('simulator_token');
          localStorage.removeItem('simulator_user');
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        console.error('[SimulatorView] Error al verificar sesión:', err);
        localStorage.removeItem('simulator_token');
        localStorage.removeItem('simulator_user');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const handleLoginSuccess = useCallback((newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
  }, []);

  const handleLogout = useCallback(() => {
    try {
      localStorage.removeItem('simulator_token');
      localStorage.removeItem('simulator_user');
    } catch (e) {
      console.warn('[SimulatorView] Error al limpiar localStorage en logout:', e);
    }
    setToken(null);
    setUser(null);
    setIsAdminModalOpen(false);
  }, []);

  // Spinner corporativo estilizado con Akredita Me
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border-2 border-orange-500/20 border-t-orange-500 animate-spin" />
            <img 
              src={LOGO_ISOTIPO} 
              alt="Akredita Me" 
              className="w-8 h-8 absolute object-contain animate-pulse"
            />
          </div>
          <div className="space-y-1">
            <h2 className="text-white font-semibold text-base md:text-lg tracking-wide">
              Simulador OP1 — Operadora Energética I
            </h2>
            <p className="text-xs text-slate-400">
              Verificando credenciales de acceso...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Vista no autenticada: Pantalla de Login
  if (!token || !user) {
    return <SimulatorLogin onLoginSuccess={handleLoginSuccess} />;
  }

  // Vista autenticada: Barra superior + iframe del simulador
  return (
    <div className="min-h-screen w-full bg-background flex flex-col overflow-hidden">
      {/* Barra superior de 64px */}
      <header className="h-16 bg-surface-container/90 backdrop-blur-md border-b border-white/10 px-4 md:px-6 flex items-center justify-between z-40 shrink-0">
        {/* Izquierda: Logotipo Akredita Me y separador con título */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <img
              src={LOGO_ISOTIPO}
              alt="Akredita Me Isotipo"
              className="h-7 md:h-8 w-auto object-contain"
            />
            <img
              src={LOGO_WORDMARK}
              alt="Akredita Me Wordmark"
              className="hidden sm:block h-4 md:h-5 w-auto object-contain"
            />
          </div>
          <div className="hidden sm:block h-5 w-[1px] bg-white/15" />
          <span className="text-xs md:text-sm font-medium text-slate-200 tracking-wide truncate max-w-[200px] md:max-w-none">
            Simulador OP1 <span className="text-slate-400 font-normal hidden md:inline">— Operadora Energética I</span>
          </span>
        </div>

        {/* Derecha: Indicador de usuario, botón admin y cerrar sesión */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Indicador de usuario con badge de rol */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-surface-container-high/60 border border-white/10 text-xs">
            <UserIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-200 font-medium truncate max-w-[120px] md:max-w-[180px]" title={user.email}>
              {user.email}
            </span>
            {user.role === 'admin' ? (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/30 uppercase tracking-wider flex items-center gap-1">
                <Shield className="w-2.5 h-2.5" />
                Admin
              </span>
            ) : (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-wider">
                {user.role || 'Usuario'}
              </span>
            )}
          </div>

          {/* Si user.role === 'admin': botón Administrar Accesos */}
          {user.role === 'admin' && (
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/25 text-orange-300 hover:text-orange-200 text-xs font-medium transition-colors"
              title="Administrar Accesos"
            >
              <Users className="w-3.5 h-3.5 text-orange-400" />
              <span className="hidden md:inline">Administrar Accesos</span>
            </button>
          )}

          {/* Botón Cerrar Sesión */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/20 text-slate-300 hover:text-red-300 text-xs font-medium transition-colors"
            title="Cerrar Sesión"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cerrar Sesión</span>
          </button>
        </div>
      </header>

      {/* Contenedor iframe de altura completa */}
      <div className="w-full h-[calc(100vh-64px)] bg-background">
        <iframe
          src={import.meta.env.VITE_SIMULATOR_URL || '/stream/?embed=true'}
          title="Simulador OP1 - Operadora Energética I"
          className="w-full h-full border-0"
          allow="clipboard-read; clipboard-write"
        />
      </div>

      {/* Modal de administración condicional */}
      {isAdminModalOpen && user.role === 'admin' && (
        <SimulatorAdminModal
          isOpen={isAdminModalOpen}
          onClose={() => setIsAdminModalOpen(false)}
          currentUser={user}
          token={token}
          propToken={token}
        />
      )}
    </div>
  );
};

export default SimulatorView;
