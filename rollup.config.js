import svelte from 'rollup-plugin-svelte';
import replace from 'rollup-plugin-replace'
import commonjs from '@rollup/plugin-commonjs';
import alias from '@rollup/plugin-alias';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';

const production = !process.env.ROLLUP_WATCH;

const aliases = alias({
	resolve: ['.svelte', '.js'],
	entries: [
	  { find: 'lib', replacement: 'src/lib' },
	  { find: 'options', replacement: 'src/components/options'}
	]
});

export default [
	{
		input: 'src/main.js',
		output: {
			sourcemap: false,
			format: 'iife',
			name: 'app',
			file: 'public/build/bundle.js'
		},
		plugins: [
			svelte({
				compilerOptions: {
					// enable run-time checks when not in production
					dev: !production
				}
			}),
			aliases,
			// we'll extract any component CSS out into
			// a separate file - better for performance
			css({ output: 'bundle.css' }),
	
			// If you have external dependencies installed from
			// npm, you'll most likely need these plugins. In
			// some cases you'll need additional configuration -
			// consult the documentation for details:
			// https://github.com/rollup/plugins/tree/master/packages/commonjs
			resolve({
				browser: true,
				dedupe: ['svelte']
			}),
			commonjs(),
	
			// If we're building for production (npm run build
			// instead of npm run dev), minify
			production && terser()
		],
		watch: {
			clearScreen: false
		}
	},
	{
		input: 'src/options.js',
		output: {
			sourcemap: false,
			format: 'iife',
			name: 'app',
			file: 'public/build/options_bundle.js'
		},
		plugins: [
			svelte({
				compilerOptions: {
					// enable run-time checks when not in production
					dev: !production
				}
			}),
			aliases,
			// we'll extract any component CSS out into
			// a separate file - better for performance
			css({ output: 'options_bundle.css' }),
			replace({ 'process.env.NODE_ENV': JSON.stringify( 'production' ) }),
			// If you have external dependencies installed from
			// npm, you'll most likely need these plugins. In
			// some cases you'll need additional configuration -
			// consult the documentation for details:
			// https://github.com/rollup/plugins/tree/master/packages/commonjs
			resolve({
				browser: true,
				dedupe: ['svelte']
			}),
			commonjs(),

			// If we're building for production (npm run build
			// instead of npm run dev), minify
			production && terser()
		],
		watch: {
			clearScreen: false
		}
	}
]
