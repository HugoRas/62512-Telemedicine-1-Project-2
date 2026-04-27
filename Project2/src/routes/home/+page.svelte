<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { getLogs, hasLoggedToday, glucoseStatus } from '$lib/store.js';

	let loggedToday = $state(false);
	let latestLog = $state(null);
	let latestStatus = $state(null);
	let recentLogs = $state([]);

	onMount(() => {
		const logs = getLogs();
		loggedToday = hasLoggedToday();
		recentLogs = logs.slice(0, 5);
		if (logs.length > 0) {
			latestLog = logs[0];
			latestStatus = glucoseStatus(latestLog);
		}
	});

	function fmt(iso) {
		return new Date(iso).toLocaleDateString('da-DK', { day: '2-digit', month: 'short' });
	}
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
	<div class="max-w-2xl mx-auto space-y-4">
		<div class="flex items-center justify-between pt-4">
			<div>
				<h1 class="text-2xl font-bold text-gray-800">Diabetes Monitor</h1>
				<p class="text-sm text-gray-500">Type 2-diabetes telemedicinsk opfølgning</p>
			</div>
			<a href="/logout" class="btn btn-ghost btn-sm">Log ud</a>
		</div>

		{#if !loggedToday}
			<div role="alert" class="alert alert-warning shadow">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
				</svg>
				<span>Du har ikke registreret dagens blodsukker endnu.</span>
				<button class="btn btn-sm btn-warning" onclick={() => goto('/log')}>Registrer nu</button>
			</div>
		{/if}

		{#if latestLog && latestStatus}
			<div class="card bg-white shadow-xl">
				<div class="card-body">
					<h2 class="card-title text-gray-700">Seneste måling</h2>
					<div class="flex items-center gap-3">
						<div class="badge badge-lg {latestStatus.badge} text-white p-4 text-sm font-bold">
							{latestStatus.label}
						</div>
						<span class="text-gray-400 text-sm">{fmt(latestLog.date)}</span>
					</div>
					<div class="grid grid-cols-2 gap-3 mt-2 text-sm">
						<div class="bg-gray-50 rounded-lg p-3">
							<p class="text-gray-500">Blodsukker</p>
							<p class="text-2xl font-bold text-gray-800">{latestLog.glucose}<span class="text-sm text-gray-400"> mmol/l</span></p>
							<p class="text-xs text-gray-400 mt-1">{latestLog.fasting ? 'Fastende' : 'Ikke-fastende'}</p>
						</div>
						<div class="bg-gray-50 rounded-lg p-3">
							<p class="text-gray-500">Vægt</p>
							{#if latestLog.weight}
								<p class="text-2xl font-bold text-gray-800">{latestLog.weight}<span class="text-sm text-gray-400"> kg</span></p>
							{:else}
								<p class="text-lg text-gray-400">—</p>
							{/if}
						</div>
					</div>
				</div>
			</div>
		{:else}
			<div class="card bg-white shadow-xl">
				<div class="card-body text-center text-gray-400">
					<p>Ingen registreringer endnu.</p>
				</div>
			</div>
		{/if}

		<div class="grid grid-cols-2 gap-3">
			<button class="btn btn-primary btn-lg h-24 flex-col gap-1" onclick={() => goto('/log')}>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
				</svg>
				Registrer blodsukker
			</button>
			<button class="btn btn-secondary btn-lg h-24 flex-col gap-1" onclick={() => goto('/history')}>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
				</svg>
				Historik & Trend
			</button>
			<button class="btn btn-accent btn-lg h-24 flex-col gap-1 col-span-2" onclick={() => goto('/exercises')}>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
				</svg>
				Anbefalinger (KRAM)
			</button>
		</div>

		<div class="card bg-white shadow">
			<div class="card-body p-4">
				<h3 class="font-semibold text-gray-700 text-sm mb-2">Blodsukkertærskler (jf. retningslinjer)</h3>
				<div class="space-y-1 text-xs">
					<div class="flex items-center gap-2">
						<span class="badge badge-success text-white w-3 h-3 p-0"></span>
						<span><strong>Fastende ≤ 7,0 mmol/l</strong> – Normal</span>
					</div>
					<div class="flex items-center gap-2">
						<span class="badge badge-warning text-white w-3 h-3 p-0"></span>
						<span><strong>Fastende 7,1–10,0 mmol/l</strong> – Forhøjet, følg op</span>
					</div>
					<div class="flex items-center gap-2">
						<span class="badge badge-error text-white w-3 h-3 p-0"></span>
						<span><strong>Fastende &gt; 10,0 mmol/l</strong> – Kontakt læge</span>
					</div>
					<div class="divider my-1"></div>
					<div class="flex items-center gap-2">
						<span class="badge badge-success text-white w-3 h-3 p-0"></span>
						<span><strong>Ikke-fastende ≤ 11,1 mmol/l</strong> – Normal</span>
					</div>
					<div class="flex items-center gap-2">
						<span class="badge badge-error text-white w-3 h-3 p-0"></span>
						<span><strong>Ikke-fastende &gt; 11,1 mmol/l</strong> – Mistanke om hyperglykæmi</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
