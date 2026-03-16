import { useEffect, useState } from 'react';
import type {
  Claim,
  UpdateClaimFormData,
  UpdateClaimRequest,
} from '../types/claim';
import { updateClaim } from '../services/claimService';

type EditClaimFormProps = {
  claim: Claim;
  onCancel: () => void;
  onClaimUpdated: () => Promise<void>;
};

function EditClaimForm({
  claim,
  onCancel,
  onClaimUpdated,
}: EditClaimFormProps) {
  const [formData, setFormData] = useState<UpdateClaimFormData>({
    title: claim.title,
    description: claim.description,
    amount: claim.amount.toString(),
    status: claim.status,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setFormData({
      title: claim.title,
      description: claim.description,
      amount: claim.amount.toString(),
      status: claim.status,
    });
  }, [claim]);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    const trimmedTitle = formData.title.trim();
    const trimmedDescription = formData.description.trim();
    const parsedAmount = Number(formData.amount);

    if (
      !trimmedTitle ||
      !trimmedDescription ||
      !formData.amount ||
      !formData.status
    ) {
      setError('Please fill out all fields');
    }

    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Amount must be greater than 0.');
      return;
    }

    setSubmitting(true);

    const payload: UpdateClaimRequest = {
      title: trimmedTitle,
      description: trimmedDescription,
      amount: parsedAmount,
      status: formData.status,
    };

    try {
      await updateClaim(claim.id, payload);
      await onClaimUpdated();
      onCancel();
    } catch {
      setError('Failed to update claim');
    } finally {
      setSubmitting(false);
    }
  }

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">Edit Claim</h2>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-300 px-3 py-1 text-sm text-slate-700"
        >
          Cancel
        </button>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="edit-title"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Title
          </label>
          <input
            id="edit-title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
          />
        </div>

        <div>
          <label
            htmlFor="edit-description"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Description
          </label>
          <textarea
            id="edit-description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
          />
        </div>

        <div>
          <label
            htmlFor="edit-amount"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Amount
          </label>
          <input
            id="edit-amount"
            name="amount"
            type="number"
            step="0.01"
            min="0.01"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
          />
        </div>

        <div>
          <label
            htmlFor="edit-status"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Status
          </label>
          <select
            id="edit-status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
          >
            <option value="Pending">Pending</option>
            <option value="UnderReview">Under Review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Paid">Paid</option>
          </select>
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-slate-900 px-4 py-2 text-white disabled:opacity-50"
        >
          {submitting ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </section>
  );
}

export default EditClaimForm;
