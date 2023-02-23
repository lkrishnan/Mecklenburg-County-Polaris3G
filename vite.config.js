import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	build: {
		minify: true,
	},
	plugins: [sveltekit()]
};

export default config;
