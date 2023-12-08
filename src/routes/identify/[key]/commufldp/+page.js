/** @type {import('./$types').PageData} */
import { idLayer } from "$lib/api"
import { formatIdentifyResult, formatDate } from "$lib/format"

export async function load( {params} ){
    const rows = await idLayer( params.key, 43 ),
        field_format = { 
            "date": val => formatDate( val ),
            
        }
    
    return formatIdentifyResult( rows, "objectid", field_format )

}