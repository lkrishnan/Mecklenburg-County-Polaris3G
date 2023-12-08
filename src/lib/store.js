import { writable } from "svelte/store"
import { readable } from "svelte/store"

// Export readable stores

// Export writable stores
export let messenger = writable( [ { type: "id_lyr", layer: "juris" } ] )
export let offset = writable( 0 )
export let search = writable( "main" )
export let datadrawer = writable( true )