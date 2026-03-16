import { useState } from 'react';
import type { CreateClaimFormData, CreateClaimRequest } from '../types/claim';
import { createClaim } from '../services/claimService';

type CreateClamFormProps = {
  onClaimCreated: () => Promise<void>;
};

function CreateClaimForm({ onClaimCreated }: CreateClamFormProps) {
  const [formData, setFormData] = useState<CreateClaimFormData>({
    title: '',
    description: '',
    amount: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event?.preventDefault();
    setError('');

    const trimmedTitle = formData.title.trim();
    const trimmedDescription = formData.description.trim();
    const parsedAmount = Number(formData.amount);

    if (!trimmedTitle || !trimmedDescription || !formData.amount) {
      setError('Please fill out all fields.');
      return;
    }

    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Amount must be greater than 0.');
      return;
    }

    setSubmitting(true);

    const payload: CreateClaimRequest = {
      title: trimmedTitle,
      description: trimmedDescription,
      amount: parsedAmount,
    };

    try {
      await createClaim(payload);
      setFormData({
        title: '',
        description: '',
        amount: '',
      });
      await onClaimCreated();
    } catch {
      setError('Failed to create claim');
    } finally {
      setSubmitting(false);
    }
  }

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-slate-900">
        Create Claim
      </h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="title"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
          />
        </div>
        <div>
          <label
            htmlFor="amount"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Amount
          </label>
          <input
            id="amount"
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

        {error ? <p>{error}</p> : null}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-slate-900 px-4 py-2 text-white disabled:opacity-50"
        >
          {submitting ? 'Creating...' : 'Create Claim'}
        </button>
      </form>
    </section>
  );
}

export default CreateClaimForm;
