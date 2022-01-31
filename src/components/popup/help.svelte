<script>

    import { help_commands, Copy, OpenExternal } from 'lib/helpers.js';
	import Fa from 'svelte-fa';
	import { faExternalLinkAlt, faCopy } from '@fortawesome/free-solid-svg-icons'

	let copied = "";

</script>


<div class="view">
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

<style>
    .view{
		display: grid;
		grid-template-rows: repeat(11, max-content);
		grid-gap: 5px;
		font-size: 0.9em;
		padding: 5px;
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
</style>