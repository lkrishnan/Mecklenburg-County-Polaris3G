/** @type {import('./$types').PageData} */
import { idLayer } from "$lib/api"
import { formatIdentifyResult, formatDecimal } from "$lib/format"

export async function load( {params} ){
    const rows = await idLayer( params.key, 10 ),
        field_format = { 
            "aland20": val => formatDecimal( parseFloat( val ), 3 ),
            "awater20": val => formatDecimal( parseFloat( val ), 3 ),
            "intptlat20": val => formatDecimal( parseFloat( val ), 3 ),
            "intptlon20": val => formatDecimal( parseFloat( val ), 3 ),

        }
    
    return formatIdentifyResult( rows, "tractce20", field_format )

}