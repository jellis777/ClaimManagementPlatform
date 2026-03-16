import { useEffect, useState } from 'react';
import ClaimCard from '../components/ClaimCard';
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
    return <p className="text-slate-600">Loading claims...</p>;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">
          {' '}
          Claims Dashboard
        </h2>
        <p className="mt-2 text-slate-600">
          Create, review, update, and manage claims in one place.
        </p>
      </div>
      <CreateClaimForm onClaimCreated={loadClaims} />

      {editingClaim ? (
        <EditClaimForm
          claim={editingClaim}
          onCancel={handleCancelEdit}
          onClaimUpdated={loadClaims}
        />
      ) : null}

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">All Claims</h3>
        <p className="text-sm text-slate-500">
          {claims.length} {claims.length === 1 ? 'claim' : 'claims'}
        </p>
      </div>

      {claims.length === 0 ? (
        <div className="rounded-xl bg-white p-6 shadow sm">
          <p className="text-slate-600">No claims found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {claims.map((claim) => (
            <ClaimCard
              key={claim.id}
              claim={claim}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default ClaimsPage;
