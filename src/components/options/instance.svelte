<script>
    import Fa from 'svelte-fa'
	import { faHeart, faEraser, faTag, faStar, faGlobeEurope } from '@fortawesome/free-solid-svg-icons';
    import { createEventDispatcher, onMount } from 'svelte';
    import BulmaTagsInput from '@creativebulma/bulma-tagsinput';

    export let index;
    export let description;
    export let content;
    export let projects;
    export let shortcuts = { 

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

    const dispatch = createEventDispatcher();
    let projectsInput;
    $ : projectsValue = '';

    const ChangeInstance = (index, isPrimary = false) => {

        dispatch("setInstance", {index, isPrimary});

    }
    const Edit = (element) => {

        const Inputdata = element.value.split(',');
        dispatch("edit", {
            bool : false, 
            message : "Not Saved 🔥", 
            data : {
                instance : index,
                values : Inputdata
            }
        })

    };
    const Delete = (index) => dispatch("delete", {index});

    onMount( () => {
        const projectsInputComponent = new BulmaTagsInput(projectsInput);

        if(projects.length == 0){
            projectsInputComponent.add("DEFAULT")
        }
        
        projectsInputComponent.on('after.add', () => Edit(projectsInputComponent));
        projectsInputComponent.on('after.remove', () => Edit(projectsInputComponent));

    });

</script>

<div class="instance has-background-white">
    <span class="instance-inputs">
        <div class="field">
            <p class="control has-icons-left">
                <input class="input" type="text" placeholder="https://[JIRA-INSTANCE].ubisoft.org/jira/" bind:value={content} on:input={Edit}>
                <span class="icon is-small is-left is-unselectable"> <Fa icon={faGlobeEurope} /> </span>
            </p>
            <p class="control has-icons-left">
                <input class="input" type="text" placeholder="Tag" bind:value={description} on:input={Edit}>
                <span class="icon is-small is-left is-unselectable">  <Fa icon={faTag} /> </span>
            </p>
        </div>

        <div class="projects">
            <input bind:this={projectsInput} id="tags-input" class="input" type="tags" data-type="tags" placeholder="Enter project key here.. 🖋" value={projects} />
        </div>
        <span class="additional-options is-unselectable">
            
            <button class="button has-transition { shortcuts.Primary_Instance.content == content ? " is-danger" : "has-text-grey-light"} is-outlined" on:click={_ => ChangeInstance(index, true)} style="width: 2.5em"> <Fa icon={faHeart} /></button>
            <button class="button has-transition { shortcuts.Secondary_Instance.content == content  ? " is-warning" : "has-text-grey-light"} is-outlined" on:click={_ => ChangeInstance(index)} style="width: 2.5em"><Fa icon={faStar} /></button>

            <p style="opacity: 0.5; font-size: 0.9em; align-self: center;"> &nbsp; &#8592; mark your instance as primary (❤️) or secondary (⭐) </p>
            <button class="button is-danger is-outlined" on:click={_ => Delete(index)} style="width: 2.5em; justify-self: end"><Fa icon={faEraser} /></button>
        </span>
    </span> 
</div>

<style>

    .instance{
		display: grid;
		width: 35vw;
		height: 100%;
		padding: 10px;
		background: rgba(255, 255, 255, 0.70);
		border-radius: 5px;
        z-index: 1;
	}

    .projects{
        display: grid;
        align-items: end;
    }

    .projects input{
        margin-top: 10px;
    }

    .projects input::placeholder {
        font-size: 0.9em;
    }

	.field{
		display: grid;
		grid-template-columns: calc(80% - 10px) 20%;
		gap: 10px;
		margin: 0;
	}

	.instance-inputs{
		display: grid;
		gap: 10px;
		grid-template-rows: max-content auto max-content;
		border-top: 5px solid var(--border);
		padding-top: 10px;
		height: 100%;
	}

	.instance{
		box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
	}

    .additional-options{
		display: grid;
		grid-template-columns: repeat(2, 2.5em) auto 2.5em;
		gap: 5px;
        height: max-content;
	}

    .button{
		box-shadow: rgba(50, 50, 93, 0.15) 0px 2px 5px -1px, rgba(0, 0, 0, 0.2) 0px 1px 3px -1px;
	}

	.button.is-warning.is-outlined:hover, .button.is-warning.is-outlined:focus{
		color: white;
	}

	.button.has-text-grey-light:hover{
		color: white !important;
		background: #b5b5b5;
	}
</style>