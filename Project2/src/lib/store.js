import { browser } from '$app/environment';

const STORAGE_KEY = 'diabetes_logs';

export function getLogs() {
	if (!browser) return [];
	try {
		return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
	} catch {
		return [];
	}
}

export function saveLog(entry) {
	if (!browser) return;
	const logs = getLogs();
	logs.unshift({ ...entry, id: Date.now(), date: new Date().toISOString() });
	localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

export function hasLoggedToday() {
	const logs = getLogs();
	if (logs.length === 0) return false;
	const today = new Date().toDateString();
	return new Date(logs[0].date).toDateString() === today;
}

// Thresholds from Danish guidelines (endocrinology.dk):
// Fasting: normal ≤ 7.0 mmol/l, hyperglycemia > 7.0
// Non-fasting: normal ≤ 11.1 mmol/l, hyperglycemia > 11.1
export function glucoseStatus(log) {
	const g = Number(log.glucose);
	if (log.fasting) {
		if (g > 10.0) return { label: 'Rød – Kontakt læge', color: 'error', badge: 'badge-error' };
		if (g > 7.0) return { label: 'Gul – Forhøjet fastende', color: 'warning', badge: 'badge-warning' };
		return { label: 'Grøn – Normal fastende', color: 'success', badge: 'badge-success' };
	} else {
		if (g > 15.0) return { label: 'Rød – Kontakt læge', color: 'error', badge: 'badge-error' };
		if (g > 11.1) return { label: 'Gul – Forhøjet', color: 'warning', badge: 'badge-warning' };
		return { label: 'Grøn – Normal', color: 'success', badge: 'badge-success' };
	}
}
