<script>
    import { onMount } from "svelte";   
	import Fa from 'svelte-fa';
	import { faEraser, faAngleDown, faTag, faSave } from '@fortawesome/free-solid-svg-icons';
    import { toast } from '@zerodevx/svelte-toast';
    import tippy from "sveltejs-tippy";


	let projects_element;
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

        new_id = "";
	    new_tag = "";

		chrome.storage.sync.set({JiraFilters : filters });
        filters = filters;

        toast.push('Filter Added 📝');

	}

    const RemoveFilter = ({instance, id, instance_tag, filter_tag}) => {

		const filter = filters.findIndex(e => e.id === id && e.instance_tag === instance_tag && e.instance === instance && e.filter_tag === filter_tag);

        filters.splice(filter, 1);

		chrome.storage.sync.set({JiraFilters : filters});
        filters = filters;

        toast.push('Filter Removed 📝');
	}

	onMount(()=> {

		window.addEventListener('click', ({target}) => {
			if(isProjectsOpen && !projects_element.contains(target)){ 
				isProjectsOpen = false
			}
		});

	});

    const showTooltip = (content) => {
        return {
            content: content,
			placement: "bottom",
			delay: [1000, 200]
        }
    }

</script>


<div class= "view">

    {#each filters as {filter_tag, id, instance, instance_tag}}
    <span class="record">
        <div class="record-contents">
            <a use:tippy={showTooltip(`${instance.endsWith('/') ? instance.slice(0, -1) : instance}/issues/?filter=${id}`)} href='{instance.endsWith('/') ? instance.slice(0, -1) : instance}/issues/?filter={id}' target="_blank" style="align-self: center"> {instance_tag} - {id} - {filter_tag} </a>
        </div>
        <div class="record-controlls">
            <button class="button is-danger is-outlined" on:click|stopPropagation={_ => RemoveFilter({filter_tag, id, instance, instance_tag})}> <Fa icon={faEraser} /> </button>
        </div>
    </span>
    {/each}

    <span class="record" style="gap: 5px; padding-left: 5px; padding-right: 5px;">
        <div class="new-record-contents">
            <div bind:this={projects_element} class="dropdown {isProjectsOpen ? "is-active" : ""}">
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

    .view{
		display: grid;
		grid-gap: 5px;
		font-size: 0.9em;
		padding: 5px;
	}

    .record{
       display: grid;
       grid-template-columns: auto 15%;
       height: 60px;
       background: white;
       border-radius: 5px;
       align-items: center;
       border: 3px solid transparent;
       box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
   }

   .record:hover{
       background: rgba(0,0,0,0.01);
       border-right: 3px solid var(--border);
       border-bottom: 3px solid var(--border);
   }

   .record-contents{
       display: grid;
       gap: 5px;
       height: 100%;
   }

   .record-controlls{
        width: 100%;
        height: 100%;
        place-items: center;
        display: grid;
   }

   a{
        height: 100%;
        padding-left: 10px;
        display: grid;
        align-items: center;
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