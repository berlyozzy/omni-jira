<script>
	import { onMount } from "svelte";
	import Fa from 'svelte-fa'
	import { faSave, faPlus, faHome, faBookmark, faBook, faLifeRing } from '@fortawesome/free-solid-svg-icons';
	import { faGithub } from '@fortawesome/free-brands-svg-icons';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import tippy from "sveltejs-tippy";

	import Settings from 'options/settings.svelte';
	import Instance from 'options/instance.svelte';
	import Documentation from 'options/docs.svelte';
	import Filters from 'options/filters.svelte';

	$: instances = [];
	let status = "Saved 🔥";
	let isSaved = true;
	let isTabOpen = false;
	let selectedTab = 'none';
	let settings_element;
	let shortcuts = { 

		Primary_Instance : {
			content : "",
			description : "",
			projects : []
		}, 
		Secondary_Instance : {
			content: "", 
			description: "", 
			projects : []
		},
		Primary_Link : "", 
		Secondary_Link : "" 

	};

	const tooltips = [
		{
			content: "Settings",
			placement: "right",
			delay: [1000, 200]
		},
		{
			content: "Filters",
			placement: "right",
			delay: [1000, 200]
		},
		{
			content: "Help",
			placement: "right",
			delay: [1000, 200]
		},
		{
			content: "GitHub",
			placement: "right",
			delay: [1000, 200]
		},
		{
			content: "Home Page",
			placement: "right",
			delay: [1000, 200]
		}
	]

	const tabs = {
		'settings' : Settings,
		'documentation' : Documentation,
		'filters' : Filters
	}

	const options = {
		duration: 2500,
		initial: 1,           // initial progress bar value
		next: 0,              // next progress value
		theme: {
			'--toastBackground': '#00d1b2',
			'--toastBarBackground': '#ebfffc'
		}
	}

	chrome.storage.sync.get(['JiraInstances'], function(result) {
		
        instances = result.JiraInstances === undefined ? [] : result.JiraInstances;

    });

	chrome.storage.sync.get(['Shortcuts'], function(result) {

		if(result.Shortcuts === undefined){ 
			chrome.storage.sync.set({ Shortcuts : shortcuts }) 
		}else{
			shortcuts = result.Shortcuts
		}

    });

	const Save = () => {

		status = "Saving..."

		instances.map(instance => {
			if(typeof instance.projects == "string"){
				instance.projects = instance.projects.split(',')
			}
		})

		instances = instances;

		chrome.storage.sync.set({JiraInstances : instances}, _ => {isSaved = true; status = "Saved! 🔥"});

	}

	const Add = () => {
		isSaved = false;
		status = "Not Saved 🔥"

		instances.push({
			content: "", 
			description: "", 
			projects : []
		})

		instances = instances;
	}

	const Delete = (id) => {
		isSaved = false;
		status = "Not Saved 🔥"

		instances.splice(id, 1);
		instances = instances;
	}

	const SetInstance = ({index, isPrimary = false}) => {
		
		if(isPrimary){
			shortcuts.Primary_Instance = instances[index];
			chrome.storage.sync.set({Shortcuts : shortcuts });
		}else{
			shortcuts.Secondary_Instance = instances[index];
			chrome.storage.sync.set({Shortcuts : shortcuts });
		}
	
	}

	const SetFavourite = () => chrome.storage.sync.set({ Shortcuts : shortcuts })

	const Edit = ({bool, message, data : {instance, values}}) => {
		isSaved = bool;
		status = message;

		instances[instance].projects = values
	}

	const OpenTab = (name) => {

		if(name == selectedTab && isTabOpen){
			selectedTab = "none";
			isTabOpen = false
		}else{
			selectedTab = name;
			isTabOpen = true;
		}

	}


	onMount(() => {

        window.addEventListener('click', (event) => {

			if(!settings_element.contains(event.target) && isTabOpen){ 
				selectedTab = "none";
				isTabOpen = false;
			}
		});
		
	})

</script>

