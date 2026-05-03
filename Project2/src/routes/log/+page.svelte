<script>
	import { goto } from '$app/navigation';
	import { saveLog, glucoseStatus } from '$lib/store.js';

	let glucose = $state('');
	let fasting = $state(true);
	let weight = $state('');
	let notes = $state('');
	let submitted = $state(false);
	let resultStatus = $state(null);

	function handleSubmit() {
		const g = parseFloat(glucose);
		if (isNaN(g) || g <= 0) return;
		const log = {
			glucose: g,
			fasting,
			weight: weight ? parseFloat(weight) : null,
			notes
		};
		resultStatus = glucoseStatus(log);
		saveLog(log);
		submitted = true;
	}

	const today = new Date().toLocaleDateString('da-DK', { weekday: 'long', day: 'numeric', month: 'long' });
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
	<div class="max-w-lg mx-auto space-y-4">
		<div class="flex items-center gap-3 pt-4">
			<button class="btn btn-ghost btn-sm btn-circle" aria-label="Tilbage" onclick={() => goto('/home')}>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
				</svg>
			</button>
			<div>
				<h1 class="text-xl font-bold text-gray-800">Registrer blodsukker</h1>
				<p class="text-xs text-gray-500">{today}</p>
			</div>
		</div>

		{#if submitted && resultStatus}
			<div class="card bg-white shadow-xl">
				<div class="card-body items-center text-center gap-4">
					<div class="w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-bold
						{resultStatus.color === 'success' ? 'bg-success' : resultStatus.color === 'warning' ? 'bg-warning' : 'bg-error'}">
						{glucose} <span class="text-xs ml-1">mmol/l</span>
					</div>
					<h2 class="text-xl font-bold text-gray-800">{resultStatus.label}</h2>
					{#if resultStatus.color === 'success'}
						<p class="text-gray-600 text-sm">Dit blodsukker er inden for normalt område. Fortsæt god kost og motion.</p>
					{:else if resultStatus.color === 'warning'}
						<p class="text-gray-600 text-sm">Dit blodsukker er let forhøjet. Kontakt din klinik inden for 2 dage og vær opmærksom på kost og medicin.</p>
					{:else}
						<p class="text-red-600 text-sm font-semibold">Dit blodsukker er markant forhøjet. Kontakt din læge i dag – mistanke om hyperglykæmi.</p>
					{/if}
					<div class="flex gap-3 w-full">
						<button class="btn btn-primary w-full" onclick={() => goto('/home')}>Tilbage</button>
					</div>
				</div>
			</div>
		{:else}
			<div class="card bg-white shadow">
				<div class="card-body p-4 space-y-3">
					<h2 class="font-semibold text-gray-700">Blodsukker (mmol/l)</h2>
					<input
						type="number"
						min="1"
						max="30"
						step="0.1"
						bind:value={glucose}
						placeholder="fx 6.5"
						class="input input-bordered w-full text-lg"
					/>
					<div class="flex items-center gap-3">
						<input type="checkbox" id="fasting" bind:checked={fasting} class="checkbox checkbox-primary" />
						<label for="fasting" class="text-sm text-gray-700 cursor-pointer">
							Fastende måling (mindst 8 timer uden mad)
						</label>
					</div>
					<p class="text-xs text-gray-400">
						{fasting ? 'Tærskler: Normal ≤ 7,0 · Forhøjet 7,1–10,0 · Høj > 10,0' : 'Tærskler: Normal ≤ 11,1 · Forhøjet > 11,1 · Høj > 15,0'}
					</p>
				</div>
			</div>

			<div class="card bg-white shadow">
				<div class="card-body p-4 space-y-2">
					<h2 class="font-semibold text-gray-700">Vægt (kg) <span class="text-xs text-gray-400 font-normal">– valgfrit</span></h2>
					<input
						type="number"
						min="30"
						max="250"
						step="0.1"
						bind:value={weight}
						placeholder="fx 82.5"
						class="input input-bordered w-full"
					/>
				</div>
			</div>

			<div class="card bg-white shadow">
				<div class="card-body p-4">
					<h2 class="font-semibold text-gray-700">Bemærkninger / symptomer</h2>
					<textarea
						class="textarea textarea-bordered w-full mt-2 text-sm"
						placeholder="Fx: træthed, tørst, svedte om natten, tog insulin..."
						rows="3"
						bind:value={notes}
					></textarea>
				</div>
			</div>

			<button class="btn btn-primary btn-lg w-full" onclick={handleSubmit} disabled={!glucose}>
				Gem & vis status
			</button>
		{/if}
	</div>
</div>
