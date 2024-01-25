/** @type {import('tailwindcss').Config} */
module.exports = {
  	content: ["*.html", "./src/**/*.{html,js,svelte,ts}"],
  	theme: {
		extend: {
      		colors: {
				primero: "#211746", //primary
				segundo: "#00768a", //secondary
				todo: "#5d594d", //all - mostly used
				suave: "theme('colors.gray.400')", //soft
				luz: "theme('colors.gray.100')", //light glow for empahsis on hover
				pop: "#ef3e3d",
				lienzo: "#ffffff", //canvas - surface

        	},
			
    	},

  	},

}