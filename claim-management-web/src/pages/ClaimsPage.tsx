import { useEffect, useState } from 'react';
import { getClaims, deleteClaim } from '../services/claimService';
import type { Claim } from '../types/claim';
import CreateClaimForm from '../components/CreateClaimForm';
import EditClaimForm from '../components/EditClaimForm';

function ClaimsPage() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingClaim, setEditingClaim] = useState<Claim | null>(null);

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

  async function handleDelete(id: number) {
    const confirmed = confirm('Are you sure you want to delete this claim?');

    if (!confirmed) return;

    try {
      await deleteClaim(id);

      if (editingClaim?.id === id) {
        setEditingClaim(null);
      }

      await loadClaims();
    } catch {
      alert('Failed to delete claim');
    }
  }

  function handleEdit(claim: Claim) {
    setEditingClaim(claim);
  }

  function handleCancelEdit() {
    setEditingClaim(null);
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

  return (
    <section className="space-y-6">
      <CreateClaimForm onClaimCreated={loadClaims} />

      {editingClaim ? (
        <EditClaimForm
          claim={editingClaim}
          onCancel={handleCancelEdit}
          onClaimUpdated={loadClaims}
        />
      ) : null}

      {claims.length === 0 ? (
        <div className="rounded-xl bg-white p-6 shadow sm">
          <p className="text-slate-600">No claims found.</p>
        </div>
      ) : (
        claims.map((claim) => (
          <article key={claim.id} className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
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
              <div>
                <button
                  onClick={() => handleEdit(claim)}
                  className="rounded-lg bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(claim.id)}
                  className="rounded-lg bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))
      )}
    </section>
  );
}

export default ClaimsPage;
