/** @type {import('./$types').PageData} */
import { idLayer } from "$lib/api"
import { formatIdentifyResult } from "$lib/format"

export async function load( {params} ){
    const rows = await idLayer( params.key, 22, "pt" )
    
    return formatIdentifyResult( rows, "projname" )

}