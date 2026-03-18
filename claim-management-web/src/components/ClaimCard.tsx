import type { Claim } from '../types/claim';
import { formatDate } from '../utils/formatDate';
import StatusBadge from './StatusBadge';

type ClaimCardProps = {
  claim: Claim;
  onEdit: (claim: Claim) => void;
  onDelete: (id: number) => void;
  userRole?: string;
};

function ClaimCard({ claim, onEdit, onDelete, userRole }: ClaimCardProps) {
  const isAdmin = userRole === 'Admin';
  const canEdit = isAdmin || userRole === 'Adjuster';
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-semibold text-slate-900">
              {claim.title}
            </h2>
            <StatusBadge status={claim.status} />
          </div>

          <p className="mt-3 text-slate-600">{claim.description}</p>

          <div className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
            <p>
              <span className="font-medium text-slate-900">Amount:</span> $
              {claim.amount.toFixed(2)}
            </p>
            <p>
              <span className="font-medium text-slate-900">Amount:</span>{' '}
              {formatDate(claim.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 gap-2">
          {canEdit && (
            <button
              onClick={() => onEdit(claim)}
              className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Edit
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => onDelete(claim.id)}
              className="rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default ClaimCard;
