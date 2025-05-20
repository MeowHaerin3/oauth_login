import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { Button } from './components/ui/button';

function PrivateRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/auth/user', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(user => {
        setIsAuthenticated(!!user);
        setLoading(false);
      })
      .catch(() => {
        setIsAuthenticated(false);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
}

function HomePage({ user, onLogout }) {
  return (
    <div className="container flex h-screen flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-4">
        {user?.image && (
          <img 
            src={user.image} 
            alt="Profile" 
            className="h-24 w-24 rounded-full object-cover ring-2 ring-primary" 
          />
        )}
        <h1 className="text-3xl font-bold">
          Welcome, {user?.displayName || user?.email || 'User'}!
        </h1>
      </div>
      <Button 
        variant="outline"
        onClick={onLogout}
        className="w-[200px]"
      >
        Logout
      </Button>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/auth/user', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data) setUser(data);
      })
      .catch(console.error);
  }, []);

  const handleLogout = () => {
    fetch('http://localhost:3000/auth/logout', {
      credentials: 'include'
    })
      .then(() => {
        setUser(null);
        window.location.href = '/login';
      })
      .catch(console.error);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <HomePage user={user} onLogout={handleLogout} />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
