import { writable } from "svelte/store"
import { readable } from "svelte/store"

// Export readable stores

// Export writable stores
export let last_hit = writable( { } )
export let selection = writable( { } )
export let results = writable( [ ] )
export let poi = writable( { } )
export let last_results_pg = writable( null )
export let propdrawer = writable( true )
export let datosdrawer = writable( true )
export let poidrawer = writable( true )
export let messenger = writable( [ ] )
export let offset = writable( 0 )