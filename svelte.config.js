import adapter from "@sveltejs/adapter-node"

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter( ),
		//paths: {
			//base: "/polaris3g",
			
		//}
	}
}

export default config