<script>
	import { view } from './stores.js';
	import Docs from './components/docs_wrapper.svelte';
	import Main from './components/main.svelte';

	const views = {
		main : Main,
		docs : Docs
	}

</script>

{#if $view == "main"}
<div class="background-image is-unselectable" style="left: 2vw; bottom: 1vh; width: 35%;">
	<figure class="image">
		<!-- svelte-ignore a11y-missing-attribute -->
		<img src="/images/undraw_handcrafts_tree.svg">
	</figure>
</div>
{/if}

<div class="background-image is-unselectable" style="top: 1vh; right: 1vw; width: 20%;">
	<figure class="image">
		<!-- svelte-ignore a11y-missing-attribute -->
		<img src="/images/undraw_handcrafts_planet.svg">
	</figure>
</div>

<svelte:component this={views[$view]} />

<style>

	.background-image{
		position: absolute;
		z-index: 0;
		opacity: 0.25;
		pointer-events: none;
	}

</style>