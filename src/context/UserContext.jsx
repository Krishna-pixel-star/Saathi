import { createContext, useContext, useMemo, useState } from 'react';

const defaultUser = {
  name: '',
  farmerId: '',
  mobile: '',
};

const defaultLocation = {
  village: '',
  block: '',
  district: '',
  state: '',
};

const UserContext = createContext(undefined);

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : defaultUser;
  });
  const [location, setLocation] = useState(defaultLocation);
  const [preferredLanguage, setPreferredLanguage] = useState('Hindi');
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));

  const login = (userData) => {
    const newUser = { ...defaultUser, ...userData };
    setUser(newUser);
    setIsLoggedIn(true);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    localStorage.clear();
    setUser(defaultUser);
    setIsLoggedIn(false);
  };

  const updateLocation = (locData) => {
    setLocation((currentLocation) => ({ ...currentLocation, ...locData }));
  };

  const setLanguage = (lang) => {
    setPreferredLanguage(lang);
  };

  const value = useMemo(
    () => ({
      user,
      location,
      preferredLanguage,
      isLoggedIn,
      login,
      logout,
      updateLocation,
      setLanguage,
    }),
    [user, location, preferredLanguage, isLoggedIn],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
}

export default UserContext;
