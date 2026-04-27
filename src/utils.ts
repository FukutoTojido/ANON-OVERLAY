const defaultTimingFunction: EffectTiming = {
	duration: 250,
};

const debounce = <T extends unknown[]>(
	fn: (...args: T) => void,
	timeout = 3000,
): ((...args: T) => void) => {
	let timeoutId: number | null = null;
	return (...args: T) => {
		if (timeoutId) clearTimeout(timeoutId);

		timeoutId = setTimeout(() => {
			fn(...args);
		}, timeout);

		return;
	};
};

const query = new URLSearchParams(window.location.search);

const getPlayerData = async (
	playerName: string,
	controller: AbortController,
) => {
	const response = await fetch(
		`${import.meta.env.VITE_BASE_API_URL}/u/${playerName}`,
		{ signal: controller.signal },
	);

	return await response.json();
};

export { defaultTimingFunction, debounce, query, getPlayerData };
