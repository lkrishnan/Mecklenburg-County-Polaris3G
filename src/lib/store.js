import { writable } from "svelte/store"
import { readable } from "svelte/store"

// Selected Property
let lastHit = { },
    selProp = { 
        matid: null,
        pid: null,
        gisid: null,
        x: null,
        y: null,
        lat: null,
        lon: null, 
        sqft: null,
        address: null,
        parcelgeom: null,
        desc: null,
                    
    }

// Export
export let last_hit = writable( lastHit )
export let sel_prop = writable( selProp )