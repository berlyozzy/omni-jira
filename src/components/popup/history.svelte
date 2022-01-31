<script>
    import Fa from 'svelte-fa';
	import { faExternalLinkAlt, faEraser } from '@fortawesome/free-solid-svg-icons';
    import { toast } from '@zerodevx/svelte-toast';
    import tippy from "sveltejs-tippy";

    let history = [];

    chrome.storage.sync.get(['JiraVisited'], function({JiraVisited}) {
		
        history = JiraVisited == undefined ? [] : JiraVisited;

		if(history.length == 0){

			chrome.storage.sync.set({JiraVisited : history});

		}else{

			history = history;

		}

    });

	const RemoveHistory = (index) => {
		history.splice(index, 1);
		chrome.storage.sync.set({JiraVisited : history});
		history = history;

        toast.push('Removed from History 📝');
	}

    const showTooltip = (content) => {
        return {
            content: content,
			placement: "bottom",
			delay: [1000, 200]
        }
    }

</script>


<div class="view">
    {#if history.length != 0}
        {#each history as {title, url}, index}
        <span class="record">
            <div class="record-contents">
                <a use:tippy={showTooltip(title)} href={url} rel={title} target="_blank"> <Fa icon={faExternalLinkAlt} />{title}</a>
                <p use:tippy={showTooltip(url)} class="link">{url}</p>
            </div>
            <button class="button is-danger is-outlined" style="height: 100%;" on:click={_ => RemoveHistory(index)}> <Fa icon={faEraser} /> </button>
        </span>
        {/each}
    {:else}
        <p class="empty">You haven't visited any Jira tickets just yet!</p>
    {/if}
</div>

<style>
    .view{
		display: grid;
		grid-template-rows: repeat(10, max-content);
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

    .empty{
		text-align: center;
		opacity: 0.5;
		font-size: 1.3em;
		margin-top: 10px;
	}

    .link{
		text-overflow: ellipsis;
		overflow: hidden;
		width: 95%;
		white-space: nowrap;
		font-size: 0.8em; 
		opacity: 0.5
	}

    a{
		text-overflow: ellipsis;
		overflow: hidden;
		width: 95%;
		white-space: nowrap;
	}
</style>