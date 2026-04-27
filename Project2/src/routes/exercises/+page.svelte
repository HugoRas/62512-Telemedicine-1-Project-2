<script>
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	const TIPS = [
		{
			id: 1,
			category: 'K – Kost',
			title: 'Undgå sukkerholdig mad og drikke',
			desc: 'Sukker og hvide kulhydrater hæver blodsukkeret hurtigt. Vælg fuldkorn, grøntsager og proteiner frem for søde drikke og hvidt brød.',
			color: 'badge-primary'
		},
		{
			id: 2,
			category: 'K – Kost',
			title: 'Spis regelmæssige måltider',
			desc: 'Faste måltider på faste tidspunkter hjælper med at stabilisere blodsukkeret og gøre insulindoseringen mere forudsigelig.',
			color: 'badge-primary'
		},
		{
			id: 3,
			category: 'R – Rygning',
			title: 'Undgå rygning',
			desc: 'Rygning forværrer insulinresistens og øger risikoen for hjerte-kar-sygdomme, som er en hyppig følgesygdom ved type 2-diabetes.',
			color: 'badge-error'
		},
		{
			id: 4,
			category: 'A – Alkohol',
			title: 'Begræns alkohol',
			desc: 'Alkohol kan forstyrre blodsukkerniveauet – særligt ved insulinbehandling. Følg Sundhedsstyrelsens grænser: max 10 genstande/uge for kvinder, 14 for mænd.',
			color: 'badge-warning'
		},
		{
			id: 5,
			category: 'M – Motion',
			title: '30 min. daglig fysisk aktivitet',
			desc: 'Motion øger insulinfølsomheden og sænker blodsukkeret. Selv let gang i 30 min. har dokumenteret effekt. Husk at måle blodsukker før og efter.',
			color: 'badge-success'
		},
		{
			id: 6,
			category: 'M – Motion',
			title: 'Styrketræning 2× ugentlig',
			desc: 'Styrketræning øger muskelmassen, som forbruger mere glukose. Det supplerer konditionstræning og forbedrer den samlede glykæmiske kontrol.',
			color: 'badge-success'
		}
	];

	let done = $state(browser ? JSON.parse(localStorage.getItem('diabetes_tips_done') || '[]') : []);

	function toggle(id) {
		done = done.includes(id) ? done.filter((x) => x !== id) : [...done, id];
		if (browser) localStorage.setItem('diabetes_tips_done', JSON.stringify(done));
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
			<div>
				<h1 class="text-xl font-bold text-gray-800">Anbefalinger (KRAM)</h1>
				<p class="text-xs text-gray-500">{done.length}/{TIPS.length} fulgt i dag</p>
			</div>
		</div>

		<div class="card bg-white shadow">
			<div class="card-body p-4">
				<div class="flex justify-between text-xs text-gray-500 mb-1">
					<span>Dagens fremgang</span>
					<span>{Math.round((done.length / TIPS.length) * 100)}%</span>
				</div>
				<progress class="progress progress-primary w-full" value={done.length} max={TIPS.length}></progress>
			</div>
		</div>

		{#each TIPS as tip}
			<div class="card bg-white shadow {done.includes(tip.id) ? 'opacity-60' : ''}">
				<div class="card-body p-4">
					<div class="flex items-start gap-3">
						<div class="flex-1">
							<div class="flex items-center gap-2 flex-wrap mb-1">
								<span class="badge badge-sm {tip.color} text-white">{tip.category}</span>
								<h3 class="font-bold text-gray-800 text-sm {done.includes(tip.id) ? 'line-through text-gray-400' : ''}">{tip.title}</h3>
							</div>
							<p class="text-xs text-gray-500">{tip.desc}</p>
						</div>
						<input
							type="checkbox"
							checked={done.includes(tip.id)}
							onchange={() => toggle(tip.id)}
							class="checkbox checkbox-primary mt-1 shrink-0"
						/>
					</div>
				</div>
			</div>
		{/each}

		<div class="card bg-blue-50 shadow">
			<div class="card-body p-4 text-xs text-gray-600">
				<p class="font-semibold mb-1">Hvornår skal du kontakte lægen?</p>
				<ul class="list-disc list-inside space-y-1">
					<li>Fastende blodsukker gentagne gange over 7,0 mmol/l</li>
					<li>Blodsukker over 11,1 mmol/l uden for måltid</li>
					<li>Symptomer på hyperglykæmi: tørst, hyppig vandladning, træthed</li>
					<li>Symptomer på hypoglykæmi: svedtendens, rysten, forvirring</li>
				</ul>
			</div>
		</div>
	</div>
</div>
