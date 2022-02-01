<script>
    import { help_commands, Copy } from 'lib/helpers.js';
    import Fa from 'svelte-fa'
	import { faExternalLinkAlt, faCopy } from '@fortawesome/free-solid-svg-icons';
    import { toast } from '@zerodevx/svelte-toast'
    import tippy from "sveltejs-tippy";

	let copied = "";
    
    const showTooltip = (content) => {
        return {
            content: content,
			placement: "bottom",
			delay: [1000, 200]
        }
    }
</script>


<div class="view">
    {#each $help_commands as {text, copy, external}}
    <span class="record is-clickable" use:tippy={showTooltip(copy)} on:click={_ => {

        if(!external){
            Copy(copy);
            copied = copy;
            toast.push('Copied 📝');
        }

    }}>
        <div class="record-contents">
            {#if external}
                <a href='{copy}' target="_blank" style="align-self: center; color: inherit;"> {@html text} </a>
            {:else}
                {@html text}
            {/if}
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
		grid-template-columns: auto 10%;
		height: max-content;
		background: white;
		padding: 10px;
		border-radius: 5px;
        border: 3px solid transparent;
		box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
	}

    .record:hover{
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

    .record-contents{
		display: grid;
		gap: 5px;
	}

</style>