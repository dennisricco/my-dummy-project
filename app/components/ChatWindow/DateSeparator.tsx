'use client';

export function isSameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function getDateLabel(date: Date): string {
  if (isNaN(date.getTime())) return '';
  const now = new Date();
  if (isSameCalendarDay(date, now)) return 'Today';
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (isSameCalendarDay(date, yesterday)) return 'Yesterday';
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

interface DateSeparatorProps {
  date: Date;
}

export default function DateSeparator({ date }: DateSeparatorProps) {
  const label = getDateLabel(date);
  if (!label) return null;

  return (
    <div
      data-testid="date-separator"
      className="flex items-center gap-3 select-none"
      style={{ padding: '16px 20px 8px' }}
    >
      <div
        className="flex-1 h-px"
        style={{
          background: 'linear-gradient(to right, transparent, var(--border-color))',
        }}
      />
      <span
        style={{
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.06em',
          color: 'var(--text-muted)',
          padding: '3px 12px',
          borderRadius: '999px',
          backgroundColor: 'rgba(255,255,255,0.04)',
          border: '1px solid var(--border-color)',
        }}
      >
        {label}
      </span>
      <div
        className="flex-1 h-px"
        style={{
          background: 'linear-gradient(to left, transparent, var(--border-color))',
        }}
      />
    </div>
  );
}
