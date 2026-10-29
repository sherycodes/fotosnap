export { cn } from 'cn';

export const getImageUrl = (image: string | null) => {
  if (!image) {
    return '';
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_IMAGES_URL || process.env.NEXT_PUBLIC_API_URL;
  return `${baseUrl}/uploads/${image}`;
};

const relativeTimeFormatter = new Intl.RelativeTimeFormat('en', {
  numeric: 'auto',
});

const TIME_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 60 * 60 * 24 * 365],
  ['month', 60 * 60 * 24 * 30],
  ['week', 60 * 60 * 24 * 7],
  ['day', 60 * 60 * 24],
  ['hour', 60 * 60],
  ['minute', 60],
];

export const formatRelativeTime = (
  date: string | Date,
  now: Date = new Date(),
) => {
  const seconds = Math.round((new Date(date).getTime() - now.getTime()) / 1000);

  if (Math.abs(seconds) < 60) {
    return 'just now';
  }

  for (const [unit, unitSeconds] of TIME_UNITS) {
    if (Math.abs(seconds) >= unitSeconds) {
      return relativeTimeFormatter.format(
        Math.trunc(seconds / unitSeconds),
        unit,
      );
    }
  }

  return 'just now';
};
