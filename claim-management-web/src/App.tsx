import ClaimsPage from './pages/ClaimsPage';

function App() {
  return (
    <div className="min-h-screen bg-slate-100">
      <main className="mx-auto max-w-6xl p-6">
        <header className="mb-8">
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
            Enterprise Claims
          </p>
          <h1 className="mb-6 text-3xl font-bold text-slate-900">
            Claim Management Platform
          </h1>
        </header>

        <ClaimsPage />
      </main>
    </div>
  );
}

export default App;
