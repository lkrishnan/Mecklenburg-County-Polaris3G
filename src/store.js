import { writable } from "svelte/store"
import { readable } from "svelte/store"

// Selected Property
let initSelProp = { 
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
                
}

// Export
export let sel_prop = writable( initSelProp )