import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Lock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [regNo, setRegNo] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const loginEmail = `${regNo.toLowerCase()}@vitstars.edu`;
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password,
      });

      if (error) throw error;
      
      // AuthContext will handle checking the admin role and redirecting
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg-app)', alignItems: 'center', justifyContent: 'center', padding: 'var(--spacing-4)' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: 'var(--spacing-8)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-6)' }}>
          <div style={{ backgroundColor: 'white', display: 'inline-block', padding: '24px', borderRadius: '24px', marginBottom: 'var(--spacing-6)', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <img src="/logo.png" alt="VIT STARS Logo" style={{ height: '180px', maxWidth: '100%', objectFit: 'contain' }} />
          </div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-1)' }}>STARS Admin</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Sign in to manage the STARS program</p>
        </div>

        {error && (
          <div style={{ backgroundColor: 'var(--color-status-critical-bg)', color: 'var(--color-status-critical)', padding: 'var(--spacing-3)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-4)', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          <div>
            <label className="input-label" style={{ display: 'block', marginBottom: 'var(--spacing-1)' }}>Register Number / Admin ID</label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}>
                <User size={18} />
              </div>
              <input
                type="text"
                required
                className="input-field"
                style={{ paddingLeft: '40px' }}
                placeholder="e.g. ADMIN001"
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="input-label" style={{ display: 'block', marginBottom: 'var(--spacing-1)' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}>
                <Lock size={18} />
              </div>
              <input
                type="password"
                required
                className="input-field"
                style={{ paddingLeft: '40px' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: 'var(--spacing-2)' }} disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
