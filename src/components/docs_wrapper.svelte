<script>
    import Docs from './docs.svx';
    import Fa from 'svelte-fa';
	import { faHome } from '@fortawesome/free-solid-svg-icons';
    import { createEventDispatcher} from 'svelte';

    const dispatch = createEventDispatcher();

</script>

<main class="content">


    <button class="button is-info is-light" on:click={_ => dispatch("close")}>
        <span>Back</span>
        <span class="icon"> <Fa icon={faHome} /></span>
    </button>

    <Docs />

</main>


<style>

    main{
        margin: 4em;
        padding: 1em;
        position: relative;
        background: rgba(255,255,255,0.8);
	}

</style>