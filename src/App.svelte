<script>
	import { view } from './stores.js';
	import Docs from './components/docs_wrapper.svelte';
	import Main from './components/main.svelte';

	const views = {
		main : Main,
		docs : Docs
	}

</script>

<div class="background-image is-unselectable" style="left: 2vw; bottom: 1vh; width: 35%;">
	<figure class="image"> -->
		<!-- svelte-ignore a11y-missing-attribute -->
		<img src="/omni-jira/images/undraw_handcrafts_tree.svg">
	</figure>
</div>

<div class="background-image is-unselectable" style="top: 1vh; right: 1vw; width: 20%;">
	<figure class="image"> -->
		<!-- svelte-ignore a11y-missing-attribute -->
		<img src="/omni-jira/images/undraw_handcrafts_planet.svg">
	</figure>
</div>

<svelte:component this={views[$view]} on:close={_ => $view = "main"} />

<style>

	.background-image{
		position: fixed;
		z-index: 0;
		opacity: 0.25;
		pointer-events: none;
	}

</style>