/** @type {import('./$types').PageDataData} */
import {error} from "@sveltejs/kit"
import finder from "$lib/finder"
import {qrystr2srchstr} from "$lib/utils"
import {validateSpChar, validateStatePlane} from "$lib/validate" 

export async function load( {fetch, params, route, url} ){
    const srch_str = qrystr2srchstr( params.key ),
        srch_type = route.id.split( "/" ).filter( item => !validateSpChar( item ) && item.length > 0 )[ 0 ]

    if( srch_str.length === 0 )
        throw error( 404, { message: `Polaris 3G can't find anything. Enter valid State Plane Coordinates` } )

    if( !validateStatePlane( srch_str ) )
        throw error( 404, { message: `Polaris 3G can't find State Plane Coordinates: ${srch_str}` } )

    const hit = { type: srch_type, nearby: srch_str, page: 1 },
        rows = await finder( hit, fetch )

    return { 
        hit: hit, 
        results: rows, 
        idx: ( rows.length === 1 ? 0 : -1 ), 
        view: "ownership",
        poi: { },  

    }
    
}