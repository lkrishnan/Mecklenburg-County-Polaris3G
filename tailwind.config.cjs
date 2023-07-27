/** @type {import('tailwindcss').Config} */
//const plugin = require('tailwindcss/plugin');

module.exports = {
  	content: ["*.html", "./src/**/*.{html,js,svelte,ts}"],
  	theme: {
		extend: {
      		colors: {
				primero: "#211746", //primary
				segundo: "#00768a", //secondary
				todo: "#5d594d", //all - mostly used
				suave: "theme('colors.gray.300')", //soft
				luz: "theme('colors.gray.100')", //light glow for empahsis on hover
				pop: "#ef3e3d",
				title: "theme('colors.slate.800')",
				lienzo: "#ffffff", //canvas - surface
				seleccion: "#5aa3d2",
				oro: "#c1962e",
				limon: "#b0d239",
				

        		//primary: `theme('colors.gray.500')`,
				primary: "#5d594d",
				secondary: "theme('colors.gray.100')",
				tertiary: "theme('colors.blue.500')",
				surface: "#ffffff",
				//edge: "theme('colors.gray.300')",
				edge: "#211746",
				signify: "theme('colors.sky.500')",
				signifytxt: "theme('colors.neutral.100')",
				statictxt: "#374151",
				inputtxt: "#6b7280",
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