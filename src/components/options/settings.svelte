<script>
    import kbd from 'keyboard-css';
    import Fa from 'svelte-fa'
	import { faHeart, faStar, faAngleDown } from '@fortawesome/free-solid-svg-icons'
    import { createEventDispatcher } from 'svelte';

    export let instances = [];
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
    let isPrimaryDropdownOpen = false;
    let isSecondaryDropdownOpen = false;

    const ExportPrefsAsJSON = async () => {

        async function getLocalStorageValue(key) {
            return new Promise((resolve) => {
                chrome.storage.sync.get(key, function (value) { resolve(value) })
            });
        }

        const downloadToFile = (content, filename, contentType) => {

            const a = document.createElement('a');
            const file = new Blob([content], {encoding:"UTF-8", type: contentType});
            a.href= URL.createObjectURL(file);
            a.download = filename;
            a.click();

            URL.revokeObjectURL(a.href);
        };

        const cur_instances = (await getLocalStorageValue('JiraInstances')).JiraInstances;
        const cur_filters = (await getLocalStorageValue('JiraFilters')).JiraFilters;
        const cur_fav_link = (await getLocalStorageValue('Shortcuts')).Shortcuts;

        const template = {
            JiraInstances : cur_instances !== undefined ? cur_instances : [],
            JiraFilters : cur_filters !== undefined ? cur_filters : [],
            Shortcuts : cur_fav_link !== undefined ? cur_fav_link : {
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
            },
        }

        downloadToFile(JSON.stringify(template), 'omni-jira-prefferences.json', 'application/json;charset=UTF-8');

    }

    const ImportPrefsAsJSON = async (e) => {
        for (const file of e.target.files) {
            if(file.type == "application/json"){

                const reader = new FileReader();

                reader.addEventListener("load", (event) => {
                    const result = JSON.parse(event.target.result);

                    let keys = ["JiraInstances", "JiraFilters", "Shortcuts"];

                    if(!keys.every( e => Object.keys(result).includes(e))){
                        console.log("not complete")
                        return 
                    }

                    console.log(result)
                    console.log(result.Shortcuts)

                    chrome.storage.sync.set({JiraInstances : result.JiraInstances });
                    chrome.storage.sync.set({JiraFilters : result.JiraFilters });
                    chrome.storage.sync.set({Shortcuts : result.Shortcuts });

                    location.reload();
                });

                reader.readAsText(file);

            }else{
                return
            }
        }
    }

    const OpenDropdown = (dropdown) => {
        
        switch (dropdown) {
            case "primary" :
                isPrimaryDropdownOpen = !isPrimaryDropdownOpen
                isSecondaryDropdownOpen = false;
                break;
        
            default:
                isSecondaryDropdownOpen = !isSecondaryDropdownOpen
                isPrimaryDropdownOpen = false;
                break;
        }
    }

    const Purge = () => {
        chrome.storage.sync.clear(_ => {location.reload()});
    }

	const ChangeInstance = (index, isPrimary = false) => {

        dispatch("setInstance", {index, isPrimary});

		isPrimaryDropdownOpen = false;
        isSecondaryDropdownOpen = false;

	}

    const SetFavourite = () => dispatch("setFavourite", {shortcuts})


</script>


