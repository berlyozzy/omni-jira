<script>
	import { onMount } from "svelte";
	import { help_commands, Copy, OpenExternal } from 'lib/helpers.js';
	import Fa from 'svelte-fa';
	import { faHistory, faBook, faLifeRing, faExternalLinkAlt, faEraser, faAngleDown, faTag, faSave, faCopy } from '@fortawesome/free-solid-svg-icons';

	let history = [];
	let filters = []
	let view = "history";
	let selected_project = "";
	let raw_instances = [];
	let instances = [];
	let isProjectsOpen = false;
	let projects_element;
	let new_id = "";
	let new_tag = "";
	let copied = "";

	chrome.storage.sync.get(['JiraVisited'], function({JiraVisited}) {
		
        history = JiraVisited == undefined ? [] : JiraVisited;

		if(history.length == 0){

			chrome.storage.sync.set({JiraVisited : history});

		}else{

			history = history;

		}

    });

	chrome.storage.sync.get(['JiraInstances'], function({JiraInstances}) {
		
        raw_instances = JiraInstances == undefined ? [] : JiraInstances;

		if(raw_instances.length == 0){

			chrome.storage.sync.set({JiraInstances : raw_instances});

		}else{

			instances = raw_instances.map(e => {return e.description});
			selected_project = instances[0].trim();

		}

    });

	chrome.storage.sync.get(['JiraFilters'], function({JiraFilters}) {
		
		filters = JiraFilters == undefined ? [] : JiraFilters;

		if(filters.length == 0){
			chrome.storage.sync.set({JiraFilters : filters });
		}

	});

	const RemoveHistory = (index) => {
		history.splice(index, 1);
		chrome.storage.sync.set({JiraVisited : history});
		history = history;
	}

	const selectTab = (name) => {
		view = name;
	}

	const SelectInstance = ({target : { textContent }}) => {
		if(selected_project.trim() != textContent.trim()){
			selected_project = textContent.trim()
		}

		isProjectsOpen = false;
	}

	const SaveFilter = () => {

		const instance = raw_instances.find(({description}) => description.trim() == selected_project.trim());
		const { content } = instance;

		const filter = {
			instance : content.endsWith('/') ? content.slice(0, -1) : content,
			instance_tag : selected_project.trim(),
			id : new_id,
			filter_tag : new_tag
		}

		filters.push(filter);
		chrome.storage.sync.set({JiraFilters : filters });
		// filters = filters;
	}

	const RemoveFilter = (index) => {
		filters.splice(index, 1);
		chrome.storage.sync.set({JiraFilters : filters});
		// filters = filters;
	}

	onMount(()=> {

		window.addEventListener('click', ({target}) => {
			if(!projects_element.contains(target) && isProjectsOpen){ 
				isProjectsOpen = !isProjectsOpen
			}
		});

	})

</script>