<main>

	<div class="background-image is-unselectable" style="left: 2vw; bottom: 1vh; width: 35%;">
		<figure class="image">
			<!-- svelte-ignore a11y-missing-attribute -->
			<img src="/images/undraw_handcrafts_tree.svg">
		</figure>
	</div>

	<div class="background-image is-unselectable" style="top: 15vh; right: 20vw; width: 20%;">
		<figure class="image">
			<!-- svelte-ignore a11y-missing-attribute -->
			<img src="/images/undraw_handcrafts_planet.svg">
		</figure>
	</div>

	<nav bind:this={settings_element} class="settings {isTabOpen ? "has-background-white has-transition" : ""}" style="{isTabOpen ? "box-shadow: rgb(99 99 99 / 20%) 0px 2px 8px 0px;" : ""}"> 

		<!-- svelte-ignore a11y-missing-attribute -->
		<a use:tippy={tooltips[0]} class="icon has-text-danger is-clickable" on:click={_ => OpenTab("settings")}> <Fa icon={faBookmark} size={"lg"}/> </a>

		<!-- svelte-ignore a11y-missing-attribute -->
		<a use:tippy={tooltips[1]} class="icon has-text-success is-clickable" on:click={_ => OpenTab("filters")}> <Fa icon={faBook} size={"lg"}/> </a>

		<!-- svelte-ignore a11y-missing-attribute -->
		<a use:tippy={tooltips[2]} class="icon has-text-danger is-clickable" on:click={_ => OpenTab("documentation")}> <Fa icon={faLifeRing} size={"lg"}/> </a>

		<a use:tippy={tooltips[3]} class="icon has-text-info" href="https://github.com/berlyozzy/omni-jira" target="_blank">
			<Fa icon={faGithub} size={"lg"}/>
		</a>

		<a use:tippy={tooltips[4]} class="icon has-text-primary" href="https://example.com/" target="_blank">
			<Fa icon={faHome} size={"lg"}/>
		</a>

		<svelte:component this={tabs[selectedTab]} {instances} {shortcuts} on:setInstance={({detail}) => SetInstance(detail)} on:setFavourite={({detail}) => { shortcuts = detail; SetFavourite() }}/>

	</nav>

	{#each instances as instance, index}
		<Instance {...instance} {index} {shortcuts} on:setInstance={({detail}) => SetInstance(detail)} on:edit={({detail}) => Edit(detail)} on:delete={({detail}) => Delete(detail.index)}/>
	{/each}
	<div class="item-new" style="width: 35vw; z-index: 1;">
		<span class="new-options has-background-white">
			<button class="button is-primary is-outlined is-unselectable" on:click={Add}><Fa icon={faPlus} /></button>
			<button class="button is-danger is-outlined is-unselectable" on:click={Save}><Fa icon={faSave} /></button>
			<p class="status has-transition {isSaved ? "has-text-primary" : "has-text-danger"} has-text-weight-semibold">{status}</p>
		</span>
	</div>

</main>

<SvelteToast {options}/>

<style>
	main{
		display: grid;
		height: 100%;
		grid-template-rows: repeat(4, minmax(auto, 1fr));
		grid-template-columns: repeat(auto-fill, 35vw);
		grid-auto-flow: column;
		width: max-content;
		gap: 1vh;
		padding: 1vh 1vw 1vh 3vw;
	}

	.background-image{
		position: absolute;
		z-index: 0;
		opacity: 0.25;
		pointer-events: none;
	}

	.new-options{
		box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
	}

	.new-options{
		padding: 10px;
		display: grid;
		grid-template-columns: repeat(3, max-content);
		gap: 5px;
		grid-template-rows: max-content;
		place-items: center;
		width: 100%;
		border-radius: 5px;
	}

	.status{
		margin-left: 10px;
		font-size: 0.8em;
	}
	
	.settings{
		position: fixed;
		display: grid;
		gap: 2vh;
		width: 2.5vw;
		left: 0.25vw;
		top: 0.5vh;
		z-index: 10;
		padding: 0.5vh;
		border-radius: 5px;
		place-items: center;
		background: var(--background);
		z-index: 2;
	}
</style>