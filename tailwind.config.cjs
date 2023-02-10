/** @type {import('tailwindcss').Config} */
module.exports = {
  	content: ["*.html", "./src/**/*.{html,js,svelte,ts}"],
  	theme: {
    	extend: {
      		colors: {
        		primary: `theme('colors.gray.500')`,
				secondary: "theme('colors.gray.100')",
				surface: "#ffffff",
				edge: "theme('colors.gray.300')",
				signify: "theme('colors.blue.700')",
				statictxt: "#374151",
				inputtxt: "#6b7280"

        	},

    	},

  	},
  	plugins: [ ],

}