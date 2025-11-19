/**
 * Date Utility Functions
 *
 * Provides consistent date formatting across the application.
 */

/**
 * Format a date as a short string (e.g., "Nov 15, 2025")
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Format a date with time (e.g., "Nov 15, 2025 at 2:30 PM")
 */
export const formatDateTime = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

/**
 * Format a date range (e.g., "Nov 15 - Nov 22, 2025")
 */
export const formatDateRange = (start: Date, end?: Date): string => {
  if (!end) {
    return `${formatDate(start)} - Present`;
  }

  const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
  const startDay = start.getDate();
  const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
  const endDay = end.getDate();
  const year = end.getFullYear();

  if (start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth()) {
    // Same month and year
    return `${startMonth} ${startDay} - ${endDay}, ${year}`;
  } else if (start.getFullYear() === end.getFullYear()) {
    // Same year, different months
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
  } else {
    // Different years
    return `${formatDate(start)} - ${formatDate(end)}`;
  }
};

/**
 * Calculate duration between two dates in days
 */
export const calculateDuration = (start: Date, end: Date): number => {
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Format duration as human-readable string
 */
export const formatDuration = (days: number): string => {
  if (days < 7) {
    return `${days} day${days !== 1 ? 's' : ''}`;
  } else if (days < 30) {
    const weeks = Math.floor(days / 7);
    return `${weeks} week${weeks !== 1 ? 's' : ''}`;
  } else if (days < 365) {
    const months = Math.floor(days / 30);
    return `${months} month${months !== 1 ? 's' : ''}`;
  } else {
    const years = Math.floor(days / 365);
    return `${years} year${years !== 1 ? 's' : ''}`;
  }
};
