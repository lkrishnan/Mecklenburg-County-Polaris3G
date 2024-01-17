import { writable } from "svelte/store"
import { readable } from "svelte/store"

// Export readable stores

// Export writable stores
export let messenger = writable( [ { type: "id_lyr", layer: "juris" } ] )
export let offset = writable( { left: 0, bottom: 0, top: 0 } )

//Appdata Stores
export let search = writable( "main" )
export let datadrawer = writable( true ) //true or false
export let dual = writable( true )
export let mobile = writable( false )
export let results_count = writable( 0 )
export let results_index = writable( -1 )
