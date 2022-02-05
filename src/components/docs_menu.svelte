<script>
    import Fa from 'svelte-fa';
	import { faHome } from '@fortawesome/free-solid-svg-icons';
    import {view} from '../stores.js';
</script>

<div class="menu">
    <!-- svelte-ignore a11y-missing-attribute -->
    <p class="back" on:click={_ => $view = "main"}> 
        <span class="icon"> <Fa icon={faHome} /> </span> 
        <a>Back To Main Page</a>
    </p>

    <slot></slot>
</div>

<style>
    div{
        position: fixed;
        right: -5vw;
        top: 0;
        height: 100%;
        padding: 1em 0;
        text-align: end;
        font-size: 0.8em;
        background: rgba(255,255,255,0.5);
        opacity: 0;
        transition: all 0.25s;
        overflow: auto;
    }

    div:hover{
        opacity: 1;
        right: 0;
    }

    :global(.menu p){
        height: 30px;
        background: transparent;
        width: 100%;
        display: grid;
        padding: 0 1em;
        align-items: center;
    } 

    :global(.menu p:hover){
        background: hsl(219, 70%, 96%);
    } 

    :global(.menu a){
       color: black;
       padding-top: 0.3em
    } 

    :global(.menu a:hover){
       text-decoration: underline;
    }  

    .back{
        display: grid;
        grid-template-columns: auto max-content;
        gap: 0.25em;
    }

    .back .icon{
        place-self: end;
    }
</style>