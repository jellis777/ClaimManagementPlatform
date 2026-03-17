import { Navigate, Route, Routes } from 'react-router-dom';
import ClaimsPage from './pages/ClaimsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { useAuth } from './context/useAuth';

function App() {
  const { isAuthenticated } = useAuth();
  return (
    <div className="min-h-screen bg-slate-100">
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Routes>
          <Route
            path="/login"
            element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/register"
            element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/" />}
          />
          <Route
            path="/"
            element={
              isAuthenticated ? <ClaimsPage /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
