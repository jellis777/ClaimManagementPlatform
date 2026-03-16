type StatusBadgeProps = {
  status: string;
};

function StatusBadge({ status }: StatusBadgeProps) {
  const baseClasses =
    'inline-flex rounded-full px-3 py-1 text-xs font-semibold';

  const statusClasses: Record<string, string> = {
    Pending: 'bg-yellow-100 text-yellow-800',
    UnderReview: 'bg-blue-100 text-blue-800',
    Approved: 'bg-green-100 text-green-800',
    Rejected: 'bg-red-100 text-red-800',
    Paid: 'bg-emerald-100 text-emerald-800',
  };

  return (
    <span
      className={`${baseClasses} ${statusClasses[status] ?? 'bg-slate-100 text-slate-700'}`}
    >
      {status}
    </span>
  );
}

export default StatusBadge;
