import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  adminProfile: any | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user] = useState<User | null>({ id: 'dummy', email: 'admin@vitstars.edu' } as User);
  const [adminProfile] = useState<any | null>({ id: 'mock_admin', role: 'admin' });
  const [session] = useState<Session | null>({} as Session);
  const [loading] = useState(false);

  // Bypassing real Supabase auth for local UI testing
  useEffect(() => {
    // Empty effect for dummy auth
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, adminProfile, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
