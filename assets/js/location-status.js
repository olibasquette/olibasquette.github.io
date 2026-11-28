(() => {
	const badge = document.querySelector('.location-status');
	const url = badge?.dataset.statusUrl;
	if (!url) return;

	const value = badge.querySelector('span');
	const fallback = value.textContent;
	const refreshMs = 60_000;
	const namedLocations = new Map([
		['at home', 'home'],
		['at the office', 'office'],
		['in the office', 'office'],
	]);

	async function refresh() {
		let label = '';
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 10_000);

		try {
			const response = await fetch(url, {
				cache: 'no-store',
				credentials: 'omit',
				signal: controller.signal,
			});
			if (response.ok) {
				const status = await response.json();
				if (typeof status?.label === 'string') {
					label = status.label.trim();
				}
			}
		} catch {
			// Keep the fallback when the API is unreachable or its response is invalid.
		} finally {
			clearTimeout(timeout);
			badge.dataset.location = label
				? namedLocations.get(label.toLowerCase()) ?? 'elsewhere'
				: '';
			const text = label || fallback;
			if (value.textContent !== text) value.textContent = text;
			setTimeout(refresh, refreshMs);
		}
	}

	refresh();
})();
