import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';


// https://vitejs.dev/config/
export default defineConfig({
    resolve : {
        alias : {
            'lib' : '/src/lib',
            'options' : '/src/components/options',
            'popup' : '/src/components/popup'
        },
    },
    plugins : [svelte()],
    build : {
        sourcemap : false,
        outDir : "extension",
        rollupOptions: {
            input: {
              popup: 'index.html',
              options: 'options.html'
            }
        }
    }
})