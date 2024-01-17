import { sveltekit } from '@sveltejs/kit/vite'
//import { SvelteKitPWA } from "@vite-pwa/sveltekit"

/** @type {import('vite').UserConfig} */
const config = {
	build: {
		minify: true,
	},
	/*define: {
		__DATE__: `'${new Date().toISOString()}'`,
		__RELOAD_SW__: false,
		'process.env': process.env,
	},*/
	plugins: [
		sveltekit( ),
		/*SvelteKitPWA( {
			strategies: "generateSW",
			filename: 'service-worker.js',
			scope: '/',
			base: '/',
			manifest: {
				id: "/",
				start_url: "/",
				icons: [
					{
						src: 'pwa-192x192.png',
						sizes: '192x192',
						type: 'image/png'
					  },
					  {
						src: 'pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png'
					  },
					  {
						src: 'pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any'
					  },
					  {
						src: 'pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'maskable'
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
			
		} )*/
	],
}

export default config;