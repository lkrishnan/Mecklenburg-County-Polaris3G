/** @type {import('tailwindcss').Config} */
module.exports = {
  	content: ["*.html", "./src/**/*.{html,js,svelte,ts}"],
  	theme: {
    	extend: {
      		colors: {
        		primary: "#aa6164",
				secondary: "#f7e18f",
				surface: "#ffffff",
				edge: "#dbc576",
				signify: "#768cdb",
				statictxt: "#374151",
				inputtxt: "#6b7280"

        	},

    	},

  	},
  	plugins: [ ],

}