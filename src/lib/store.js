import { writable } from "svelte/store"
import { readable } from "svelte/store"

// Export readable stores

// Export writable stores
export let last_hit = writable( { } )
export let selection = writable( { } )
export let results = writable( [ ] )
