import { writable } from "svelte/store"
import { readable } from "svelte/store"

// Export readable stores

// Export writable stores
export let last_hit = writable( { } )
export let rsltados = writable( [ ] )
export let historia = writable( { hit: null, rsltados: [ ] } )
export let poi = writable( { } )
export let searchdrawer = writable( false )
export let messenger = writable( [ { type: "id_lyr", layer: "juris" } ] )
export let offset = writable( 0 )