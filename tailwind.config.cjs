/** @type {import('tailwindcss').Config} */
//const plugin = require('tailwindcss/plugin');

module.exports = {
  	content: ["*.html", "./src/**/*.{html,js,svelte,ts}"],
  	theme: {
		extend: {
      		colors: {
        		primary: `theme('colors.gray.500')`,
				secondary: "theme('colors.gray.300')",
				tertiary: "theme('colors.blue.500')",
				surface: "#ffffff",
				edge: "theme('colors.gray.300')",
				signify: "theme('colors.sky.500')",
				signifytxt: "theme('colors.neutral.100')",
				statictxt: "#374151",
				inputtxt: "#6b7280",
				title: "theme('colors.slate.800')",
				alert: "theme('colors.amber.500')",
				error: "theme('colors.red.500')"

        	},
			
			

    	},

  	},
  	plugins: [
		/*plugin(function({ addBase }) {
		 addBase({
			'html': { fontSize: "14px" },
		  })
		}),*/
	  ],

}