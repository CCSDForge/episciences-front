export function getJournalRvCode(): string {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;

    // Handle localhost and development environments
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return import.meta.env.VITE_JOURNAL_RVCODE || '';
    }

    // Only extract from hostname if it's an episciences.org domain
    if (hostname.endsWith('.episciences.org')) {
      return hostname.split('.')[0];
    }

    // For all other domains, use the environment variable
    return import.meta.env.VITE_JOURNAL_RVCODE || '';
  }
  return import.meta.env.VITE_JOURNAL_RVCODE || '';
}