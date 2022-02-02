<script>
    import Fa from 'svelte-fa'
	import { faBook, faSave } from '@fortawesome/free-solid-svg-icons';
	import { faGithubAlt } from '@fortawesome/free-brands-svg-icons';
    import { view } from '../stores.js';
</script>

<main>

	<a class="button is-info git" href="https://github.com/berlyozzy/omni-jira" target="_blank">
        <span class="icon">
          <Fa icon={faGithubAlt} />
        </span>
        <span>GitHub</span>
    </a>
    
    <div class="page-head content">
        <span style="text-align: center;">
            <h1 class="is-unselectable">Omni-Jira</h1>
            <a href="https://github.com/berlyozzy" target="_blank" class="author is-clickable">with ❤️ by berlyozzy / Aleksandrs "Sasha" Domkovs</a>	
        </span>
    </div>
    
    <div class="page-content">
    
        <article class="message is-primary">
            <div class="message-body">
                - is a <b>browser extension</b> designed to help with productivity using Jira by allowing to <b>leverage multiple jira instances</b> through <b><a href="https://developer.chrome.com/docs/extensions/reference/omnibox/" target="_blank">chromium omnibox API</a></b>
            </div>
        </article>
    
    
        <article class="message is-info is-light">
            <div class="message-body content">
                <ul>
                    <li>Use your address bar to navigate Jira!</li>
                    <li>Open tickets, projects and instances: <code>jira TEST-549</code>, <code>jira p TEST</code>, <code>jira INSTANCE</code></li>
                    <li>Search in any instance using keywords or JQL <code>jira INASTANCE_KEY keywords... </code> or <code>jira INSTANCE jql project = TEST AND assignee = "example@email.com"</code></li>
                    <li>Save and open smart filters <code>jira filter CUSTOM_FILTER_NAME/ID</code></li>
                    <li>Have quick access to up-to 10 last opened Jira tickets</li>
                    <li>Set your own shortcuts*</li>
                </ul>
                <p style="font-size: 0.8em; text-decoration: underline">*Browser extensions allow for up-to 4 commands. <a href="https://developer.chrome.com/docs/extensions/reference/commands/" target="_blank">This is an API limitation.</a></p>
            </div>
        </article>
    
        <span class="buttons">
    
            <button class="button big-button is-info is-light" on:click={_ => $view = "docs"}>
                <span class="icon is-small">
                    <Fa icon={faBook}/>
                </span>
                <span>
                    <span class="has-text-weight-semibold">Learn More</span>
                </span>
            </button>
            <a href="https://bit.ly/34wyLs0" class="button big-button is-danger is-light">
                <span class="icon is-small">
                    <Fa icon={faSave}/>
                </span>
                <span>
                    <span class="has-text-weight-semibold">Download</span>@Latest
                </span>
            </a>
            <a class="demo-prefs" href="https://github.com/berlyozzy/omni-jira" target="_blank"> See example preferences JSON </a>
    
        </span>
    
    </div>

</main>


<style>

    main{
		height: 100vh;
		width: 100%;
		display: grid;
		grid-template-rows: 30vh max-content auto;
	}

    .content{
		margin: 0;
	}

	.git{
		position: absolute;
		height: 2.5em;
		top: 1vh;
		left: 1vw;
		z-index: 5;
	}

	h1{
		font-size: 4em;
		margin: 0;
	}

	.content ul{
		margin-top: 0;
	}

	.buttons{
		margin: 0;
		display: grid;
		place-items: center;
	}

	.author{
		color: black;
		opacity: 0.9;
	}

	.author:hover{
		opacity: 0.7;
	}

	.page-content{
		display: grid;
		align-items: start;
		justify-items: center;
		grid-template-rows: max-content auto;
		gap: 3vh;
		z-index: 1;
	}

	.big-button{
		height: 7vh;
		width: 15vw;
		min-width: max-content;
	}

	.demo-prefs{
		color: black;
		opacity: 0.7;
		text-decoration: underline;
	}

	.demo-prefs:hover{
		opacity: 1;
	}

	.page-head{
		display: grid;
		place-items: center;
		z-index: 1;
	}
</style>