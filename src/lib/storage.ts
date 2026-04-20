import type { Alert } from './mock-data';

const ALERTS_STORAGE_KEY = 'sentinel_alerts';

export function loadAlertsFromStorage(): Alert[] {
  if (typeof window === 'undefined') return [];

  const raw = window.localStorage.getItem(ALERTS_STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as Alert[];
    return parsed.map(alert => ({
      ...alert,
      timestamp: new Date(alert.timestamp),
    }));
  } catch {
    return [];
  }
}

export function saveAlertsToStorage(alerts: Alert[]) {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alerts));
  window.dispatchEvent(new CustomEvent('sentinelAlertsUpdated', { detail: alerts }));
}
