import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { UserProvider, useUser } from './context/UserContext';
import BuyerDiscovery from './pages/BuyerDiscovery';
import Government from './pages/Government';
import Home from './pages/Home';
import MarketPrices from './pages/MarketPrices';
import MarketExplorer from './pages/MarketExplorer';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import Profile from './pages/Profile';

function ProtectedPage({ children }) {
  const { isLoggedIn } = useUser();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
}

function CatchAllRedirect() {
  const { isLoggedIn } = useUser();

  return <Navigate to={isLoggedIn ? '/' : '/login'} replace />;
}

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<Onboarding />} />

          <Route path="/" element={<ProtectedPage><Home /></ProtectedPage>} />
          <Route path="/buyers" element={<ProtectedPage><BuyerDiscovery /></ProtectedPage>} />
          <Route path="/prices" element={<ProtectedPage><MarketPrices /></ProtectedPage>} />
          <Route path="/explorer" element={<ProtectedPage><MarketExplorer /></ProtectedPage>} />
          <Route path="/government" element={<ProtectedPage><Government /></ProtectedPage>} />
          <Route path="/profile" element={<ProtectedPage><Profile /></ProtectedPage>} />
          <Route path="/ai" element={<ProtectedPage />} />

          <Route path="/notifications" element={<ProtectedPage />} />
          <Route path="*" element={<CatchAllRedirect />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}
