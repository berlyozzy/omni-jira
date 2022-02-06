import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from "mdsvex";
import slug from 'rehype-slug';

// https://vitejs.dev/config/
export default defineConfig({
    server : {
        port : 5000
    },
    plugins : [
        svelte({
            extensions: [".svelte", ".svx"],
            preprocess : [
                mdsvex({
                    rehypePlugins: [slug]
                })
            ]
        })
    ],
    build : {
        sourcemap : false,
        outDir : "docs"
    }
})