<main>
	<div class="views">
		<span class="icon view is-clickable {view == "history" ? "selected has-text-primary" : ""}" on:click={_ => selectTab("history")}> <Fa icon={faHistory} /> </span>
		<span class="icon view is-clickable {view == "filters" ? "selected has-text-primary" : ""}" on:click={_ => selectTab("filters")}> <Fa icon={faBook} /> </span>
		<span class="icon view is-clickable {view == "help" ? "selected has-text-primary" : ""}" on:click={_ => selectTab("help")}> <Fa icon={faLifeRing} /> </span>
	</div>
	<div class= "history {view == "history" ? "is-grid" : ""}">
		{#if history.length != 0}
			{#each history as record, index}
			<span class="record">
				<div class="record-contents">
					<a href={record.url} rel={record.title} target="_blank"> <Fa icon={faExternalLinkAlt} /> {record.title}</a>
					<p class="link">{record.url}</p>
				</div>
				<button class="button is-danger is-outlined" style="height: 100%;" on:click={_ => RemoveHistory(index)}> <Fa icon={faEraser} /> </button>
			</span>
			{/each}
		{:else}
			<p class="empty">You haven't visited any Jira tickets just yet!</p>
		{/if}
	</div>
	<div class= "filters {view == "filters" ? "is-grid" : ""}" style="grid-template-rows: repeat(auto-fit, 60px)">
		{#each filters as record, index}
		<span class="record">
			<div class="record-contents">
				<a href='{record.instance.endsWith('/') ? record.instance.slice(0, -1) : record.instance}/issues/?filter={record.id}' target="_blank" style="align-self: center"> <Fa icon={faExternalLinkAlt} /> {record.instance_tag} - {record.id} - {record.filter_tag}</a>
			</div>
			<button class="button is-danger is-outlined" style="height: 2.5em;" on:click={_ => RemoveFilter(index)}> <Fa icon={faEraser} /> </button>
		</span>
		{/each}
		<span class="record" style="gap: 5px">
			<div class="new-record-contents">
				<div bind:this={projects_element} class="dropdown {isProjectsOpen ? "is-active" : ""}">
					<div class="dropdown-trigger" style="width: 100%;">
					  <button class="button no-shadow" style="width: 100%;" aria-haspopup="true" aria-controls="dropdown-menu" on:click={_ => isProjectsOpen = !isProjectsOpen}>
						<span style="text-overflow: ellipsis; overflow: hidden;">{selected_project}</span>
						<span class="icon is-small">
							<Fa icon={faAngleDown} />
						</span>
					  </button>
					</div>
					<div class="dropdown-menu" id="dropdown-menu" role="menu">
					  <div class="dropdown-content">
						  {#each instances as instance}
						  <span class="dropdown-item is-clickable" on:click={SelectInstance}> {instance}  </span>
						  {/each}
					  </div>
					</div>
				  </div>
				<input class="input" type="text" placeholder="ID" bind:value={new_id}>
				<div class="field">
					<p class="control has-icons-left">
					  <input class="input" type="text" placeholder="Tag" bind:value={new_tag}>
					  <span class="icon is-small is-left"> <Fa icon={faTag} /> </span>
					</p>
				</div>
			</div>
			<button class="button is-primary is-outlined" style="height: 100%" disabled={raw_instances.length == 0} on:click={SaveFilter}> <Fa icon={faSave} /> </button>
		</span>
	</div>
	<div class= "help {view == "help" ? "is-grid" : ""}" style="grid-template-rows: repeat(11, max-content)">
		{#each $help_commands as {external, copy, text}}
		<span class="record is-clickable" on:click={_ => {

			if(external){
				OpenExternal(copy, true)
			}else{
				Copy(copy);
				copied = copy;
			}

		}}>
			<div class="record-contents">
				{@html text}
			</div>
			{#if external}
				<span class="icon has-text-link" style="place-self: center"> <Fa icon={faExternalLinkAlt} />  </span>
			{:else}
				{#key copied}
				<span class="icon {copied == copy ? "has-text-primary" : ""}" style="place-self: center"> <Fa icon={faCopy} /> </span>
				{/key}
			{/if}
		</span>
		{/each}
	</div>
</main>


<style>
	main {
		height: 200px;
		width: 400px;
		max-height: 550px;
		min-height: 200px;
		grid-template-rows: 50px auto;
		display: grid;
		grid-gap: 5px;
		overflow: auto;
		resize: vertical;
		background: rgba(0,0,0,0.03);
	}

	main::-webkit-scrollbar {
		width: 7px;
		height: 7px;
	}

	main::-webkit-scrollbar-track{
		background: transparent !important;
	}

	main::-webkit-scrollbar-thumb{
		background-color: rgba(34,34,34,0.5) !important;
	}

	.history, .filters, .help{
		display: none;
		grid-template-rows: repeat(10, max-content);
		grid-gap: 5px;
		font-size: 0.9em;
		padding: 5px;
	}

	.views{
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
	

	.empty{
		text-align: center;
		opacity: 0.5;
		font-size: 1.3em;
		margin-top: 10px;
	}

	.record{
		display: grid;
		grid-template-columns: auto 10%;
		height: max-content;
		background: white;
		padding: 10px;
		border-radius: 5px;
		box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
	}

	.record-contents{
		display: grid;
		gap: 5px;
	}

	.new-record-contents{
		display: grid;
		grid-template-columns: 25% repeat(2, 1fr);
		gap: 5px;
	}

	a{
		text-overflow: ellipsis;
		overflow: hidden;
		width: 95%;
		white-space: nowrap;
	}

	.button{
		box-shadow: rgba(50, 50, 93, 0.15) 0px 2px 5px -1px, rgba(0, 0, 0, 0.2) 0px 1px 3px -1px;
	}

	.no-shadow{
		box-shadow: none !important;
	}

	.dropdown-menu{
		bottom: 0%;
		left: 105%;
		top: inherit;
	}

	.dropdown-item:hover{
		background: rgba(0,0,0,0.03);
	}

	.link{
		text-overflow: ellipsis;
		overflow: hidden;
		width: 95%;
		white-space: nowrap;
		font-size: 0.8em; 
		opacity: 0.5
	}
</style>