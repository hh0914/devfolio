const MONTH_LABELS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

export function formatDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return iso;
  const year = date.getUTCFullYear();
  const month = MONTH_LABELS[date.getUTCMonth()] ?? '01';
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}

/** "2022-07" -> "2022.07" */
export function formatMonth(value: string): string {
  if (value === 'present') return '至今';
  return value.replace('-', '.');
}

export function highlightIndex(level: string): number {
  switch (level) {
    case 'expert':
      return 4;
    case 'advanced':
      return 3;
    case 'proficient':
      return 2;
    default:
      return 1;
  }
}
