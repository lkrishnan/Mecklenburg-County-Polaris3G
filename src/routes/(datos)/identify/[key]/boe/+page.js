/** @type {import('./$types').PageData} */
import { idLayer } from "$lib/api"
import { formatIdentifyResult } from "$lib/format"

export async function load( {params} ){
    const rows = await idLayer( params.key, 13 ),
        field_format = { 
            "precinct": val => parseInt( val ),
            "zone": val => parseInt( val ), 

        }
    
    return formatIdentifyResult( rows, "precinct", field_format )

}