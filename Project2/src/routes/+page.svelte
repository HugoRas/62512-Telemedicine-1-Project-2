<script>
	let { form } = $props();
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
	<div class="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6">
		<div class="text-center">
			<h1 class="text-4xl font-bold text-gray-800">Diabetes Monitor</h1>
			<p class="text-gray-500 mt-1">Log ind for at fortsætte</p>
		</div>

		<form method="POST" class="space-y-4">
			{#if form?.error}
				<div role="alert" class="alert alert-error text-sm">{form.error}</div>
			{/if}

			<div class="form-control">
				<label class="label" for="username">
					<span class="label-text">Brugernavn</span>
				</label>
				<input
					type="text"
					id="username"
					name="username"
					class="input input-bordered w-full"
					autocomplete="username"
				/>
			</div>

			<div class="form-control">
				<label class="label" for="password">
					<span class="label-text">Adgangskode</span>
				</label>
				<input
					type="password"
					id="password"
					name="password"
					class="input input-bordered w-full"
					autocomplete="current-password"
				/>
			</div>

			<button type="submit" class="btn btn-primary w-full">Log ind</button>
		</form>
	</div>
</div>
