<script>
    import Fa from 'svelte-fa'
	import { faSave } from '@fortawesome/free-solid-svg-icons';
	import { faGithub } from '@fortawesome/free-brands-svg-icons';

</script>

<main>

	<div class="background-image is-unselectable" style="left: 2vw; bottom: 1vh; width: 35%;">
		<figure class="image">
			<!-- svelte-ignore a11y-missing-attribute -->
			<img src="/images/undraw_handcrafts_tree.svg">
		</figure>
	</div>

	<div class="background-image is-unselectable" style="top: 1vh; right: 1vw; width: 20%;">
		<figure class="image">
			<!-- svelte-ignore a11y-missing-attribute -->
			<img src="/images/undraw_handcrafts_planet.svg">
		</figure>
	</div>


	<div class="page-head content">
		<span style="text-align: center">
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

		<span class="buttons">
			<a href="https://bit.ly/34wyLs0" class="button is-danger is-light">
				<span class="icon is-small">
				  <Fa icon={faSave}/>
				</span>
				<span>
					<span class="has-text-weight-semibold">Download</span>@Latest
				</span>
			</a>
			<a class="demo-prefs" href="https://github.com/berlyozzy/omni-jira" target="_blank"> Demo preferences JSON </a>
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

	.background-image{
		position: absolute;
		z-index: 0;
		opacity: 0.25;
		pointer-events: none;
	}

	.content{
		margin: 0;
	}

	h1{
		font-size: 4em;
		margin: 0;
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

	.button{
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