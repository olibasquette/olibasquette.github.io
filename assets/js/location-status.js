(() => {
	const badge = document.querySelector('.location-status');
	const url = badge?.dataset.statusUrl;
	if (!url) return;

	const value = badge.querySelector('span');
	const fallback = value.textContent;
	const refreshMs = 60_000;

	async function refresh() {
		let label = fallback;
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
					label = status.label.trim() || fallback;
				}
			}
		} catch {
			// Keep the fallback when the API is unreachable or its response is invalid.
		} finally {
			clearTimeout(timeout);
			if (value.textContent !== label) value.textContent = label;
			setTimeout(refresh, refreshMs);
		}
	}

	refresh();
})();
