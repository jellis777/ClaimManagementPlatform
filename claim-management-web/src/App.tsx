import ClaimsPage from './pages/ClaimsPage';

function App() {
  return (
    <div className="min-h-screen bg-slate-100">
      <main className="mx-auto max-w-5xl p-6">
        <h1 className="mb-6 text-3xl font-bold text-slate-900">
          Claim Management Platform
        </h1>
        <ClaimsPage />
      </main>
    </div>
  );
}

export default App;
