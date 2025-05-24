import React, { createContext, useContext, useState, useEffect } from 'react';

interface SignupData {
  fullName: string;
  email: string;
  username: string;
  password: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  signup: (data: SignupData) => boolean;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Dummy credentials for now
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

// Store for pending admin registrations (in real app, this would be in a database)
const PENDING_REGISTRATIONS: SignupData[] = [];
const EXISTING_USERS = new Set(['admin']); // Track existing usernames

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const token = localStorage.getItem('admin_token');
    if (token === 'authenticated') {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (username: string, password: string): boolean => {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      setIsAuthenticated(true);
      localStorage.setItem('admin_token', 'authenticated');
      return true;
    }
    return false;
  };

  const signup = (data: SignupData): boolean => {
    // Check if username or email already exists
    if (EXISTING_USERS.has(data.username)) {
      return false; // Username already exists
    }
    
    // Check if email already exists in pending registrations
    const emailExists = PENDING_REGISTRATIONS.some(reg => reg.email === data.email);
    if (emailExists) {
      return false; // Email already registered
    }

    // Add to pending registrations
    PENDING_REGISTRATIONS.push(data);
    EXISTING_USERS.add(data.username);
    
    // In a real application, this would:
    // 1. Save to database
    // 2. Send notification to existing admins
    // 3. Send confirmation email to user
    
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_token');
  };

  const value = {
    isAuthenticated,
    login,
    signup,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
