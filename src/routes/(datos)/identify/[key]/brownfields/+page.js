/** @type {import('./$types').PageData} */
import { idLayer } from "$lib/api"
import { formatIdentifyResult, formatDecimal, formatDate } from "$lib/format"

export async function load( {params} ){
    const rows = await idLayer( params.key, 61 ),
        field_format = { 
            bf_acreage: val => formatDecimal( parseFloat( val ), 3 ),
            creationdate: val => formatDate( val ),
            editdate: val => formatDate( val ),
            shape_Length: val => formatDecimal( parseFloat( val ), 3 ),
            shape_Area: val => formatDecimal( parseFloat( val ), 3 )

        }
    
    return formatIdentifyResult( rows, "bf_name", field_format )

}