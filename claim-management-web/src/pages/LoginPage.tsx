import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setError('');
      await login({ email, password });
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <p className="mt-2 text-sm text-slate-600">
        Sign in to access the Claim Management Platform.
      </p>

      {error ? <p className="text-red-500">{error}</p> : null}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-slate-500"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            className="w-full mb-2 p-2 bow-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-slate-500"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="w-full rounded-lg bg-slate-900 px-4 py-2 font-medium text-white transition p-2 hover:bg-slate-800">
          Login
        </button>
      </form>

      <p className="mt-4 text-sm text-slate-600">
        Need an account?{' '}
        <Link to="/register" className="font-medium text-slate-900 underline">
          Create one
        </Link>
      </p>
    </div>
  );
}

export default LoginPage;
