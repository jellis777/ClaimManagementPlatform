import { useEffect, useState } from 'react';
import { getClaims, deleteClaim } from '../services/claimService';
import type { Claim } from '../types/claim';
import CreateClaimForm from '../components/CreateClaimForm';

function ClaimsPage() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadClaims() {
    try {
      const data = await getClaims();
      setClaims(data);
    } catch {
      setError('Failed to load claims');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadClaims();
  }, []);

  if (loading) {
    return <p>Loading claims...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  async function handleDelete(id: number) {
    const confirmed = confirm('Are you sure you want to delete this claim?');

    if (!confirmed) return;

    try {
      await deleteClaim(id);
      await loadClaims();
    } catch {
      alert('Failed to delete claim');
    }
  }

  return (
    <section className="space-y-6">
      <CreateClaimForm onClaimCreated={loadClaims} />

      {claims.length === 0 ? (
        <div className="rounded-xl bg-white p-6 shadow sm">
          <p className="text-slate-600">No claims found.</p>
        </div>
      ) : (
        claims.map((claim) => (
          <article key={claim.id} className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {claim.title}
                </h2>
                <p className="mt-2 text-slate-600">{claim.description}</p>
                <p className="mt-3 text-sm text-slate-700">
                  Amount: ${claim.amount.toFixed(2)}
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  Status: {claim.status}
                </p>
              </div>
              <button
                onClick={() => handleDelete(claim.id)}
                className="rounded-lg bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </article>
        ))
      )}
    </section>
  );
}

export default ClaimsPage;
