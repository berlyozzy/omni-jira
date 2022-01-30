<script>
    import Fa from 'svelte-fa'
	import { faTimes, faEraser, faAngleDown, faTag, faSave } from '@fortawesome/free-solid-svg-icons';
    import { toast } from '@zerodevx/svelte-toast'
    import Fuse from 'fuse.js';

    let searchInput = "";
    let filteredHelp = [];
    let filters = [];
	let raw_instances = [];
	let instances = [];
    let isProjectsOpen = false;
    let selected_project = "";
	let new_id = "";
	let new_tag = "";

    chrome.storage.sync.get(['JiraFilters'], function({JiraFilters}) {
		
		filters = JiraFilters == undefined ? [] : JiraFilters;

		if(filters.length == 0){
			chrome.storage.sync.set({JiraFilters : filters });
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

    const Search = async () => {

        if(searchInput.length != 0){

            const fuse = new Fuse(filters, {
                keys: ['filter_tag', 'id', 'instance_tag'],
                findAllMatches: false,
                ignoreLocation: true,
                minMatchCharLength: searchInput.length
            });

            filteredHelp = (fuse.search(`^${searchInput}`)).map(e => {return e.item});
        }else{
            filteredHelp = [];
        }

    }

    const ResetSearch = () => {
        searchInput = ""; 
        filteredHelp = [];
    }

    const SelectInstance = ({target : { textContent }}) => {
		if(selected_project.trim() != textContent.trim()){
			selected_project = textContent.trim()
		}

		isProjectsOpen = false;
	}

	const SaveFilter = () => {

        if(filteredHelp.length != 0){
            ResetSearch();
        }

		const instance = raw_instances.find(({description}) => description.trim() == selected_project.trim());
		const { content } = instance;

		const filter = {
			instance : content.endsWith('/') ? content.slice(0, -1) : content,
			instance_tag : selected_project.trim(),
			id : new_id,
			filter_tag : new_tag
		}

        filters.push(filter);

        new_id = "";
	    new_tag = "";

		chrome.storage.sync.set({JiraFilters : filters });
        filters = filters;

        toast.push('Filter Added 📝');

	}

    const RemoveFilter = ({instance, id, instance_tag, filter_tag}) => {

        if(filteredHelp.length != 0){
            ResetSearch();
        }

		const filter = filters.findIndex(e => e.id === id && e.instance_tag === instance_tag && e.instance === instance && e.filter_tag === filter_tag);

        filters.splice(filter, 1);

		chrome.storage.sync.set({JiraFilters : filters});
        filters = filters;

        toast.push('Filter Removed 📝');
	}

</script>

<div class="filters-display is-grid">
    <span class="record is-keyword-input is-clickable">
        <div class="record-contents">
            <input class="input" placeholder="Keywords" type="text" bind:value={searchInput} on:input|stopPropagation={Search}>
        </div>
        <button class="button reset-keyword-input {searchInput == "" ? "is-disabled" : ""}" disabled={searchInput == "" ? true : false} on:click={ResetSearch}>
            <span class="icon"> <Fa icon={faTimes} />  </span>
        </button>
    </span>

    {#key filters}
    {#if filteredHelp.length != 0}
        {#each filteredHelp as {filter_tag, id, instance, instance_tag}}
            <span class="record">
                <div class="record-contents">
                    <a href='{instance.endsWith('/') ? instance.slice(0, -1) : instance}/issues/?filter={id}' target="_blank" style="align-self: center"> {instance_tag} - {id} - {filter_tag} </a>
                </div>
                <button class="button is-danger is-outlined" on:click|stopPropagation={_ => RemoveFilter({filter_tag, id, instance, instance_tag})}> <Fa icon={faEraser} /> </button>
            </span>
        {/each}
    {:else}
        {#each filters as {filter_tag, id, instance, instance_tag}}
            <span class="record">
                <div class="record-contents">
                    <a href='{instance.endsWith('/') ? instance.slice(0, -1) : instance}/issues/?filter={id}' target="_blank" style="align-self: center"> {instance_tag} - {id} - {filter_tag} </a>
                </div>
                <button class="button is-danger is-outlined" on:click|stopPropagation={_ => RemoveFilter({filter_tag, id, instance, instance_tag})}> <Fa icon={faEraser} /> </button>
            </span>
        {/each}
    {/if}     
    {/key}

    <span class="record" style="gap: 5px">
        <div class="new-record-contents">
            <div class="dropdown {isProjectsOpen ? "is-active" : ""}">
                <div class="dropdown-trigger" style="width: 100%;">
                  <button class="button" style="width: 100%;" aria-haspopup="true" aria-controls="dropdown-menu" on:click={_ => isProjectsOpen = !isProjectsOpen}>
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
        <button class="button is-primary is-outlined" disabled={raw_instances.length == 0} on:click|preventDefault={SaveFilter}> <Fa icon={faSave} /> </button>
    </span>
</div>

<style>
    .filters-display{
       display: none;
       position: absolute;
       background: white;
       padding: 20px;
       border-radius: 5px;
       width: 25vw;
       left: 110%;
       top: 0;
       gap: 15px;
       box-shadow: rgb(99 99 99 / 20%) 0px 2px 8px 0px;
       max-height: 98vh;
       overflow: auto;
   }

   .record{
       display: grid;
       grid-template-columns: auto 10%;
       height: max-content;
       background: white;
       padding: 10px;
       border-radius: 5px;
       border: 3px solid transparent;
       box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
   }

   .record:not(.is-keyword-input):hover{
       background: rgba(0,0,0,0.01);
       border-right: 3px solid var(--border);
       border-bottom: 3px solid var(--border);
   }

   .reset-keyword-input{
       border-radius: 50%;
       border: none;
       height: 2em;
       width: 2em;
       background-color: none;
       place-self: center;
       opacity: 0.6;
   }

   .reset-keyword-input:not(.is-disabled):hover{
       background: rgb(243, 243, 243);
       opacity: 0.8;
   }

   .record-contents{
       display: grid;
       gap: 5px;
   }

   :global(.record-contents span){
       display:grid; 
       gap: 5px;
       font-size: 0.8em;
   }

   .new-record-contents{
		display: grid;
		grid-template-columns: 25% repeat(2, 1fr);
		gap: 5px;
	}

    .dropdown-menu{
		bottom: 0%;
		left: 105%;
		top: inherit;
	}

	.dropdown-item:hover{
		background: rgba(0,0,0,0.03);
	}

</style>