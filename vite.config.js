import { sveltekit } from '@sveltejs/kit/vite'

/** @type {import('vite').UserConfig} */
const config = {
	build: {
		minify: true,
	},
	define: {
		__DATE__: `'${new Date().toISOString()}'`,
		__RELOAD_SW__: true,
		'process.env': process.env,
	},
	plugins: [
		sveltekit( ),
		
	],
}

export default config;