<div class="settings-display content is-grid">
    <h4> Assign your ❤️ shortcuts</h4>
    <div class="shortcut">
        <!-- svelte-ignore component-name-lowercase -->
        <p class="is-unselectable"> Primary Shortcut (<kbd class="kbc-button kbc-button-xxs disabled">Alt</kbd> + <kbd class="kbc-button kbc-button-xxs disabled">N</kbd>)</p>
        <input class="input is-danger" type="text" placeholder="e.g. Very Important Dashboard 1" bind:value={shortcuts.Primary_Link}>
    </div>
    <div class="shortcut">
        <!-- svelte-ignore component-name-lowercase -->
        <p class="is-unselectable"> Secondary Shortcut (<kbd class="kbc-button kbc-button-xxs disabled">Alt</kbd> + <kbd class="kbc-button kbc-button-xxs disabled">M</kbd>)</p>
        <input class="input is-warning" type="text" placeholder="e.g. Very Important Dashboard 2" bind:value={shortcuts.Secondary_Link}>
    </div>

    <button class="button is-danger is-outlined" on:click={SetFavourite}>Save</button>

    <hr>

    <h4> Assign your Primary (❤️) and Secondary (⭐) instances </h4>
    <div class="settings-instance-dropdown">
        <span class="icon has-text-danger">
            <Fa icon={faHeart} />
        </span>
        <div class="dropdown {isPrimaryDropdownOpen ? "is-active" : ""}">
            <div class="dropdown-trigger">
              <button class="button" aria-haspopup="true" aria-controls="dropdown-menu" on:click={_ => OpenDropdown("primary")}>
                <!-- svelte-ignore component-name-lowercase -->
                <span>{ instances.length > 0 && shortcuts.Primary_Instance.description !== undefined && shortcuts.Primary_Instance.description !== "" ? shortcuts.Primary_Instance.description : "Not Assigned" } (<kbd class="kbc-button kbc-button-xxs disabled">Alt</kbd> + <kbd class="kbc-button kbc-button-xxs disabled">J</kbd>)</span>
                <span class="icon is-small">
                  <Fa icon={faAngleDown} />
                </span>
              </button>
            </div>
            <div class="dropdown-menu" id="dropdown-menu" role="menu">
              <div class="dropdown-content">
                {#each instances as { description }, index}
                    <!-- svelte-ignore a11y-missing-attribute -->
                    <a class="dropdown-item" on:click={_ => ChangeInstance(index, true)}>
                        {description}
                    </a>
                {/each}
              </div>
            </div>
        </div>
    </div>

    <div class="settings-instance-dropdown">
        <span class="icon has-text-warning">
            <Fa icon={faStar} />
        </span>
        <div class="dropdown {isSecondaryDropdownOpen ? "is-active" : ""}">
            <div class="dropdown-trigger">
              <button class="button" aria-haspopup="true" aria-controls="dropdown-menu" on:click={_ => OpenDropdown("secondary")}>
                <!-- svelte-ignore component-name-lowercase -->
                <span>{ instances.length > 0 && shortcuts.Secondary_Instance.description !== undefined && shortcuts.Secondary_Instance.description !== "" ? shortcuts.Secondary_Instance.description : "Not Assigned" } (<kbd class="kbc-button kbc-button-xxs disabled">Alt</kbd> + <kbd class="kbc-button kbc-button-xxs disabled">K</kbd>)</span>
                <span class="icon is-small">
                    <Fa icon={faAngleDown} />
                </span>
              </button>
            </div>
            <div class="dropdown-menu" id="dropdown-menu" role="menu">
              <div class="dropdown-content">
                {#each instances as { description }, index}
                    <!-- svelte-ignore a11y-missing-attribute -->
                    <a class="dropdown-item" on:click={_ => ChangeInstance(index)}>
                        { description }
                    </a>
                {/each}
              </div>
            </div>
        </div>
    </div>

    <hr>

    <h4> Export/Import your settings </h4>
    <button class="button is-primary is-outlined" on:click={ExportPrefsAsJSON}>Export</button>
    <div class="file is-danger is-outlined">
        <label class="file-label">
          <input class="file-input" type="file" name="import" on:change={ImportPrefsAsJSON}>
          <span class="file-cta">
            <span class="file-label">
              Import
            </span>
          </span>
        </label>
    </div>

    <hr>

    <h4> Delete all data </h4>
    <button class="button is-danger is-outlined" on:click={Purge}>Purge! 🔥</button>


</div>

<style>

    .file{
		box-shadow: rgba(50, 50, 93, 0.15) 0px 2px 5px -1px, rgba(0, 0, 0, 0.2) 0px 1px 3px -1px;
	}

    .settings-display{
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

	.settings-display h4, .settings-display p{
		margin: 0;
	}

	.settings-display hr{
		margin: 1rem;
	}

	.settings-instance-dropdown{
		display: grid;
		grid-template-columns: 10% 90%;
		place-items: center;
	}

	.shortcut{
		display: grid;
		gap: 10px;
	}

	.file-label{
		width: 100%;
		justify-content: center;
	}

	.file-cta{
		background: white;
		border: 1px solid #f14668;
		color: #f14668;
		width: 100%;
	}

	.file-cta:hover{
		background: #f14668;
		border: 1px solid #f14668;
		color: white;
	}

	.dropdown, .dropdown-trigger, .dropdown .button, .dropdown-menu, .dropdown-content{
		width: 100%;
	}

	.dropdown-item{
		text-align: center;
	}
</style>