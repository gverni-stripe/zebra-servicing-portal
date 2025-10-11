interface StatusBadgeProps {
  label: string;
  status: boolean | 'empty' | 'not-empty';
  ariaLabel?: string;
}

export default function StatusBadge({ label, status, ariaLabel }: StatusBadgeProps) {
  const isPositive = status === true || status === 'empty';
  const emoji = isPositive ? '✅' : '❌';

  return (
    <div className="flex items-center gap-2">
      <span
        className="text-lg"
        role="img"
        aria-label={ariaLabel || (isPositive ? 'Yes' : 'No')}
      >
        {emoji}
      </span>
      <span className="text-sm text-gray-700">{label}</span>
    </div>
  );
}
