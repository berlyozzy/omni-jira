<script>
	import Fa from 'svelte-fa';
	import { faHistory, faBook, faLifeRing } from '@fortawesome/free-solid-svg-icons';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	
	import Filters from 'popup/filters.svelte';
	import Help from 'popup/help.svelte';
	import History from 'popup/history.svelte';

	let view = "history";

	const views = {
		filters : Filters,
		help : Help,
		history : History
	}

	const options = {
		duration: 1000,
		initial: 1,         
		next: 0,
		theme: {
			'--toastBackground': '#00d1b2',
			'--toastBarBackground': '#ebfffc'
		}
	}

</script>

<main>

	<div class="popup-header">
		<span class="icon view is-clickable {view == "history" ? "selected has-text-primary" : ""}" on:click={_ => view = "history"}> <Fa icon={faHistory} /> </span>
		<span class="icon view is-clickable {view == "filters" ? "selected has-text-primary" : ""}" on:click={_ => view = "filters"}> <Fa icon={faBook} /> </span>
		<span class="icon view is-clickable {view == "help" ? "selected has-text-primary" : ""}" on:click={_ => view = "help"}> <Fa icon={faLifeRing} /> </span>
	</div>

	<div class="popup-content">
		<svelte:component this={views[view]} />
	</div>

</main>

<SvelteToast {options}/>


<style>

	main {
		height: 550px;
		width: 400px;
		grid-template-rows: 50px auto;
		display: grid;
		grid-gap: 5px;
		background: white;
	}

	.popup-header{
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		place-items: center;
		background: white;
		box-shadow: rgb(99 99 99 / 20%) 0px 2px 8px 0px;
	}

	.view{
		width: 100%;
		height: 100%;
		border-bottom: 3px solid;
	}

	.view:not(.selected){
		border-color: transparent;
	}

	.selected{
		background: rgba(0,0,0,0.05);
	}


	.popup-content{
		height: 100%;
		overflow: auto;
	}

</style>