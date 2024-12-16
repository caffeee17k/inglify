import { getAuth, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

import { useStore } from '~/store/store';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const auth = getAuth();
  const { user, setUser } = useStore((state) => state);

  const [isLoading, setIsLoading] = useState(true);

  const logout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    return unsubscribe;
  }, [user, setUser]);

  return (
    <AuthContext.Provider value={{ user, isLoading, logout }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
