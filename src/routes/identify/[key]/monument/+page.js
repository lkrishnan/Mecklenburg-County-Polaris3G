/** @type {import('./$types').PageData} */
import { idLayer } from "$lib/api"
import { formatIdentifyResult, formatDecimal } from "$lib/format"

export async function load( {params} ){
    const rows = await idLayer( params.key, 34, "pt" ),
        field_format = { 
            "longitude": val => formatDecimal( val ),
            "latitude": val => formatDecimal( val ),
            
        }

    return formatIdentifyResult( rows, "NAME", field_format )

}