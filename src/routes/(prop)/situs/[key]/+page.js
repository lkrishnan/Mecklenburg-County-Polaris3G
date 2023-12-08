/** @type {import('./$types').PageDataData} */
import {error} from "@sveltejs/kit"
import finder from "$lib/finder"
import {qrystr2srchstr} from "$lib/utils"
import {validateSpChar, validateAddress} from "$lib/validate" 

export async function load( {fetch, params, route, url} ){
    const srch_str = qrystr2srchstr( params.key ),
        srch_type = route.id.split( "/" ).filter( item => !validateSpChar( item ) && item.length > 0 )[ 0 ]

    if( !validateAddress( srch_str ) )
        throw error( 404, { message: `Enter a valid Situs address.` } )

    const hit = { type: srch_type, situs: srch_str, page: 1 },
        rows = await finder( hit, fetch )

    if( rows.length === 0 )
        throw error( 404, { message: `<div>No results were returned for search:</div><div><b>${srch_type.toUpperCase( )} = ${srch_str}</b>.</div>` } )
        
    return { 
        hit: hit, 
        results: rows, 
        idx: ( rows.length === 1 ? 0 : -1 ), 
        view: "ownership" 

    }
    
}