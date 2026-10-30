import { useState, useEffect, useCallback } from 'react';
import { 
  X, 
  Users, 
  UserPlus, 
  Shield, 
  UserCheck, 
  UserX, 
  Key, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  RotateCw,
  Search,
  Eye,
  EyeOff
} from 'lucide-react';

export const SimulatorAdminModal = ({ 
  isOpen, 
  onClose, 
  token: propToken, 
  currentUser 
}) => {
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'create'
  const [users, setUsers] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Create form state
  const [createForm, setCreateForm] = useState({
    email: '',
    name: '',
    password: '',
    role: 'user'
  });
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [creating, setCreating] = useState(false);

  // Password change modal state
  const [passwordModalUser, setPasswordModalUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Delete confirmation state
  const [deleteConfirmUser, setDeleteConfirmUser] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Global action feedback
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  const getAuthToken = useCallback(() => {
    return propToken || localStorage.getItem('simulator_token') || '';
  }, [propToken]);

  // Fetch users (manual refresh or action reload)
  const fetchUsers = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setActionError('No se encontró token de sesión. Inicia sesión nuevamente.');
      return;
    }

    setLoadingList(true);
    try {
      const res = await fetch('/api/simulador/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || 'Error al obtener usuarios');
      }

      setUsers(data.users || []);
    } catch (err) {
      console.error('[SimulatorAdminModal] fetchUsers error:', err);
      setActionError(err.message || 'Error al cargar los usuarios');
    } finally {
      setLoadingList(false);
    }
  }, [getAuthToken]);

  // Initial load when modal opens
  useEffect(() => {
    let ignore = false;
    if (isOpen) {
      const token = propToken || localStorage.getItem('simulator_token') || '';
      if (token) {
        fetch('/api/simulador/admin/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
          .then(res => res.json().then(data => ({ ok: res.ok, data })))
          .then(({ ok, data }) => {
            if (!ignore && ok && data.users) {
              setUsers(data.users);
            }
          })
          .catch(err => {
            if (!ignore) {
              console.error('[SimulatorAdminModal] initial fetch error:', err);
            }
          });
      }
    }
    return () => {
      ignore = true;
    };
  }, [isOpen, propToken]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        if (passwordModalUser) {
          setPasswordModalUser(null);
        } else if (deleteConfirmUser) {
          setDeleteConfirmUser(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, passwordModalUser, deleteConfirmUser]);

  // Clear messages after 4 seconds
  useEffect(() => {
    if (actionSuccess || actionError) {
      const timer = setTimeout(() => {
        setActionSuccess('');
        setActionError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [actionSuccess, actionError]);

  if (!isOpen) return null;

  // Handle create user
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setActionError('');
    setActionSuccess('');
    setCreating(true);

    const token = getAuthToken();
    try {
      const res = await fetch('/api/simulador/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: createForm.email.trim(),
          name: createForm.name.trim(),
          password: createForm.password,
          role: createForm.role
        })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || 'Error al crear el acceso');
      }

      setActionSuccess(`Usuario "${data.user?.email || createForm.email}" creado con éxito.`);
      setCreateForm({ email: '', name: '', password: '', role: 'user' });
      await fetchUsers();
      setActiveTab('list');
    } catch (err) {
      console.error('[SimulatorAdminModal] Create error:', err);
      setActionError(err.message || 'El correo ya está registrado o los datos son inválidos');
    } finally {
      setCreating(false);
    }
  };

  // Toggle active status
  const handleToggleActive = async (targetUser) => {
    const token = getAuthToken();
    try {
      const nextStatus = !targetUser.is_active;
      const res = await fetch(`/api/simulador/admin/users/${targetUser.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          is_active: nextStatus
        })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || 'Error al actualizar estado del usuario');
      }

      setUsers(prev => prev.map(u => u.id === targetUser.id ? { ...u, is_active: nextStatus } : u));
      setActionSuccess(`Acceso ${nextStatus ? 'activado' : 'desactivado'} para ${targetUser.email}`);
    } catch (err) {
      console.error('[SimulatorAdminModal] Toggle active error:', err);
      setActionError(err.message || 'Error al actualizar el usuario');
    }
  };

  // Update password
  const handleSavePassword = async () => {
    if (!passwordModalUser || !newPassword || newPassword.length < 6) {
      setActionError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    const token = getAuthToken();
    setUpdatingPassword(true);
    try {
      const res = await fetch(`/api/simulador/admin/users/${passwordModalUser.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          password: newPassword
        })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || 'Error al cambiar la contraseña');
      }

      setActionSuccess(`Contraseña actualizada para ${passwordModalUser.email}`);
      setPasswordModalUser(null);
      setNewPassword('');
    } catch (err) {
      console.error('[SimulatorAdminModal] Password error:', err);
      setActionError(err.message || 'Error al cambiar la contraseña');
    } finally {
      setUpdatingPassword(false);
    }
  };

  // Delete user
  const handleDeleteUser = async () => {
    if (!deleteConfirmUser) return;

    const token = getAuthToken();
    setDeleting(true);
    try {
      const res = await fetch(`/api/simulador/admin/users/${deleteConfirmUser.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || 'Error al eliminar usuario');
      }

      setUsers(prev => prev.filter(u => u.id !== deleteConfirmUser.id));
      setActionSuccess(`Usuario ${deleteConfirmUser.email} eliminado.`);
      setDeleteConfirmUser(null);
    } catch (err) {
      console.error('[SimulatorAdminModal] Delete error:', err);
      setActionError(err.message || 'Error al eliminar el usuario');
    } finally {
      setDeleting(false);
    }
  };

  const filteredUsers = users.filter(u => {
    const q = searchTerm.toLowerCase();
    return (u.email && u.email.toLowerCase().includes(q)) || 
           (u.name && u.name.toLowerCase().includes(q));
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div 
        className="bg-surface-container border border-white/10 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-surface-container-high/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-container/20 border border-primary-container/30 flex items-center justify-center text-primary-container">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-headline-lg font-bold text-white flex items-center gap-2">
                Administración de Accesos
                <span className="text-[11px] font-mono uppercase bg-primary-container/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-normal">
                  Admin Panel
                </span>
              </h2>
              <p className="text-xs text-on-secondary-container mt-0.5">
                Control y provisión de accesos confidenciales para el simulador financiero
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="p-2 text-on-surface-variant hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Notifications */}
        {actionSuccess && (
          <div className="mx-6 mt-4 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-3 text-sm animate-fade-in">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span className="flex-1 font-medium">{actionSuccess}</span>
          </div>
        )}
        {actionError && (
          <div className="mx-6 mt-4 p-3.5 rounded-xl bg-error-container/20 border border-error/30 text-error flex items-center gap-3 text-sm animate-shake">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="flex-1 font-medium">{actionError}</span>
          </div>
        )}

        {/* Tabs Bar */}
        <div className="px-6 pt-4 pb-0 border-b border-white/10 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-2 pb-3 px-3 text-sm font-medium border-b-2 transition-all ${
              activeTab === 'list'
                ? 'border-primary-container text-white font-semibold'
                : 'border-transparent text-on-surface-variant hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Accesos Registrados</span>
            <span className="ml-1.5 px-2 py-0.5 text-xs rounded-full bg-white/10 text-on-surface font-mono">
              {users.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('create')}
            className={`flex items-center gap-2 pb-3 px-3 text-sm font-medium border-b-2 transition-all ${
              activeTab === 'create'
                ? 'border-primary-container text-white font-semibold'
                : 'border-transparent text-on-surface-variant hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Dar de alta nuevo acceso</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB 1: ACCESOS REGISTRADOS */}
          {activeTab === 'list' && (
            <div className="space-y-4">
              {/* Search & Refresh Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-on-surface-variant/60 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por correo o referencia..."
                    className="w-full pl-9 pr-4 py-2 bg-surface-container-high/60 border border-white/10 rounded-xl text-white placeholder-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary-container text-xs sm:text-sm"
                  />
                </div>

                <button
                  onClick={fetchUsers}
                  disabled={loadingList}
                  className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs sm:text-sm text-on-surface font-medium transition-colors disabled:opacity-50"
                  title="Actualizar lista"
                >
                  <RotateCw className={`w-4 h-4 ${loadingList ? 'animate-spin' : ''}`} />
                  <span>Refrescar</span>
                </button>
              </div>

              {/* Users Table / List */}
              {loadingList && users.length === 0 ? (
                <div className="py-16 text-center text-on-surface-variant flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-primary-container" />
                  <span className="text-sm">Cargando usuarios registrados...</span>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="py-16 text-center border border-dashed border-white/10 rounded-2xl p-8">
                  <Users className="w-12 h-12 text-on-surface-variant/40 mx-auto mb-3" />
                  <p className="text-sm text-white font-medium">No se encontraron usuarios</p>
                  <p className="text-xs text-on-surface-variant mt-1">
                    {searchTerm ? 'Intenta con otro término de búsqueda' : 'Registra el primer acceso institucional usando la pestaña correspondiente.'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-white/10 rounded-xl bg-surface-container-high/30">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-xs text-on-surface-variant uppercase font-medium bg-white/[0.02]">
                        <th className="py-3.5 px-4">Usuario / Email</th>
                        <th className="py-3.5 px-4">Nombre / Referencia</th>
                        <th className="py-3.5 px-4">Rol</th>
                        <th className="py-3.5 px-4">Fecha</th>
                        <th className="py-3.5 px-4 text-center">Estado</th>
                        <th className="py-3.5 px-4 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredUsers.map((u) => {
                        const isSelf = currentUser && String(currentUser.id) === String(u.id);
                        const createdDate = u.created_at 
                          ? new Date(u.created_at).toLocaleDateString('es-MX', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })
                          : '—';

                        return (
                          <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-3.5 px-4">
                              <div className="font-medium text-white flex items-center gap-2">
                                <span>{u.email}</span>
                                {isSelf && (
                                  <span className="text-[10px] bg-primary-container/20 text-primary border border-primary/30 px-1.5 py-0.2 rounded font-mono">
                                    Tú
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-on-secondary-container">
                              {u.name || <span className="text-on-surface-variant/40 italic">Sin referencia</span>}
                            </td>
                            <td className="py-3.5 px-4">
                              {u.role === 'admin' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                                  <Shield className="w-3 h-3" />
                                  Admin
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/30">
                                  Usuario
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-xs text-on-surface-variant font-mono">
                              {createdDate}
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              {u.is_active ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                  Activo
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/15 text-rose-400 border border-rose-500/30">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                                  Inactivo
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="inline-flex items-center gap-1 justify-end">
                                {/* Toggle Active Button */}
                                <button
                                  onClick={() => handleToggleActive(u)}
                                  disabled={isSelf}
                                  title={isSelf ? 'No puedes desactivarte a ti mismo' : u.is_active ? 'Desactivar acceso' : 'Activar acceso'}
                                  className={`p-1.5 rounded-lg border transition-all ${
                                    isSelf 
                                      ? 'opacity-30 cursor-not-allowed border-transparent text-on-surface-variant'
                                      : u.is_active
                                        ? 'border-rose-500/20 text-rose-400 hover:bg-rose-500/10'
                                        : 'border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10'
                                  }`}
                                >
                                  {u.is_active ? (
                                    <UserX className="w-4 h-4" />
                                  ) : (
                                    <UserCheck className="w-4 h-4" />
                                  )}
                                </button>

                                {/* Change Password Button */}
                                <button
                                  onClick={() => {
                                    setPasswordModalUser(u);
                                    setNewPassword('');
                                    setShowNewPassword(false);
                                  }}
                                  title="Cambiar contraseña"
                                  className="p-1.5 rounded-lg border border-white/10 text-on-surface hover:text-white hover:bg-white/5 transition-all"
                                >
                                  <Key className="w-4 h-4" />
                                </button>

                                {/* Delete User Button */}
                                <button
                                  onClick={() => setDeleteConfirmUser(u)}
                                  disabled={isSelf}
                                  title={isSelf ? 'No puedes eliminar tu propia cuenta' : 'Eliminar acceso'}
                                  className={`p-1.5 rounded-lg border transition-all ${
                                    isSelf 
                                      ? 'opacity-30 cursor-not-allowed border-transparent text-on-surface-variant'
                                      : 'border-red-500/20 text-red-400 hover:bg-red-500/10'
                                  }`}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DAR DE ALTA NUEVO ACCESO */}
          {activeTab === 'create' && (
            <div className="max-w-xl mx-auto py-2">
              <div className="mb-6">
                <h3 className="text-lg font-headline-lg font-semibold text-white">
                  Dar de alta nuevo acceso institucional
                </h3>
                <p className="text-xs text-on-secondary-container mt-1">
                  Crea una cuenta autorizada para inversionistas, evaluadores o administradores del simulador.
                </p>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-on-surface-variant mb-1.5">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    placeholder="inversionista@empresa.com"
                    className="w-full px-3.5 py-2.5 bg-surface-container-high/60 border border-white/10 rounded-xl text-white placeholder-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary-container text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-on-surface-variant mb-1.5">
                    Nombre o Referencia Institucional
                  </label>
                  <input
                    type="text"
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    placeholder="Ej. Inversionista Fondo Alfa / Lic. Rodrigo Cruz"
                    className="w-full px-3.5 py-2.5 bg-surface-container-high/60 border border-white/10 rounded-xl text-white placeholder-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary-container text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-on-surface-variant mb-1.5">
                    Contraseña Provisoria *
                  </label>
                  <div className="relative">
                    <input
                      type={showCreatePassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={createForm.password}
                      onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full pl-3.5 pr-10 py-2.5 bg-surface-container-high/60 border border-white/10 rounded-xl text-white placeholder-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary-container text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCreatePassword(!showCreatePassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-on-surface-variant hover:text-white"
                      tabIndex={-1}
                    >
                      {showCreatePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-on-surface-variant mb-1.5">
                    Rol y Nivel de Privilegios
                  </label>
                  <select
                    value={createForm.role}
                    onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-surface-container-high border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-primary-container text-sm"
                  >
                    <option value="user" className="bg-surface-container-high text-white">
                      Usuario Regular (Solo consulta y simulación)
                    </option>
                    <option value="admin" className="bg-surface-container-high text-white">
                      Administrador (Gestión completa de accesos y simulador)
                    </option>
                  </select>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('list')}
                    className="px-4 py-2.5 border border-white/10 hover:bg-white/5 rounded-xl text-sm font-medium text-on-surface transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="px-6 py-2.5 bg-primary-container hover:brightness-110 active:scale-[0.99] text-white font-semibold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-primary-container/20 transition-all disabled:opacity-50"
                  >
                    {creating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Guardando...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>Registrar Acceso</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* SUBMODAL: CAMBIAR CONTRASEÑA */}
        {passwordModalUser && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm z-20 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-surface-container-high border border-white/15 rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-primary-container/20 text-primary-container border border-primary-container/30">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Cambiar Contraseña</h4>
                  <p className="text-xs text-on-secondary-container truncate max-w-[260px]">
                    {passwordModalUser.email}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-medium uppercase tracking-wider text-on-surface-variant mb-1.5">
                  Nueva Contraseña *
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    autoFocus
                    className="w-full pl-3.5 pr-10 py-2.5 bg-surface-container border border-white/10 rounded-xl text-white placeholder-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary-container text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-on-surface-variant hover:text-white"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setPasswordModalUser(null)}
                  disabled={updatingPassword}
                  className="px-4 py-2 border border-white/10 hover:bg-white/5 rounded-xl text-xs sm:text-sm font-medium text-on-surface transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSavePassword}
                  disabled={updatingPassword || !newPassword || newPassword.length < 6}
                  className="px-4 py-2 bg-primary-container hover:brightness-110 text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {updatingPassword ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Actualizando...</span>
                    </>
                  ) : (
                    <span>Actualizar Contraseña</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SUBMODAL: CONFIRMAR ELIMINACIÓN */}
        {deleteConfirmUser && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm z-20 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-surface-container-high border border-white/15 rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Confirmar Eliminación</h4>
                  <p className="text-xs text-rose-300">Esta acción no se puede deshacer</p>
                </div>
              </div>

              <p className="text-sm text-on-secondary-container mb-6">
                ¿Estás seguro de que deseas eliminar permanentemente el acceso del usuario{' '}
                <strong className="text-white font-mono">{deleteConfirmUser.email}</strong>? Perderá acceso inmediato a todos los modelos financieros.
              </p>

              <div className="flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmUser(null)}
                  disabled={deleting}
                  className="px-4 py-2 border border-white/10 hover:bg-white/5 rounded-xl text-xs sm:text-sm font-medium text-on-surface transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleDeleteUser}
                  disabled={deleting}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-red-600/20"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Eliminando...</span>
                    </>
                  ) : (
                    <span>Sí, eliminar acceso</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimulatorAdminModal;
