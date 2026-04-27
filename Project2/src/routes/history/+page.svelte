<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { getLogs, glucoseStatus } from '$lib/store.js';

	let logs = $state([]);
	let values = $derived(logs.map((l) => Number(l.glucose)));
	let maxVal = $derived(values.length > 0 ? Math.max(...values, 12) : 12);

	onMount(() => {
		logs = getLogs().slice(0, 14);
	});

	function fmt(iso) {
		return new Date(iso).toLocaleDateString('da-DK', { day: '2-digit', month: 'short' });
	}

	function barColor(log) {
		const s = glucoseStatus(log);
		if (s.color === 'error') return 'bg-error';
		if (s.color === 'warning') return 'bg-warning';
		return 'bg-success';
	}
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
	<div class="max-w-lg mx-auto space-y-4">
		<div class="flex items-center gap-3 pt-4">
			<button class="btn btn-ghost btn-sm btn-circle" aria-label="Tilbage" onclick={() => goto('/home')}>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
				</svg>
			</button>
			<h1 class="text-xl font-bold text-gray-800">Historik & Trend</h1>
		</div>

		{#if logs.length === 0}
			<div class="card bg-white shadow">
				<div class="card-body items-center text-center text-gray-400">
					<p>Ingen registreringer endnu.</p>
					<button class="btn btn-primary btn-sm mt-2" onclick={() => goto('/log')}>Registrer nu</button>
				</div>
			</div>
		{:else}
			<div class="card bg-white shadow">
				<div class="card-body p-4">
					<h2 class="font-semibold text-gray-700 mb-1">Blodsukker trend (seneste {logs.length} målinger)</h2>
					<p class="text-xs text-gray-400 mb-3">Grøn: normal · Gul: forhøjet · Rød: høj</p>
					<div class="flex items-end gap-1 h-28">
						{#each [...logs].reverse() as log}
							<div class="flex-1 flex flex-col items-center gap-1">
								<span class="text-xs font-bold text-gray-600">{log.glucose}</span>
								<div
									class="w-full rounded-t {barColor(log)}"
									style="height: {Math.max((Number(log.glucose) / maxVal) * 80, 4)}px"
								></div>
								<span class="text-gray-400 origin-top-left" style="font-size:9px; writing-mode:vertical-rl; transform:rotate(180deg)">{fmt(log.date)}</span>
							</div>
						{/each}
					</div>
					<div class="flex gap-4 mt-3 text-xs justify-center text-gray-500">
						<span>Fastende grænse: <strong>7,0 mmol/l</strong></span>
						<span>Ikke-fastende: <strong>11,1 mmol/l</strong></span>
					</div>
				</div>
			</div>

			<div class="space-y-2">
				{#each logs as log}
					{@const status = glucoseStatus(log)}
					<div class="card bg-white shadow">
						<div class="card-body p-4">
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-3">
									<div class="w-12 h-12 rounded-full flex flex-col items-center justify-center text-white font-bold text-xs
										{status.color === 'success' ? 'bg-success' : status.color === 'warning' ? 'bg-warning' : 'bg-error'}">
										<span class="text-base font-bold leading-none">{log.glucose}</span>
										<span class="text-xs leading-none opacity-80">mmol/l</span>
									</div>
									<div>
										<p class="font-semibold text-sm text-gray-800">{fmt(log.date)}</p>
										<p class="text-xs text-gray-400">{status.label}</p>
										<p class="text-xs text-gray-400">{log.fasting ? 'Fastende' : 'Ikke-fastende'}</p>
									</div>
								</div>
								{#if log.weight}
									<div class="text-right text-xs text-gray-500">
										<p>Vægt</p>
										<p class="font-bold">{log.weight} kg</p>
									</div>
								{/if}
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
