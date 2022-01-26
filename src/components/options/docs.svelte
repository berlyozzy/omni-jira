<script>
    import { help_commands, Copy, OpenExternal } from 'lib/helpers.js';
    import Fa from 'svelte-fa'
	import { faExternalLinkAlt, faCopy, faTimes } from '@fortawesome/free-solid-svg-icons';
    import { toast } from '@zerodevx/svelte-toast'
    import Fuse from 'fuse.js';

    let copied = "";
    let searchInput = "";
    let filteredHelp = [];

    const Search = async () => {

        if(searchInput.length != 0){

            const fuse = new Fuse($help_commands, {
                keys: ['text'],
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
        filteredHelp = []
    }
</script>

<div class="documentation-display is-grid">
    <span class="record is-keyword-input is-clickable">
        <div class="record-contents">
            <input class="input" placeholder="Keywords" type="text" bind:value={searchInput} on:input|stopPropagation={Search}>
        </div>
        <button class="button reset-keyword-input {searchInput == "" ? "is-disabled" : ""}" disabled={searchInput == "" ? true : false} on:click={ResetSearch}>
            <span class="icon"> <Fa icon={faTimes} />  </span>
        </button>
    </span>
    {#if filteredHelp.length != 0}
        {#each filteredHelp as {text, copy, external}}
            <span class="record is-clickable" on:click={_ => {

                if(external){
                    OpenExternal(copy)
                }else{
                    Copy(copy);
                    copied = copy;
                    toast.push('Copeid 📝');
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
    {:else}
        {#each $help_commands as {text, copy, external}}
            <span class="record is-clickable" on:click={_ => {

                if(external){
                    OpenExternal(copy);
                }else{
                    Copy(copy);
                    copied = copy;
                    toast.push('Copeid 📝');
                }

            }}>
                <div class="record-contents">
                    {@html text}
                </div>
                {#if external}
                    <span class="icon has-text-link" style="place-self: center"> <Fa icon={faExternalLinkAlt} />  </span>
                {:else}
                    {#key copied}
                    <span class="icon copy {copied == copy ? "has-text-primary" : ""}" style="place-self: center"> <Fa icon={faCopy} /> </span>
                    {/key}
                {/if}
            </span>
        {/each}
    {/if}
</div>

<style>
     .documentation-display{
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

    .record:hover .copy{
        opacity: 1;
    }

    .copy{
        opacity: 0.5;
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

    .input, .input::placeholder{
        font-size: 0.9em;
    }

</style>