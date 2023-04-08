import { sveltekit } from '@sveltejs/kit/vite'
import { SvelteKitPWA } from "@vite-pwa/sveltekit"

/** @type {import('vite').UserConfig} */
const config = {
	build: {
		minify: false,
	},
	define: {
		__DATE__: `'${new Date().toISOString()}'`,
		__RELOAD_SW__: true,
		'process.env': process.env,
	},
	plugins: [
		sveltekit( ),
		SvelteKitPWA( {
			strategies: "generateSW",
			scope: '/',
			base: '/',
			manifest: {
				start_url: "/",
				icons: [
					{
						src: "android-icon-512.png",
						sizes: "512x512",
						type: "image/png"
					},
					{
						src: "android-icon-maskable-512.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "maskable"
					}
				]
			},
			workbox: {
				runtimeCaching: [ //not working yet
					{
						urlPattern: ( {url} ) => {
							return url.pathname.startsWith( "/api" )
						
						},
						handler: "CacheFirst",
						options: {
							cacheName: "api-cache",
							cacheableResponse: {
								statuses: [ 0, 200 ]

							}

						}

					} 
				]
			},
			
		} )
	],
}

export default config;
